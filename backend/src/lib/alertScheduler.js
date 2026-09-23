import { evaluateAllSites } from './alertEvaluator.js';

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// A simple, honest in-process scheduler — this is the right scope for a
// single Node process. A production deployment running multiple server
// instances would need a real job queue instead, so alerts aren't
// redundantly evaluated per instance; noting that here so this isn't
// mistaken for something more robust than it is.
export function startAlertScheduler() {
  setTimeout(runOnce, 60 * 1000);
  setInterval(runOnce, INTERVAL_MS);
}

async function runOnce() {
  try {
    await evaluateAllSites();
  } catch (err) {
    console.error('Alert scheduler run failed:', err);
  }
}
