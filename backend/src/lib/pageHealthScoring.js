// Every function here returns null (not a fabricated number) when there
// isn't enough real data to say anything meaningful — a page with 1 visit
// doesn't get a confident bounce-rate score, it gets "insufficient data".
export const MIN_SAMPLE = 3;

// Engagement: inverse of this page's own bounce rate (sessions that landed
// here and did nothing else). Simple and fully explainable by that one number.
export function scoreEngagement(bounceRate, landingSessions) {
  if (landingSessions < MIN_SAMPLE) return null;
  return Math.round((1 - bounceRate) * 100);
}

// Conversion: this page's conversion rate relative to the SITE's own
// average (not an external benchmark we don't have) — exactly average
// scores 50, double the site average scores 100, zero scores 0.
export function scoreConversion(pageRate, siteAvgRate, visitingSessions) {
  if (visitingSessions < MIN_SAMPLE || !(siteAvgRate > 0)) return null;
  return Math.round(Math.min(1, pageRate / (siteAvgRate * 2)) * 100);
}

// Performance: Google's published Core Web Vitals ratings (good/needs
// improvement/poor, already computed in webVitals.js) turned into points
// and averaged across whichever metrics have data for this page.
const RATING_POINTS = { good: 100, 'needs-improvement': 50, poor: 0 };
export function scorePerformance(vitals) {
  const rated = ['lcp', 'cls', 'inp', 'ttfb'].map((k) => vitals[k]?.rating).filter(Boolean);
  if (!rated.length) return null;
  return Math.round(rated.reduce((sum, r) => sum + RATING_POINTS[r], 0) / rated.length);
}

// SEO: 100 minus 15 points per distinct on-page issue found (missing title,
// missing meta description, etc.) — null only if the page has never been
// audited at all, not when it was audited clean.
const SEO_PENALTY_PER_ISSUE = 15;
export function scoreSeo(issueCount, wasAudited) {
  if (!wasAudited) return null;
  return Math.max(0, 100 - issueCount * SEO_PENALTY_PER_ISSUE);
}

// Errors: a simple linear penalty on (errors observed on this page) / (page
// views), scaled so a 10% error rate zeroes the score out. Not a claim that
// every page view had an error — just a density signal.
export function scoreErrors(errorCount, pageViews) {
  if (pageViews < MIN_SAMPLE) return null;
  const rate = errorCount / pageViews;
  return Math.max(0, Math.round(100 - rate * 1000));
}

// Traffic trend: this page's own page views, first half of the observed
// visits in this range vs the second half — a plain, self-contained
// "holding up or dropping off" signal. (Day-of-week-aware historical
// anomaly detection is a separate, later capability — this only compares
// within the currently selected range.)
export function scoreTrafficTrend(firstHalfCount, secondHalfCount) {
  const total = firstHalfCount + secondHalfCount;
  if (total < 10) return null;
  if (firstHalfCount === 0) return 100;
  const declinePct = ((firstHalfCount - secondHalfCount) / firstHalfCount) * 100;
  return Math.max(0, Math.round(100 - Math.max(0, declinePct)));
}

export function overallScore(dimensions) {
  const values = Object.values(dimensions).filter((v) => v !== null);
  if (!values.length) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}
