const VISITOR_KEY = 'md_visitor_id';
const SESSION_KEY = 'md_session_id';
const REFERRER_KEY = 'md_session_referrer';

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Same browser, forever (until they clear site data) -> tells us new vs returning.
export function getVisitor() {
  if (typeof window === 'undefined') return { visitorId: null, isReturning: false };
  let visitorId = window.localStorage.getItem(VISITOR_KEY);
  const isReturning = Boolean(visitorId);
  if (!visitorId) {
    visitorId = randomId();
    window.localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return { visitorId, isReturning };
}

// Same tab/session only -> groups the pages one visit touched.
export function getSessionId() {
  if (typeof window === 'undefined') return null;
  let sessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = randomId();
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// The real referrer (Google, Facebook, etc.) only matters on the first page
// of a session — after that, document.referrer is just our own previous page.
export function getSessionReferrer() {
  if (typeof window === 'undefined') return '';
  const stored = window.sessionStorage.getItem(REFERRER_KEY);
  if (stored !== null) return stored;
  const referrer = document.referrer || '';
  window.sessionStorage.setItem(REFERRER_KEY, referrer);
  return referrer;
}
