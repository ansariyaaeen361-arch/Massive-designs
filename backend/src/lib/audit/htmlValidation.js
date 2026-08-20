import axios from 'axios';

const VALIDATOR_ENDPOINT = 'https://validator.w3.org/nu/';

// Patterns that identify a validator message as coming from markup the site
// owner has no control over and can't fix, rather than a real defect in the
// site's own code:
//  - "origin-trial" meta tags: Chrome itself injects these into the live DOM
//    for experimental platform features during headless rendering; they were
//    never authored by the site and don't exist in its actual source.
//  - reCAPTCHA iframe/bubble markup: injected verbatim by Google's own
//    react-google-recaptcha widget. Its sandbox attribute and similar quirks
//    are Google's markup, not something editing the site's code can change.
const IGNORED_MESSAGE_PATTERNS = [/origin-trial/i, /recaptcha/i, /g-recaptcha/i];

function isIgnorableMessage(message) {
  const haystack = `${message.message ?? ''} ${message.extract ?? ''}`;
  return IGNORED_MESSAGE_PATTERNS.some((pattern) => pattern.test(haystack));
}

// Takes the already-rendered HTML (post-JavaScript) rather than a URL. If we
// instead handed the validator a bare URL, it would fetch the page itself
// with no JS execution, meaning a client-side-rendered site would validate
// an almost-empty <div id="root"> shell and report near-zero errors
// regardless of what's actually wrong with the real markup.
export async function runHtmlValidation(html) {
  const { data } = await axios.post(VALIDATOR_ENDPOINT, html, {
    params: { out: 'json' },
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'User-Agent': 'MassiveDesignsAuditTool/1.0 (+https://massive-designs.com)',
    },
    timeout: 25000,
    maxBodyLength: 20 * 1024 * 1024,
  });

  const messages = (data.messages ?? []).filter((m) => !isIgnorableMessage(m));
  const errorCount = messages.filter((m) => m.type === 'error').length;
  const warningCount = messages.filter((m) => m.type === 'info' && m.subType === 'warning').length;

  return { errorCount, warningCount, totalMessages: messages.length };
}
