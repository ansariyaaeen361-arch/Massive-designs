import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { vitalsBundle } from '../lib/webVitals.js';
import { issuesFor } from '../lib/seoIssues.js';
import {
  scoreEngagement,
  scoreConversion,
  scorePerformance,
  scoreSeo,
  scoreErrors,
  scoreTrafficTrend,
  overallScore,
} from '../lib/pageHealthScoring.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// Combines every earlier phase's own data (Traffic/Engagement from session
// behavior, Conversion from Phase 6's goals, Performance from Phase 9,
// SEO from Phase 11, Errors from Phase 10) into one per-page score. See
// lib/pageHealthScoring.js for exactly how each dimension is computed —
// nothing here is a fabricated or estimated number.
router.get('/', requireAuth, async (req, res) => {
  const dateFilter = dateRange(req);
  const siteId = dateFilter.siteId;

  const [goals, events, vitalsRows, seoRows, errorRows] = await Promise.all([
    Goal.find({ siteId, enabled: true }).lean(),
    ClickEvent.find({ ...dateFilter, isBot: { $ne: true }, event: { $ne: 'page_view_duration' } })
      .select('event page sessionId createdAt')
      .sort({ createdAt: 1 })
      .lean(),
    ClickEvent.find({ ...dateFilter, event: 'web_vitals', isBot: { $ne: true } }).select('page metadata').lean(),
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: 'seo_audit', isBot: { $ne: true } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$page', metadata: { $first: '$metadata' } } },
    ]),
    ClickEvent.find({ ...dateFilter, event: { $in: ['js_error', 'resource_error'] }, isBot: { $ne: true } })
      .select('page')
      .lean(),
  ]);

  const goalEvents = new Set(goals.map((g) => g.event));

  const sessions = new Map();
  events.forEach((e) => {
    if (!e.sessionId) return;
    if (!sessions.has(e.sessionId)) sessions.set(e.sessionId, []);
    sessions.get(e.sessionId).push(e);
  });

  const perPage = new Map();
  function pageEntry(page) {
    if (!perPage.has(page)) {
      perPage.set(page, { landingSessions: 0, bounceSessions: 0, visitingSessionIds: new Set(), pageViewTimestamps: [] });
    }
    return perPage.get(page);
  }

  let totalSessions = 0;
  let convertedSessionCount = 0;
  const convertedSessionIds = new Set();

  sessions.forEach((steps, sessionId) => {
    totalSessions++;
    const pageViews = steps.filter((s) => s.event === 'page_view' && s.page);
    const converted = steps.some((s) => goalEvents.has(s.event));
    if (converted) {
      convertedSessionCount++;
      convertedSessionIds.add(sessionId);
    }

    if (pageViews.length) {
      const entry = pageEntry(pageViews[0].page);
      entry.landingSessions++;
      if (steps.length === 1) entry.bounceSessions++;
    }

    new Set(pageViews.map((pv) => pv.page)).forEach((page) => {
      pageEntry(page).visitingSessionIds.add(sessionId);
    });
    pageViews.forEach((pv) => pageEntry(pv.page).pageViewTimestamps.push(pv.createdAt));
  });

  const siteAvgConversionRate = totalSessions ? convertedSessionCount / totalSessions : 0;

  const vitalsByPage = new Map();
  vitalsRows.forEach((r) => {
    if (!r.page) return;
    if (!vitalsByPage.has(r.page)) vitalsByPage.set(r.page, []);
    vitalsByPage.get(r.page).push(r);
  });

  const seoByPage = new Map(seoRows.map((r) => [r._id, r.metadata || {}]));

  const errorCountByPage = new Map();
  errorRows.forEach((r) => {
    const p = r.page || 'Unknown';
    errorCountByPage.set(p, (errorCountByPage.get(p) || 0) + 1);
  });

  const pages = [...perPage.entries()]
    .map(([page, agg]) => {
      const bounceRate = agg.landingSessions ? agg.bounceSessions / agg.landingSessions : null;
      const visitingCount = agg.visitingSessionIds.size;
      let convertedVisiting = 0;
      agg.visitingSessionIds.forEach((sid) => {
        if (convertedSessionIds.has(sid)) convertedVisiting++;
      });
      const pageConversionRate = visitingCount ? convertedVisiting / visitingCount : null;

      const sortedTimestamps = agg.pageViewTimestamps.slice().sort((a, b) => a - b);
      const mid = Math.ceil(sortedTimestamps.length / 2);
      const firstHalf = sortedTimestamps.slice(0, mid).length;
      const secondHalf = sortedTimestamps.slice(mid).length;

      const vitals = vitalsByPage.has(page) ? vitalsBundle(vitalsByPage.get(page)) : null;
      const seoMeta = seoByPage.get(page);
      const issues = seoMeta ? issuesFor(seoMeta) : null;
      const pageViewCount = agg.pageViewTimestamps.length;
      const errorCount = errorCountByPage.get(page) || 0;

      const dimensions = {
        traffic: scoreTrafficTrend(firstHalf, secondHalf),
        engagement: scoreEngagement(bounceRate, agg.landingSessions),
        conversion: goalEvents.size ? scoreConversion(pageConversionRate, siteAvgConversionRate, visitingCount) : null,
        performance: vitals ? scorePerformance(vitals) : null,
        seo: scoreSeo(issues ? issues.length : 0, Boolean(seoMeta)),
        errors: scoreErrors(errorCount, pageViewCount),
      };

      return {
        page,
        pageViews: pageViewCount,
        overall: overallScore(dimensions),
        dimensions,
        breakdown: {
          bounceRate,
          landingSessions: agg.landingSessions,
          pageConversionRate,
          siteAvgConversionRate: goalEvents.size ? siteAvgConversionRate : null,
          visitingSessions: visitingCount,
          vitals,
          seoIssues: issues,
          errorCount,
          trafficTrend: { firstHalf, secondHalf },
        },
      };
    })
    .filter((p) => p.overall !== null || p.pageViews > 0)
    .sort((a, b) => (a.overall ?? 999) - (b.overall ?? 999));

  return res.json({ success: true, pages });
});

export default router;
