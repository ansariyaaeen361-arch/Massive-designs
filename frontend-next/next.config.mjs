import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// `output: 'export'` disallows rewrites/redirects/headers, so they only get added
// during `next dev` (mirrors the proxy in ../frontend/vite.config.js) and are absent
// from the config object used by `next build`.
export default function nextConfig(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(isDev ? {} : { output: 'export' }),
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    ...(isDev && {
      // Without this, Next's own trailing-slash redirect (from `trailingSlash: true`
      // below) intercepts /cms/* and /api/* requests before the rewrite proxy runs,
      // 308-redirecting them to a slash-suffixed URL the CMS/backend don't expect.
      skipTrailingSlashRedirect: true,
      async rewrites() {
        return [
          { source: '/cms/:path*', destination: 'https://massive-designs.com/cms/:path*' },
          { source: '/api/:path*', destination: 'http://localhost:4000/:path*' },
        ];
      },
    }),
  };
}
