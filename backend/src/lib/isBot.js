const BOT_PATTERNS = [
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /slurp/i, // Yahoo
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /gptbot/i, // OpenAI
  /claudebot/i, // Anthropic
  /anthropic-ai/i,
  /perplexitybot/i,
  /ccbot/i, // Common Crawl
  /facebookexternalhit/i,
  /linkedinbot/i,
  /twitterbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /python-requests/i,
  /curl\//i,
  /wget/i,
  /go-http-client/i,
  /axios\//i,
  /scrapy/i,
];

export function isBot(userAgent) {
  if (!userAgent) return true; // no UA at all is almost always a script, not a browser
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
