import { evaluateAllSiteReports } from './reportEvaluator.js';

const INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours — reports are due at most weekly, so this cadence is plenty

// Same honest single-process caveat as alertScheduler.js: fine for one Node
// instance, would need a real job queue behind multiple instances.
export function startReportScheduler() {
  setTimeout(runOnce, 2 * 60 * 1000);
  setInterval(runOnce, INTERVAL_MS);
}

async function runOnce() {
  try {
    await evaluateAllSiteReports();
  } catch (err) {
    console.error('Report scheduler run failed:', err);
  }
}
