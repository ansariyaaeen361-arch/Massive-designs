(function () {
	'use strict';

	// Identify our own <script> tag to get the siteKey and figure out where
	// to send events — works unmodified on WordPress, plain HTML, React,
	// Next.js, Shopify, Webflow, Laravel, or anything else that can load a
	// <script> tag, since none of this depends on the host page's framework.
	var currentScript = document.currentScript;
	if (!currentScript) return;

	var siteKey = currentScript.getAttribute('data-site');
	if (!siteKey) return;

	var API_BASE = new URL(currentScript.src).origin;

	var VISITOR_KEY = 'ma_visitor_id';
	var SESSION_KEY = 'ma_session_id';
	var REFERRER_KEY = 'ma_session_referrer';
	var UTM_KEY = 'ma_session_utm';

	function randomId() {
		if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
		return Date.now() + '-' + Math.random().toString(16).slice(2);
	}

	function getVisitor() {
		var visitorId;
		try {
			visitorId = window.localStorage.getItem(VISITOR_KEY);
		} catch (e) { /* private browsing / blocked storage */ }
		var isReturning = Boolean(visitorId);
		if (!visitorId) {
			visitorId = randomId();
			try { window.localStorage.setItem(VISITOR_KEY, visitorId); } catch (e) {}
		}
		return { visitorId: visitorId, isReturning: isReturning };
	}

	function getSessionId() {
		var sessionId;
		try {
			sessionId = window.sessionStorage.getItem(SESSION_KEY);
		} catch (e) {}
		if (!sessionId) {
			sessionId = randomId();
			try { window.sessionStorage.setItem(SESSION_KEY, sessionId); } catch (e) {}
		}
		return sessionId;
	}

	// The real referrer (Google, Facebook, etc.) and any UTM params only
	// matter on the first page of a session — after that, document.referrer
	// is just our own previous page, and the URL has moved on.
	function getSessionReferrer() {
		try {
			var stored = window.sessionStorage.getItem(REFERRER_KEY);
			if (stored !== null) return stored;
			var referrer = document.referrer || '';
			window.sessionStorage.setItem(REFERRER_KEY, referrer);
			return referrer;
		} catch (e) {
			return document.referrer || '';
		}
	}

	function getSessionUtm() {
		try {
			var stored = window.sessionStorage.getItem(UTM_KEY);
			if (stored !== null) return JSON.parse(stored);
		} catch (e) {}

		var params = new URLSearchParams(window.location.search);
		var utm = {
			utmSource: params.get('utm_source') || undefined,
			utmMedium: params.get('utm_medium') || undefined,
			utmCampaign: params.get('utm_campaign') || undefined,
			utmTerm: params.get('utm_term') || undefined,
			utmContent: params.get('utm_content') || undefined,
		};
		try { window.sessionStorage.setItem(UTM_KEY, JSON.stringify(utm)); } catch (e) {}
		return utm;
	}

	function send(body, useBeacon) {
		var url = API_BASE + '/api/track';
		var json = JSON.stringify(body);
		if (useBeacon && navigator.sendBeacon) {
			navigator.sendBeacon(url, new Blob([json], { type: 'application/json' }));
			return;
		}
		fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: json,
			keepalive: true,
			credentials: 'omit',
		}).catch(function () {});
	}

	function trackEvent(eventName, params, useBeacon) {
		params = params || {};
		var visitor = getVisitor();
		send(
			{
				siteKey: siteKey,
				event: eventName,
				source: params.source || null,
				page: window.location.pathname,
				referrer: params.referrer,
				durationMs: params.durationMs,
				sessionId: getSessionId(),
				visitorId: visitor.visitorId,
				isReturning: visitor.isReturning,
				isWebdriver: Boolean(navigator.webdriver),
				utmSource: params.utm && params.utm.utmSource,
				utmMedium: params.utm && params.utm.utmMedium,
				utmCampaign: params.utm && params.utm.utmCampaign,
				utmTerm: params.utm && params.utm.utmTerm,
				utmContent: params.utm && params.utm.utmContent,
				metadata: params.metadata,
			},
			useBeacon
		);
	}
	window.maTrackEvent = trackEvent;

	// ---- page view + duration -------------------------------------------

	var current = { page: null, enteredAt: null };

	function sendDuration() {
		if (!current.page) return;
		var durationMs = Date.now() - current.enteredAt;
		if (durationMs < 500) { current.page = null; return; }
		trackEvent('page_view_duration', { durationMs: durationMs }, true);
		current.page = null;
	}

	function trackPageView() {
		sendDuration();
		current = { page: window.location.pathname, enteredAt: Date.now() };
		trackEvent('page_view', { referrer: getSessionReferrer(), utm: getSessionUtm() });
	}

	trackPageView();

	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'hidden') sendDuration();
	});
	window.addEventListener('pagehide', sendDuration);

	// ---- real-user performance (Core Web Vitals) --------------------------
	// Standards-based collection via PerformanceObserver — not the full
	// `web-vitals` library, but the same underlying browser APIs and the
	// same well-known metrics, so it reflects actual visitor experience
	// rather than a synthetic lab test.
	var vitals = { lcp: null, cls: 0, inp: 0, ttfb: null };
	var vitalsSent = false;

	try {
		new PerformanceObserver(function (list) {
			var entries = list.getEntries();
			var last = entries[entries.length - 1];
			if (last) vitals.lcp = Math.round(last.renderTime || last.startTime);
		}).observe({ type: 'largest-contentful-paint', buffered: true });
	} catch (e) {}

	try {
		new PerformanceObserver(function (list) {
			list.getEntries().forEach(function (entry) {
				if (!entry.hadRecentInput) vitals.cls += entry.value;
			});
		}).observe({ type: 'layout-shift', buffered: true });
	} catch (e) {}

	try {
		// INP is technically a high percentile across every interaction on
		// the page; tracking every one requires the full web-vitals
		// algorithm. This records the worst single interaction instead — a
		// simplified stand-in that still surfaces genuinely slow
		// interactions, just not the exact percentile figure.
		new PerformanceObserver(function (list) {
			list.getEntries().forEach(function (entry) {
				if (entry.duration > vitals.inp) vitals.inp = Math.round(entry.duration);
			});
		}).observe({ type: 'event', durationThreshold: 40, buffered: true });
	} catch (e) {}

	try {
		var navEntry = performance.getEntriesByType('navigation')[0];
		if (navEntry) vitals.ttfb = Math.round(navEntry.responseStart);
	} catch (e) {}

	function sendVitals() {
		if (vitalsSent) return;
		vitalsSent = true;
		var loadTime = null;
		try {
			var nav = performance.getEntriesByType('navigation')[0];
			if (nav && nav.loadEventEnd > 0) loadTime = Math.round(nav.loadEventEnd);
		} catch (e) {}
		trackEvent(
			'web_vitals',
			{
				metadata: {
					lcp: vitals.lcp,
					cls: Math.round(vitals.cls * 1000) / 1000,
					inp: vitals.inp || null,
					ttfb: vitals.ttfb,
					loadTime: loadTime,
				},
			},
			true
		);
	}

	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'hidden') sendVitals();
	});
	window.addEventListener('pagehide', sendVitals);

	// ---- error monitoring --------------------------------------------------
	// Capped so a broken loop or a chatty third-party script on the host
	// page can't flood this endpoint — a well-behaved third-party script
	// should never amplify a client's own bug into thousands of requests.
	var MAX_ERROR_EVENTS_PER_PAGE = 20;
	var errorEventCount = 0;
	function trackErrorEvent(name, meta) {
		if (errorEventCount >= MAX_ERROR_EVENTS_PER_PAGE) return;
		errorEventCount++;
		trackEvent(name, { metadata: meta }, true);
	}

	// The same failed resource can trigger both the Resource Timing
	// observer (real status) and the fallback element error listener below
	// (no status) — dedupe by URL so one failure isn't counted twice.
	// Whichever fires first wins; in practice that's usually the real-status
	// observer, but this is a best-effort monitoring signal, not a precise
	// count.
	var reportedResourceUrls = {};
	function trackResourceError(url, status, tagName) {
		if (reportedResourceUrls[url]) return;
		reportedResourceUrls[url] = true;
		trackErrorEvent('resource_error', { url: url, status: status, tagName: tagName });
	}

	window.addEventListener('error', function (e) {
		// Element-level resource failures (img/script/link) also fire a
		// window 'error' event during the capture phase, but with no
		// message/lineno — routed to resource_error instead, below.
		if (e.target && e.target !== window && e.target.nodeType === 1) return;
		trackErrorEvent('js_error', {
			message: String(e.message || 'Unknown error'),
			source: e.filename || '',
			line: e.lineno || 0,
			col: e.colno || 0,
		});
	});

	window.addEventListener('unhandledrejection', function (e) {
		var reason = e.reason;
		var message = reason && reason.message ? reason.message : String(reason);
		trackErrorEvent('js_error', { message: 'Unhandled promise rejection: ' + message, source: '', line: 0, col: 0 });
	});

	// Real HTTP status codes for resource loads (images, scripts, CSS,
	// fetch/XHR) via the standards-based Resource Timing API — no need to
	// monkey-patch fetch/XHR on someone else's site to get this. Support
	// for `responseStatus` varies by browser; where it's missing we simply
	// don't know the code (labeled as such), never guessed.
	try {
		new PerformanceObserver(function (list) {
			list.getEntries().forEach(function (entry) {
				var status = typeof entry.responseStatus === 'number' ? entry.responseStatus : null;
				if (status && status >= 400) {
					trackResourceError(entry.name, status, entry.initiatorType || 'resource');
				}
			});
		}).observe({ type: 'resource', buffered: true });
	} catch (e) {}

	// Fallback for browsers without responseStatus, and for failures that
	// never even get a resource-timing entry (e.g. blocked/DNS failure):
	// the native error event on the element itself, with no status code.
	document.addEventListener(
		'error',
		function (e) {
			var el = e.target;
			if (!el || el.nodeType !== 1) return;
			var tag = el.tagName ? el.tagName.toLowerCase() : '';
			if (tag !== 'img' && tag !== 'script' && tag !== 'link') return;
			var url = el.src || el.href || '';
			if (!url) return;
			trackResourceError(url, 0, tag);
		},
		true
	);

	// ---- lightweight on-page SEO audit --------------------------------------
	// Reads the page's own DOM once — the same on-page technical checks a
	// site owner could run manually (title/meta description/H1/canonical/
	// noindex/image alt) — reported once per page per session so repeat
	// visitors don't keep re-reporting an unchanged page. Deferred until the
	// DOM has actually finished parsing, so this is accurate even if the
	// script tag sits in <head>.
	function runSeoAudit() {
		var AUDITED_KEY = 'ma_seo_audited';
		var auditedPages = {};
		try {
			auditedPages = JSON.parse(window.sessionStorage.getItem(AUDITED_KEY) || '{}');
		} catch (e) {}
		var path = window.location.pathname;
		if (auditedPages[path]) return;

		var title = document.title || '';
		var metaDesc = document.querySelector('meta[name="description"]');
		var metaDescContent = metaDesc ? metaDesc.getAttribute('content') || '' : '';
		var h1Count = document.querySelectorAll('h1').length;
		var canonical = document.querySelector('link[rel="canonical"]');
		var canonicalMatches = false;
		if (canonical && canonical.href) {
			try {
				canonicalMatches = new URL(canonical.href).pathname === window.location.pathname;
			} catch (e) {}
		}
		var robotsMeta = document.querySelector('meta[name="robots"]');
		var isNoindex = Boolean(robotsMeta && /noindex/i.test(robotsMeta.getAttribute('content') || ''));
		var images = document.querySelectorAll('img');
		var imagesMissingAlt = 0;
		for (var i = 0; i < images.length; i++) {
			if (!images[i].hasAttribute('alt')) imagesMissingAlt++;
		}

		trackEvent('seo_audit', {
			metadata: {
				hasTitle: title.length > 0,
				titleLength: title.length,
				hasMetaDescription: metaDescContent.length > 0,
				metaDescriptionLength: metaDescContent.length,
				h1Count: h1Count,
				hasCanonical: Boolean(canonical),
				canonicalMatchesUrl: canonicalMatches,
				isNoindex: isNoindex,
				imagesTotal: images.length,
				imagesMissingAlt: imagesMissingAlt,
			},
		});

		auditedPages[path] = true;
		try {
			window.sessionStorage.setItem(AUDITED_KEY, JSON.stringify(auditedPages));
		} catch (e) {}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', runSeoAudit);
	} else {
		runSeoAudit();
	}

	// ---- lead / conversion click detection --------------------------------
	// An explicit data-ma-event always wins (lets a site owner label a
	// specific link precisely, e.g. data-ma-event="quote_request"). Failing
	// that, well-known, unambiguous URL patterns are auto-classified —
	// nothing here is guessed from link text or position, only from the
	// actual href, so it can't misfire on an unrelated link.
	var DOWNLOAD_EXT_RE = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|mp3|mp4)(\?.*)?$/i;
	var WHATSAPP_RE = /(^https?:\/\/)?(wa\.me|api\.whatsapp\.com|whatsapp\.com)\//i;
	var BOOKING_RE = /(calendly\.com|cal\.com|acuityscheduling\.com|squarespacescheduling\.com|chilipiper\.com)/i;

	function classifyLink(el) {
		if (el.hasAttribute('data-ma-event')) {
			return { event: el.getAttribute('data-ma-event'), source: el.getAttribute('data-ma-source') };
		}
		var href = el.getAttribute('href') || '';
		if (/^tel:/i.test(href)) return { event: 'phone_click', source: href.replace(/^tel:/i, '') };
		if (/^mailto:/i.test(href)) return { event: 'email_click', source: href.replace(/^mailto:/i, '').split('?')[0] };
		if (WHATSAPP_RE.test(href)) return { event: 'whatsapp_click', source: href };
		if (BOOKING_RE.test(href)) return { event: 'booking_click', source: href };
		if (el.hasAttribute('download') || DOWNLOAD_EXT_RE.test(href)) return { event: 'download', source: href };
		return null;
	}

	// Untagged, unrecognized links/buttons are still not tracked (avoids
	// noise) — only elements with data-ma-event or a recognized href pattern
	// fire an event.
	document.addEventListener(
		'click',
		function (e) {
			var el = e.target.closest ? e.target.closest('[data-ma-event], a[href]') : null;
			if (!el) return;
			var result = classifyLink(el);
			if (!result) return;
			trackEvent(result.event, { source: result.source });
		},
		true
	);

	// Any form submission is a real business interaction by default
	// (form_submit); a site owner can override the name per-form with
	// data-ma-event="quote_request"/"signup"/etc. for precision, without
	// losing tracking on every other, unlabeled form.
	document.addEventListener(
		'submit',
		function (e) {
			var form = e.target;
			if (!(form instanceof HTMLFormElement)) return;
			var eventName = form.getAttribute('data-ma-event') || 'form_submit';
			var source = form.getAttribute('data-ma-source') || form.id || form.getAttribute('name') || null;
			trackEvent(eventName, { source: source });
		},
		true
	);
})();
