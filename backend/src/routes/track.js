import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ClickEvent from '../models/ClickEvent.js';
import { geoLookup } from '../lib/geoLookup.js';
import { parseUserAgent } from '../lib/parseUserAgent.js';
import { parseReferrer } from '../lib/parseReferrer.js';
import { isBot } from '../lib/isBot.js';

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

router.post('/', trackLimiter, async (req, res) => {
  const { event, source, page, referrer, sessionId, visitorId, isReturning, durationMs } = req.body ?? {};

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ success: false, error: 'event is required.' });
  }

  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const { device, browser, os } = parseUserAgent(userAgent);
  const referrerLabel = referrer !== undefined ? parseReferrer(referrer, req.hostname) : undefined;

  try {
    const geo = await geoLookup(ip);
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
      isBot: isBot(userAgent),
      ...geo,
    });
  } catch (err) {
    console.error('Failed to log click event:', err);
  }

  return res.json({ success: true });
});

// Excludes known bots/crawlers by default so they don't inflate visitor
// counts. Pass ?includeBots=true to see everything (debugging only).
function sinceFilter(req) {
  const since = parseInt(req.query.since, 10);
  const filter = since ? { createdAt: { $gte: new Date(since) } } : {};
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
  const since = parseInt(req.query.since, 10);
  const filter = since ? { createdAt: { $gte: new Date(since) } } : {};
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

export default router;
