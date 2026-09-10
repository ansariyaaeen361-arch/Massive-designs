// Lightweight, dependency-free user-agent parsing — just enough to show
// device type, browser, and OS on the dashboard.
export function parseUserAgent(ua) {
  if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  let device = 'Desktop';
  if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  else if (/mobi|android.*mobile|iphone/i.test(ua)) device = 'Mobile';

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) browser = 'Chrome';
  else if (/firefox\//i.test(ua)) browser = 'Firefox';
  else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/i.test(ua)) os = 'Mac';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}
