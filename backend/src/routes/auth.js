import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Site from '../models/Site.js';
import { comparePassword, signToken } from '../lib/auth.js';

const router = Router();

// Login is a prime brute-force target — separate, tighter limiter than the
// tracking endpoints.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const GENERIC_ERROR = { success: false, error: 'Invalid email or password.' };

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const site = await Site.findOne({ ownerEmail: email.trim().toLowerCase() });

  // Always run a bcrypt compare, even when no site was found, so response
  // timing doesn't reveal whether the email exists (compare against a
  // fixed dummy hash costs the same as a real one).
  const hash = site?.passwordHash || '$2a$12$C6UzMDM.H6dfI/f/IKcEeOgqbYQZR7yz5ADzs4Q7O2Zt4z5.PoTqK';
  const valid = await comparePassword(password, hash);

  if (!site || !valid) {
    return res.status(401).json(GENERIC_ERROR);
  }

  const token = signToken({ siteId: site._id.toString() });

  return res.json({
    success: true,
    token,
    site: { name: site.name, domain: site.domain, theme: site.theme, branding: site.branding || { brandName: null, logoUrl: null } },
  });
});

export default router;
