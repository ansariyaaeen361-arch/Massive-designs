import { Router } from 'express';
import { dateRange } from '../lib/dateRangeFilter.js';
import { computeOpportunities } from '../lib/computeOpportunities.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// A condensed "What Needs Attention?" view over the exact same evidence-backed
// findings as /api/opportunities — same engine, same data, just trimmed to
// one line each so it can be the first thing a client sees.
router.get('/', requireAuth, async (req, res) => {
  const opportunities = await computeOpportunities(dateRange(req));

  const items = opportunities.map((o) => ({
    severity: o.severity,
    message: o.whatHappened,
    page: o.page,
  }));

  return res.json({ success: true, items, count: items.length, allClear: items.length === 0 });
});

export default router;
