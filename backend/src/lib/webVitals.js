// Google's published Core Web Vitals thresholds (web.dev/articles/*) — not
// invented here, just applied to the real measured values we collected.
const THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  inp: { good: 200, needsImprovement: 500 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

export function rateMetric(name, value) {
  const t = THRESHOLDS[name];
  if (!t || value === null || value === undefined) return null;
  if (value <= t.good) return 'good';
  if (value <= t.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return null;
  const idx = Math.min(sortedValues.length - 1, Math.ceil((p / 100) * sortedValues.length) - 1);
  return sortedValues[Math.max(0, idx)];
}

// Core Web Vitals are officially scored at the 75th percentile of real
// visitors, not the average — a few very fast loads shouldn't hide that
// most visitors had a slow one.
export function metricStats(rows, key) {
  const values = rows.map((r) => r.metadata?.[key]).filter((v) => typeof v === 'number').sort((a, b) => a - b);
  const p75 = percentile(values, 75);
  return { p75, rating: rateMetric(key, p75), sampleSize: values.length };
}

export function vitalsBundle(rows) {
  return {
    lcp: metricStats(rows, 'lcp'),
    cls: metricStats(rows, 'cls'),
    inp: metricStats(rows, 'inp'),
    ttfb: metricStats(rows, 'ttfb'),
    loadTime: metricStats(rows, 'loadTime'),
  };
}
