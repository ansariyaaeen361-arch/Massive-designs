import mongoose from 'mongoose';

// Always scoped to the authenticated tenant (req.siteId, set only by
// requireAuth) — the base filter every read route builds on, so siteId
// isolation can't be forgotten in one branch. Shared by track.js and
// conversions.js so both stay in sync if the range logic ever changes.
export function dateRange(req) {
  const since = parseInt(req.query.since, 10);
  const until = parseInt(req.query.until, 10);
  const range = {};
  if (since) range.$gte = new Date(since);
  if (until) range.$lte = new Date(until);

  const filter = { siteId: new mongoose.Types.ObjectId(req.siteId) };
  if (Object.keys(range).length) filter.createdAt = range;
  return filter;
}
