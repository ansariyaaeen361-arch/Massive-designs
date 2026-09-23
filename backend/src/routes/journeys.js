import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// Bounds how many sessions get walked in JS below, so this stays fast on a
// busy site — the most recent sessions in range are used, not a random or
// biased sample.
const MAX_SESSIONS = 2000;
// A path is truncated at this many distinct pages so one long crawl-like
// session can't dominate every "common path" bucket with a unique tail.
const PATH_MAX_PAGES = 5;
const TOP_N = 15;
const MAX_SAMPLES = 20;

function topEntries(counts) {
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N);
}

// Anonymous visitor journeys — page/event sequences and referrers only.
// Deliberately never selects ip, visitorId, city, or any other
// visitor-identifying field, per the "no PII" requirement for this feature.
router.get('/', requireAuth, async (req, res) => {
  const dateFilter = dateRange(req);
  const siteId = dateFilter.siteId;

  const [goals, sessions] = await Promise.all([
    Goal.find({ siteId, enabled: true }).lean(),
    ClickEvent.aggregate([
      {
        $match: {
          ...dateFilter,
          isBot: { $ne: true },
          sessionId: { $ne: null, $exists: true },
          event: { $ne: 'page_view_duration' },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$sessionId',
          steps: { $push: { event: '$event', page: '$page', referrer: '$referrer', createdAt: '$createdAt' } },
          lastAt: { $max: '$createdAt' },
        },
      },
      { $sort: { lastAt: -1 } },
      { $limit: MAX_SESSIONS },
    ]),
  ]);

  const goalEvents = new Set(goals.map((g) => g.event));
  const goalLabelByEvent = new Map(goals.map((g) => [g.event, g.label]));

  const landingCounts = {};
  const exitCounts = {};
  const pathCounts = {};
  const preConversionCounts = {};
  const conversionSamples = [];

  sessions.forEach((s) => {
    const pageSteps = s.steps.filter((st) => st.event === 'page_view' && st.page);

    if (pageSteps.length) {
      landingCounts[pageSteps[0].page] = (landingCounts[pageSteps[0].page] || 0) + 1;
      exitCounts[pageSteps[pageSteps.length - 1].page] = (exitCounts[pageSteps[pageSteps.length - 1].page] || 0) + 1;
    }

    // Consecutive duplicate page views (e.g. a refresh) collapse into one
    // step so the path reflects where they actually went, not how many
    // times they viewed each stop.
    const pathPages = [];
    pageSteps.forEach((st) => {
      if (pathPages[pathPages.length - 1] !== st.page) pathPages.push(st.page);
    });
    if (pathPages.length) {
      const key = pathPages.slice(0, PATH_MAX_PAGES).join(' → ');
      pathCounts[key] = (pathCounts[key] || 0) + 1;
    }

    if (!goalEvents.size) return;
    const convIdx = s.steps.findIndex((st) => goalEvents.has(st.event));
    if (convIdx === -1) return;

    for (let i = convIdx - 1; i >= 0; i--) {
      if (s.steps[i].event === 'page_view' && s.steps[i].page) {
        preConversionCounts[s.steps[i].page] = (preConversionCounts[s.steps[i].page] || 0) + 1;
        break;
      }
    }

    if (conversionSamples.length < MAX_SAMPLES) {
      const journeySteps = s.steps.slice(0, convIdx + 1).map((st) => ({
        event: st.event,
        label: st.event === 'page_view' ? st.page : goalLabelByEvent.get(st.event) || st.event,
        createdAt: st.createdAt,
      }));
      // Where this visitor actually came from, shown as the origin of the
      // journey — e.g. "Google Search" — same label already computed at
      // ingest time (parseReferrer.js), never a raw IP/visitor identity.
      const origin = pageSteps[0]?.referrer || 'Direct';
      conversionSamples.push({ sessionId: s._id, origin, steps: journeySteps });
    }
  });

  return res.json({
    success: true,
    sessionsAnalyzed: sessions.length,
    landingPages: topEntries(landingCounts).map((r) => ({ page: r.key, count: r.count })),
    exitPages: topEntries(exitCounts).map((r) => ({ page: r.key, count: r.count })),
    commonPaths: topEntries(pathCounts).map((r) => ({ path: r.key, count: r.count })),
    preConversionPages: topEntries(preConversionCounts).map((r) => ({ page: r.key, count: r.count })),
    conversionSamples,
  });
});

export default router;
