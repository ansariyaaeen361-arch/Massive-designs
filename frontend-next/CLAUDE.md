# Massive Designs — Frontend (Next.js migration)

This is the Next.js port of `../frontend` (React + Vite + react-router-dom). It uses the
Pages Router with `output: 'export'` in [next.config.mjs](next.config.mjs), so it still
builds to a static site (`out/`) deployable on the same Apache/cPanel hosting as the
current live site — there is no Node server in production.

Route-for-route, every page in `../frontend/src/pages` (and `pages/services/*`,
`pages/areas/*`) has a matching file under `pages/` here. Page-local components that used
to live next to the React page (`pages/home/*.jsx`, `pages/about/*.jsx`, etc.) were moved
into `components/home/`, `components/about/`, `components/packages/` to fit the Next
`pages/` convention (that directory is reserved for routes).

## Strict rule: every internal URL must end with a trailing slash `/`

Same convention as the live site — enforced automatically here via `trailingSlash: true`
in `next.config.mjs`, which makes every route export as `out/<route>/index.html`. Keep
using `next/link` (`<Link href="/about/">`) with the trailing slash for consistency with
the generated output and `public/sitemap.xml`.

## `public/.htaccess`

Adapted from `../frontend/public/.htaccess` for a Next static export:

- www → non-www redirect (unchanged).
- Per-route 301 redirects from the no-slash URL to the `/slash/` URL (unchanged, plus a
  `/packages` rule the original file was missing).
- **No SPA fallback rule.** The React build was a single `index.html` that needed
  `RewriteRule . /index.html [L]` so client-side routing could handle any path. Next's
  static export instead writes a real `index.html` per route, so Apache serves each URL
  directly — the fallback is replaced with `ErrorDocument 404 /404.html`.

Do not delete, simplify, or reorder these rules without explicit instruction. Add a new
`RewriteRule` here for every new route, matching `../frontend/public/.htaccess`.

## After editing

```
npm install   # only if node_modules is missing
npm run build # runs next build, outputs the static site to out/
```

`out/` is what gets uploaded to hosting (equivalent to `frontend`'s `dist.zip`). It is
git-ignored; regenerate it before deploying rather than committing it.

## Not yet done / verify before cutover

- Nothing wires `out/` into a deploy step yet (`frontend`'s README describes zipping
  `dist/` into `dist.zip`; this project has no equivalent packaging step or CI).
- `/api/*` calls (contact form, audit tool) and `/cms/wp-json/*` (projects page) are
  relative fetches, same as `../frontend` — confirm the backend/CMS proxy rules that make
  those work today also apply once this build replaces `frontend` at the domain root.
