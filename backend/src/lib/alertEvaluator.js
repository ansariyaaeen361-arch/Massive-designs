import Site from '../models/Site.js';
import Alert from '../models/Alert.js';
import { computeAnomalies } from './computeAnomalies.js';
import { compareMetric } from './anomalyDetection.js';
import { sendAlertEmail } from './mailer.js';

const DAY_MS = 24 * 60 * 60 * 1000;
// Don't re-alert the exact same ongoing condition every 30-minute cycle —
// once notified, wait a day before the same finding can fire again.
const DEDUPE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

// Maps computeAnomalies.js's generic anomaly types (shared with the
// dashboard's Anomalies page) onto the 8 named alert types from the spec.
// top_page_shift/channel_shift/day_of_week_anomaly are dashboard-only
// insights, not part of the defined alert set.
const TYPE_MAP = {
  traffic_change: { down: 'traffic_drop', up: 'traffic_spike' },
  conversions_change: { down: 'conversion_drop' },
  conversion_rate_change: { down: 'conversion_drop' },
  quality_change: { down: 'quality_drop' },
  performance_change: { up: 'performance_degradation' },
  errors_change: { up: 'errors_spike' },
};

async function postWebhook(url, payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export async function evaluateSite(site) {
  const settings = site.alertSettings || {};
  const enabled = new Set(settings.enabledTypes || []);
  if (!enabled.size) return;

  const until = Date.now();
  const since = until - DAY_MS;

  // Day-of-week comparison needs a stable daily window, not a 30-minute
  // rolling re-evaluation — that stays a dashboard-only (Anomalies page)
  // insight, not part of the periodic alert check.
  const { anomalies, current, previous } = await computeAnomalies(site._id, since, until, { dayOfWeek: false });

  const candidates = [];

  anomalies.forEach((a) => {
    const mapped = TYPE_MAP[a.type]?.[a.direction];
    if (mapped && enabled.has(mapped)) {
      candidates.push({ type: mapped, severity: a.severity, whatHappened: a.whatHappened, evidence: a.evidence, suggestedAction: a.suggestedAction });
    }
  });

  if (enabled.has('bot_spike')) {
    const currBotPct = current.allPageViews ? current.botPageViews / current.allPageViews : 0;
    const prevBotPct = previous.allPageViews ? previous.botPageViews / previous.allPageViews : 0;
    const cmp = compareMetric({
      current: Math.round(currBotPct * 1000),
      previous: Math.round(prevBotPct * 1000),
      sampleSize: Math.min(current.allPageViews, previous.allPageViews),
      minSample: 20,
      thresholdPct: 50,
    });
    if (cmp?.significant && cmp.direction === 'up') {
      candidates.push({
        type: 'bot_spike',
        severity: 'medium',
        whatHappened: 'Bot/automated traffic spiked in the last 24 hours.',
        evidence: `Bot share of traffic was ${Math.round(prevBotPct * 100)}% in the previous 24 hours, now ${Math.round(currBotPct * 100)}%.`,
        suggestedAction: 'Check the Traffic Quality breakdown on Overview for which bot/reason is driving this.',
      });
    }
  }

  if (enabled.has('page_unavailable')) {
    previous.pageCounts.forEach((prevCount, page) => {
      if (prevCount < 10) return;
      const currCount = current.pageCounts.get(page) || 0;
      if (currCount === 0) {
        candidates.push({
          type: 'page_unavailable',
          severity: 'high',
          whatHappened: `${page} appears to have stopped receiving traffic.`,
          evidence: `${page} had ${prevCount} page views in the previous 24 hours, and 0 in the last 24 hours.`,
          suggestedAction: `Manually check that ${page} still loads correctly and hasn't been taken down or broken.`,
        });
      }
    });
  }

  await dispatchCandidates(site, candidates);
}

// Separated from evaluateSite so the dispatch mechanics (dedupe, DB write,
// email, webhook) can be exercised directly with a hand-built candidate
// list — verified this way during Phase 15 since real anomaly conditions
// aren't always present in a given 24h window at test time.
export async function dispatchCandidates(site, candidates) {
  const settings = site.alertSettings || {};

  for (const c of candidates) {
    const dedupeKey = `${c.type}:${c.whatHappened}`.slice(0, 200);
    // eslint-disable-next-line no-await-in-loop
    const recent = await Alert.findOne({ siteId: site._id, dedupeKey, createdAt: { $gte: new Date(Date.now() - DEDUPE_COOLDOWN_MS) } });
    if (recent) continue;

    // eslint-disable-next-line no-await-in-loop
    const alert = await Alert.create({
      siteId: site._id,
      type: c.type,
      severity: c.severity,
      whatHappened: c.whatHappened,
      evidence: c.evidence,
      suggestedAction: c.suggestedAction,
      dedupeKey,
    });

    if (settings.emailEnabled) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await sendAlertEmail({ to: site.ownerEmail, siteName: site.name, dashboardUrl: process.env.CLIENT_DASHBOARD_URL || '', alert: c });
        alert.emailSent = true;
      } catch (err) {
        console.error('Failed to send alert email:', err);
      }
    }
    if (settings.webhookUrl) {
      // eslint-disable-next-line no-await-in-loop
      alert.webhookSent = await postWebhook(settings.webhookUrl, {
        site: site.name,
        severity: c.severity,
        whatHappened: c.whatHappened,
        evidence: c.evidence,
        suggestedAction: c.suggestedAction,
      });
    }
    // eslint-disable-next-line no-await-in-loop
    await alert.save();
  }
}

export async function evaluateAllSites() {
  const sites = await Site.find({});
  for (const site of sites) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await evaluateSite(site);
    } catch (err) {
      console.error('Alert evaluation failed for site', site._id.toString(), err);
    }
  }
}
