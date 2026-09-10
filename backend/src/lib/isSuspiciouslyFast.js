import ClickEvent from '../models/ClickEvent.js';

const WINDOW_MS = 10 * 1000;
const MAX_PAGE_VIEWS_IN_WINDOW = 6; // a real person can't open 6+ pages in 10s

// A scraper following a sitemap hits many pages back-to-back far faster
// than a human clicking around ever could, even with a faked browser UA.
export async function isSuspiciouslyFast(ip) {
  if (!ip) return false;
  const count = await ClickEvent.countDocuments({
    ip,
    event: 'page_view',
    createdAt: { $gte: new Date(Date.now() - WINDOW_MS) },
  });
  return count >= MAX_PAGE_VIEWS_IN_WINDOW;
}
