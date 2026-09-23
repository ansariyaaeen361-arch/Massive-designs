import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signToken({ siteId }) {
  return jwt.sign({ siteId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Throws (jwt.verify's own error) on invalid/expired tokens — callers catch it.
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
