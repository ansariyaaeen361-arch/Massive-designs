import 'dotenv/config';
import app from './app.js';
import { connectDb } from './db.js';
import { startAlertScheduler } from './lib/alertScheduler.js';
import { startReportScheduler } from './lib/reportScheduler.js';
import { startRetentionScheduler } from './lib/retentionScheduler.js';

const port = process.env.PORT || 4000;

// Express 4 does not forward a rejected promise from an `async` route
// handler to its error middleware automatically — an uncaught error in any
// single request (a bad route match, a bad cast, anything) otherwise
// crashes the entire process, taking down every tenant at once, not just
// that one request. This was reproduced directly during Phase 15
// verification (a route-ordering bug on one endpoint killed the whole
// server). Logging instead of exiting is the right tradeoff for a stateless
// HTTP API where no single request holds shared mutable state that could be
// left corrupted; it is not a substitute for fixing the underlying bug.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
    startAlertScheduler();
    startReportScheduler();
    startRetentionScheduler();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
