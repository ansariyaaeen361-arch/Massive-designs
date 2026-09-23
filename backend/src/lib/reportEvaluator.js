import Site from '../models/Site.js';
import { gatherAnalyticsContext } from './gatherAnalyticsContext.js';
import { sendPeriodicReportEmail } from './mailer.js';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const DEFAULT_REPORT_SETTINGS = { weeklyEnabled: true, monthlyEnabled: false, lastWeeklyReportAt: null, lastMonthlyReportAt: null };

function withDefaults(rs) {
  return { ...DEFAULT_REPORT_SETTINGS, ...(rs || {}) };
}

// Atomically "claims" this site's report slot before sending, so two
// overlapping scheduler ticks (or a manual trigger racing the scheduler)
// can never send the same period's report twice — same
// check-and-reserve-in-one-write pattern as the AI budget counters and the
// alert dedupe check. `{ field: null }` also matches documents where the
// field has never been set at all, which is what makes this safe for sites
// created before reportSettings existed.
async function claimSlot(siteId, field, cutoff) {
  return Site.findOneAndUpdate(
    { _id: siteId, [field]: { $not: { $gt: cutoff } } },
    { $set: { [field]: new Date() } },
    { new: false }
  );
}

async function sendReport(site, since, until, frequency) {
  const report = await gatherAnalyticsContext(site._id, since, until);
  const dashboardUrl = process.env.CLIENT_DASHBOARD_URL || 'http://localhost:5173';
  await sendPeriodicReportEmail({ to: site.ownerEmail, siteName: site.name, dashboardUrl, frequency, report });
}

export async function evaluateSiteReports(site) {
  const now = new Date();
  const settings = withDefaults(site.reportSettings);

  if (settings.weeklyEnabled) {
    const cutoff = new Date(now - WEEK_MS);
    const prev = await claimSlot(site._id, 'reportSettings.lastWeeklyReportAt', cutoff);
    if (prev) {
      const since = prev.reportSettings?.lastWeeklyReportAt || new Date(now - WEEK_MS);
      await sendReport(site, since, now, 'weekly');
    }
  }

  if (settings.monthlyEnabled) {
    const cutoff = new Date(now - MONTH_MS);
    const prev = await claimSlot(site._id, 'reportSettings.lastMonthlyReportAt', cutoff);
    if (prev) {
      const since = prev.reportSettings?.lastMonthlyReportAt || new Date(now - MONTH_MS);
      await sendReport(site, since, now, 'monthly');
    }
  }
}

export async function evaluateAllSiteReports() {
  const sites = await Site.find({}).lean();
  for (const site of sites) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await evaluateSiteReports(site);
    } catch (err) {
      console.error(`Report evaluation failed for site ${site._id}:`, err);
    }
  }
}
