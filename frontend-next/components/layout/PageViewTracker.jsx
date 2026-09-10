import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { trackEvent } from '../../lib/analytics';
import { getVisitor, getSessionId, getSessionReferrer } from '../../lib/visitor';

// Sends how long someone stayed on a page. Bypasses trackEvent() directly
// (rather than going through it) because the "page" here is the page they
// are LEAVING, not window.location.pathname, which has often already moved
// on to the next page by the time this fires.
function sendPageDuration(page, durationMs) {
  if (!page || durationMs < 500) return;
  const { visitorId, isReturning } = getVisitor();
  const body = JSON.stringify({
    event: 'page_view_duration',
    page,
    durationMs,
    sessionId: getSessionId(),
    visitorId,
    isReturning,
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
  } else {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  }
}

export default function PageViewTracker() {
  const router = useRouter();
  const current = useRef({ page: null, enteredAt: null });
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (window.location.pathname.startsWith('/dashboard')) return undefined;

    const trackPageView = (page) => {
      if (page.startsWith('/dashboard')) return;
      if (current.current.page) {
        sendPageDuration(current.current.page, Date.now() - current.current.enteredAt);
      }
      current.current = { page, enteredAt: Date.now() };
      // _document.js already fires fbq PageView for the very first load of a
      // fresh page request; only fire it here for subsequent SPA navigations.
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      } else if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
      trackEvent('page_view', { referrer: getSessionReferrer() });
    };

    trackPageView(window.location.pathname);
    router.events.on('routeChangeComplete', trackPageView);

    const flush = () => {
      if (current.current.page) {
        sendPageDuration(current.current.page, Date.now() - current.current.enteredAt);
        current.current.page = null;
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);

    return () => {
      router.events.off('routeChangeComplete', trackPageView);
      window.removeEventListener('pagehide', flush);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
