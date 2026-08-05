import axios from 'axios';

const TITLE_IDEAL_MIN = 50;
const TITLE_IDEAL_MAX = 60;
const META_DESCRIPTION_IDEAL_MIN = 120;
const META_DESCRIPTION_IDEAL_MAX = 160;

export function analyzeSeo($, baseUrl) {
  const title = $('title').first().text().trim();
  const metaDescription = ($('meta[name="description"]').attr('content') ?? '').trim();
  const h1Count = $('h1').length;
  const images = $('img');
  const imagesMissingAlt = images.filter((_, el) => !$(el).attr('alt')?.trim()).length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasFavicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;

  const hasHtmlLang = Boolean($('html').first().attr('lang')?.trim());
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasOgTitle = Boolean($('meta[property="og:title"]').attr('content')?.trim());
  const hasOgDescription = Boolean($('meta[property="og:description"]').attr('content')?.trim());
  const hasOgImage = Boolean($('meta[property="og:image"]').attr('content')?.trim());
  const hasOpenGraph = hasOgTitle && hasOgDescription && hasOgImage;

  const isHttps = /^https:/i.test(baseUrl ?? '');
  const mixedContentCount = isHttps
    ? $('img[src^="http://"], script[src^="http://"], link[rel="stylesheet"][href^="http://"]').length
    : 0;

  return {
    title,
    titleLength: title.length,
    titlePresent: title.length > 0,
    titleLengthOk: title.length >= TITLE_IDEAL_MIN && title.length <= TITLE_IDEAL_MAX,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    metaDescriptionPresent: metaDescription.length > 0,
    metaDescriptionLengthOk:
      metaDescription.length >= META_DESCRIPTION_IDEAL_MIN && metaDescription.length <= META_DESCRIPTION_IDEAL_MAX,
    h1Count,
    h1CountOk: h1Count === 1,
    totalImages: images.length,
    imagesMissingAlt,
    hasViewport,
    hasFavicon,
    hasHtmlLang,
    hasCanonical,
    hasOpenGraph,
    mixedContentCount,
  };
}

export async function checkRobotsAndSitemap(baseUrl) {
  const check = async (path) => {
    try {
      const res = await axios.get(new URL(path, baseUrl).toString(), {
        timeout: 8000,
        validateStatus: () => true,
      });
      if (res.status < 200 || res.status >= 400) return false;
      // Single-page apps with a catch-all rewrite return 200 + their HTML
      // shell for any unmatched path, including /robots.txt and
      // /sitemap.xml when those files don't actually exist. Neither file is
      // ever legitimately served as HTML, so that response is a false
      // positive, not a real robots.txt/sitemap.xml.
      const contentType = String(res.headers['content-type'] ?? '');
      return !contentType.includes('text/html');
    } catch {
      return false;
    }
  };

  const [robotsExists, sitemapExists] = await Promise.all([check('/robots.txt'), check('/sitemap.xml')]);
  return { robotsExists, sitemapExists };
}
