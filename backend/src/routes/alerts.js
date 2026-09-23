import { Router } from 'express';
import Alert from '../models/Alert.js';
import Site from '../models/Site.js';
import { ALERT_TYPES } from '../lib/alertTypes.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const DEFAULT_ALERT_SETTINGS = { enabledTypes: ALERT_TYPES, emailEnabled: true, webhookUrl: null };

// .lean() reads skip Mongoose's document hydration, so schema defaults for
// a nested object never get filled in for sites created (or partially
// PATCHed) before this field existed — merge explicitly so the response is
// always complete rather than silently missing keys.
function withDefaults(settings) {
  return { ...DEFAULT_ALERT_SETTINGS, ...(settings || {}) };
}

router.get('/', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const alerts = await Alert.find({ siteId: req.siteId }).sort({ createdAt: -1 }).limit(limit).lean();
  return res.json({ success: true, alerts });
});

// These two MUST be registered before PATCH /:id below — otherwise Express
// matches "/settings" against the ":id" param route first (id="settings"),
// which is exactly what crashed the whole server during verification: an
// invalid-ObjectId cast error thrown inside an async handler with nothing
// catching it. See server.js's process-level safety net for the other half
// of that fix.
router.get('/settings', requireAuth, async (req, res) => {
  const site = await Site.findById(req.siteId).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: withDefaults(site.alertSettings), availableTypes: ALERT_TYPES });
});

router.patch('/settings', requireAuth, async (req, res) => {
  const { enabledTypes, emailEnabled, webhookUrl } = req.body ?? {};
  const update = {};

  if (enabledTypes !== undefined) {
    if (!Array.isArray(enabledTypes) || enabledTypes.some((t) => !ALERT_TYPES.includes(t))) {
      return res.status(400).json({ success: false, error: 'enabledTypes must be an array drawn from the known alert types.' });
    }
    update['alertSettings.enabledTypes'] = enabledTypes;
  }
  if (emailEnabled !== undefined) {
    update['alertSettings.emailEnabled'] = Boolean(emailEnabled);
  }
  if (webhookUrl !== undefined) {
    if (webhookUrl !== null && webhookUrl !== '') {
      try {
        new URL(webhookUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'webhookUrl must be a valid URL.' });
      }
      update['alertSettings.webhookUrl'] = webhookUrl;
    } else {
      update['alertSettings.webhookUrl'] = null;
    }
  }

  const site = await Site.findByIdAndUpdate(req.siteId, { $set: update }, { new: true }).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: withDefaults(site.alertSettings) });
});

// req.siteId (from the verified JWT) gates the lookup — same IDOR-safe
// pattern as goals.js — a client can never acknowledge another tenant's alert.
router.patch('/:id', requireAuth, async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, siteId: req.siteId },
    { $set: { acknowledged: Boolean(req.body?.acknowledged) } },
    { new: true }
  );
  if (!alert) return res.status(404).json({ success: false, error: 'Alert not found.' });
  return res.json({ success: true, alert });
});

export default router;
