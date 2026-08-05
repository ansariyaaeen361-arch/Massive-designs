import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { isValidObjectId } from 'mongoose';
import { runAudit } from '../lib/audit/runAudit.js';
import { generateAuditPdf } from '../lib/pdfReport.js';
import { sendAuditReportEmail } from '../lib/mailer.js';
import Audit from '../models/Audit.js';
import Lead from '../models/Lead.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many audit requests from this IP. Please try again in an hour.' },
});

const sendReportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again in an hour.' },
});

router.post('/', auditLimiter, async (req, res) => {
  const { url } = req.body ?? {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'Please enter a website URL.' });
  }

  let result;
  try {
    result = await runAudit(url);
  } catch (err) {
    console.error('Audit failed:', err);
    return res.status(422).json({ success: false, error: err.message || 'We could not audit that URL. Please check it and try again.' });
  }

  let auditDoc;
  try {
    auditDoc = await Audit.create({
      url: result.url,
      overallScore: result.overallScore,
      scores: result.scores,
      issues: result.issues,
      details: result.details,
    });
  } catch (err) {
    console.error('Failed to save audit result:', err);
    return res.status(500).json({ success: false, error: 'Audit completed, but we failed to save the result. Please try again.' });
  }

  return res.json({
    success: true,
    auditId: auditDoc._id,
    url: result.url,
    overallScore: result.overallScore,
    scores: result.scores,
    issues: result.issues,
  });
});

router.post('/send-report', sendReportLimiter, async (req, res) => {
  const { email, auditId } = req.body ?? {};

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  if (!auditId || !isValidObjectId(auditId)) {
    return res.status(400).json({ success: false, error: 'Invalid audit reference. Please run the audit again.' });
  }

  const auditDoc = await Audit.findById(auditId);
  if (!auditDoc) {
    return res.status(404).json({ success: false, error: 'We could not find that audit result. Please run the audit again.' });
  }

  const trimmedEmail = email.trim();
  let lead;
  try {
    lead = await Lead.create({ email: trimmedEmail, audit: auditDoc._id });
  } catch (err) {
    console.error('Failed to save lead:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong saving your details. Please try again.' });
  }

  try {
    const pdfBuffer = await generateAuditPdf({
      url: auditDoc.url,
      overallScore: auditDoc.overallScore,
      scores: auditDoc.scores,
      issues: auditDoc.issues,
    });

    await sendAuditReportEmail({
      to: trimmedEmail,
      url: auditDoc.url,
      overallScore: auditDoc.overallScore,
      pdfBuffer,
    });

    lead.reportSent = true;
    await lead.save();
  } catch (err) {
    console.error('Failed to send audit report email:', err);
    return res.status(502).json({ success: false, error: 'Your details were saved, but the report email failed to send. Please try again.' });
  }

  return res.json({ success: true });
});

export default router;
