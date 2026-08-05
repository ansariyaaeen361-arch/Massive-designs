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

async function requestWithMethod(method, link) {
  return axios.request({ method, url: link, timeout: 8000, maxRedirects: 5, validateStatus: () => true });
}

async function checkLink(link) {
  // Some servers/WAFs reject or misbehave on HEAD requests (not just with a
  // clean 405/501) as a bot-detection heuristic, which would otherwise show
  // up as a false "broken" link. Falling back to GET on any non-2xx/3xx
  // response confirms whether it's a real break or just a HEAD quirk.
  try {
    const headRes = await requestWithMethod('head', link);
    if (headRes.status < 400) return { link, status: headRes.status, broken: false };

    const getRes = await requestWithMethod('get', link);
    return { link, status: getRes.status, broken: getRes.status >= 400 };
  } catch {
    try {
      const getRes = await requestWithMethod('get', link);
      return { link, status: getRes.status, broken: getRes.status >= 400 };
    } catch (err) {
      return { link, status: null, broken: true, error: err.code ?? 'REQUEST_FAILED' };
    }
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
