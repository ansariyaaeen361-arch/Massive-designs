// Every reason here is backed by a real, checkable signal — never a guess.
// 'spam' and 'fraud' tiers are intentionally not modeled yet: telling those
// apart from 'bot' reliably needs conversion/form context that doesn't
// exist until the lead-tracking phase — claiming that distinction now would
// be exactly the kind of unreliable/invented classification to avoid.
const PENALTIES = {
  bot_user_agent: 100,
  no_user_agent: 100,
  webdriver_detected: 100,
  excessive_request_rate: 50,
  session_flood: 35,
  datacenter_ip: 30,
  known_proxy_vpn: 15,
};

const REASON_LABELS = {
  bot_user_agent: 'Known bot/crawler user agent',
  no_user_agent: 'No User-Agent header sent',
  webdriver_detected: 'Browser automation detected (navigator.webdriver)',
  excessive_request_rate: 'Abnormal request frequency (too many pages too fast)',
  session_flood: 'One visitor generated an unusually large number of sessions quickly',
  datacenter_ip: 'Traffic from a datacenter/hosting IP, not a residential connection',
  known_proxy_vpn: 'Known proxy or VPN exit IP',
};

export function classifyTrafficQuality({ isKnownBot, hasNoUserAgent, isWebdriver, isTooFast, isSessionFlood, isHosting, isProxy }) {
  const reasonKeys = [];
  if (isKnownBot) reasonKeys.push('bot_user_agent');
  if (hasNoUserAgent) reasonKeys.push('no_user_agent');
  if (isWebdriver) reasonKeys.push('webdriver_detected');
  if (isTooFast) reasonKeys.push('excessive_request_rate');
  if (isSessionFlood) reasonKeys.push('session_flood');
  if (isHosting) reasonKeys.push('datacenter_ip');
  if (isProxy) reasonKeys.push('known_proxy_vpn');

  const score = Math.max(0, 100 - reasonKeys.reduce((sum, key) => sum + PENALTIES[key], 0));

  let classification;
  const hasHardSignal = isKnownBot || hasNoUserAgent || isWebdriver;
  if (hasHardSignal || score <= 0) classification = 'bot';
  else if (score <= 50) classification = 'suspicious';
  else if (score <= 80) classification = 'likely_human';
  else classification = 'human';

  return {
    classification,
    score,
    reasons: reasonKeys.map((key) => REASON_LABELS[key]),
  };
}
