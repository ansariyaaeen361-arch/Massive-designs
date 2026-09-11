// Specific bots first (so e.g. Googlebot gets named "Googlebot", not caught
// by the generic /bot\b/ pattern below it); generic catch-alls always last.
const BOT_PATTERNS = [
  { match: /googlebot/i, name: 'Googlebot' },
  { match: /bingbot/i, name: 'Bingbot' },
  { match: /yandexbot/i, name: 'YandexBot' },
  { match: /duckduckbot/i, name: 'DuckDuckBot' },
  { match: /baiduspider/i, name: 'Baiduspider' },
  { match: /slurp/i, name: 'Yahoo Slurp' },
  { match: /ahrefsbot/i, name: 'AhrefsBot' },
  { match: /semrushbot/i, name: 'SemrushBot' },
  { match: /mj12bot/i, name: 'MJ12bot' },
  { match: /dotbot/i, name: 'DotBot' },
  { match: /gptbot/i, name: 'GPTBot (OpenAI)' },
  { match: /claudebot/i, name: 'ClaudeBot (Anthropic)' },
  { match: /anthropic-ai/i, name: 'Anthropic AI' },
  { match: /perplexitybot/i, name: 'PerplexityBot' },
  { match: /ccbot/i, name: 'CCBot (Common Crawl)' },
  { match: /facebookexternalhit/i, name: 'Facebook' },
  { match: /linkedinbot/i, name: 'LinkedInBot' },
  { match: /twitterbot/i, name: 'Twitterbot' },
  { match: /whatsapp/i, name: 'WhatsApp' },
  { match: /telegrambot/i, name: 'TelegramBot' },
  { match: /discordbot/i, name: 'Discordbot' },
  { match: /pingdom/i, name: 'Pingdom' },
  { match: /uptimerobot/i, name: 'UptimeRobot' },
  { match: /statuscake/i, name: 'StatusCake' },
  { match: /headlesschrome/i, name: 'Headless Chrome' },
  { match: /phantomjs/i, name: 'PhantomJS' },
  { match: /puppeteer/i, name: 'Puppeteer' },
  { match: /playwright/i, name: 'Playwright' },
  { match: /python-requests/i, name: 'python-requests' },
  { match: /curl\//i, name: 'curl' },
  { match: /wget/i, name: 'Wget' },
  { match: /go-http-client/i, name: 'Go HTTP Client' },
  { match: /axios\//i, name: 'axios' },
  { match: /scrapy/i, name: 'Scrapy' },
  // Generic catch-alls — only reached if nothing more specific matched above.
  { match: /crawler/i, name: 'Unnamed Crawler' },
  { match: /spider/i, name: 'Unnamed Spider' },
  { match: /bot\b/i, name: 'Unnamed Bot (self-declared)' },
];

// Returns { isBot, name } in one pass, so whatever flags something as a bot
// also names it — the dashboard just displays this, it never has to guess.
export function detectBot(userAgent) {
  if (!userAgent) return { isBot: true, name: 'No User-Agent Sent' };
  const found = BOT_PATTERNS.find((p) => p.match.test(userAgent));
  return found ? { isBot: true, name: found.name } : { isBot: false, name: null };
}
