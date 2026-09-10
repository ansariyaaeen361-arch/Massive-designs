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
      async rewrites() {
        return [
          { source: '/cms/:path*', destination: 'https://massive-designs.com/cms/:path*' },
          { source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' },
        ];
      },
    }),
  };
}
