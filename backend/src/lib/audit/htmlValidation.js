import axios from 'axios';

const VALIDATOR_ENDPOINT = 'https://validator.w3.org/nu/';

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

  const messages = data.messages ?? [];
  const errorCount = messages.filter((m) => m.type === 'error').length;
  const warningCount = messages.filter((m) => m.type === 'info' && m.subType === 'warning').length;

  return { errorCount, warningCount, totalMessages: messages.length };
}
