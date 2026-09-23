// Unlike opportunityRules.js (which splits ONE window in half), everything
// here compares two INDEPENDENT time windows — the selected period vs the
// immediately preceding period of the same length — which is what "period
// over period" actually means, and closer to how a real analyst checks for
// a genuine shift vs. normal noise within a single window.

// A change only counts as significant when it's both large enough AND
// backed by a minimum sample size passed in by the caller — a swing from
// 1 to 3 conversions is a 200% "increase" that means nothing.
export function compareMetric({ current, previous, sampleSize, minSample = 10, thresholdPct = 20 }) {
  if (sampleSize < minSample) return null;
  if (previous === 0) {
    if (current === 0) return null;
    return { current, previous, changePct: null, direction: 'new', significant: true };
  }
  const changePct = ((current - previous) / previous) * 100;
  return {
    current,
    previous,
    changePct: Math.round(changePct),
    direction: changePct >= 0 ? 'up' : 'down',
    significant: Math.abs(changePct) >= thresholdPct,
  };
}

// Compares each key's SHARE of total traffic between two periods (not raw
// counts) — robust to the whole site's traffic simply growing or shrinking,
// which would otherwise make every page's raw count "change".
export function compareShares(currentShares, previousShares, { minTotalSample = 20, thresholdPoints = 10 } = {}) {
  const keys = new Set([...currentShares.keys(), ...previousShares.keys()]);
  const results = [];
  keys.forEach((key) => {
    const current = currentShares.get(key) || 0;
    const previous = previousShares.get(key) || 0;
    const deltaPoints = Math.round((current - previous) * 100);
    if (Math.abs(deltaPoints) >= thresholdPoints) {
      results.push({ key, currentPct: Math.round(current * 100), previousPct: Math.round(previous * 100), deltaPoints });
    }
  });
  return results.sort((a, b) => Math.abs(b.deltaPoints) - Math.abs(a.deltaPoints));
}

// Day-of-week-normalized anomaly detection: each day in the current window
// is compared to the mean/stddev of that SAME weekday drawn from a longer
// history — not to yesterday, not to the period's flat average — so a
// naturally quiet Sunday doesn't get flagged just for being quieter than a
// Tuesday. Requires at least 3 historical instances of a weekday before it
// will judge anything for that weekday at all.
export function detectDayOfWeekAnomalies(historyByDay, currentDates) {
  const currentSet = new Set(currentDates);
  const byWeekday = new Map();

  historyByDay.forEach(({ date, count }) => {
    if (currentSet.has(date)) return;
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    if (!byWeekday.has(dow)) byWeekday.set(dow, []);
    byWeekday.get(dow).push(count);
  });

  const stats = new Map();
  byWeekday.forEach((counts, dow) => {
    if (counts.length < 3) return;
    const mean = counts.reduce((s, v) => s + v, 0) / counts.length;
    const variance = counts.reduce((s, v) => s + (v - mean) ** 2, 0) / counts.length;
    stats.set(dow, { mean, stddev: Math.sqrt(variance) });
  });

  const anomalies = [];
  historyByDay.forEach(({ date, count }) => {
    if (!currentSet.has(date)) return;
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    const baseline = stats.get(dow);
    if (!baseline || baseline.mean < 3) return;
    const z = baseline.stddev > 0 ? (count - baseline.mean) / baseline.stddev : count === baseline.mean ? 0 : count > baseline.mean ? 3 : -3;
    if (Math.abs(z) >= 2) {
      anomalies.push({ date, count, expected: Math.round(baseline.mean), z: Math.round(z * 10) / 10 });
    }
  });
  return anomalies;
}
