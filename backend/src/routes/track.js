import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ClickEvent from '../models/ClickEvent.js';
import { geoLookup } from '../lib/geoLookup.js';

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
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
  const { event, source, page } = req.body ?? {};

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ success: false, error: 'event is required.' });
  }

  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    const geo = await geoLookup(ip);
    await ClickEvent.create({ event, source, page, ip, userAgent, ...geo });
  } catch (err) {
    console.error('Failed to log click event:', err);
  }

  return res.json({ success: true });
});

router.get('/summary', requireDashboardKey, async (req, res) => {
  const [byEvent, byPage, totalCount] = await Promise.all([
    ClickEvent.aggregate([
      { $group: { _id: { event: '$event', source: '$source' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ClickEvent.aggregate([{ $group: { _id: '$page', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ClickEvent.countDocuments(),
  ]);

  return res.json({
    success: true,
    total: totalCount,
    byEvent: byEvent.map((r) => ({ event: r._id.event, source: r._id.source, count: r.count })),
    byPage: byPage.map((r) => ({ page: r._id, count: r.count })),
  });
});

router.get('/events', requireDashboardKey, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);

  const [events, total] = await Promise.all([
    ClickEvent.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ClickEvent.countDocuments(),
  ]);

  return res.json({ success: true, total, events });
});

export default router;
