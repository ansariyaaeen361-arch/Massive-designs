import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ClickEvent from '../models/ClickEvent.js';
import { geoLookup } from '../lib/geoLookup.js';
import { parseUserAgent } from '../lib/parseUserAgent.js';
import { parseReferrer } from '../lib/parseReferrer.js';
import { detectBot } from '../lib/isBot.js';
import { isSuspiciouslyFast } from '../lib/isSuspiciouslyFast.js';
import { isPopupBypass } from '../lib/isPopupBypass.js';

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

function requireDashboardKey(req, res, next) {
  if (!process.env.TRACK_DASHBOARD_KEY || req.query.key !== process.env.TRACK_DASHBOARD_KEY) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
}

// A real browser always sets Origin (or at least Referer) to our own site on
// a same-origin fetch() POST — that's enforced by the browser itself, not
// something a page's JS can fake. A script hitting this endpoint directly
// (the source of the "referrer spam" — fabricated referrer values claiming
// Twitter/YouTube/random domains, all landing on the same page) has no
// reason to bother setting either correctly.
// Our reverse proxy (OLS) sometimes forwards Origin/Referer as a
// comma-joined duplicate (e.g. "https://x.com, https://x.com") — Node
// joins repeated headers this way. Only the first value matters here.
function firstHeaderValue(value) {
  return value ? value.split(',')[0].trim() : value;
}

// Now that Cloudflare proxies all traffic, req.ip would otherwise resolve to
// Cloudflare's edge IP for every visitor. Cloudflare always sets this header
// to the real client IP on requests it forwards, so prefer it when present.
function getClientIp(req) {
  return req.headers['cf-connecting-ip'] || req.ip;
}

function isFromOurSite(req) {
  const allowedHosts = [new URL(process.env.FRONTEND_URL || 'https://massive-designs.com').host];
  // Only relaxed outside production, for local dev testing — never on the
  // live server, since Origin is trivially fake-able by a non-browser
  // client and "just claim localhost" would otherwise be a known bypass.
  if (process.env.NODE_ENV !== 'production') allowedHosts.push('localhost:3000', '127.0.0.1:3000');

  const origin = firstHeaderValue(req.headers.origin);
  const referer = firstHeaderValue(req.headers.referer);
  try {
    if (origin && allowedHosts.includes(new URL(origin).host)) return true;
  } catch {
    // ignore malformed Origin
  }
  try {
    if (referer && allowedHosts.includes(new URL(referer).host)) return true;
  } catch {
    // ignore malformed Referer
  }
  return false;
}

router.post('/', trackLimiter, async (req, res) => {
  if (!isFromOurSite(req)) {
    // Silently succeed (no error detail) so a spam script gets no signal
    // that it was rejected rather than just dropped.
    return res.json({ success: true });
  }

  const { event, source, page, referrer, sessionId, visitorId, isReturning, durationMs, isWebdriver } = req.body ?? {};

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ success: false, error: 'event is required.' });
  }

  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];
  const { device, browser, os } = parseUserAgent(userAgent);
  const referrerLabel = referrer !== undefined ? parseReferrer(referrer, req.hostname) : undefined;

  try {
    const createdAt = new Date();
    const [geo, tooFast, popupBypassed] = await Promise.all([
      geoLookup(ip),
      event === 'page_view' ? isSuspiciouslyFast(ip) : Promise.resolve(false),
      isPopupBypass(sessionId, page, event, source, createdAt),
    ]);
    const uaResult = detectBot(userAgent);
    const webdriverFlagged = isWebdriver === true;
    const botFlagged = uaResult.isBot || webdriverFlagged || tooFast || popupBypassed;
    // For UA-matched bots, botReason IS the bot's actual name (e.g.
    // "Googlebot") — no separate naming step needed downstream.
    const botReason = uaResult.isBot
      ? uaResult.name
      : webdriverFlagged
        ? 'webdriver'
        : tooFast
          ? 'speed'
          : popupBypassed
            ? 'popup-bypass'
            : undefined;

    await ClickEvent.create({
      event,
      source,
      page,
      ip,
      userAgent,
      device,
      browser,
      os,
      referrer: referrerLabel,
      sessionId,
      visitorId,
      isReturning,
      durationMs,
      isBot: botFlagged,
      botReason,
      createdAt,
      ...geo,
    });
  } catch (err) {
    console.error('Failed to log click event:', err);
  }

  return res.json({ success: true });
});

// Excludes known bots/crawlers by default so they don't inflate visitor
// counts. Pass ?includeBots=true to see everything (debugging only).
function dateRange(req) {
  const since = parseInt(req.query.since, 10);
  const until = parseInt(req.query.until, 10);
  const range = {};
  if (since) range.$gte = new Date(since);
  if (until) range.$lte = new Date(until);
  return Object.keys(range).length ? { createdAt: range } : {};
}

function sinceFilter(req) {
  const filter = dateRange(req);
  if (req.query.includeBots !== 'true') filter.isBot = { $ne: true };
  return filter;
}

router.get('/summary', requireDashboardKey, async (req, res) => {
  const match = sinceFilter(req);
  const matchStage = Object.keys(match).length ? [{ $match: match }] : [];

  const [
    byEvent,
    byPage,
    byReferrer,
    byDevice,
    totalCount,
    distinctEvents,
    distinctPages,
    distinctSources,
    newVisitorCount,
    returningVisitorCount,
    avgDurationResult,
  ] = await Promise.all([
    ClickEvent.aggregate([
      ...matchStage,
      { $group: { _id: { event: '$event', source: '$source' }, count: { $sum: 1 }, last: { $max: '$createdAt' } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      ...matchStage,
      { $group: { _id: '$page', count: { $sum: 1 }, last: { $max: '$createdAt' } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.countDocuments(match),
    ClickEvent.distinct('event', match),
    ClickEvent.distinct('page', match),
    ClickEvent.distinct('source', match),
    ClickEvent.distinct('sessionId', { ...match, event: 'page_view', isReturning: false }),
    ClickEvent.distinct('sessionId', { ...match, event: 'page_view', isReturning: true }),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view_duration' } },
      { $group: { _id: null, avg: { $avg: '$durationMs' } } },
    ]),
  ]);

  const avgDurationMs = avgDurationResult[0]?.avg ?? null;

  return res.json({
    success: true,
    avgDurationMs,
    total: totalCount,
    byEvent: byEvent.map((r) => ({ event: r._id.event, source: r._id.source, count: r.count, last: r.last })),
    byPage: byPage.map((r) => ({ page: r._id, count: r.count, last: r.last })),
    byReferrer: byReferrer.map((r) => ({ referrer: r._id, count: r.count })),
    byDevice: byDevice.map((r) => ({ device: r._id, count: r.count })),
    newVisitors: newVisitorCount.length,
    returningVisitors: returningVisitorCount.length,
    filters: {
      events: distinctEvents.filter(Boolean).sort(),
      pages: distinctPages.filter(Boolean).sort(),
      sources: distinctSources.filter(Boolean).sort(),
    },
  });
});

router.get('/events', requireDashboardKey, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);

  const match = sinceFilter(req);
  if (req.query.event) match.event = req.query.event;
  if (req.query.page) match.page = req.query.page;
  if (req.query.source) match.source = req.query.source;
  if (req.query.isReturning === 'false') match.isReturning = false;
  if (req.query.isReturning === 'true') match.isReturning = true;

  const [events, total] = await Promise.all([
    ClickEvent.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ClickEvent.countDocuments(match),
  ]);

  return res.json({ success: true, total, events });
});

// Groups events by visitor session so the dashboard can show each
// visitor's path through the site (which pages, in what order).
router.get('/sessions', requireDashboardKey, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
  const match = { ...sinceFilter(req), sessionId: { $ne: null, $exists: true } };

  const sessions = await ClickEvent.aggregate([
    { $match: match },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: '$sessionId',
        visitorId: { $first: '$visitorId' },
        isReturning: { $first: '$isReturning' },
        device: { $first: '$device' },
        browser: { $first: '$browser' },
        os: { $first: '$os' },
        referrer: { $first: '$referrer' },
        ip: { $first: '$ip' },
        city: { $first: '$city' },
        country: { $first: '$country' },
        startedAt: { $min: '$createdAt' },
        lastAt: { $max: '$createdAt' },
        eventCount: { $sum: 1 },
        steps: { $push: { event: '$event', source: '$source', page: '$page', createdAt: '$createdAt' } },
      },
    },
    { $sort: { lastAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalSessions = (await ClickEvent.distinct('sessionId', match)).length;

  return res.json({ success: true, total: totalSessions, sessions });
});

// Same shape as /events, but only bot/crawler traffic — kept fully separate
// from the human visitor numbers everywhere else in this file.
function botFilter(req) {
  const filter = dateRange(req);
  filter.isBot = true;
  return filter;
}

router.get('/bots', requireDashboardKey, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
  const match = botFilter(req);

  const [events, total, uniqueIps] = await Promise.all([
    ClickEvent.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ClickEvent.countDocuments(match),
    ClickEvent.distinct('ip', match),
  ]);

  return res.json({ success: true, total, uniqueIpCount: uniqueIps.length, events });
});

// A link to this exists on every page, hidden from real visitors (off-screen,
// aria-hidden, not keyboard-focusable). Nothing a human does can reach it, so
// any request here is automatically a bot/scraper that parsed the raw HTML.
router.get('/trap', trackLimiter, async (req, res) => {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];

  try {
    const geo = await geoLookup(ip);
    await ClickEvent.create({
      event: 'honeypot_hit',
      page: req.query.from || null,
      ip,
      userAgent,
      isBot: true,
      botReason: 'honeypot',
      ...geo,
    });
  } catch (err) {
    console.error('Failed to log honeypot hit:', err);
  }

  res.status(204).end();
});

export default router;
