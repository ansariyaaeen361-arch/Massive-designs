import { Router } from 'express';
import mongoose from 'mongoose';
import { computeAnomalies } from '../lib/computeAnomalies.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const DAY_MS = 24 * 60 * 60 * 1000;

router.get('/', requireAuth, async (req, res) => {
  const siteId = new mongoose.Types.ObjectId(req.siteId);
  const until = req.query.until ? parseInt(req.query.until, 10) : Date.now();
  const since = req.query.since ? parseInt(req.query.since, 10) : until - 7 * DAY_MS;

  const { anomalies } = await computeAnomalies(siteId, since, until);

  return res.json({ success: true, anomalies, count: anomalies.length, period: { since, until } });
});

export default router;
