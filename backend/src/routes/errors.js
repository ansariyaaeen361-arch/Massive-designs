import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const TOP_N = 15;

function topEntries(counts) {
  return Object.entries(counts)
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N);
}

// Errors actually observed by real visitors' browsers — JS exceptions,
// unhandled promise rejections, and failed resource loads (with a real HTTP
// status where the browser exposes one, "unknown" where it doesn't). There
// is no fabricated status here — see track.js for exactly what's detected
// and how.
router.get('/', requireAuth, async (req, res) => {
  const base = dateRange(req);

  const [jsErrorRows, resourceErrorRows] = await Promise.all([
    ClickEvent.find({ ...base, event: 'js_error', isBot: { $ne: true } })
      .select('page metadata createdAt')
      .lean(),
    ClickEvent.find({ ...base, event: 'resource_error', isBot: { $ne: true } })
      .select('page metadata createdAt')
      .lean(),
  ]);

  const jsByMessage = {};
  const errorsByPage = {};

  jsErrorRows.forEach((r) => {
    const message = r.metadata?.message || 'Unknown error';
    if (!jsByMessage[message]) jsByMessage[message] = { count: 0, samplePage: r.page, lastSeen: r.createdAt, source: r.metadata?.source };
    jsByMessage[message].count += 1;
    if (r.createdAt > jsByMessage[message].lastSeen) jsByMessage[message].lastSeen = r.createdAt;
    errorsByPage[r.page || 'Unknown'] = (errorsByPage[r.page || 'Unknown'] || 0) + 1;
  });

  let http404 = 0;
  let http500 = 0;
  let brokenResources = 0;
  const resourceByUrl = {};

  resourceErrorRows.forEach((r) => {
    const status = r.metadata?.status || 0;
    const url = r.metadata?.url || 'Unknown resource';
    if (status === 404) http404++;
    else if (status >= 500) http500++;
    else brokenResources++;

    if (!resourceByUrl[url]) resourceByUrl[url] = { count: 0, status, samplePage: r.page, lastSeen: r.createdAt };
    resourceByUrl[url].count += 1;
    if (r.createdAt > resourceByUrl[url].lastSeen) resourceByUrl[url].lastSeen = r.createdAt;
    errorsByPage[r.page || 'Unknown'] = (errorsByPage[r.page || 'Unknown'] || 0) + 1;
  });

  return res.json({
    success: true,
    summary: {
      jsErrors: jsErrorRows.length,
      http404,
      http500,
      brokenResources,
    },
    jsErrorsByMessage: topEntries(jsByMessage).map((r) => ({
      message: r.key,
      count: r.count,
      samplePage: r.samplePage,
      source: r.source,
      lastSeen: r.lastSeen,
    })),
    resourceErrorsByUrl: topEntries(resourceByUrl).map((r) => ({
      url: r.key,
      count: r.count,
      status: r.status || null,
      samplePage: r.samplePage,
      lastSeen: r.lastSeen,
    })),
    errorsByPage: Object.entries(errorsByPage)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N),
  });
});

export default router;
