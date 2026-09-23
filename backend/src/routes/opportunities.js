import { Router } from 'express';
import { dateRange } from '../lib/dateRangeFilter.js';
import { computeOpportunities } from '../lib/computeOpportunities.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const opportunities = await computeOpportunities(dateRange(req));
  return res.json({ success: true, opportunities, count: opportunities.length });
});

export default router;
