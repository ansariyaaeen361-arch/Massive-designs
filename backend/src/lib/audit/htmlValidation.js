import axios from 'axios';

const VALIDATOR_ENDPOINT = 'https://validator.w3.org/nu/';

export async function runHtmlValidation(url) {
  const { data } = await axios.get(VALIDATOR_ENDPOINT, {
    params: { doc: url, out: 'json' },
    headers: { 'User-Agent': 'MassiveDesignsAuditTool/1.0 (+https://massive-designs.com)' },
    timeout: 25000,
  });

  const messages = data.messages ?? [];
  const errorCount = messages.filter((m) => m.type === 'error').length;
  const warningCount = messages.filter((m) => m.type === 'info' && m.subType === 'warning').length;

  return { errorCount, warningCount, totalMessages: messages.length };
}
