import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ClickEvent from '../models/ClickEvent.js';
import Site from '../models/Site.js';
import { geoLookup } from '../lib/geoLookup.js';
import { parseUserAgent } from '../lib/parseUserAgent.js';
import { parseReferrer } from '../lib/parseReferrer.js';
import { detectBot } from '../lib/isBot.js';
import { isSuspiciouslyFast } from '../lib/isSuspiciouslyFast.js';
import { isPopupBypass } from '../lib/isPopupBypass.js';
import { isSessionFlood } from '../lib/isSessionFlood.js';
import { classifyChannel } from '../lib/classifyChannel.js';
import { classifyTrafficQuality } from '../lib/trafficQuality.js';
import { sanitizeMetadata } from '../lib/sanitizeMetadata.js';
import { anonymizeIp } from '../lib/anonymizeIp.js';
import { dateRange } from '../lib/dateRangeFilter.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

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

function normalizeHost(host) {
  return host.replace(/^www\./, '');
}

// A real browser always sets Origin (or at least Referer) to the site it's
// actually running on — that's enforced by the browser itself, not
// something a page's JS can fake. A script hitting this endpoint directly
// (with a stolen/guessed siteKey) has no reason to bother setting either to
// that specific tenant's own registered domain.
function isFromDomain(req, domain) {
  const isDev = process.env.NODE_ENV !== 'production';

  const matches = (value) => {
    if (!value) return false;
    try {
      const host = normalizeHost(new URL(value).host);
      if (host === domain) return true;
      // Only relaxed outside production, for local dev testing — never on
      // the live server, since Origin is trivially fake-able by a
      // non-browser client and "just claim localhost" would otherwise be a
      // known bypass.
      if (isDev && (host.startsWith('localhost') || host.startsWith('127.0.0.1'))) return true;
      return false;
    } catch {
      return false;
    }
  };

  return matches(firstHeaderValue(req.headers.origin)) || matches(firstHeaderValue(req.headers.referer));
}

router.post('/', trackLimiter, async (req, res) => {
  const body = req.body ?? {};
  const {
    siteKey,
    event,
    source,
    page,
    referrer,
    sessionId,
    visitorId,
    isReturning,
    durationMs,
    isWebdriver,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    metadata,
  } = body;

  const site = siteKey ? await Site.findOne({ siteKey }) : null;

  if (!site || !isFromDomain(req, site.domain)) {
    // Silently succeed (no error detail) so a spam script — or one probing
    // for valid siteKeys — gets no signal whether the key exists or the
    // origin was rejected, rather than just dropped.
    return res.json({ success: true });
  }

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ success: false, error: 'event is required.' });
  }

  const ip = getClientIp(req);
  // geoLookup() below runs on the real IP for accuracy — this is only what
  // gets persisted (and, so the too-fast check below still matches this
  // site's own past rows, what gets queried against too).
  const storedIp = site.privacySettings?.anonymizeIp ? anonymizeIp(ip) : ip;
  const userAgent = req.headers['user-agent'];
  const { device, browser, os } = parseUserAgent(userAgent);
  const referrerLabel = referrer !== undefined ? parseReferrer(referrer, req.hostname) : undefined;
  const channel = classifyChannel({ referrerLabel, utmMedium });

  try {
    const createdAt = new Date();
    const [geo, tooFast, popupBypassed, sessionFlood] = await Promise.all([
      geoLookup(ip),
      event === 'page_view' ? isSuspiciouslyFast(storedIp) : Promise.resolve(false),
      isPopupBypass(sessionId, page, event, source, createdAt),
      event === 'page_view' ? isSessionFlood(site._id, visitorId) : Promise.resolve(false),
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

    // A separate, additive signal layer on top of the existing bot flag —
    // e.g. a VPN user is "suspicious" for quality reporting but is NOT
    // excluded from human stats the way a confirmed bot is, so this never
    // changes isBot/botReason above.
    const trafficQuality = classifyTrafficQuality({
      // isBot.js flags "no UA" as its own kind of bot match — keep that as
      // exactly one reason (hasNoUserAgent) instead of also reporting it as
      // a separate "known bot pattern" match.
      isKnownBot: uaResult.isBot && Boolean(userAgent),
      hasNoUserAgent: !userAgent,
      isWebdriver: webdriverFlagged,
      isTooFast: tooFast,
      isSessionFlood: sessionFlood,
      isHosting: geo.isHosting,
      isProxy: geo.isProxy,
    });

    await ClickEvent.create({
      siteId: site._id,
      event,
      source,
      page,
      ip: storedIp,
      userAgent,
      device,
      browser,
      os,
      referrer: referrerLabel,
      channel,
      utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign, term: utmTerm, content: utmContent },
      sessionId,
      visitorId,
      isReturning,
      durationMs,
      isBot: botFlagged,
      botReason,
      createdAt,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      isp: geo.isp,
      metadata: { trafficQuality, ...sanitizeMetadata(event, metadata) },
    });
  } catch (err) {
    console.error('Failed to log click event:', err);
  }

  return res.json({ success: true });
});

// Excludes known bots/crawlers by default so they don't inflate visitor
// counts. Pass ?includeBots=true to see everything (debugging only).
function sinceFilter(req) {
  const filter = dateRange(req);
  if (req.query.includeBots !== 'true') filter.isBot = { $ne: true };
  return filter;
}

router.get('/summary', requireAuth, async (req, res) => {
  const match = sinceFilter(req);
  const matchStage = [{ $match: match }];

  const [
    byEvent,
    byPage,
    byReferrer,
    byDevice,
    byOs,
    byCountry,
    byChannel,
    byDay,
    totalCount,
    distinctEvents,
    distinctPages,
    distinctSources,
    newVisitorCount,
    returningVisitorCount,
    avgDurationResult,
    bounceStats,
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
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      { $group: { _id: '$channel', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: { ...match, event: 'page_view' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          visits: { $addToSet: '$sessionId' },
          pageViews: { $sum: 1 },
        },
      },
      { $project: { _id: 1, pageViews: 1, visits: { $size: '$visits' } } },
      { $sort: { _id: 1 } },
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
    // A session "bounced" if it has exactly one page_view and no other
    // non-duration event — i.e. the visitor left without interacting further.
    ClickEvent.aggregate([
      { $match: { ...match, sessionId: { $ne: null, $exists: true }, event: { $ne: 'page_view_duration' } } },
      { $group: { _id: '$sessionId', eventCount: { $sum: 1 } } },
      { $group: { _id: null, totalSessions: { $sum: 1 }, bounced: { $sum: { $cond: [{ $eq: ['$eventCount', 1] }, 1, 0] } } } },
    ]),
  ]);

  const avgDurationMs = avgDurationResult[0]?.avg ?? null;
  const bounce = bounceStats[0] ?? { totalSessions: 0, bounced: 0 };
  const bounceRate = bounce.totalSessions ? bounce.bounced / bounce.totalSessions : null;

  return res.json({
    success: true,
    avgDurationMs,
    bounceRate,
    total: totalCount,
    byEvent: byEvent.map((r) => ({ event: r._id.event, source: r._id.source, count: r.count, last: r.last })),
    byPage: byPage.map((r) => ({ page: r._id, count: r.count, last: r.last })),
    byReferrer: byReferrer.map((r) => ({ referrer: r._id, count: r.count })),
    byDevice: byDevice.map((r) => ({ device: r._id, count: r.count })),
    byOs: byOs.map((r) => ({ os: r._id, count: r.count })),
    byCountry: byCountry.map((r) => ({ country: r._id, count: r.count })),
    byChannel: byChannel.map((r) => ({ channel: r._id, count: r.count })),
    byDay: byDay.map((r) => ({ date: r._id, visits: r.visits, pageViews: r.pageViews })),
    newVisitors: newVisitorCount.length,
    returningVisitors: returningVisitorCount.length,
    filters: {
      events: distinctEvents.filter(Boolean).sort(),
      pages: distinctPages.filter(Boolean).sort(),
      sources: distinctSources.filter(Boolean).sort(),
    },
  });
});

// Traffic-quality breakdown for page_view traffic — deliberately runs
// against dateRange(req) (siteId + date only), NOT sinceFilter's isBot
// exclusion, since the whole point here is to classify the full population
// (human/likely_human/suspicious/bot), not just the pre-filtered "human" set.
router.get('/quality', requireAuth, async (req, res) => {
  const match = { ...dateRange(req), event: 'page_view' };

  const [byClassification, avgScoreResult, topReasons] = await Promise.all([
    ClickEvent.aggregate([
      { $match: match },
      { $group: { _id: '$metadata.trafficQuality.classification', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([
      { $match: match },
      { $group: { _id: null, avg: { $avg: '$metadata.trafficQuality.score' } } },
    ]),
    ClickEvent.aggregate([
      { $match: match },
      { $unwind: '$metadata.trafficQuality.reasons' },
      { $group: { _id: '$metadata.trafficQuality.reasons', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  // Excludes the null bucket (page views from before this feature existed,
  // or any future case where classification failed to run) so percentages
  // below always add up to 100% of classified traffic — an unclassified
  // remainder folded into the denominator would silently understate every
  // percentage without explaining why.
  const classified = byClassification.filter((r) => r._id);
  const total = classified.reduce((sum, r) => sum + r.count, 0);

  return res.json({
    success: true,
    total,
    averageScore: avgScoreResult[0]?.avg ?? null,
    byClassification: classified.map((r) => ({ classification: r._id, count: r.count, pct: total ? r.count / total : 0 })),
    topReasons: topReasons.map((r) => ({ reason: r._id, count: r.count })),
  });
});

router.get('/events', requireAuth, async (req, res) => {
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
router.get('/sessions', requireAuth, async (req, res) => {
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

router.get('/bots', requireAuth, async (req, res) => {
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
  const site = req.query.site ? await Site.findOne({ siteKey: req.query.site }) : null;
  if (!site) {
    return res.status(204).end();
  }

  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];

  try {
    const geo = await geoLookup(ip);
    await ClickEvent.create({
      siteId: site._id,
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
