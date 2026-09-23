import { Router } from 'express';
import mongoose from 'mongoose';
import ClickEvent from '../models/ClickEvent.js';
import Goal from '../models/Goal.js';
import { suggestLabel } from '../lib/eventLabels.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const NOT_A_GOAL_CANDIDATE = new Set(['page_view', 'page_view_duration']);

// "Possible goals found" — every distinct event name this site has actually
// recorded (excluding page views), with how often it happened and whether
// it's already been enabled as a goal. Nothing here is treated as a
// conversion until the client explicitly enables it below.
router.get('/discovered', requireAuth, async (req, res) => {
  const siteId = new mongoose.Types.ObjectId(req.siteId);

  const [eventCounts, goals] = await Promise.all([
    ClickEvent.aggregate([
      { $match: { siteId, isBot: { $ne: true } } },
      { $group: { _id: '$event', count: { $sum: 1 }, lastSeen: { $max: '$createdAt' } } },
      { $sort: { count: -1 } },
    ]),
    Goal.find({ siteId }).lean(),
  ]);

  const goalByEvent = new Map(goals.map((g) => [g.event, g]));

  const discovered = eventCounts
    .filter((r) => r._id && !NOT_A_GOAL_CANDIDATE.has(r._id))
    .map((r) => {
      const existing = goalByEvent.get(r._id);
      return {
        event: r._id,
        count: r.count,
        lastSeen: r.lastSeen,
        suggestedLabel: suggestLabel(r._id),
        goal: existing
          ? { id: existing._id, label: existing.label, enabled: existing.enabled, estimatedValue: existing.estimatedValue ?? null }
          : null,
      };
    });

  return res.json({ success: true, discovered });
});

router.get('/', requireAuth, async (req, res) => {
  const goals = await Goal.find({ siteId: req.siteId }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, goals });
});

// Enabling a goal for the first time creates it; enabling one that already
// exists (e.g. re-enabling after a disable) just updates it in place —
// there is deliberately never more than one goal per event per site.
router.post('/', requireAuth, async (req, res) => {
  const { event, label } = req.body ?? {};

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ success: false, error: 'event is required.' });
  }
  const cleanLabel = typeof label === 'string' && label.trim() ? label.trim() : suggestLabel(event);

  const goal = await Goal.findOneAndUpdate(
    { siteId: req.siteId, event },
    { $set: { label: cleanLabel, enabled: true }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true, new: true }
  );

  return res.status(201).json({ success: true, goal });
});

// req.siteId (from the verified JWT) gates every lookup here — a goal id
// alone is never enough to read/modify it, so one client's token can't
// touch another tenant's goals even by guessing/enumerating ids.
router.patch('/:id', requireAuth, async (req, res) => {
  const { label, enabled, estimatedValue } = req.body ?? {};
  const update = {};
  if (label !== undefined) {
    if (typeof label !== 'string' || !label.trim()) {
      return res.status(400).json({ success: false, error: 'label must be a non-empty string.' });
    }
    update.label = label.trim();
  }
  if (enabled !== undefined) update.enabled = Boolean(enabled);
  if (estimatedValue !== undefined) {
    if (estimatedValue !== null && (typeof estimatedValue !== 'number' || estimatedValue < 0 || Number.isNaN(estimatedValue))) {
      return res.status(400).json({ success: false, error: 'estimatedValue must be a non-negative number or null.' });
    }
    update.estimatedValue = estimatedValue;
  }

  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, siteId: req.siteId }, { $set: update }, { new: true });
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found.' });
  }
  return res.json({ success: true, goal });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, siteId: req.siteId });
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found.' });
  }
  return res.json({ success: true });
});

export default router;
