import { Router } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { gatherAnalyticsContext } from '../lib/gatherAnalyticsContext.js';
import { askAiAnalyst } from '../lib/aiAnalyst.js';
import { checkAndReserveBudget } from '../lib/aiUsageBudget.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const DAY_MS = 24 * 60 * 60 * 1000;

// A short burst guard on top of the daily budget below — stops one client
// from firing off requests faster than a human could actually be typing
// questions.
const askLimiter = rateLimit({ windowMs: 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });

router.post('/', requireAuth, askLimiter, async (req, res) => {
  const { question } = req.body ?? {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ success: false, error: 'question is required.' });
  }
  if (question.length > 500) {
    return res.status(400).json({ success: false, error: 'question is too long (max 500 characters).' });
  }
  // Fail fast before doing any DB work if the integration isn't set up.
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'not_configured',
      message: "The AI Analyst isn't set up yet — it needs a Gemini API key configured on the server.",
    });
  }

  const siteId = new mongoose.Types.ObjectId(req.siteId);

  // Checked (and reserved) before the costly context-gathering + AI call —
  // protects the free tier's real daily ceiling, shared across every
  // tenant, from ever being exceeded.
  const budget = await checkAndReserveBudget(siteId);
  if (!budget.allowed) {
    return res.status(429).json({ success: false, error: budget.reason, message: budget.message });
  }

  const until = req.query.until ? parseInt(req.query.until, 10) : Date.now();
  const since = req.query.since ? parseInt(req.query.since, 10) : until - 7 * DAY_MS;

  try {
    const context = await gatherAnalyticsContext(siteId, since, until);
    const answer = await askAiAnalyst({ question: question.trim(), context });
    return res.json({ success: true, answer });
  } catch (err) {
    if (err.code === 'NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        error: 'not_configured',
        message: "The AI Analyst isn't set up yet — it needs a Gemini API key configured on the server.",
      });
    }
    console.error('AI Analyst request failed:', err);
    return res.status(502).json({ success: false, error: 'provider_error', message: 'The AI provider request failed. Try again shortly.' });
  }
});

export default router;
