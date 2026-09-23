import { Router } from 'express';
import crypto from 'crypto';
import Site from '../models/Site.js';
import ClickEvent from '../models/ClickEvent.js';
import Alert from '../models/Alert.js';
import { hashPassword } from '../lib/auth.js';
import { sendClientWelcomeEmail } from '../lib/mailer.js';

const router = Router();

function requireAdminKey(req, res, next) {
  if (!process.env.ADMIN_API_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
}

// Strips protocol/www so "https://www.client.com/" and "client.com" are
// treated as the same domain everywhere else in the system.
function normalizeDomain(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

async function generateUniqueSiteKey() {
  for (;;) {
    const key = crypto.randomBytes(12).toString('hex');
    // eslint-disable-next-line no-await-in-loop
    const existing = await Site.findOne({ siteKey: key });
    if (!existing) return key;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A deterministic, evidence-backed status per client — same rule-based
// approach as opportunityRules.js/alertEvaluator.js rather than a fuzzy
// "score", so the agency can see exactly why a site needs attention.
function computeHealth({ createdAt, highAlerts, mediumAlerts, pageViews7d }) {
  const reasons = [];
  let status = 'healthy';

  if (highAlerts > 0) {
    status = 'critical';
    reasons.push(`${highAlerts} high-priority alert${highAlerts > 1 ? 's' : ''} open`);
  }
  if (mediumAlerts > 0 && status !== 'critical') {
    status = 'attention';
  }
  if (mediumAlerts > 0) {
    reasons.push(`${mediumAlerts} alert${mediumAlerts > 1 ? 's' : ''} need review`);
  }

  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  if (pageViews7d === 0 && ageMs > ONE_WEEK_MS) {
    if (status === 'healthy') status = 'attention';
    reasons.push('No traffic in the last 7 days — check the tracking script is installed');
  }

  if (reasons.length === 0) reasons.push('No open issues');
  return { status, reasons };
}

// The agency-facing multi-client list — quick health at a glance for every
// managed site, not any one tenant's own view (that stays scoped by JWT via
// requireAuth everywhere else). One aggregation per metric across all sites
// at once rather than N+1 queries per site.
router.get('/sites', requireAdminKey, async (req, res) => {
  const sites = await Site.find({}).sort({ createdAt: -1 }).lean();
  const siteIds = sites.map((s) => s._id);
  const now = new Date();
  const since24h = new Date(now - 24 * 60 * 60 * 1000);
  const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [pv24hRows, pv7dRows, alertRows] = await Promise.all([
    ClickEvent.aggregate([
      { $match: { siteId: { $in: siteIds }, event: 'page_view', isBot: { $ne: true }, createdAt: { $gte: since24h } } },
      { $group: { _id: '$siteId', count: { $sum: 1 } } },
    ]),
    ClickEvent.aggregate([
      { $match: { siteId: { $in: siteIds }, event: 'page_view', isBot: { $ne: true }, createdAt: { $gte: since7d } } },
      { $group: { _id: '$siteId', count: { $sum: 1 } } },
    ]),
    Alert.aggregate([
      { $match: { siteId: { $in: siteIds }, acknowledged: false } },
      { $group: { _id: { siteId: '$siteId', severity: '$severity' }, count: { $sum: 1 } } },
    ]),
  ]);

  const toMap = (rows) => new Map(rows.map((r) => [String(r._id), r.count]));
  const pv24h = toMap(pv24hRows);
  const pv7d = toMap(pv7dRows);

  const openAlerts = new Map();
  const highAlerts = new Map();
  const mediumAlerts = new Map();
  alertRows.forEach((r) => {
    const key = String(r._id.siteId);
    openAlerts.set(key, (openAlerts.get(key) || 0) + r.count);
    if (r._id.severity === 'high') highAlerts.set(key, (highAlerts.get(key) || 0) + r.count);
    if (r._id.severity === 'medium') mediumAlerts.set(key, (mediumAlerts.get(key) || 0) + r.count);
  });

  return res.json({
    success: true,
    sites: sites.map((s) => {
      const key = String(s._id);
      const pageViews7d = pv7d.get(key) || 0;
      const health = computeHealth({
        createdAt: s.createdAt,
        highAlerts: highAlerts.get(key) || 0,
        mediumAlerts: mediumAlerts.get(key) || 0,
        pageViews7d,
      });
      return {
        id: s._id,
        name: s.name,
        domain: s.domain,
        ownerEmail: s.ownerEmail,
        siteKey: s.siteKey,
        createdAt: s.createdAt,
        pageViews24h: pv24h.get(key) || 0,
        pageViews7d,
        openAlerts: openAlerts.get(key) || 0,
        health,
      };
    }),
  });
});

router.post('/sites', requireAdminKey, async (req, res) => {
  const { name, domain, ownerEmail, password } = req.body ?? {};

  if (!name || !domain || !ownerEmail || !password) {
    return res.status(400).json({ success: false, error: 'name, domain, ownerEmail, and password are all required.' });
  }
  if (!EMAIL_RE.test(ownerEmail)) {
    return res.status(400).json({ success: false, error: 'ownerEmail is not a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ success: false, error: 'password must be at least 8 characters.' });
  }

  const normalizedDomain = normalizeDomain(domain);
  const normalizedEmail = ownerEmail.trim().toLowerCase();

  const existing = await Site.findOne({ ownerEmail: normalizedEmail });
  if (existing) {
    return res.status(409).json({ success: false, error: 'A site with that ownerEmail already exists.' });
  }

  const siteKey = await generateUniqueSiteKey();
  const passwordHash = await hashPassword(password);

  const site = await Site.create({
    name: name.trim(),
    domain: normalizedDomain,
    siteKey,
    ownerEmail: normalizedEmail,
    passwordHash,
  });

  const loginUrl = process.env.CLIENT_DASHBOARD_URL || 'http://localhost:5173';
  const trackerOrigin = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 4000}`;
  const embedSnippet = `<script src="${trackerOrigin}/track.js" data-site="${siteKey}"></script>`;

  try {
    await sendClientWelcomeEmail({ to: normalizedEmail, name: site.name, loginUrl, embedSnippet });
  } catch (err) {
    // The site is already created and usable — a failed welcome email
    // shouldn't fail provisioning, just get logged for manual follow-up.
    console.error('Failed to send client welcome email:', err);
  }

  return res.status(201).json({
    success: true,
    site: { id: site._id, name: site.name, domain: site.domain, siteKey: site.siteKey },
  });
});

export default router;
