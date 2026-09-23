import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { vitalsBundle } from '../lib/webVitals.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

function groupBy(rows, keyFn) {
  const groups = new Map();
  rows.forEach((r) => {
    const key = keyFn(r);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });
  return groups;
}

// Real-user performance — every number here came from an actual visitor's
// browser (PerformanceObserver), not a synthetic lab test.
router.get('/', requireAuth, async (req, res) => {
  const match = { ...dateRange(req), event: 'web_vitals', isBot: { $ne: true } };

  const rows = await ClickEvent.find(match).select('metadata device browser country page').lean();

  const byDevice = [...groupBy(rows, (r) => r.device).entries()].map(([device, group]) => ({
    device,
    count: group.length,
    ...vitalsBundle(group),
  }));
  const byBrowser = [...groupBy(rows, (r) => r.browser).entries()].map(([browser, group]) => ({
    browser,
    count: group.length,
    ...vitalsBundle(group),
  }));
  const byCountry = [...groupBy(rows, (r) => r.country).entries()].map(([country, group]) => ({
    country,
    count: group.length,
    ...vitalsBundle(group),
  }));
  const byPage = [...groupBy(rows, (r) => r.page).entries()]
    .map(([page, group]) => ({ page, count: group.length, ...vitalsBundle(group) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return res.json({
    success: true,
    sampleSize: rows.length,
    overall: vitalsBundle(rows),
    byDevice,
    byBrowser,
    byCountry,
    byPage,
  });
});

export default router;
