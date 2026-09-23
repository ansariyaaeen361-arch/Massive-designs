import AiUsage from '../models/AiUsage.js';

// Gemini 2.5 Flash-Lite's real free-tier ceiling is 1,000 requests/day,
// shared across the whole project (not per API key, not per site) — this
// stays safely under that so normal usage never hits Google's hard wall.
// PER_SITE_DAILY_LIMIT keeps any single client from using up the whole
// shared budget by themselves.
export const GLOBAL_DAILY_LIMIT = 900;
export const PER_SITE_DAILY_LIMIT = 20;

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

// Atomically increments both counters first, then checks the new totals —
// avoids a check-then-increment race where two concurrent requests could
// both pass the check before either counter updates. Under heavy
// concurrency this can overshoot the limit by a small amount, which is an
// acceptable trade-off for a cost-safety budget, not a hard security bound.
export async function checkAndReserveBudget(siteId) {
  const date = todayUtc();

  const globalDoc = await AiUsage.findOneAndUpdate({ siteId: null, date }, { $inc: { count: 1 } }, { upsert: true, new: true });
  if (globalDoc.count > GLOBAL_DAILY_LIMIT) {
    return { allowed: false, reason: 'global_limit', message: 'The AI Analyst has reached its shared daily limit across all clients. Try again tomorrow.' };
  }

  const siteDoc = await AiUsage.findOneAndUpdate({ siteId, date }, { $inc: { count: 1 } }, { upsert: true, new: true });
  if (siteDoc.count > PER_SITE_DAILY_LIMIT) {
    return { allowed: false, reason: 'site_limit', message: "You've reached today's AI question limit for your account. Try again tomorrow." };
  }

  return { allowed: true, siteCount: siteDoc.count, globalCount: globalDoc.count };
}
