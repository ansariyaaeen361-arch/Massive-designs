import express from 'express';
import cors from 'cors';
import contactRouter from './routes/contact.js';
import auditRouter from './routes/audit.js';
import popupClickRouter from './routes/popupClick.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/contact', contactRouter);
app.use('/api/audit', auditRouter);
app.use('/api/popup-click', popupClickRouter);

export default app;
