// Standard "last octet" IPv4 anonymization (the same approach Google
// Analytics' IP anonymization uses) and its IPv6 equivalent (zero the last
// 80 bits, keeping only the /48 network prefix). Applied only to the value
// actually persisted — geoLookup() already runs on the real IP before this,
// so city/country accuracy is unaffected.
export function anonymizeIp(ip) {
  if (!ip) return ip;

  // Loopback/private addresses (local dev, internal health checks) aren't
  // real visitor IPs to begin with — leave them as-is rather than mangling
  // a short address like "::1" into something malformed.
  if (ip === '::1' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.')) return ip;

  if (ip.includes('.') && !ip.includes(':')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
    return ip;
  }

  if (ip.includes(':')) {
    // Handle IPv4-mapped IPv6 addresses (::ffff:1.2.3.4) by anonymizing the
    // embedded IPv4 part rather than the hextets.
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) return `::ffff:${anonymizeIp(mapped[1])}`;

    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}::`;
  }

  return ip;
}
