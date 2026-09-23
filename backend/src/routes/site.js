import { Router } from 'express';
import Site from '../models/Site.js';
import ClickEvent from '../models/ClickEvent.js';
import Alert from '../models/Alert.js';
import Goal from '../models/Goal.js';
import AiUsage from '../models/AiUsage.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { comparePassword } from '../lib/auth.js';

const router = Router();

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

const DEFAULT_REPORT_SETTINGS = { weeklyEnabled: true, monthlyEnabled: false };

// .lean() reads skip Mongoose's nested-object schema defaults, so sites
// created before reportSettings existed would otherwise come back missing
// these keys entirely — same fix as alerts.js's withDefaults().
function reportSettingsWithDefaults(settings) {
  const { weeklyEnabled, monthlyEnabled } = { ...DEFAULT_REPORT_SETTINGS, ...(settings || {}) };
  return { weeklyEnabled, monthlyEnabled };
}

const DEFAULT_BRANDING = { brandName: null, logoUrl: null };

function brandingWithDefaults(branding) {
  return { ...DEFAULT_BRANDING, ...(branding || {}) };
}

router.get('/me', requireAuth, async (req, res) => {
  const site = await Site.findById(req.siteId).lean();
  if (!site) {
    return res.status(404).json({ success: false, error: 'Site not found.' });
  }
  return res.json({ success: true, site: { name: site.name, domain: site.domain, theme: site.theme, branding: brandingWithDefaults(site.branding) } });
});

router.patch('/branding', requireAuth, async (req, res) => {
  const { brandName, logoUrl } = req.body ?? {};
  const update = {};

  if (brandName !== undefined) {
    if (brandName !== null && (typeof brandName !== 'string' || brandName.length > 60)) {
      return res.status(400).json({ success: false, error: 'brandName must be a string of 60 characters or fewer.' });
    }
    update['branding.brandName'] = brandName || null;
  }
  if (logoUrl !== undefined) {
    if (logoUrl !== null && logoUrl !== '') {
      try {
        new URL(logoUrl);
      } catch {
        return res.status(400).json({ success: false, error: 'logoUrl must be a valid URL.' });
      }
      update['branding.logoUrl'] = logoUrl;
    } else {
      update['branding.logoUrl'] = null;
    }
  }

  const site = await Site.findByIdAndUpdate(req.siteId, { $set: update }, { new: true }).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, branding: brandingWithDefaults(site.branding) });
});

router.patch('/theme', requireAuth, async (req, res) => {
  const { primaryColor, accentColor, mode } = req.body ?? {};
  const update = {};

  if (primaryColor !== undefined) {
    if (!HEX_COLOR_RE.test(primaryColor)) {
      return res.status(400).json({ success: false, error: 'primaryColor must be a hex color like #4f46e5.' });
    }
    update['theme.primaryColor'] = primaryColor;
  }
  if (accentColor !== undefined) {
    if (!HEX_COLOR_RE.test(accentColor)) {
      return res.status(400).json({ success: false, error: 'accentColor must be a hex color like #22c55e.' });
    }
    update['theme.accentColor'] = accentColor;
  }
  if (mode !== undefined) {
    if (!['light', 'dark'].includes(mode)) {
      return res.status(400).json({ success: false, error: 'mode must be "light" or "dark".' });
    }
    update['theme.mode'] = mode;
  }

  const site = await Site.findByIdAndUpdate(req.siteId, { $set: update }, { new: true }).lean();
  if (!site) {
    return res.status(404).json({ success: false, error: 'Site not found.' });
  }
  return res.json({ success: true, theme: site.theme });
});

router.get('/report-settings', requireAuth, async (req, res) => {
  const site = await Site.findById(req.siteId).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: reportSettingsWithDefaults(site.reportSettings) });
});

router.patch('/report-settings', requireAuth, async (req, res) => {
  const { weeklyEnabled, monthlyEnabled } = req.body ?? {};
  const update = {};

  if (weeklyEnabled !== undefined) update['reportSettings.weeklyEnabled'] = Boolean(weeklyEnabled);
  if (monthlyEnabled !== undefined) update['reportSettings.monthlyEnabled'] = Boolean(monthlyEnabled);

  const site = await Site.findByIdAndUpdate(req.siteId, { $set: update }, { new: true }).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: reportSettingsWithDefaults(site.reportSettings) });
});

const DEFAULT_PRIVACY_SETTINGS = { retentionDays: 425, anonymizeIp: false };
const MIN_RETENTION_DAYS = 30;
const MAX_RETENTION_DAYS = 730;

function privacySettingsWithDefaults(settings) {
  return { ...DEFAULT_PRIVACY_SETTINGS, ...(settings || {}) };
}

router.get('/privacy-settings', requireAuth, async (req, res) => {
  const site = await Site.findById(req.siteId).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: privacySettingsWithDefaults(site.privacySettings) });
});

router.patch('/privacy-settings', requireAuth, async (req, res) => {
  const { retentionDays, anonymizeIp } = req.body ?? {};
  const update = {};

  if (retentionDays !== undefined) {
    if (!Number.isInteger(retentionDays) || retentionDays < MIN_RETENTION_DAYS || retentionDays > MAX_RETENTION_DAYS) {
      return res.status(400).json({ success: false, error: `retentionDays must be an integer between ${MIN_RETENTION_DAYS} and ${MAX_RETENTION_DAYS}.` });
    }
    update['privacySettings.retentionDays'] = retentionDays;
  }
  if (anonymizeIp !== undefined) {
    update['privacySettings.anonymizeIp'] = Boolean(anonymizeIp);
  }

  const site = await Site.findByIdAndUpdate(req.siteId, { $set: update }, { new: true }).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });
  return res.json({ success: true, settings: privacySettingsWithDefaults(site.privacySettings) });
});

// Real, complete data portability: every event this site's tracker has ever
// recorded, plus its own settings/goals/alerts, as newline-delimited JSON —
// streamed via a cursor so exporting a large history doesn't load it all
// into memory at once (unlike everywhere else in this app, which is small
// enough to just .lean() into an array).
router.get('/export', requireAuth, async (req, res) => {
  const site = await Site.findById(req.siteId).lean();
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });

  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Content-Disposition', `attachment; filename="analytics-export-${site.domain}.ndjson"`);

  res.write(`${JSON.stringify({ type: 'site', data: { name: site.name, domain: site.domain, createdAt: site.createdAt } })}\n`);

  const goals = await Goal.find({ siteId: req.siteId }).lean();
  goals.forEach((g) => res.write(`${JSON.stringify({ type: 'goal', data: g })}\n`));

  const alerts = await Alert.find({ siteId: req.siteId }).lean();
  alerts.forEach((a) => res.write(`${JSON.stringify({ type: 'alert', data: a })}\n`));

  const cursor = ClickEvent.find({ siteId: req.siteId }).lean().cursor();
  for await (const doc of cursor) {
    res.write(`${JSON.stringify({ type: 'event', data: doc })}\n`);
  }

  res.end();
});

// Self-service account + full data deletion — irreversible, so it requires
// re-confirming the login password rather than just the JWT (which could be
// sitting in an unattended browser tab). Deletes from every model that
// carries this site's siteId so nothing is orphaned behind.
router.delete('/me', requireAuth, async (req, res) => {
  const { password } = req.body ?? {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'password is required to confirm account deletion.' });
  }

  const site = await Site.findById(req.siteId);
  if (!site) return res.status(404).json({ success: false, error: 'Site not found.' });

  const valid = await comparePassword(password, site.passwordHash);
  if (!valid) return res.status(401).json({ success: false, error: 'Incorrect password.' });

  await Promise.all([
    ClickEvent.deleteMany({ siteId: site._id }),
    Alert.deleteMany({ siteId: site._id }),
    Goal.deleteMany({ siteId: site._id }),
    AiUsage.deleteMany({ siteId: site._id }),
  ]);
  await Site.deleteOne({ _id: site._id });

  return res.json({ success: true });
});

export default router;
