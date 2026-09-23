import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import contactRouter from './routes/contact.js';
import auditRouter from './routes/audit.js';
import trackRouter from './routes/track.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import siteRouter from './routes/site.js';
import goalsRouter from './routes/goals.js';
import conversionsRouter from './routes/conversions.js';
import journeysRouter from './routes/journeys.js';
import performanceRouter from './routes/performance.js';
import errorsRouter from './routes/errors.js';
import seoRouter from './routes/seo.js';
import pageHealthRouter from './routes/pageHealth.js';
import opportunitiesRouter from './routes/opportunities.js';
import attentionRouter from './routes/attention.js';
import anomaliesRouter from './routes/anomalies.js';
import alertsRouter from './routes/alerts.js';
import aiAnalystRouter from './routes/aiAnalyst.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('trust proxy', 1);

// The tracking endpoints must accept requests from every client's own
// website (that's the whole point of the embeddable script) — the marketing
// site's own forms stay restricted to FRONTEND_URL, and the separate
// client-dashboard app (a different origin entirely) gets its own allowance.
const marketingCors = cors({ origin: process.env.FRONTEND_URL });
const dashboardCors = cors({ origin: process.env.CLIENT_DASHBOARD_URL });
// `credentials: true` is required here even though the tracker never sends
// cookies — navigator.sendBeacon() cross-origin requests are sent by the
// browser with credentials mode "include" (unlike fetch, JS can't opt this
// out), so without this the preflight fails and every beacon-sent event
// (page_view_duration, web_vitals) is silently dropped. `origin: true`
// reflects the actual request origin rather than "*", which is required
// for credentials to be allowed at all.
const openCors = cors({ origin: true, credentials: true });

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/track', openCors, trackRouter);
// The embeddable tracker script itself — served as a static file, reachable
// cross-origin like any other <script src>.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/contact', marketingCors, contactRouter);
app.use('/api/audit', marketingCors, auditRouter);
app.use('/api/auth', dashboardCors, authRouter);
app.use('/api/site', dashboardCors, siteRouter);
app.use('/api/goals', dashboardCors, goalsRouter);
app.use('/api/conversions', dashboardCors, conversionsRouter);
app.use('/api/journeys', dashboardCors, journeysRouter);
app.use('/api/performance', dashboardCors, performanceRouter);
app.use('/api/errors', dashboardCors, errorsRouter);
app.use('/api/seo', dashboardCors, seoRouter);
app.use('/api/page-health', dashboardCors, pageHealthRouter);
app.use('/api/opportunities', dashboardCors, opportunitiesRouter);
app.use('/api/attention', dashboardCors, attentionRouter);
app.use('/api/anomalies', dashboardCors, anomaliesRouter);
app.use('/api/alerts', dashboardCors, alertsRouter);
app.use('/api/ai-analyst', dashboardCors, aiAnalystRouter);
// Now also called directly from the client-dashboard's Agency console (a
// browser origin), in addition to server-to-server curl/Postman use — so it
// needs the same dashboard CORS allowance. Still gated entirely by
// ADMIN_API_KEY, never by the tenant JWT.
app.use('/api/admin', dashboardCors, adminRouter);

// Production deploy convenience: when client-dashboard's built SPA sits next
// to this repo (client-dashboard/dist, built with VITE_API_URL="" so its own
// fetches are same-origin), serve it directly from this same Node process —
// one subdomain, one process, no separate static host or CORS setup needed.
// Guarded by existsSync so local dev (dashboard served by its own Vite dev
// server on :5173) is unaffected unless someone runs `npm run build` here.
const dashboardDist = path.join(__dirname, '..', '..', 'client-dashboard', 'dist');
if (fs.existsSync(dashboardDist)) {
  app.use(express.static(dashboardDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/track.js') return next();
    res.sendFile(path.join(dashboardDist, 'index.html'));
  });
}

export default app;
