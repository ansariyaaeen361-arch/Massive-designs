// Suggested labels only — the client can rename a goal to whatever they
// want when they enable it. Mirrors client-dashboard's own LEAD_EVENT_LABELS
// (kept as two small copies rather than a shared package, since one is a
// server-side suggestion and the other a client-side display label — not
// worth the coupling for a handful of strings).
const KNOWN_LABELS = {
  phone_click: 'Phone Link',
  email_click: 'Email Link',
  whatsapp_click: 'WhatsApp',
  booking_click: 'Booking Link',
  download: 'File Download',
  form_submit: 'Contact Form',
  quote_request: 'Quote Form',
  signup: 'Signup',
  purchase: 'Purchase',
  conversion: 'Conversion',
  cta_click: 'Call-to-Action Click',
};

export function suggestLabel(event) {
  if (KNOWN_LABELS[event]) return KNOWN_LABELS[event];
  return event
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
