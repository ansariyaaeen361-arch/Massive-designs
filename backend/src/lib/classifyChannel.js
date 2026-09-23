// Centralized so every later report/dashboard reuses the same categories
// instead of re-deriving them from the raw referrer independently.
// Reuses the exact label strings parseReferrer.js already produces — no
// duplicate source list to keep in sync.
const SOCIAL_LABELS = new Set(['Facebook', 'Instagram', 'LinkedIn', 'Twitter / X', 'WhatsApp', 'TelegramBot', 'Discordbot']);

export function classifyChannel({ referrerLabel, utmMedium }) {
  if (utmMedium && /cpc|ppc|paid/i.test(utmMedium)) {
    return 'paid';
  }
  if (!referrerLabel || referrerLabel === 'Direct') {
    return 'direct';
  }
  if (/ Search$/.test(referrerLabel)) {
    return 'organic_search';
  }
  if (SOCIAL_LABELS.has(referrerLabel)) {
    return 'social';
  }
  return 'referral';
}
