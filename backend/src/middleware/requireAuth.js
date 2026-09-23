import { verifyToken } from '../lib/auth.js';

// The only place req.siteId ever gets set — every authenticated route reads
// the tenant identity from here, never from a client-supplied parameter.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    req.siteId = decoded.siteId;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}
