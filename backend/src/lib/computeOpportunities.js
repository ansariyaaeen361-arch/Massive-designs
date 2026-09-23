import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import {
  findHighTrafficLowConversion,
  findOrganicPoorEngagement,
  findHighExitPages,
  findMobileConversionGap,
  findSlowingPages,
  findTrafficUpLeadsDown,
  findQualityDeclining,
  findChannelTrafficDrop,
  findConversionRateDrop,
  findPagesWithErrors,
} from './opportunityRules.js';

// Shared by routes/opportunities.js (full list) and routes/attention.js (a
// condensed version of the same list) — one data-gathering pass and one
// rule set, so the two features can never disagree with each other.
export async function computeOpportunities(dateFilter) {
  const siteId = dateFilter.siteId;

  const [goals, events, vitalsRows, qualityRows, errorRows] = await Promise.all([
    Goal.find({ siteId, enabled: true }).lean(),
    ClickEvent.find({ ...dateFilter, isBot: { $ne: true }, event: { $ne: 'page_view_duration' } })
      .select('event page sessionId device channel createdAt')
      .sort({ createdAt: 1 })
      .lean(),
    ClickEvent.find({ ...dateFilter, event: 'web_vitals', isBot: { $ne: true } })
      .select('page metadata createdAt')
      .sort({ createdAt: 1 })
      .lean(),
    ClickEvent.find({ ...dateFilter, event: 'page_view', isBot: { $ne: true }, 'metadata.trafficQuality.score': { $exists: true } })
      .select('metadata createdAt')
      .sort({ createdAt: 1 })
      .lean(),
    ClickEvent.find({ ...dateFilter, event: { $in: ['js_error', 'resource_error'] }, isBot: { $ne: true } })
      .select('page')
      .lean(),
  ]);

  const goalEvents = new Set(goals.map((g) => g.event));
  const hasGoals = goalEvents.size > 0;

  const sessions = new Map();
  events.forEach((e) => {
    if (!e.sessionId) return;
    if (!sessions.has(e.sessionId)) sessions.set(e.sessionId, []);
    sessions.get(e.sessionId).push(e);
  });

  const pageStats = new Map();
  function pageEntry(page) {
    if (!pageStats.has(page)) {
      pageStats.set(page, { pageViews: 0, visitingSessionIds: new Set(), landingSessions: 0, bounceSessions: 0, exits: 0 });
    }
    return pageStats.get(page);
  }
  const channelStats = new Map();
  const deviceStats = new Map();
  const channelTimestamps = new Map();
  const sessionTimestamps = [];
  const conversionTimestamps = [];
  const sessionConversionFlags = [];
  const convertedSessionIds = new Set();

  let totalSessions = 0;
  let totalConvertedSessions = 0;

  sessions.forEach((steps, sessionId) => {
    totalSessions++;
    sessionTimestamps.push(steps[0].createdAt);

    const pageViews = steps.filter((s) => s.event === 'page_view' && s.page);
    const goalSteps = steps.filter((s) => goalEvents.has(s.event));
    const converted = goalSteps.length > 0;
    sessionConversionFlags.push(converted);
    if (converted) {
      totalConvertedSessions++;
      convertedSessionIds.add(sessionId);
      goalSteps.forEach((s) => conversionTimestamps.push(s.createdAt));
    }

    pageViews.forEach((pv) => pageEntry(pv.page).pageViews++);

    if (pageViews.length) {
      const landing = pageViews[0];
      const exit = pageViews[pageViews.length - 1];
      const landingEntry = pageEntry(landing.page);
      landingEntry.landingSessions++;
      if (steps.length === 1) landingEntry.bounceSessions++;

      pageEntry(exit.page).exits++;

      const channel = landing.channel || 'direct';
      const channelKey = `${landing.page}|${channel}`;
      if (!channelStats.has(channelKey)) {
        channelStats.set(channelKey, { page: landing.page, channel, sessions: 0, bounced: 0 });
      }
      const cs = channelStats.get(channelKey);
      cs.sessions++;
      if (steps.length === 1) cs.bounced++;

      if (!channelTimestamps.has(channel)) channelTimestamps.set(channel, []);
      channelTimestamps.get(channel).push(landing.createdAt);

      const device = landing.device || 'Unknown';
      if (!deviceStats.has(device)) deviceStats.set(device, { sessions: 0, converted: 0 });
      const ds = deviceStats.get(device);
      ds.sessions++;
      if (converted) ds.converted++;
    }

    new Set(pageViews.map((pv) => pv.page)).forEach((page) => pageEntry(page).visitingSessionIds.add(sessionId));
  });

  const siteAvgConversionRate = totalSessions ? totalConvertedSessions / totalSessions : 0;
  const totalLandingSessions = [...pageStats.values()].reduce((s, p) => s + p.landingSessions, 0);
  const totalBounceSessions = [...pageStats.values()].reduce((s, p) => s + p.bounceSessions, 0);
  const siteAvgBounceRate = totalLandingSessions ? totalBounceSessions / totalLandingSessions : 0;
  const totalPageViews = events.filter((e) => e.event === 'page_view').length;
  const siteAvgExitRate = totalPageViews ? totalSessions / totalPageViews : 0;

  const pages = [...pageStats.entries()].map(([page, s]) => {
    const visiting = s.visitingSessionIds.size;
    let convertedVisiting = 0;
    s.visitingSessionIds.forEach((sid) => {
      if (convertedSessionIds.has(sid)) convertedVisiting++;
    });
    return {
      page,
      pageViews: s.pageViews,
      visitingSessions: visiting,
      conversionRate: visiting ? convertedVisiting / visiting : null,
      exitRate: s.pageViews ? s.exits / s.pageViews : null,
    };
  });

  const pageChannelStats = [...channelStats.values()].map((c) => ({
    page: c.page,
    channel: c.channel,
    sessions: c.sessions,
    bounceRate: c.sessions ? c.bounced / c.sessions : null,
  }));

  const deviceConversion = [...deviceStats.entries()].map(([device, d]) => ({
    device,
    sessions: d.sessions,
    rate: d.sessions ? d.converted / d.sessions : 0,
  }));

  const vitalsByPage = new Map();
  vitalsRows.forEach((r) => {
    if (!r.page || typeof r.metadata?.lcp !== 'number') return;
    if (!vitalsByPage.has(r.page)) vitalsByPage.set(r.page, []);
    vitalsByPage.get(r.page).push(r.metadata.lcp);
  });
  const pagePerf = [...vitalsByPage.entries()].map(([page, lcps]) => {
    const mid = Math.ceil(lcps.length / 2);
    return { page, first: lcps.slice(0, mid), second: lcps.slice(mid) };
  });

  const qualityScores = qualityRows.map((r) => r.metadata?.trafficQuality?.score).filter((v) => typeof v === 'number');

  const errorCountByPage = new Map();
  errorRows.forEach((r) => {
    const p = r.page || 'Unknown';
    errorCountByPage.set(p, (errorCountByPage.get(p) || 0) + 1);
  });
  const errorsByPage = [...errorCountByPage.entries()].map(([page, count]) => ({ page, count }));

  const opportunities = [
    ...findHighTrafficLowConversion({ pages, siteAvgConversionRate, hasGoals }),
    ...findOrganicPoorEngagement({ pageChannelStats, siteAvgBounceRate }),
    ...findHighExitPages({ pages, siteAvgExitRate }),
    ...findMobileConversionGap({ deviceConversion, hasGoals }),
    ...findSlowingPages({ pagePerf }),
    ...findTrafficUpLeadsDown({ sessionTimestamps, conversionTimestamps, hasGoals }),
    ...findQualityDeclining({ qualityScores }),
    ...findChannelTrafficDrop({ channelTimestamps }),
    ...findConversionRateDrop({ sessionConversionFlags, hasGoals }),
    ...findPagesWithErrors({ errorsByPage }),
  ];

  const severityOrder = { high: 0, medium: 1, low: 2 };
  opportunities.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return opportunities;
}
