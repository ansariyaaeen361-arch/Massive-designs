import axios from 'axios';

const TITLE_IDEAL_MIN = 50;
const TITLE_IDEAL_MAX = 60;
const META_DESCRIPTION_IDEAL_MIN = 120;
const META_DESCRIPTION_IDEAL_MAX = 160;

export function analyzeSeo($) {
  const title = $('title').first().text().trim();
  const metaDescription = ($('meta[name="description"]').attr('content') ?? '').trim();
  const h1Count = $('h1').length;
  const images = $('img');
  const imagesMissingAlt = images.filter((_, el) => !$(el).attr('alt')?.trim()).length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasFavicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;

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
  };
}

export async function checkRobotsAndSitemap(baseUrl) {
  const check = async (path) => {
    try {
      const res = await axios.get(new URL(path, baseUrl).toString(), {
        timeout: 8000,
        validateStatus: () => true,
      });
      return res.status >= 200 && res.status < 400;
    } catch {
      return false;
    }
  };

  const [robotsExists, sitemapExists] = await Promise.all([check('/robots.txt'), check('/sitemap.xml')]);
  return { robotsExists, sitemapExists };
}
