import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ContactSubmission from '../models/ContactSubmission.js';
import { verifyRecaptcha } from '../lib/verifyRecaptcha.js';
import { sendContactEmail } from '../lib/mailer.js';
import { VALID_SERVICES } from '../lib/validServices.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions. Please try again later.' },
});

const MIN_SUBMIT_MS = 3000;

router.post('/', contactLimiter, async (req, res) => {
  const { name, mail, number, service, message, consent, recaptchaToken, website, formLoadedAt } = req.body ?? {};

  // Honeypot: a real visitor never sees or fills this field, so any value
  // means a bot filled the raw form fields without rendering the page.
  // Bots that skip rendering also submit near-instantly, so the elapsed-time
  // check catches those without a honeypot value too. Both cases report
  // success so the bot has no signal that it was caught.
  const submittedTooFast = typeof formLoadedAt === 'number' && Date.now() - formLoadedAt < MIN_SUBMIT_MS;
  if (website || submittedTooFast) {
    return res.json({ success: true });
  }

  if (!name || !mail || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  if (!consent) {
    return res.status(400).json({ success: false, error: 'Please accept the consent checkbox to continue.' });
  }

  if (service && !VALID_SERVICES.has(service)) {
    return res.status(400).json({ success: false, error: 'Invalid service selection.' });
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
