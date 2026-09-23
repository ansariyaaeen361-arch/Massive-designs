import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const EMPTY_RESPONSE = {
  success: true,
  hasGoals: false,
  totalConversions: 0,
  totalSessions: 0,
  convertedSessions: 0,
  conversionRate: null,
  estimatedValue: null,
  byGoal: [],
  byDay: [],
  bySource: [],
  byLandingPage: [],
  byDevice: [],
  byCountry: [],
};

function tally(rows, landingBySession, pick) {
  const counts = {};
  rows.forEach((r) => {
    const landing = landingBySession.get(r.sessionId);
    const key = landing ? pick(landing) : null;
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

// A conversion is any event matching an enabled Goal (Phase 5) — nothing
// else counts, by design. Attribution (source/landing page/device/country)
// comes from each conversion's SESSION's first page view, not the
// conversion click's own fields, since a click on "Call Us" never carries
// the referrer/UTM that actually brought that visitor in.
router.get('/', requireAuth, async (req, res) => {
  const dateFilter = dateRange(req);
  const siteId = dateFilter.siteId;

  const goals = await Goal.find({ siteId, enabled: true }).lean();
  if (!goals.length) {
    return res.json(EMPTY_RESPONSE);
  }
  const goalEvents = goals.map((g) => g.event);

  const [conversions, totalSessionIds] = await Promise.all([
    ClickEvent.find({ ...dateFilter, event: { $in: goalEvents }, isBot: { $ne: true } })
      .select('event sessionId createdAt')
      .lean(),
    ClickEvent.distinct('sessionId', { ...dateFilter, isBot: { $ne: true }, sessionId: { $ne: null, $exists: true } }),
  ]);

  const totalSessions = totalSessionIds.length;
  const convertedSessionIds = [...new Set(conversions.map((c) => c.sessionId).filter(Boolean))];
  const convertedSessions = convertedSessionIds.length;
  const conversionRate = totalSessions ? convertedSessions / totalSessions : null;

  const landingRows = convertedSessionIds.length
    ? await ClickEvent.aggregate([
        { $match: { siteId, event: 'page_view', sessionId: { $in: convertedSessionIds } } },
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: '$sessionId',
            channel: { $first: '$channel' },
            page: { $first: '$page' },
            device: { $first: '$device' },
            country: { $first: '$country' },
          },
        },
      ])
    : [];
  const landingBySession = new Map(landingRows.map((r) => [r._id, r]));

  const countsByEvent = {};
  const dayCounts = {};
  conversions.forEach((c) => {
    countsByEvent[c.event] = (countsByEvent[c.event] || 0) + 1;
    const day = c.createdAt.toISOString().slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const byGoal = goals
    .map((g) => {
      const count = countsByEvent[g.event] || 0;
      const estimatedTotal = g.estimatedValue != null ? count * g.estimatedValue : null;
      return { event: g.event, label: g.label, count, estimatedValue: g.estimatedValue ?? null, estimatedTotal };
    })
    .sort((a, b) => b.count - a.count);

  const estimatedValue = byGoal.some((g) => g.estimatedTotal !== null)
    ? byGoal.reduce((sum, g) => sum + (g.estimatedTotal || 0), 0)
    : null;

  return res.json({
    success: true,
    hasGoals: true,
    totalConversions: conversions.length,
    totalSessions,
    convertedSessions,
    conversionRate,
    estimatedValue,
    byGoal,
    byDay: Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    bySource: tally(conversions, landingBySession, (l) => l.channel).map((r) => ({ channel: r.key, count: r.count })),
    byLandingPage: tally(conversions, landingBySession, (l) => l.page).map((r) => ({ page: r.key, count: r.count })),
    byDevice: tally(conversions, landingBySession, (l) => l.device).map((r) => ({ device: r.key, count: r.count })),
    byCountry: tally(conversions, landingBySession, (l) => l.country).map((r) => ({ country: r.key, count: r.count })),
  });
});

export default router;
