import { purgeExpiredEventsForAllSites } from './dataRetention.js';

const INTERVAL_MS = 24 * 60 * 60 * 1000; // once a day is plenty for a retention window measured in months

export function startRetentionScheduler() {
  setTimeout(runOnce, 5 * 60 * 1000);
  setInterval(runOnce, INTERVAL_MS);
}

async function runOnce() {
  try {
    const deleted = await purgeExpiredEventsForAllSites();
    if (deleted > 0) console.log(`Data retention: purged ${deleted} expired event(s).`);
  } catch (err) {
    console.error('Retention scheduler run failed:', err);
  }
}
