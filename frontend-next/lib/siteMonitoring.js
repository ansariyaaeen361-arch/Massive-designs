import { trackEvent } from './analytics';

// Adds the newer event types (Core Web Vitals, JS/resource errors, on-page
// SEO audit) that the multi-tenant analytics platform's Performance/Errors/
// SEO pages read — ported from the embeddable public/track.js tracker
// clients embed on their own sites, but wired through this site's own
// trackEvent() instead of loading that script separately, so page views,
// clicks, and form submits are never double-counted.
export function initSiteMonitoring() {
  if (typeof window === 'undefined') return;

  // ---- real-user performance (Core Web Vitals) ---------------------------
  const vitals = { lcp: null, cls: 0, inp: 0, ttfb: null };
  let vitalsSent = false;

  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) vitals.lcp = Math.round(last.renderTime || last.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) vitals.cls += entry.value;
      });
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}

  try {
    // A simplified stand-in for full INP (worst single interaction, not the
    // exact percentile) — still surfaces genuinely slow interactions.
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > vitals.inp) vitals.inp = Math.round(entry.duration);
      });
    }).observe({ type: 'event', durationThreshold: 40, buffered: true });
  } catch {}

  try {
    const navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry) vitals.ttfb = Math.round(navEntry.responseStart);
  } catch {}

  function sendVitals() {
    if (vitalsSent) return;
    vitalsSent = true;
    let loadTime = null;
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.loadEventEnd > 0) loadTime = Math.round(nav.loadEventEnd);
    } catch {}
    trackEvent('web_vitals', {
      metadata: { lcp: vitals.lcp, cls: Math.round(vitals.cls * 1000) / 1000, inp: vitals.inp || null, ttfb: vitals.ttfb, loadTime },
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendVitals();
  });
  window.addEventListener('pagehide', sendVitals);

  // ---- error monitoring ----------------------------------------------------
  const MAX_ERROR_EVENTS_PER_PAGE = 20;
  let errorEventCount = 0;
  function trackErrorEvent(name, meta) {
    if (errorEventCount >= MAX_ERROR_EVENTS_PER_PAGE) return;
    errorEventCount += 1;
    trackEvent(name, { metadata: meta });
  }

  const reportedResourceUrls = {};
  function trackResourceError(url, status, tagName) {
    if (reportedResourceUrls[url]) return;
    reportedResourceUrls[url] = true;
    trackErrorEvent('resource_error', { url, status, tagName });
  }

  window.addEventListener('error', (e) => {
    if (e.target && e.target !== window && e.target.nodeType === 1) return;
    trackErrorEvent('js_error', { message: String(e.message || 'Unknown error'), source: e.filename || '', line: e.lineno || 0, col: e.colno || 0 });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    const message = reason && reason.message ? reason.message : String(reason);
    trackErrorEvent('js_error', { message: `Unhandled promise rejection: ${message}`, source: '', line: 0, col: 0 });
  });

  try {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const status = typeof entry.responseStatus === 'number' ? entry.responseStatus : null;
        if (status && status >= 400) trackResourceError(entry.name, status, entry.initiatorType || 'resource');
      });
    }).observe({ type: 'resource', buffered: true });
  } catch {}

  document.addEventListener(
    'error',
    (e) => {
      const el = e.target;
      if (!el || el.nodeType !== 1) return;
      const tag = el.tagName ? el.tagName.toLowerCase() : '';
      if (tag !== 'img' && tag !== 'script' && tag !== 'link') return;
      const url = el.src || el.href || '';
      if (!url) return;
      trackResourceError(url, 0, tag);
    },
    true
  );

  // ---- lightweight on-page SEO audit -----------------------------------
  function runSeoAudit() {
    const AUDITED_KEY = 'md_seo_audited';
    let auditedPages = {};
    try {
      auditedPages = JSON.parse(window.sessionStorage.getItem(AUDITED_KEY) || '{}');
    } catch {}
    const path = window.location.pathname;
    if (auditedPages[path]) return;

    const title = document.title || '';
    const metaDesc = document.querySelector('meta[name="description"]');
    const metaDescContent = metaDesc ? metaDesc.getAttribute('content') || '' : '';
    const h1Count = document.querySelectorAll('h1').length;
    const canonical = document.querySelector('link[rel="canonical"]');
    let canonicalMatches = false;
    if (canonical && canonical.href) {
      try {
        canonicalMatches = new URL(canonical.href).pathname === window.location.pathname;
      } catch {}
    }
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const isNoindex = Boolean(robotsMeta && /noindex/i.test(robotsMeta.getAttribute('content') || ''));
    const images = document.querySelectorAll('img');
    let imagesMissingAlt = 0;
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) imagesMissingAlt += 1;
    });

    trackEvent('seo_audit', {
      metadata: {
        hasTitle: title.length > 0,
        titleLength: title.length,
        hasMetaDescription: metaDescContent.length > 0,
        metaDescriptionLength: metaDescContent.length,
        h1Count,
        hasCanonical: Boolean(canonical),
        canonicalMatchesUrl: canonicalMatches,
        isNoindex,
        imagesTotal: images.length,
        imagesMissingAlt,
      },
    });

    auditedPages[path] = true;
    try {
      window.sessionStorage.setItem(AUDITED_KEY, JSON.stringify(auditedPages));
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSeoAudit);
  } else {
    runSeoAudit();
  }
}
