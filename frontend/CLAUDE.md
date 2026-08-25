# Massive Designs — Frontend (live SPA)

This is the live production site (React + react-router-dom, built with Vite, deployed as `dist.zip` to Apache/cPanel hosting).

## Strict rule: every internal URL must end with a trailing slash `/`

- All internal links (`Link to=`, `NavLink to=`, `href=`, route `path=` values, `Seo` `path` prop) must end with `/` — e.g. `/about/`, `/services/`, `/areas-we-serve/dallas/`. Never `/about` without the slash.
- The homepage stays `/` (no double slash).
- External links (other domains, `mailto:`, `tel:`) are exempt.
- `public/sitemap.xml` — every `<loc>` must end with `/`.
- Any new page/route added later must follow this convention from the start (route path, nav links, footer links, breadcrumbs, canonical/OG tags, sitemap entry).

## `.htaccess` must not be touched carelessly

`public/.htaccess` is what enforces the trailing slash + www→non-www redirects in production and must be preserved as-is. Do not delete, simplify, or reorder it without explicit instruction. Rules:

1. `RewriteEngine On` / `RewriteBase /` first.
2. www → non-www 301 redirect.
3. Per-page 301 redirects from the no-slash URL to the `/slash/` URL — add one new `RewriteRule` here for every new route.
4. The SPA fallback rule (`RewriteCond ... !-f/!-d` → `RewriteRule . /index.html [L]`) must always stay **last**, after the redirects above — it is what lets React Router handle client-side routes on hard refresh/direct link.

## After editing `src/`

Rebuild before considering the fix live:

```
npm install   # only if node_modules is missing
npm run build # outputs to dist/
```

Then repackage `dist/` into `dist.zip` (the artifact actually uploaded to hosting) preserving forward-slash paths inside the archive (`dist/...`, not `dist\...`) — Windows `Compress-Archive` produces backslash entry paths, which break extraction on Linux hosting. Use a zip tool/script that writes `/`-separated entries.
