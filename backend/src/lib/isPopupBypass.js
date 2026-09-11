import ClickEvent from '../models/ClickEvent.js';

// While the welcome popup is open, its full-screen overlay (pointer-events:
// auto) makes every other element on the page physically unclickable for a
// real visitor — the only two things reachable are the popup's own call
// button and its close button. So seeing some OTHER on-page interaction
// (a footer form, a service CTA, etc.) on the same page after the popup was
// shown, with no welcome_popup_closed anywhere earlier in the session, is
// not something a real click/tap could ever produce — only a script that
// manipulates the DOM directly, bypassing the overlay entirely, can do this.
const GATED_SOURCES = new Set(['footer', 'contact_form', 'order_modal', 'service_cta', 'pricing_card', 'services_page', 'audit_success']);

export async function isPopupBypass(sessionId, page, event, source, createdAt) {
  if (!sessionId || !page || !GATED_SOURCES.has(source)) return false;

  const [shown, closed] = await Promise.all([
    ClickEvent.exists({ sessionId, page, event: 'welcome_popup_shown', createdAt: { $lt: createdAt } }),
    ClickEvent.exists({ sessionId, event: 'welcome_popup_closed', createdAt: { $lt: createdAt } }),
  ]);

  return Boolean(shown) && !closed;
}
