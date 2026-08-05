import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { runPageSpeedChecks } from './pagespeed.js';
import { runSslCheck } from './ssl.js';
import { analyzeSeo, checkRobotsAndSitemap } from './seo.js';
import { checkBrokenLinks } from './brokenLinks.js';
import { runHtmlValidation } from './htmlValidation.js';
import {
  computeSeoScore,
  computeMobileScore,
  computeAccessibilityScore,
  computeOverallScore,
  buildIssues,
} from './scoring.js';

export function normalizeUrl(input) {
  const trimmed = (input ?? '').trim();
  if (!trimmed) throw new Error('Please enter a website URL.');

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("That doesn't look like a valid URL. Please check it and try again.");
  }

  if (!parsed.hostname.includes('.')) {
    throw new Error("That doesn't look like a valid URL. Please check it and try again.");
  }

  return parsed;
}

const fallbackPagespeed = (message) => ({
  performanceScore: 0,
  mobilePerformanceScore: 0,
  desktopPerformanceScore: 0,
  mobileFriendlyScore: 0,
  coreWebVitals: { mobile: { lcp: null, cls: null, inp: null }, desktop: { lcp: null, cls: null, inp: null } },
  error: message,
});

const fallbackSsl = (message) => ({
  status: 'ERROR',
  grade: null,
  score: 40,
  protocols: [],
  certificate: null,
  error: message,
});

const fallbackHtmlValidation = (message) => ({ errorCount: 0, warningCount: 0, totalMessages: 0, error: message });

async function fetchHomepageHtml(url) {
  // Many sites (including this one) are client-side-rendered React/Vue apps
  // where the real content, H1s, and nav links only exist after JS runs, not
  // in the raw server response. A headless browser renders the page the same
  // way a real visitor's browser would, so checks reflect what's actually on
  // screen instead of the near-empty <div id="root"> shell.
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (compatible; MassiveDesignsAuditTool/1.0; +https://massive-designs.com)');

    let response;
    try {
      response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch {
      throw new Error('We could not reach that website. Please check the URL and try again.');
    }

    if (!response || response.status() >= 400) {
      throw new Error(
        `The site responded with an error (HTTP ${response ? response.status() : 'unknown'}). Please check the URL and try again.`,
      );
    }

    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function runAudit(rawUrl) {
  const parsedUrl = normalizeUrl(rawUrl);
  const url = parsedUrl.toString();

  const html = await fetchHomepageHtml(url);
  const $ = cheerio.load(html);

  const [pagespeedResult, sslResult, robotsSitemapResult, htmlValidationResult] = await Promise.allSettled([
    runPageSpeedChecks(url),
    runSslCheck(parsedUrl.hostname),
    checkRobotsAndSitemap(url),
    runHtmlValidation(url),
  ]);

  const pagespeed =
    pagespeedResult.status === 'fulfilled' ? pagespeedResult.value : fallbackPagespeed(pagespeedResult.reason?.message);
  const ssl = sslResult.status === 'fulfilled' ? sslResult.value : fallbackSsl(sslResult.reason?.message);
  const robotsSitemap =
    robotsSitemapResult.status === 'fulfilled' ? robotsSitemapResult.value : { robotsExists: false, sitemapExists: false };
  const htmlValidation =
    htmlValidationResult.status === 'fulfilled'
      ? htmlValidationResult.value
      : fallbackHtmlValidation(htmlValidationResult.reason?.message);

  const seo = analyzeSeo($);
  const brokenLinks = await checkBrokenLinks($, url);

  const scores = {
    performance: pagespeed.performanceScore,
    seo: computeSeoScore(seo, robotsSitemap),
    mobile: computeMobileScore(pagespeed, seo),
    security: ssl.score,
    accessibility: computeAccessibilityScore(htmlValidation, brokenLinks),
  };

  const overallScore = computeOverallScore(scores);
  const issues = buildIssues({ pagespeed, seo, robotsSitemap, ssl, brokenLinks, htmlValidation });

  return {
    url,
    overallScore,
    scores,
    issues,
    details: { pagespeed, seo, robotsSitemap, ssl, brokenLinks, htmlValidation },
  };
}
