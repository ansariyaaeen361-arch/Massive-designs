const KNOWN_SOURCES = [
  { match: /google\./i, label: 'Google Search' },
  { match: /bing\./i, label: 'Bing Search' },
  { match: /yahoo\./i, label: 'Yahoo Search' },
  { match: /duckduckgo\./i, label: 'DuckDuckGo Search' },
  { match: /facebook\.|fb\.com/i, label: 'Facebook' },
  { match: /instagram\./i, label: 'Instagram' },
  { match: /linkedin\./i, label: 'LinkedIn' },
  { match: /twitter\.|x\.com/i, label: 'Twitter / X' },
  { match: /youtube\./i, label: 'YouTube' },
  { match: /chatgpt\.|openai\./i, label: 'ChatGPT' },
];

// Turns document.referrer into a simple, human-readable source label.
export function parseReferrer(referrer, ownHostname) {
  if (!referrer) return 'Direct';

  let hostname;
  try {
    hostname = new URL(referrer).hostname;
  } catch {
    return 'Direct';
  }

  if (ownHostname && hostname === ownHostname) return 'Direct';

  const known = KNOWN_SOURCES.find((s) => s.match.test(hostname));
  if (known) return known.label;

  return hostname;
}
