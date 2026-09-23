// Every rule here only fires when it has the real numbers to back its claim
// (minimum sample sizes throughout) — "no opportunity" is the correct,
// honest output when the data doesn't clearly show one, not a reason to
// invent a softer version of it.
const MIN_SESSIONS = 5;
const MIN_TREND_SAMPLE = 10;

function pct(n) {
  return `${Math.round(n * 100)}%`;
}

// Splits a chronologically-sorted array in half by count (not by calendar
// time), mirroring pageHealthScoring.js's traffic-trend method — "first
// half of what happened in this range" vs "second half of it".
export function firstSecondHalf(sortedItems) {
  const mid = Math.ceil(sortedItems.length / 2);
  return { first: sortedItems.slice(0, mid), second: sortedItems.slice(mid) };
}

const CHANNEL_LABELS = { direct: 'Direct', organic_search: 'Organic Search', social: 'Social', paid: 'Paid', referral: 'Referral' };

// 1. High traffic + low conversion
export function findHighTrafficLowConversion({ pages, siteAvgConversionRate, hasGoals }) {
  if (!hasGoals) return [];
  const sortedByTraffic = [...pages].sort((a, b) => b.pageViews - a.pageViews);
  const trafficThreshold = sortedByTraffic[Math.floor(sortedByTraffic.length / 4)]?.pageViews ?? 0;

  return pages
    .filter((p) => p.pageViews >= Math.max(trafficThreshold, MIN_SESSIONS) && p.visitingSessions >= MIN_SESSIONS)
    .filter((p) => p.conversionRate !== null && p.conversionRate < siteAvgConversionRate * 0.5)
    .map((p) => ({
      type: 'high_traffic_low_conversion',
      severity: 'high',
      page: p.page,
      whatHappened: `${p.page} gets significant traffic but converts far below your site average.`,
      evidence: `${p.pageViews} page views, ${pct(p.conversionRate)} conversion rate vs. ${pct(siteAvgConversionRate)} site average.`,
      whyItMatters: 'This page reaches a lot of visitors but is losing most of them before they take a meaningful action — a small improvement here affects more visitors than the same fix on a low-traffic page.',
      suggestedAction: 'Review this page\'s call-to-action, form placement, and load speed — high traffic with low conversion usually points to a friction problem, not a traffic problem.',
    }));
}

// 2. High organic traffic + poor engagement
export function findOrganicPoorEngagement({ pageChannelStats, siteAvgBounceRate }) {
  return pageChannelStats
    .filter((p) => p.channel === 'organic_search' && p.sessions >= MIN_SESSIONS)
    .filter((p) => p.bounceRate !== null && p.bounceRate > 0.65 && p.bounceRate > siteAvgBounceRate * 1.3)
    .map((p) => ({
      type: 'organic_poor_engagement',
      severity: 'medium',
      page: p.page,
      whatHappened: `${p.page} brings in organic search traffic that bounces at an unusually high rate.`,
      evidence: `${p.sessions} sessions landed here from Organic Search, ${pct(p.bounceRate)} bounced (site average ${pct(siteAvgBounceRate)}).`,
      whyItMatters: 'Search engines are sending real interest to this page, but visitors are leaving immediately — that mismatch between search intent and page content is usually fixable and directly recoverable traffic.',
      suggestedAction: 'Check whether this page actually matches what the ranking search query promises, and whether the above-the-fold content answers it immediately.',
    }));
}

// 3. High exit rate
export function findHighExitPages({ pages, siteAvgExitRate }) {
  return pages
    .filter((p) => p.pageViews >= MIN_SESSIONS && p.exitRate !== null)
    .filter((p) => p.exitRate > siteAvgExitRate * 1.5 && p.exitRate > 0.4)
    .map((p) => ({
      type: 'high_exit_rate',
      severity: 'medium',
      page: p.page,
      whatHappened: `${p.page} has an unusually high exit rate.`,
      evidence: `${pct(p.exitRate)} of sessions that viewed this page ended their visit here, vs. ${pct(siteAvgExitRate)} site average.`,
      whyItMatters: 'A high exit rate on a page that isn\'t meant to be a natural stopping point (like a thank-you page) often signals a dead end, broken next step, or confusing layout.',
      suggestedAction: 'Check this page for a missing or unclear next step (a link, CTA, or related content) that would keep visitors moving.',
    }));
}

// 4. Mobile conversion significantly lower than desktop
export function findMobileConversionGap({ deviceConversion, hasGoals }) {
  if (!hasGoals) return [];
  const mobile = deviceConversion.find((d) => d.device === 'Mobile');
  const desktop = deviceConversion.find((d) => d.device === 'Desktop');
  if (!mobile || !desktop) return [];
  if (mobile.sessions < MIN_SESSIONS || desktop.sessions < MIN_SESSIONS) return [];
  if (desktop.rate <= 0 || mobile.rate >= desktop.rate * 0.5) return [];

  return [
    {
      type: 'mobile_conversion_gap',
      severity: 'high',
      page: null,
      whatHappened: 'Mobile visitors convert at a much lower rate than desktop visitors.',
      evidence: `Desktop: ${pct(desktop.rate)} (${desktop.sessions} sessions). Mobile: ${pct(mobile.rate)} (${mobile.sessions} sessions).`,
      whyItMatters: 'If a large share of your traffic is mobile, this gap alone can be your single biggest source of lost conversions site-wide.',
      suggestedAction: 'Test your key conversion paths (forms, checkout, click-to-call) on an actual mobile device — tap targets, form field sizing, and page speed are the usual culprits.',
    },
  ];
}

// 5. A page becoming slower
export function findSlowingPages({ pagePerf }) {
  return pagePerf
    .filter((p) => p.first.length >= 3 && p.second.length >= 3)
    .map((p) => {
      const firstP75 = percentile75(p.first);
      const secondP75 = percentile75(p.second);
      return { page: p.page, firstP75, secondP75 };
    })
    .filter((p) => p.firstP75 && p.secondP75 && p.secondP75 > p.firstP75 * 1.25)
    .map((p) => ({
      type: 'page_slowing_down',
      severity: 'medium',
      page: p.page,
      whatHappened: `${p.page} is loading noticeably slower than it was earlier in this period.`,
      evidence: `LCP was ${Math.round(p.firstP75)}ms in the first half of this range, now ${Math.round(p.secondP75)}ms in the second half.`,
      whyItMatters: 'Slower loading pages directly hurt engagement and conversion, and this is a real, measured regression within your own data — not a one-off slow visit.',
      suggestedAction: 'Check for a recent deploy, added script/tracking tag, or image that increased this page\'s load weight.',
    }));
}

function percentile75(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil(0.75 * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

// 6. Traffic increasing but leads decreasing (site-wide)
export function findTrafficUpLeadsDown({ sessionTimestamps, conversionTimestamps, hasGoals }) {
  if (!hasGoals) return [];
  if (sessionTimestamps.length < MIN_TREND_SAMPLE) return [];
  const { first: sf, second: ss } = firstSecondHalf(sessionTimestamps);
  const { first: cf, second: cs } = firstSecondHalf(conversionTimestamps);

  const trafficUp = sf.length > 0 && ss.length > sf.length * 1.1;
  const leadsDown = cf.length > 0 && cs.length < cf.length * 0.9;
  if (!trafficUp || !leadsDown) return [];

  const trafficChange = Math.round(((ss.length - sf.length) / sf.length) * 100);
  const leadsChange = Math.round(((cs.length - cf.length) / cf.length) * 100);

  return [
    {
      type: 'traffic_up_leads_down',
      severity: 'high',
      page: null,
      whatHappened: 'Traffic is growing, but conversions are falling in the same period.',
      evidence: `Sessions went from ${sf.length} to ${ss.length} (${trafficChange >= 0 ? '+' : ''}${trafficChange}%). Conversions went from ${cf.length} to ${cs.length} (${leadsChange}%).`,
      whyItMatters: 'More visitors are arriving but converting less often — the new traffic may be lower-intent, or something on the conversion path broke for everyone.',
      suggestedAction: 'Check the Traffic Channels and Conversions pages for what changed — a new traffic source, a broken form, or a goal that stopped firing are the most common causes.',
    },
  ];
}

// 7. Traffic quality declining (site-wide)
export function findQualityDeclining({ qualityScores }) {
  if (qualityScores.length < MIN_TREND_SAMPLE) return [];
  const { first, second } = firstSecondHalf(qualityScores);
  if (first.length < 5 || second.length < 5) return [];

  const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const firstAvg = avg(first);
  const secondAvg = avg(second);
  if (firstAvg - secondAvg < 10) return [];

  return [
    {
      type: 'traffic_quality_declining',
      severity: 'medium',
      page: null,
      whatHappened: 'Your average traffic quality score has dropped within this period.',
      evidence: `Average quality score was ${Math.round(firstAvg)}/100 in the first half of this range, now ${Math.round(secondAvg)}/100 in the second half.`,
      whyItMatters: 'A declining quality score usually means a growing share of bot, proxy, or scripted traffic — which inflates your visitor counts without representing real prospects.',
      suggestedAction: 'Check the Traffic Quality breakdown on the Overview page for which reason is driving the drop (e.g. a specific bot, or a new source sending automated hits).',
    },
  ];
}

// 8. A specific traffic channel dropped within this period
export function findChannelTrafficDrop({ channelTimestamps }) {
  const results = [];
  channelTimestamps.forEach((timestamps, channel) => {
    if (timestamps.length < MIN_TREND_SAMPLE) return;
    const { first, second } = firstSecondHalf(timestamps);
    if (first.length < 5) return;
    if (second.length >= first.length * 0.8) return;

    const dropPct = Math.round(((first.length - second.length) / first.length) * 100);
    const label = CHANNEL_LABELS[channel] || channel;
    results.push({
      type: 'channel_traffic_drop',
      severity: 'high',
      page: null,
      whatHappened: `${label} traffic dropped ${dropPct}% within this period.`,
      evidence: `${label} sessions went from ${first.length} to ${second.length} (-${dropPct}%) between the first and second half of this range.`,
      whyItMatters: 'A sudden drop in one specific channel usually points to a lost ranking, a paused campaign, or a broken referral link — not general site-wide softness.',
      suggestedAction: 'Check the Traffic Channels breakdown on Overview to confirm this is still trending down, and check whether anything changed for this specific source.',
    });
  });
  return results;
}

// 9. Overall conversion rate dropped within this period
export function findConversionRateDrop({ sessionConversionFlags, hasGoals }) {
  if (!hasGoals) return [];
  if (sessionConversionFlags.length < MIN_TREND_SAMPLE) return [];
  const { first, second } = firstSecondHalf(sessionConversionFlags);
  if (first.length < 5 || second.length < 5) return [];

  const firstRate = first.filter(Boolean).length / first.length;
  const secondRate = second.filter(Boolean).length / second.length;
  if (firstRate <= 0 || secondRate >= firstRate * 0.8) return [];

  const dropPct = Math.round(((firstRate - secondRate) / firstRate) * 100);
  return [
    {
      type: 'conversion_rate_drop',
      severity: 'high',
      page: null,
      whatHappened: `Your overall conversion rate dropped ${dropPct}% within this period.`,
      evidence: `Conversion rate was ${Math.round(firstRate * 100)}% in the first half of this range, now ${Math.round(secondRate * 100)}% in the second half.`,
      whyItMatters: "A site-wide conversion drop usually means something broke on a key path (a form, button, or goal event) rather than a change in traffic quality.",
      suggestedAction: "Check the Conversions page for which goal dropped, and verify that goal's form/button/link is still working correctly.",
    },
  ];
}

// 10. Pages actively showing errors to visitors
export function findPagesWithErrors({ errorsByPage }) {
  const flagged = errorsByPage.filter((p) => p.count >= 3).sort((a, b) => b.count - a.count);
  if (!flagged.length) return [];

  const top = flagged.slice(0, 3).map((p) => `${p.page} (${p.count})`).join(', ');
  return [
    {
      type: 'pages_with_errors',
      severity: 'high',
      page: null,
      whatHappened: `${flagged.length} page(s) are showing errors to real visitors.`,
      evidence: `Most affected: ${top}.`,
      whyItMatters: 'Errors visible to real visitors can silently break forms, navigation, or checkout — this may be actively costing you conversions right now.',
      suggestedAction: "Open the Errors page to see exactly what's failing on each page.",
    },
  ];
}
