import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import PopupClick from '../models/PopupClick.js';

const router = Router();

const clickLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', clickLimiter, async (req, res) => {
  const { popup, page } = req.body ?? {};

  if (!popup || typeof popup !== 'string') {
    return res.status(400).json({ success: false, error: 'popup is required.' });
  }

  try {
    await PopupClick.create({ popup, page });
  } catch (err) {
    console.error('Failed to log popup click:', err);
  }

  return res.json({ success: true });
});

router.get('/count', async (req, res) => {
  if (!process.env.POPUP_STATS_KEY || req.query.key !== process.env.POPUP_STATS_KEY) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const popup = typeof req.query.popup === 'string' ? req.query.popup : 'welcome-offer';
  const count = await PopupClick.countDocuments({ popup });

  return res.json({ success: true, popup, count });
});

export default router;
