import ClickEvent from '../models/ClickEvent.js';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SESSIONS_IN_WINDOW = 10; // a real person doesn't open 10+ fresh sessions/hour

// A script that clears storage (or rotates identities) between runs keeps
// generating brand-new sessionIds under the same visitorId far faster than
// a real person closing and reopening their browser ever would.
export async function isSessionFlood(siteId, visitorId) {
  if (!visitorId) return false;
  const sessionIds = await ClickEvent.distinct('sessionId', {
    siteId,
    visitorId,
    createdAt: { $gte: new Date(Date.now() - WINDOW_MS) },
  });
  return sessionIds.filter(Boolean).length >= MAX_SESSIONS_IN_WINDOW;
}
