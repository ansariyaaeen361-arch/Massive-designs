import axios from 'axios';

const MAX_LINKS = 20;
const SKIP_PREFIXES = ['#', 'mailto:', 'tel:', 'javascript:'];

function extractLinks($, baseUrl) {
  const links = new Set();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href || SKIP_PREFIXES.some((prefix) => href.startsWith(prefix))) return;

    try {
      links.add(new URL(href, baseUrl).toString());
    } catch {
      // ignore malformed hrefs
    }
  });

  return Array.from(links).slice(0, MAX_LINKS);
}

async function checkLink(link) {
  try {
    const res = await axios.head(link, { timeout: 8000, maxRedirects: 5, validateStatus: () => true });
    if (res.status === 405 || res.status === 501) {
      const getRes = await axios.get(link, { timeout: 8000, maxRedirects: 5, validateStatus: () => true });
      return { link, status: getRes.status, broken: getRes.status >= 400 };
    }
    return { link, status: res.status, broken: res.status >= 400 };
  } catch (err) {
    return { link, status: null, broken: true, error: err.code ?? 'REQUEST_FAILED' };
  }
}

export async function checkBrokenLinks($, baseUrl) {
  const links = extractLinks($, baseUrl);
  const results = await Promise.all(links.map(checkLink));
  const broken = results.filter((r) => r.broken);

  return {
    totalChecked: results.length,
    brokenCount: broken.length,
    brokenLinks: broken.map((r) => ({ url: r.link, status: r.status })),
  };
}
