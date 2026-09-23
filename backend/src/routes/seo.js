import { Router } from 'express';
import ClickEvent from '../models/ClickEvent.js';
import Site from '../models/Site.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { issuesFor } from '../lib/seoIssues.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// A genuine, live check against the site's own domain — not a guess, and
// not a claim of what Google itself sees (that would need Search Console).
async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    clearTimeout(timeout);
    return { available: response.status >= 200 && response.status < 300, status: response.status, checked: true };
  } catch {
    return { available: false, status: null, checked: false };
  }
}

router.get('/', requireAuth, async (req, res) => {
  const dateFilter = dateRange(req);
  const siteId = dateFilter.siteId;

  const site = await Site.findById(siteId).lean();
  const domain = site?.domain;

  const [robotsTxt, sitemapXml, auditRows, pageViewRows, notFoundEvents] = await Promise.all([
    domain ? checkUrl(`https://${domain}/robots.txt`) : Promise.resolve({ available: false, status: null, checked: false }),
    domain ? checkUrl(`https://${domain}/sitemap.xml`) : Promise.resolve({ available: false, status: null, checked: false }),
    // Most recent audit per page — an unchanged page doesn't need every
    // visitor's copy of the same result, just the latest one.
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: 'seo_audit', isBot: { $ne: true } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$page', metadata: { $first: '$metadata' }, lastAudited: { $first: '$createdAt' } } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...dateFilter, event: 'page_view', isBot: { $ne: true } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
    ]),
    ClickEvent.find({ ...dateFilter, event: '404_view', isBot: { $ne: true }, sessionId: { $ne: null, $exists: true } })
      .select('sessionId page createdAt')
      .lean(),
  ]);

  const pageViewsByPage = new Map(pageViewRows.map((r) => [r._id, r.count]));

  const pages = auditRows
    .map((r) => {
      const a = r.metadata || {};
      return {
        page: r._id,
        pageViews: pageViewsByPage.get(r._id) || 0,
        issues: issuesFor(a),
        detail: a,
        lastAudited: r.lastAudited,
      };
    })
    .sort((x, y) => y.pageViews - x.pageViews);

  // Broken internal links: whatever page a visitor was actually on right
  // before landing on a 404 — requires the site's own 404 template to fire
  // maTrackEvent('404_view'), the same manual pattern already documented
  // for error monitoring (a page's own HTTP status isn't readable from JS).
  let brokenLinkSources = [];
  if (notFoundEvents.length) {
    const sessionIds = [...new Set(notFoundEvents.map((e) => e.sessionId))];
    const pageViewEvents = await ClickEvent.find({ siteId, event: 'page_view', sessionId: { $in: sessionIds } })
      .select('sessionId page createdAt')
      .sort({ createdAt: 1 })
      .lean();

    const bySession = new Map();
    pageViewEvents.forEach((pv) => {
      if (!bySession.has(pv.sessionId)) bySession.set(pv.sessionId, []);
      bySession.get(pv.sessionId).push(pv);
    });

    const counts = {};
    notFoundEvents.forEach((nf) => {
      const views = bySession.get(nf.sessionId) || [];
      // Excludes the 404 page's own page_view — that fires just before the
      // manual 404_view call on the same page, so without this it would
      // report the 404 page as its own referrer instead of the real one.
      let prior = null;
      for (const v of views) {
        if (v.createdAt < nf.createdAt && v.page !== nf.page) prior = v;
        else if (v.createdAt >= nf.createdAt) break;
      }
      if (prior?.page) counts[prior.page] = (counts[prior.page] || 0) + 1;
    });

    brokenLinkSources = Object.entries(counts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);
  }

  return res.json({
    success: true,
    robotsTxt: { ...robotsTxt, url: domain ? `https://${domain}/robots.txt` : null },
    sitemapXml: { ...sitemapXml, url: domain ? `https://${domain}/sitemap.xml` : null },
    pages,
    brokenLinkSources,
    notFoundCount: notFoundEvents.length,
    note: 'Search ranking and Search Console data are intentionally not shown here — no external search API is connected yet.',
  });
});

export default router;
