import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ContactSubmission from '../models/ContactSubmission.js';
import { verifyRecaptcha } from '../lib/verifyRecaptcha.js';
import { sendContactEmail } from '../lib/mailer.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions. Please try again later.' },
});

router.post('/', contactLimiter, async (req, res) => {
  const { name, mail, number, service, message, consent, recaptchaToken } = req.body ?? {};

  if (!name || !mail || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  if (!consent) {
    return res.status(400).json({ success: false, error: 'Please accept the consent checkbox to continue.' });
  }

  const recaptchaOk = await verifyRecaptcha(recaptchaToken, req.ip);
  if (!recaptchaOk) {
    return res.status(400).json({ success: false, error: 'reCAPTCHA verification failed. Please try again.' });
  }

  const submission = {
    name,
    email: mail,
    phone: number,
    company: service,
    message,
  };

  try {
    await ContactSubmission.create(submission);
  } catch (err) {
    console.error('Failed to save contact submission:', err);
  }

  try {
    await sendContactEmail(submission);
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return res.status(502).json({ success: false, error: 'Message saved, but the email notification failed to send.' });
  }

  return res.json({ success: true });
});

export default router;
