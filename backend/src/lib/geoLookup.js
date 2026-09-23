// Free, no-key IP geolocation (ip-api.com, ~45 req/min limit) — best effort
// only, used to enrich click logs with city/country/ISP for the dashboard.
export async function geoLookup(ip) {
  if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('::ffff:127.') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return {};
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    // proxy/hosting are real fields ip-api's free tier returns (not
    // inferred by us) — a genuine signal for the traffic-quality engine,
    // not a guess.
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,proxy,hosting`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.status !== 'success') return {};
    return {
      city: data.city,
      region: data.regionName,
      country: data.country,
      isp: data.isp,
      isProxy: Boolean(data.proxy),
      isHosting: Boolean(data.hosting),
    };
  } catch {
    return {};
  }
}
