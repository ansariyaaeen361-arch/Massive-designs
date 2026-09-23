import Site from '../models/Site.js';
import ClickEvent from '../models/ClickEvent.js';

const DEFAULT_RETENTION_DAYS = 425; // matches GA4's own default

export async function purgeExpiredEventsForSite(site) {
  const retentionDays = site.privacySettings?.retentionDays || DEFAULT_RETENTION_DAYS;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const result = await ClickEvent.deleteMany({ siteId: site._id, createdAt: { $lt: cutoff } });
  return result.deletedCount || 0;
}

export async function purgeExpiredEventsForAllSites() {
  const sites = await Site.find({}, '_id privacySettings').lean();
  let totalDeleted = 0;
  for (const site of sites) {
    try {
      // eslint-disable-next-line no-await-in-loop
      totalDeleted += await purgeExpiredEventsForSite(site);
    } catch (err) {
      console.error(`Data retention purge failed for site ${site._id}:`, err);
    }
  }
  return totalDeleted;
}
