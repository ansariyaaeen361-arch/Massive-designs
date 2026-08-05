const WEIGHTS = {
  performance: 0.3,
  seo: 0.3,
  mobile: 0.15,
  security: 0.15,
  accessibility: 0.1,
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function computeSeoScore(seo, robotsSitemap) {
  let score = 100;

  if (!seo.titlePresent) score -= 20;
  else if (!seo.titleLengthOk) score -= 8;

  if (!seo.metaDescriptionPresent) score -= 15;
  else if (!seo.metaDescriptionLengthOk) score -= 6;

  if (seo.h1Count === 0) score -= 20;
  else if (seo.h1Count > 1) score -= 10;

  score -= Math.min(15, seo.imagesMissingAlt * 2);

  if (!seo.hasViewport) score -= 8;
  if (!seo.hasFavicon) score -= 5;
  if (!robotsSitemap.robotsExists) score -= 8;
  if (!robotsSitemap.sitemapExists) score -= 8;

  return clamp(score);
}

export function computeMobileScore(pagespeed, seo) {
  const viewportScore = seo.hasViewport ? 100 : 0;
  return clamp(pagespeed.mobileFriendlyScore * 0.7 + viewportScore * 0.3);
}

export function computeAccessibilityScore(htmlValidation, brokenLinks) {
  let score = 100;
  score -= Math.min(50, htmlValidation.errorCount * 3);
  score -= Math.min(20, htmlValidation.warningCount * 1);
  score -= Math.min(30, brokenLinks.brokenCount * 6);
  return clamp(score);
}

export function computeOverallScore(scores) {
  const weighted =
    scores.performance * WEIGHTS.performance +
    scores.seo * WEIGHTS.seo +
    scores.mobile * WEIGHTS.mobile +
    scores.security * WEIGHTS.security +
    scores.accessibility * WEIGHTS.accessibility;

  return clamp(weighted);
}

function pushIssue(issues, condition, issue) {
  if (condition) issues.push(issue);
}

export function buildIssues({ pagespeed, seo, robotsSitemap, ssl, brokenLinks, htmlValidation }) {
  const issues = [];

  pushIssue(issues, pagespeed.performanceScore < 50, {
    category: 'Performance',
    severity: 90,
    title: 'Your website loads too slowly',
    description:
      'Visitors are likely leaving before your page finishes loading. Slow-loading pages hurt both user experience and search rankings.',
    fix: 'Compress and resize images, enable browser caching, and remove unused JavaScript/CSS to cut load time.',
  });
  pushIssue(issues, pagespeed.performanceScore >= 50 && pagespeed.performanceScore < 80, {
    category: 'Performance',
    severity: 55,
    title: 'Your website could load faster',
    description:
      'Your page loads, but not as quickly as it could. Shaving off load time can meaningfully improve conversions.',
    fix: 'Optimize your largest images to modern formats (WebP/AVIF) and defer any scripts that are not needed immediately.',
  });
  pushIssue(issues, pagespeed.coreWebVitals.mobile.lcp != null && pagespeed.coreWebVitals.mobile.lcp > 2.5, {
    category: 'Performance',
    severity: 70,
    title: 'Your main content takes too long to appear on mobile',
    description:
      'Mobile visitors have to wait too long before the main content of your page shows up on screen, a common reason people bounce.',
    fix: 'Compress your hero image/banner and make sure it starts loading immediately, before other page scripts.',
  });
  pushIssue(issues, pagespeed.coreWebVitals.mobile.cls != null && pagespeed.coreWebVitals.mobile.cls > 0.1, {
    category: 'Performance',
    severity: 50,
    title: 'Your page layout shifts around while loading',
    description:
      'Elements on your page move around as it loads, which can frustrate visitors and cause accidental clicks or taps.',
    fix: 'Set explicit width and height on images and embeds so the browser reserves space for them before they load.',
  });
  pushIssue(issues, pagespeed.coreWebVitals.mobile.inp != null && pagespeed.coreWebVitals.mobile.inp > 200, {
    category: 'Performance',
    severity: 45,
    title: 'Your site feels sluggish to interact with on mobile',
    description: 'Taps and clicks take a noticeable moment to respond, which can make your site feel unpolished.',
    fix: 'Break up long-running JavaScript tasks and remove any scripts that block the main thread on page load.',
  });

  pushIssue(issues, !seo.titlePresent, {
    category: 'SEO',
    severity: 85,
    title: 'Your homepage is missing a page title',
    description:
      'The page title is one of the most important signals for search engines and is what shows up in Google search results and browser tabs.',
    fix: 'Add a unique, descriptive <title> tag to your homepage summarizing what your business offers.',
  });
  pushIssue(issues, seo.titlePresent && !seo.titleLengthOk, {
    category: 'SEO',
    severity: 30,
    title: 'Your page title length is not ideal',
    description: 'Search engines tend to favor page titles between 50 and 60 characters long.',
    fix: 'Rewrite your title tag to fall between 50 and 60 characters, front-loading your main keyword.',
  });
  pushIssue(issues, !seo.metaDescriptionPresent, {
    category: 'SEO',
    severity: 75,
    title: 'Your homepage has no meta description',
    description:
      "Without a meta description, Google shows a random snippet of text in search results instead of a compelling summary you control.",
    fix: 'Write a 120-160 character meta description that summarizes the page and encourages clicks.',
  });
  pushIssue(issues, seo.h1Count === 0, {
    category: 'SEO',
    severity: 70,
    title: 'Your page has no main heading',
    description:
      'A main heading (H1) helps search engines and visitors quickly understand what your page is about. Yours is missing one.',
    fix: 'Add a single, clear H1 heading near the top of the page that states what the page is about.',
  });
  pushIssue(issues, seo.h1Count > 1, {
    category: 'SEO',
    severity: 40,
    title: 'Your page has multiple main headings',
    description: 'Having more than one H1 heading can confuse search engines about what your page is really about.',
    fix: 'Keep a single H1 per page and convert any additional ones to H2 or H3 subheadings.',
  });
  pushIssue(issues, seo.imagesMissingAlt > 0, {
    category: 'SEO',
    severity: Math.min(80, 30 + seo.imagesMissingAlt * 2),
    title: `${seo.imagesMissingAlt} image${seo.imagesMissingAlt === 1 ? ' is' : 's are'} missing descriptive text`,
    description:
      'Images without alt text are invisible to screen readers and search engines, hurting both accessibility and image search visibility.',
    fix: 'Add short, descriptive alt text to every image that conveys what it shows.',
  });
  pushIssue(issues, !seo.hasViewport, {
    category: 'Mobile-Friendliness',
    severity: 65,
    title: 'Your site is missing a mobile viewport setting',
    description: 'Without this setting, your site can display incorrectly or appear zoomed-out on phones.',
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your page head.',
  });
  pushIssue(issues, !seo.hasFavicon, {
    category: 'SEO',
    severity: 20,
    title: "Your site doesn't have a favicon",
    description: "The small icon shown in browser tabs and bookmarks is missing, which can make your site look less trustworthy.",
    fix: 'Add a favicon.ico (or an <link rel="icon"> tag) using your logo mark.',
  });
  pushIssue(issues, !robotsSitemap.robotsExists, {
    category: 'SEO',
    severity: 35,
    title: 'No robots.txt file was found',
    description: 'This file helps search engines understand which parts of your site they should and should not crawl.',
    fix: 'Add a robots.txt file at your site root that allows crawling and links to your sitemap.',
  });
  pushIssue(issues, !robotsSitemap.sitemapExists, {
    category: 'SEO',
    severity: 35,
    title: 'No sitemap.xml file was found',
    description: 'A sitemap makes it easier for search engines to discover and index all of your pages.',
    fix: 'Generate a sitemap.xml listing your pages and submit it in Google Search Console.',
  });

  pushIssue(issues, ssl.status !== 'READY' || ssl.score < 50, {
    category: 'Security',
    severity: 95,
    title: 'Your security setup needs attention',
    description:
      "We couldn't confirm your site has a strong, valid security certificate. This can scare visitors away or expose their data.",
    fix: 'Ask your hosting provider to issue or repair your SSL certificate, and confirm HTTPS loads without warnings.',
  });
  pushIssue(
    issues,
    ssl.status === 'READY' && ssl.certificate?.daysUntilExpiry != null && ssl.certificate.daysUntilExpiry < 30,
    {
      category: 'Security',
      severity: 90,
      title: 'Your SSL certificate is expiring soon',
      description:
        'If your certificate lapses, browsers will show visitors a scary security warning before they can even see your site.',
      fix: 'Renew your SSL certificate now, or enable auto-renewal if your host supports it (e.g. Let\'s Encrypt AutoSSL).',
    },
  );
  pushIssue(
    issues,
    ssl.status === 'READY' && ssl.score >= 50 && ssl.score < 90,
    {
      category: 'Security',
      severity: 55,
      title: 'Your security configuration could be stronger',
      description: 'Your site is secure, but its encryption settings could be tightened to better protect visitors.',
      fix: 'Ask your host to disable outdated TLS/SSL protocols and enable modern, stronger cipher settings.',
    },
  );

  pushIssue(issues, brokenLinks.brokenCount > 0, {
    category: 'Accessibility',
    severity: Math.min(75, 25 + brokenLinks.brokenCount * 8),
    title: `We found ${brokenLinks.brokenCount} broken link${brokenLinks.brokenCount === 1 ? '' : 's'} on your homepage`,
    description: 'Broken links frustrate visitors and signal to search engines that a site is poorly maintained.',
    fix: 'Update or remove each broken link, or redirect it to the correct page.',
  });
  pushIssue(issues, htmlValidation.errorCount > 0, {
    category: 'Accessibility',
    severity: Math.min(60, 15 + htmlValidation.errorCount * 2),
    title: `Your page code has ${htmlValidation.errorCount} error${htmlValidation.errorCount === 1 ? '' : 's'}`,
    description: 'Invalid HTML can cause your page to display inconsistently across different browsers and devices.',
    fix: 'Run your page through a markup validator and fix the flagged tags/attributes.',
  });

  return issues.sort((a, b) => b.severity - a.severity);
}
