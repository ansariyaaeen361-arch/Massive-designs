// Fires a GA4 event (if gtag loaded — blocked by ad-blockers for a real
// chunk of visitors) and logs the same event to our own backend with the
// visitor's IP (GA4 never exposes raw IPs, so this is the only way to get
// IP/location-level detail for the dashboard). Both are best-effort and
// never throw.
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
      event: eventName,
      source: params.source ?? null,
      page: window.location.pathname,
    }),
    keepalive: true,
  }).catch(() => {});
}
