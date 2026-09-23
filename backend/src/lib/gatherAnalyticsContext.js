import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { computeAnomalies } from './computeAnomalies.js';
import { computeOpportunities } from './computeOpportunities.js';
import { issuesFor } from './seoIssues.js';

const CHANNEL_LABELS = { direct: 'Direct', organic_search: 'Organic Search', social: 'Social', paid: 'Paid', referral: 'Referral' };

// Everything the AI Analyst is allowed to talk about — assembled entirely
// from data this system has already computed and verified elsewhere (the
// same numbers the dashboard itself shows), never freshly invented. Reuses
// computeAnomalies/computeOpportunities rather than re-deriving their logic.
export async function gatherAnalyticsContext(siteId, since, until) {
  const dateFilter = { siteId, isBot: { $ne: true }, createdAt: { $gte: new Date(since), $lt: new Date(until) } };

  const [
    { anomalies, current },
    opportunities,
    goals,
    newVisitorIds,
    returningVisitorIds,
    avgDurationResult,
    sessionEventCounts,
    byDeviceRows,
    byCountryRows,
    seoRows,
  ] = await Promise.all([
    computeAnomalies(siteId, since, until, { dayOfWeek: false }),
    computeOpportunities({ siteId, createdAt: dateFilter.createdAt }),
    Goal.find({ siteId, enabled: true }).lean(),
    ClickEvent.distinct('sessionId', { ...dateFilter, event: 'page_view', isReturning: false }),
    ClickEvent.distinct('sessionId', { ...dateFilter, event: 'page_view', isReturning: true }),
    ClickEvent.aggregate([{ $match: { ...dateFilter, event: 'page_view_duration' } }, { $group: { _id: null, avg: { $avg: '$durationMs' } } }]),
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: { $ne: 'page_view_duration' }, sessionId: { $ne: null, $exists: true } } },
      { $group: { _id: '$sessionId', count: { $sum: 1 } } },
    ]),
    ClickEvent.aggregate([{ $match: { ...dateFilter, event: 'page_view' } }, { $group: { _id: '$device', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: 'page_view' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: 'seo_audit' } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$page', metadata: { $first: '$metadata' } } },
    ]),
  ]);

  const totalSessionsWithEvents = sessionEventCounts.length;
  const bouncedSessions = sessionEventCounts.filter((s) => s.count === 1).length;
  const bounceRate = totalSessionsWithEvents ? bouncedSessions / totalSessionsWithEvents : null;

  const goalCounts = {};
  if (goals.length) {
    const goalEventCounts = await ClickEvent.aggregate([
      { $match: { ...dateFilter, event: { $in: goals.map((g) => g.event) } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);
    goalEventCounts.forEach((r) => {
      goalCounts[r._id] = r.count;
    });
  }

  const topPages = [...current.pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([page, count]) => ({ page, pageViews: count, sharePct: Math.round((current.pageShare.get(page) || 0) * 100) }));

  const channels = [...current.channelShare.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([channel, share]) => ({ channel: CHANNEL_LABELS[channel] || channel, sharePct: Math.round(share * 100) }));

  const seoPagesWithIssues = seoRows
    .map((r) => ({ page: r._id, issues: issuesFor(r.metadata || {}) }))
    .filter((r) => r.issues.length > 0);

  return {
    period: { since: new Date(since).toISOString(), until: new Date(until).toISOString() },
    traffic: {
      pageViews: current.pageViews,
      sessions: current.sessions,
      newVisitors: newVisitorIds.length,
      returningVisitors: returningVisitorIds.length,
      avgDurationMs: avgDurationResult[0]?.avg ?? null,
      bounceRatePct: bounceRate !== null ? Math.round(bounceRate * 100) : null,
    },
    topPages,
    channels,
    devices: byDeviceRows.map((r) => ({ device: r._id || 'Unknown', count: r.count })),
    countries: byCountryRows.filter((r) => r._id).map((r) => ({ country: r._id, count: r.count })),
    trafficQuality: {
      avgScore: current.avgQuality !== null ? Math.round(current.avgQuality) : null,
      sampleSize: current.qualitySamples,
      botPageViews: current.botPageViews,
      allPageViews: current.allPageViews,
    },
    conversions: {
      hasGoalsEnabled: goals.length > 0,
      totalConversions: current.conversions,
      conversionRatePct: current.sessions ? Math.round((current.conversions / current.sessions) * 100) : null,
      byGoal: goals.map((g) => ({ label: g.label, count: goalCounts[g.event] || 0 })),
    },
    performance: {
      lcpP75Ms: current.lcpP75 !== null ? Math.round(current.lcpP75) : null,
      sampleSize: current.lcpSamples,
    },
    errors: { totalErrors: current.errorCount },
    seo: { pagesAudited: seoRows.length, pagesWithIssues: seoPagesWithIssues.length, examples: seoPagesWithIssues.slice(0, 5) },
    // Already evidence-backed, narrative-shaped findings from earlier phases
    // — directly useful context, not re-derived here.
    opportunities: opportunities.map((o) => ({ whatHappened: o.whatHappened, evidence: o.evidence, severity: o.severity })),
    anomalies: anomalies.map((a) => ({ whatHappened: a.whatHappened, evidence: a.evidence, severity: a.severity })),
  };
}
