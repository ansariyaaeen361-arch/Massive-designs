import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { compareMetric, compareShares, detectDayOfWeekAnomalies } from './anomalyDetection.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const BASELINE_WEEKS = 8;

const CHANNEL_LABELS = { direct: 'Direct', organic_search: 'Organic Search', social: 'Social', paid: 'Paid', referral: 'Referral' };
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Shared by routes/anomalies.js (the dashboard view) and lib/alertEvaluator.js
// (the periodic background check) — one set of period-over-period metrics,
// reused both places so they can never disagree.
export async function fetchWindow(siteId, winSince, winUntil, goalEvents) {
  const match = { siteId, isBot: { $ne: true }, createdAt: { $gte: new Date(winSince), $lt: new Date(winUntil) } };

  const [pageViews, sessionIds, conversions, qualityRows, vitalsRows, errorCount, byPageRows, byChannelRows, botPageViews, allPageViews] = await Promise.all([
    ClickEvent.countDocuments({ ...match, event: 'page_view' }),
    ClickEvent.distinct('sessionId', { ...match, sessionId: { $ne: null, $exists: true } }),
    goalEvents.length ? ClickEvent.countDocuments({ ...match, event: { $in: goalEvents } }) : Promise.resolve(0),
    ClickEvent.find({ ...match, event: 'page_view', 'metadata.trafficQuality.score': { $exists: true } }).select('metadata').lean(),
    ClickEvent.find({ ...match, event: 'web_vitals' }).select('metadata').lean(),
    ClickEvent.countDocuments({ ...match, event: { $in: ['js_error', 'resource_error'] } }),
    ClickEvent.aggregate([{ $match: { ...match, event: 'page_view' } }, { $group: { _id: '$page', count: { $sum: 1 } } }]),
    ClickEvent.aggregate([{ $match: { ...match, event: 'page_view' } }, { $group: { _id: '$channel', count: { $sum: 1 } } }]),
    // Bot share needs its own, non-isBot-excluding query — `match` above
    // already filters isBot:{$ne:true} for every other metric here.
    ClickEvent.countDocuments({ siteId, event: 'page_view', isBot: true, createdAt: { $gte: new Date(winSince), $lt: new Date(winUntil) } }),
    ClickEvent.countDocuments({ siteId, event: 'page_view', createdAt: { $gte: new Date(winSince), $lt: new Date(winUntil) } }),
  ]);

  const avgQuality = qualityRows.length
    ? qualityRows.reduce((s, r) => s + (r.metadata?.trafficQuality?.score || 0), 0) / qualityRows.length
    : null;

  const lcpValues = vitalsRows.map((r) => r.metadata?.lcp).filter((v) => typeof v === 'number').sort((a, b) => a - b);
  const lcpP75 = lcpValues.length ? lcpValues[Math.max(0, Math.ceil(0.75 * lcpValues.length) - 1)] : null;

  const totalPV = byPageRows.reduce((s, r) => s + r.count, 0) || 1;
  const pageShare = new Map(byPageRows.map((r) => [r._id || 'Unknown', r.count / totalPV]));
  const channelShare = new Map(byChannelRows.map((r) => [r._id || 'direct', r.count / totalPV]));
  const pageCounts = new Map(byPageRows.map((r) => [r._id || 'Unknown', r.count]));

  return {
    pageViews,
    sessions: sessionIds.length,
    conversions,
    avgQuality,
    qualitySamples: qualityRows.length,
    lcpP75,
    lcpSamples: vitalsRows.length,
    errorCount,
    pageShare,
    channelShare,
    pageCounts,
    botPageViews,
    allPageViews,
  };
}

export async function computeAnomalies(siteId, since, until, { dayOfWeek = true } = {}) {
  const duration = until - since;
  const prevUntil = since;
  const prevSince = since - duration;
  const baselineSince = since - BASELINE_WEEKS * 7 * DAY_MS;

  const goals = await Goal.find({ siteId, enabled: true }).lean();
  const goalEvents = goals.map((g) => g.event);
  const hasGoals = goalEvents.length > 0;

  const [current, previous, dailyRows] = await Promise.all([
    fetchWindow(siteId, since, until, goalEvents),
    fetchWindow(siteId, prevSince, prevUntil, goalEvents),
    dayOfWeek
      ? ClickEvent.aggregate([
          { $match: { siteId, isBot: { $ne: true }, event: 'page_view', createdAt: { $gte: new Date(baselineSince), $lt: new Date(until) } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        ])
      : Promise.resolve([]),
  ]);

  const anomalies = [];

  const traffic = compareMetric({ current: current.pageViews, previous: previous.pageViews, sampleSize: current.pageViews + previous.pageViews, minSample: 10, thresholdPct: 20 });
  if (traffic?.significant) {
    anomalies.push({
      type: 'traffic_change',
      direction: traffic.direction,
      severity: traffic.direction === 'down' ? 'high' : 'medium',
      whatHappened: `Traffic ${traffic.direction === 'down' ? 'dropped' : 'increased'} compared to the previous period.`,
      evidence: `Page views went from ${traffic.previous} to ${traffic.current}${traffic.changePct !== null ? ` (${traffic.changePct > 0 ? '+' : ''}${traffic.changePct}%)` : ' (new)'}.`,
      whyItMatters: 'A period-over-period shift this size is unlikely to be random noise.',
      suggestedAction: 'Check Traffic Channels on Overview for which source moved, and confirm nothing changed in tracking.',
    });
  }

  if (hasGoals) {
    const conv = compareMetric({ current: current.conversions, previous: previous.conversions, sampleSize: current.conversions + previous.conversions, minSample: 5, thresholdPct: 25 });
    if (conv?.significant) {
      anomalies.push({
        type: 'conversions_change',
        direction: conv.direction,
        severity: conv.direction === 'down' ? 'high' : 'medium',
        whatHappened: `Conversions ${conv.direction === 'down' ? 'dropped' : 'increased'} compared to the previous period.`,
        evidence: `Conversions went from ${conv.previous} to ${conv.current}${conv.changePct !== null ? ` (${conv.changePct > 0 ? '+' : ''}${conv.changePct}%)` : ' (new)'}.`,
        whyItMatters: 'This affects business outcomes directly, not just traffic volume.',
        suggestedAction: 'Check the Conversions page for which goal changed and whether its form/link still works.',
      });
    }

    const currRate = current.sessions ? current.conversions / current.sessions : 0;
    const prevRate = previous.sessions ? previous.conversions / previous.sessions : 0;
    const rateCmp = compareMetric({
      current: Math.round(currRate * 1000),
      previous: Math.round(prevRate * 1000),
      sampleSize: Math.min(current.sessions, previous.sessions),
      minSample: 15,
      thresholdPct: 25,
    });
    if (rateCmp?.significant) {
      anomalies.push({
        type: 'conversion_rate_change',
        direction: rateCmp.direction,
        severity: rateCmp.direction === 'down' ? 'high' : 'medium',
        whatHappened: `Conversion rate ${rateCmp.direction === 'down' ? 'dropped' : 'improved'} compared to the previous period.`,
        evidence: `Conversion rate was ${Math.round(prevRate * 100)}% in the previous period, now ${Math.round(currRate * 100)}%.`,
        whyItMatters: "A rate change (independent of raw traffic) usually points to something on the conversion path itself, not just visitor volume.",
        suggestedAction: 'Check the Conversions page and confirm the goal-tracking snippet is still firing correctly.',
      });
    }
  }

  const qualityCmp = compareMetric({
    current: Math.round((current.avgQuality ?? 0) * 10) / 10,
    previous: Math.round((previous.avgQuality ?? 0) * 10) / 10,
    sampleSize: Math.min(current.qualitySamples, previous.qualitySamples),
    minSample: 10,
    thresholdPct: 15,
  });
  if (current.avgQuality !== null && previous.avgQuality !== null && qualityCmp?.significant && qualityCmp.direction === 'down') {
    anomalies.push({
      type: 'quality_change',
      direction: 'down',
      severity: 'medium',
      whatHappened: 'Average traffic quality score dropped compared to the previous period.',
      evidence: `Quality score was ${Math.round(previous.avgQuality)}/100 in the previous period, now ${Math.round(current.avgQuality)}/100.`,
      whyItMatters: 'A declining quality score usually means a growing share of bot, proxy, or scripted traffic.',
      suggestedAction: 'Check the Traffic Quality breakdown on Overview for which reason is driving the drop.',
    });
  }

  const perfCmp = compareMetric({
    current: current.lcpP75,
    previous: previous.lcpP75,
    sampleSize: Math.min(current.lcpSamples, previous.lcpSamples),
    minSample: 5,
    thresholdPct: 25,
  });
  if (current.lcpP75 !== null && previous.lcpP75 !== null && perfCmp?.significant && perfCmp.direction === 'up') {
    anomalies.push({
      type: 'performance_change',
      direction: 'up',
      severity: 'medium',
      whatHappened: 'Site-wide load performance (LCP) got noticeably slower compared to the previous period.',
      evidence: `LCP (p75) was ${Math.round(previous.lcpP75)}ms in the previous period, now ${Math.round(current.lcpP75)}ms.`,
      whyItMatters: 'Slower loading directly hurts engagement and conversion, and this is a measured regression, not a one-off slow visit.',
      suggestedAction: 'Check the Performance page for which pages/devices got slower, and check for a recent deploy or added script.',
    });
  }

  const errorsCmp = compareMetric({ current: current.errorCount, previous: previous.errorCount, sampleSize: current.errorCount + previous.errorCount, minSample: 5, thresholdPct: 50 });
  if (errorsCmp?.significant && errorsCmp.direction === 'up') {
    anomalies.push({
      type: 'errors_change',
      direction: 'up',
      severity: 'high',
      whatHappened: 'Errors shown to real visitors increased compared to the previous period.',
      evidence: `Errors went from ${errorsCmp.previous} to ${errorsCmp.current}${errorsCmp.changePct !== null ? ` (+${errorsCmp.changePct}%)` : ''}.`,
      whyItMatters: 'A spike in errors can mean a recent deploy broke something visitors now hit regularly.',
      suggestedAction: 'Open the Errors page to see what started failing and on which pages.',
    });
  }

  const pageShifts = compareShares(current.pageShare, previous.pageShare, { minTotalSample: 20, thresholdPoints: 10 });
  pageShifts.slice(0, 3).forEach((shift) => {
    anomalies.push({
      type: 'top_page_shift',
      direction: shift.deltaPoints < 0 ? 'down' : 'up',
      severity: 'low',
      whatHappened: `${shift.key}'s share of site traffic changed noticeably.`,
      evidence: `${shift.key} was ${shift.previousPct}% of page views in the previous period, now ${shift.currentPct}% (${shift.deltaPoints > 0 ? '+' : ''}${shift.deltaPoints} points).`,
      whyItMatters: shift.deltaPoints < 0 ? 'A page losing traffic share may be losing rankings, links, or internal navigation to it.' : 'A page gaining share is worth understanding — it may be newly ranking or newly linked.',
      suggestedAction: "Check the Journeys page for this page's landing/exit pattern and where its traffic is coming from now.",
    });
  });

  const channelShiftsRaw = compareShares(current.channelShare, previous.channelShare, { minTotalSample: 20, thresholdPoints: 10 });
  channelShiftsRaw.slice(0, 3).forEach((shift) => {
    const label = CHANNEL_LABELS[shift.key] || shift.key;
    anomalies.push({
      type: 'channel_shift',
      direction: shift.deltaPoints < 0 ? 'down' : 'up',
      severity: shift.deltaPoints < 0 ? 'medium' : 'low',
      whatHappened: `${label}'s share of traffic changed noticeably.`,
      evidence: `${label} was ${shift.previousPct}% of traffic in the previous period, now ${shift.currentPct}% (${shift.deltaPoints > 0 ? '+' : ''}${shift.deltaPoints} points).`,
      whyItMatters: "A shifting traffic mix changes the kind of visitor you're getting, which can move engagement/conversion numbers even if total traffic looks stable.",
      suggestedAction: 'Check Traffic Channels on Overview to confirm the trend and whether it lines up with a known change (campaign, ranking, referral link).',
    });
  });

  if (dayOfWeek) {
    const currentDates = [];
    for (let t = since; t < until; t += DAY_MS) currentDates.push(new Date(t).toISOString().slice(0, 10));
    const historyByDay = dailyRows.map((r) => ({ date: r._id, count: r.count }));
    const dayAnomalies = detectDayOfWeekAnomalies(historyByDay, currentDates);
    dayAnomalies.forEach((a) => {
      const dow = new Date(`${a.date}T00:00:00Z`).getUTCDay();
      anomalies.push({
        type: 'day_of_week_anomaly',
        direction: a.count < a.expected ? 'down' : 'up',
        severity: a.z < 0 ? 'medium' : 'low',
        whatHappened: `${a.date} (a ${WEEKDAY_NAMES[dow]}) had unusual traffic for that day of the week.`,
        evidence: `${a.count} page views vs. a typical ${a.expected} for ${WEEKDAY_NAMES[dow]}s (based on the last ${BASELINE_WEEKS} weeks).`,
        whyItMatters: 'Comparing to the same weekday (not just yesterday) avoids flagging normal weekly patterns as problems.',
        suggestedAction: 'Check if anything specific happened that day — a campaign, an outage, or a press mention.',
      });
    });
  }

  const severityOrder = { high: 0, medium: 1, low: 2 };
  anomalies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return { anomalies, current, previous };
}
