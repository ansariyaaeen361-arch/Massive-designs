import express from 'express';
import cors from 'cors';
import contactRouter from './routes/contact.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/contact', contactRouter);

export default app;
