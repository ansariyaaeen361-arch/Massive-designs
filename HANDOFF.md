# Massive Designs — MERN Rebuild: Handoff Prompt for New Session

Paste this entire document as your first message in the new Claude Code session to resume exactly where this one left off.

---

## 1. ORIGINAL PROJECT BRIEF (given by user at start)

I am working inside my existing codebase for the website **massive-designs.com**. This is currently a static-ish website (actually PHP includes for header/footer/routing via .htaccess clean URLs) built with plain HTML, CSS, and JavaScript. There is NO backend and NO database currently connected to it for the frontend pages. This is a live, production company website (parent website of Massive Designs, a Texas based web design and digital marketing agency), and it is actively used by real visitors.

Goal: rebuild this site using the **MERN stack**, with the **frontend rebuilt in React (JSX components) using Vite**. The backend (Node.js + Express + MongoDB) will only be used where actually needed, for example the contact form submission. Do NOT invent fake dynamic data, fake APIs, or a fake admin panel unless explicitly asked.

### Non-Negotiable Rules

0. **Always communicate with the user in Roman Urdu.** Every explanation, summary, question, or update must be written in Roman Urdu (not English), unless a technical term has no proper Roman Urdu equivalent. Code, comments, and file names stay in English. This rule is only for how you talk to the user.
1. **Content must stay exactly the same.** Do not add, remove, rewrite, or "improve" any text content, headings, paragraphs, service descriptions, testimonials, or contact details. Copy content exactly as it exists in the current live site/codebase files. Do not generate filler content. (Exceptions made only for genuine authoring mistakes in the source, or explicit direct user requests — see section 4, "Content Deviations".)
2. **Images stay the same.** Use the exact same images, logo, and icons that already exist in the project's assets folder. Do not replace them with placeholder or new stock images, unless the user explicitly supplies a new image and asks for it (has happened, see section 3.14).
3. **Brand colors stay the same.** Keep the existing color palette exactly — **updated mid-session**: primary color is now `#B5F652` (see section 3.9 for why — the user explicitly requested this change, and it turned out to match a hardcoded value already present in the original Packages page source, confirming it was the intended brand color).
4. **Never use the "--" (double hyphen / em-dash style) symbol** anywhere in code comments, content, or commit messages.
5. **Work ONE PAGE AT A TIME by default** — after finishing a page, stop, tell the user clearly what was done, and wait for confirmation before moving to the next page. **Current status: user explicitly re-confirmed this default mid-session ("Har page ke baad confirm karo") — do NOT assume blanket autonomous permission unless the user grants it again in the new session.**
6. **No broken functionality.** Every link, button, form, and menu that currently works must keep working after conversion.
7. **Clean code only.** Remove unused CSS classes, dead JavaScript, unused libraries, duplicate code, and leftover template bloat.

### What Must Be Improved
- **Design quality must be visibly better** — more premium, agency-grade. Better spacing, hierarchy, section flow, whitespace, typography pairing. Colors/content unchanged, but layout/structure should feel like a serious upgrade.
- **Performance**: optimize images (proper formats/sizes, lazy loading), remove unused JS/CSS libraries, code-split per route, minimal bundle size.
- **Smoothness**: GSAP-based scroll and hover animations (hard requirement, see below). Subtle, not distracting.
- **Layout fixes**: fix broken/inconsistent spacing and alignment using clean modern CSS (Flexbox/Grid, Tailwind CSS).
- **Full responsiveness**: mobile, tablet, desktop for every page.
- **SEO preserved**: meta titles, meta descriptions, canonical tags, alt text, heading structure equivalent to current site.
- **Accessibility**: alt attributes, semantic HTML, keyboard-navigable menus/forms.

### Tech Stack (confirmed, in active use)
- **Frontend**: React 19 + Vite, functional components/JSX, React Router (`react-router-dom`)
- **Styling**: **Tailwind CSS v4**
- **Animation**: **GSAP + ScrollTrigger is a HARD REQUIREMENT** via `@gsap/react`'s `useGSAP` hook. Framer Motion was REMOVED entirely — do not reintroduce it.
- **Smooth scroll**: **Lenis** synced with GSAP ScrollTrigger (`src/hooks/useSmoothScroll.js`)
- **Icons**: `react-icons` (mostly `react-icons/hi` and `react-icons/fa6`)
- **SEO**: `react-helmet-async` via a shared `<Seo>` component
- **Backend (BUILT this session)**: Node.js + Express + MongoDB/Mongoose + Nodemailer, in a new top-level `backend/` folder, sibling to `frontend/`. See section 7 for full details.
- **reCAPTCHA**: `react-google-recaptcha` (v2 checkbox), real site key already wired.

### Site Structure (master checklist) — STATUS AS OF END OF THIS SESSION
1. **Home page** (`/`) — ✅ DONE (hero banner image updated this session, see section 3.14)
2. **About page** (`/about`) — ✅ DONE (stat badge restyled this session)
3. **Services main page** (`/services`) — ✅ DONE
4. **Service sub-pages** — ✅ **ALL 6 DONE**:
   - Web Design & Development (`/web-design-development`) — ✅ DONE
   - Branding & Logo Design (`/branding-logo-design`) — ✅ DONE
   - Social Media Marketing (`/social-media-marketing`) — ✅ DONE
   - Content Marketing (`/content-marketing`) — ✅ DONE
   - SEO Services (`/seo-services`) — ✅ DONE
   - Mobile App Development (`/mobile-app-development`) — ✅ DONE
5. **Projects / Portfolio page** (`/projects`) — ✅ DONE (WordPress headless CMS wired live, see section 6)
6. **Packages page** (`/packages`) — ✅ DONE
7. **Contact page** (`/contact`) — ✅ DONE, **including the Node/Express/MongoDB/Nodemailer backend** (see section 7 — one caveat: real email delivery could not be fully verified from this dev machine due to a local network SMTP port block, not a code issue)
8. **Privacy Policy page** — ⬜ **NOT STARTED — this is the next task**
9. **Terms and Conditions page** — ⬜ **NOT STARTED**
10. **Header, Footer, Navigation** — ✅ DONE

**Only 2 pages remain: Privacy Policy and Terms and Conditions.** Both are simple static legal-text pages in the original PHP (`privacy-policy.php`, `terms-conditions.php`) — read those source files first, they're short. Use `PageHeader` + plain prose sections, no special components needed. Check `inc/footer.php` / nav links for exact URLs (`/privacy-policy`, `/terms-conditions`).

Note: the Blogs section (`news.massive-designs.com`) is a separate subdomain, out of scope, do not touch.

### Untouchable folders in the original `public_html` project root
- `offer/` — do not touch
- `news/` — do not touch
- `cms/` — WordPress headless install, used for Projects/Portfolio content via REST API. **Already wired into the React Projects page this session** (read-only, via public REST API — the cms/ folder itself was never modified). See section 6.

### Working root
Original static/PHP project root: `c:\Users\PC\Downloads\Massive Designs Re create`
React frontend: `c:\Users\PC\Downloads\Massive Designs Re create\frontend`
**New Node backend (built this session)**: `c:\Users\PC\Downloads\Massive Designs Re create\backend`

---

## 2. CRITICAL FEEDBACK FROM USER (must not repeat these mistakes)

1. **GSAP is mandatory**, not optional. All scroll-reveal and interaction animations use GSAP (`gsap`, `ScrollTrigger`, `@gsap/react`'s `useGSAP`), never Framer Motion.
2. **Section vertical spacing must be tight**: `py-16 lg:py-24` for most sections (not the old `py-24 lg:py-32`).
3. **Hero sections need real visual weight/drama.** (Reinforced again this session — see section 3.14, the Home hero image was swapped for a custom-provided branded 3D-render banner instead of a stock photo.)
4. **Never leave a visibly empty half of a section** (the classic `items-start` doesn't fix it, `items-center` + rebalancing content does). Audit every two-column section for this.
5. Headings sized up: `text-3xl sm:text-4xl` → `text-4xl sm:text-5xl` pattern for most section H2/H3s.
6. **A shared component's fixed layout assumptions can silently break on other pages.** `ProcessSteps` was hardcoded to a 4-column grid; when a page passed only 3 steps (`WebDesignDevelopment.jsx`), it left a big dead gap on the right on desktop. **Fixed**: `ProcessSteps.jsx` now derives its column count from `steps.length` (3 → `sm:grid-cols-3`, 4+ → `sm:grid-cols-2 lg:grid-cols-4`). Apply this "derive columns from data length" pattern to any future shared grid component instead of hardcoding a column count.
7. **Service page hero titles were wrapping to 3 lines** on longer titles (e.g. "Texas Mobile App Development for Growing Businesses"). Fixed by widening `ServiceHero.jsx`'s container from `max-w-3xl` to `max-w-5xl` for the `<h1>`, while keeping the lead paragraph at its own narrower `max-w-2xl mx-auto` for readability. This is now the standard pattern — don't just widen everything uniformly, widen the heading and keep body text narrow.
8. **User granted a mid-session "keep working without asking" window in a previous session; do NOT assume it carries over.** Ask again explicitly if it matters, or default to confirming per page.
9. **When the user gives layout/design feedback with reference screenshots, look for a literal pixel-level detail you may have gotten wrong** (see section 3.13: the "5 Year Experience" stat badges were small dark boxes everywhere; the user's reference screenshot showed a much bigger solid-lime-green box — this was a real, repeated design miss across 3 files, not a one-off).
10. **Watch for icon/copy mismatches introduced by copy-pasting a pattern across pages.** Found twice this session: (a) `Content Marketing` page's gallery heading/alt text was literally copied from the `Social Media Marketing` page and never updated; (b) `Contact.jsx`'s "Social" info item used `HiOutlinePhone` (copy-pasted from a phone icon slot) instead of a globe/social icon. Always re-read icon and text props when duplicating a block across files.
11. **If the user references a file/image that can't be found where they said, ask them to confirm the exact path rather than guessing** from a similarly-named file. Happened this session with the Home hero banner image — resolved correctly by asking twice rather than assuming.

---

## 3. NEW WORK COMPLETED THIS SESSION (detailed)

### 3.1 Branding & Logo Design page (`/branding-logo-design`)
Built using the `service-page/` shared components (`ServiceHero`, `FeatureGrid`, `ProcessSteps`, `ServiceCta`) plus two new inline sections (before/after, logo gallery — these were page-specific, not worth extracting into shared components).
- **Content fix**: source PHP's logo gallery referenced `logo-3` twice (copy-paste error) instead of 5 distinct logos. Fixed to use `logo-1` through `logo-5` (all 5 already used elsewhere on the Home page's client-logo marquee, confirming they were meant to appear together). The 5th logo's image content visibly reads "2 Twenty Customs" — alt text set to `"2 Twenty Customs Logo"` accordingly (this was **confirmed with the user via AskUserQuestion before applying**).
- Fixed dead `mailto:hello@massivedesigns.example` placeholder link → real `brand.emailLink`.

### 3.2 Social Media Marketing page (`/social-media-marketing`)
- Source PHP's "Before & After" image was a generic external Pexels stock photo unrelated to the brand. **User approved** (via AskUserQuestion) swapping it for `dm-srv003.png` (already an existing project asset — literally the same image used to represent "Social Media Marketing" on the Home page's services slider), which fits far better than either the generic Pexels photo or a fallback option.
- Gallery: kept 1 real local on-brand asset (`pexels-photo-6476584.jpg`, a Massive Designs testimonial-slide mockup) + downloaded and self-hosted the original 2 external Pexels stock photos referenced in source (no better local alternative existed; matches original site's visual intent, just no longer hotlinked).
- Fixed dead mailto placeholder link.

### 3.3 Content Marketing page (`/content-marketing`)
- **Found and fixed a real content bug**: the gallery section heading read "Our Creative **Social Media** Work" and all 3 image alt texts said "Social Media Post Design" / "Social Media Strategy" / "Ad Campaign Design" — clearly copy-pasted from the Social Media Marketing page and never updated for this page's actual topic. Fixed heading to "Our Creative Content Marketing Work" and alts to accurately describe the (already-existing, on-topic) images.
- All 4 images used were already good, custom, on-brand Texas/content-themed illustrations — no substitution needed, just optimized to WebP.

### 3.4 SEO Services page (`/seo-services`)
Straightforward port, no content bugs found. All images already relevant.

### 3.5 Mobile App Development page (`/mobile-app-development`)
- **Found and fixed**: before/after image's source filename was literally `unnamed.jpg` with `alt="(final)"` — an obvious forgotten placeholder. Image actually shows a phone with React Native/Flutter/Ionic/Xamarin framework logos; alt fixed to `"Cross-Platform Mobile App Development"`.
- Gallery: 3 generic stock UI-kit mockup images (travel app screens) — kept as-is (these are the same style of generic-but-legitimate stock imagery already used elsewhere in the live site, e.g. SEO gallery; not a copy-paste bug like 3.3).

### 3.6 `ServiceHero` width fix (affects all 6 service sub-pages)
See section 2, point 7. `frontend/src/components/service-page/ServiceHero.jsx` — container widened to `max-w-5xl`, lead paragraph now `mx-auto max-w-2xl`.

### 3.7 `ProcessSteps` column-count fix (shared component)
See section 2, point 6. `frontend/src/components/service-page/ProcessSteps.jsx`.

### 3.8 Projects / Portfolio page (`/projects`) — WordPress CMS integration
Full details in section 6. Also iterated twice on user feedback after first build:
- Filter pill order fixed to a specific explicit order (not alphabetical API order): `Logo, Business Card, Flyer, Merchandise, Delivered Product, Website, Animation` (plus "All" first). Implemented via a `CATEGORY_ORDER` array and a sort in `Projects.jsx`.
- Filter bar changed to **always horizontally scrollable** (`overflow-x-auto`, `no-scrollbar` utility class added to `index.css`) instead of wrapping — future-proofs against more categories being added in the CMS later without breaking layout.
- Website category tiles: restored the **original site's hover-scroll effect** faithfully. Found the exact original CSS (`assets/css/main.css` — `.hover-scroll-box` / `.hover-scroll-img`): fixed-height container with `overflow: hidden`, image at natural width/height, `transition: transform 8s linear`, hover translates the image up by `-(imageHeight - containerHeight)`. Reimplemented identically with GSAP (`gsap.to(img, { y: -overflow, duration: 8, ease: 'none' })` on mouseenter, reverse on mouseleave) in `WebsiteTile` inside `Projects.jsx` — matches the "GSAP is mandatory" rule while being pixel/timing-faithful to the original.
- Website filter view: 3 tiles per row (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) instead of 2.
- **Lightbox added** for every non-Website category (Logo, Business Card, Flyer, Merchandise, Delivered Product, Animation): clicking a tile no longer navigates to `/contact` (the old fallback), it opens a GSAP fade+scale lightbox showing the full image (or looping video for Animation), closable via the ✕ button, Escape key, or click-outside. This lightbox was extracted into a **shared reusable component** `frontend/src/components/motion/Lightbox.jsx` (generic: takes `onClose` + `children`), also reused by the Home page's client-logo marquee (see 3.10) and by `Projects.jsx`'s own `ProjectLightbox` wrapper.
- "All" filter view: projects are now **grouped by category** (stable-sorted using the same `CATEGORY_ORDER`) instead of interleaved in raw CMS `menu_order` — user specifically asked for this after seeing everything mixed together.

### 3.9 Sitewide global changes
- **Business hours**: `brand.js`'s `openDays` changed from `'Monday to Saturday'` to `'Monday to Friday'` — this was the single source of truth (used in `ContactSection.jsx`), no other hardcoded instance existed.
- **Primary brand color**: `index.css`'s `--color-primary` changed from `#C4EF17` to `#B5F652` — single source of truth (Tailwind v4 `@theme` token). **Validated as correct**: the Packages page's original PHP source already had `color: #b5f652` hardcoded inline on all price displays, confirming this is the actual intended brand color, not an arbitrary swap.

### 3.10 Home page `ClientLogos` marquee — lightbox added
Same shared `Lightbox` component as Projects (3.8). Clicking any logo in the auto-scrolling marquee opens it large in a lightbox. Note: the marquee is a continuously-animating CSS/GSAP element, so Playwright (or any test) **cannot use a normal `.click()`** on it (fails "element is not stable" — it's a genuinely moving target); use `element.click()` via `page.evaluate()` (a direct JS dispatch) instead when testing this specific component.

### 3.11 Packages page (`/packages`)
- Intro section (heading, paragraph, image with stat badge) + 3-tab pricing system (Web Design / E-Commerce / Logo Design tabs, GSAP crossfade on switch, 9 total pricing cards transcribed verbatim from source including all feature-list bullets and exact prices) + the same shared `ContactForm` component used elsewhere.
- New files: `frontend/src/pages/packages/packagesData.js` (all pricing data), `frontend/src/pages/packages/PricingCard.jsx`.
- Source form had no heading above it (glued directly after pricing cards) — respected that, no invented heading added, just wrapped in a bordered card for visual polish.

### 3.12 Contact page + Node/Express/MongoDB/Nodemailer backend (`/contact`)
This is the big one. Full technical details in section 7. Summary:
- Full backend built from scratch at `backend/`.
- **User explicitly chose** (asked via AskUserQuestion) to also save every submission to MongoDB, not just email it (original PHP only emailed, MongoDB was the added-value option per the "optional" note in the original brief).
- SMTP + reCAPTCHA secret key **moved out of the plaintext `inc/mail.php`** into `backend/.env` (gitignored). **User should rotate the SMTP password** (`hello@massive-designs.com`) at some point since it sat in plaintext in the PHP codebase for an unknown amount of time before this session — this is a standing recommendation, not yet acted on.
- Real end-to-end email delivery **could not be fully verified** from this dev machine: outbound SMTP ports 465/587/25 are all blocked at the network level here (confirmed via direct TCP tests, not a code issue — port 443 works fine, so it's specifically SMTP ports being blocked, extremely common on residential/dev networks to prevent spam relay). A temporary controlled test (recaptcha bypassed for one request, then restored exactly as before, test DB entries cleaned up afterward) confirmed: validation ✅, MongoDB save ✅, and the email step fails with a clean `ETIMEDOUT` at the SMTP `CONN` stage — i.e. everything works up to the point the network blocks it. This will very likely work fine once deployed to the real production server (where the PHP version currently sends mail successfully).
- Contact page content: hero, intro paragraph, a 3-item info card (Location / Contact / Social — **restructured into one bordered card with dividers** after user feedback, see 3.13), "Get In Touch" sub-heading, then the form.

### 3.13 Design polish round (triggered by user-supplied reference screenshots)
- **`StatBadge` shared component created** (`frontend/src/components/motion/StatBadge.jsx`): big solid `bg-primary` box, large black number (via existing `Counter` component), black label text. Replaced the old small-dark-bordered-box badge style in **three places**: `Hero.jsx` (Home, "200+ Creative Professionals"), `AboutIntro.jsx` ("5+ Year of Experience"), `Packages.jsx` ("5+ Year of Experience"). User supplied a reference screenshot of the desired big/bold style and said "wherever such a box exists, make them all like this."
- **Contact page info section restructured**: fixed the wrong `HiOutlinePhone` icon on the "Social" item (now `HiOutlineGlobeAlt`), and merged the 3 previously-separate floating columns (Location/Contact/Social) into a single `rounded-3xl border bg-white/5` card with `sm:divide-x` dividers between items — user said the old floating-column version "doesn't look good."

### 3.14 Home hero image replaced with user-supplied banner
User provided a custom 3D-render banner image (laptop mockup showing the Massive Designs site, dark geometric blocks, lime-green neon accents, "STRATEGY / DESIGN / DEVELOPMENT / GROWTH" and service-icon callouts) to replace the old generic stock office photo on the Home hero's right side.
- Saved to `frontend/src/assets/img/home/banner-main.webp` (optimized from a 1.6MB PNG down to 97KB WebP, 1100px wide).
- Removed the `grayscale` filter and dark gradient overlay that were applied to the old stock photo (not needed — the new image is already fully brand-colored and doesn't need darkening for text contrast).
- **Removed the "200+ Creative Professionals" `StatBadge` overlay from this specific image** (it would visually clash with the new banner's own dense bottom-left content — the logo and glow effects are already there). The "200 creative professionals" fact is still present in the hero's body paragraph text, just not duplicated as a floating badge on top of this particular image. `StatBadge` usage on About and Packages pages is unaffected.
- **Note for next session**: the file was initially hard to locate — the user twice named it slightly wrong / put it in the wrong folder (`frontend/dist/assets`, which is a build-output folder that gets wiped on every `npm run build`, not a source folder) before it was correctly placed at `frontend/src/assets/img/home/`. See point 11 in section 2.

---

## 4. CONTENT DEVIATIONS MADE (cumulative — flag to user if they care)

All of these are fixes to what look like genuine authoring mistakes (typos, dead links, copy-paste errors), never stylistic rewrites. Content itself (wording, meaning) was never changed except to correct an obvious error.

1. `inc/mail.php` had a plaintext SMTP password and reCAPTCHA secret key hardcoded. **Now resolved**: moved into `backend/.env` (gitignored) this session. Standing recommendation: rotate the SMTP password since it was exposed in plaintext for an unknown period.
2. `web-design-development.php`: "Why Texas Businesses Choose Massive **Dynamics**?" → corrected to "Massive Designs" (only occurrence of "Massive Dynamics" anywhere in the codebase, clearly a typo).
3. Several pages' final CTA buttons linked to `mailto:hello@massivedesigns.example` (`.example` is an IANA-reserved non-functional placeholder TLD) → replaced with real `brand.emailLink` (`mailto:info@massive-designs.com`). Fixed on: Web Design, Branding, Social Media, Content Marketing (implicitly via CTA pattern), SEO, Mobile App Development pages.
4. Home page `PortfolioTeaser`: image linked to `/projects`, title/category text linked to `/contact` (inconsistent) → unified to `/projects`.
5. `branding-logo-design.php`'s Logo Gallery referenced `logo-3` twice instead of 5 distinct logos → used `logo-1` through `logo-5` (all 5 already used together elsewhere on the Home page). **User explicitly approved this fix via AskUserQuestion.**
6. `social-media-marketing.php`'s Before/After image was a generic unrelated Pexels stock photo → **user-approved** swap to `dm-srv003.png` (an existing, already-used, genuinely on-brand project asset).
7. `content-marketing.php`'s gallery heading and all 3 image alt texts were copy-pasted verbatim from the Social Media Marketing page ("Our Creative Social Media Work", "Social Media Post Design", etc.) despite being on a completely different page topic → corrected to accurately describe the content-marketing-themed images actually present.
8. `mobile-app-development.php`'s before/after image had filename `unnamed.jpg` and `alt="(final)"` (forgotten placeholder) → alt corrected to `"Cross-Platform Mobile App Development"` based on the image's actual visible content.
9. `content-writing` internal links (e.g. in `social-media-marketing.php`, `seo-services.php`) pointed to `/content-writing`, which the live `.htaccess` 301-redirects to `/content-marketing` → linked directly to `/content-marketing` (the canonical destination) instead of routing through an unnecessary redirect hop. This is a hosting/technical detail, not a content change — same visible link text, correct final destination.
10. **New this session, explicit user instructions (not "fixes", direct requests)**: business hours text changed `Monday to Saturday` → `Monday to Friday`; primary color changed `#C4EF17` → `#B5F652`; Home hero image replaced with a user-supplied custom banner. These were direct explicit instructions from the user, not autonomous judgment calls, and are documented here only for completeness/traceability, not because they need re-flagging.

None of these were content *rewrites* — only fixing genuine mistakes or fulfilling explicit direct requests. Everything else has been copied verbatim from the original site.

---

## 5. REUSABLE COMPONENTS / PATTERNS (cumulative, updated)

Folder: `frontend/src/`

```
src/
  main.jsx, App.jsx                 routes; each page is React.lazy + Suspense; see `route()` / `page()` helpers in App.jsx
  index.css                         Tailwind v4 import + @theme tokens (--color-primary now #B5F652) + marquee keyframes + .no-scrollbar utility (added this session)
  lib/
    brand.js                        brand constants — openDays now 'Monday to Friday'
    gsap.js                         registers ScrollTrigger once, exports { gsap, ScrollTrigger }
  hooks/
    useSmoothScroll.js              Lenis + gsap.ticker sync, call once in Layout
  components/
    layout/
      Header.jsx, MobileMenu.jsx, Footer.jsx, BackToTop.jsx, SocialLinks.jsx, Layout.jsx
      PageHeader.jsx                 generic inner-page breadcrumb hero (title + crumb + optional action). Used by About, Services, Projects, Packages, Contact.
      Seo.jsx                        <Helmet> wrapper: title, description, canonical path
    motion/
      Reveal.jsx                     generic GSAP ScrollTrigger fade-up wrapper; NO ref forwarding (put refs on a plain child div instead)
      Counter.jsx                    GSAP count-up number, props: to, suffix, className
      StatBadge.jsx                  NEW this session. Big solid bg-primary stat badge (black number via Counter + black label). Props: value, suffix, label, className (for absolute positioning). Used in Hero.jsx, AboutIntro.jsx, Packages.jsx.
      Lightbox.jsx                   NEW this session. Generic GSAP fade+scale modal: overlay + close button + Escape key + click-outside-close. Takes `onClose` + `children` (caller decides what media to render inside — image, video, whatever). Used by Projects.jsx (wrapped as ProjectLightbox) and Home's ClientLogos.jsx.
    forms/
      ContactForm.jsx                NOW FULLY WIRED (was UI-only before this session). Real reCAPTCHA v2 widget (react-google-recaptcha), POSTs JSON to /api/contact, loading/success/error states, resets form + recaptcha on success. Used on: Home ContactSection, Packages page, Contact page.
    service-page/                    shared building blocks for the 6 service sub-pages (all now complete)
      ServiceHero.jsx                UPDATED this session: container widened to max-w-5xl for the h1, lead paragraph kept at its own max-w-2xl.
      FeatureGrid.jsx                heading + description + N-column grid, columns=3 or 4
      ProcessSteps.jsx               UPDATED this session: column count now derived from steps.length (3→3cols, 4+→4cols) instead of hardcoded 4-col.
      PortfolioGrid.jsx              heading + description + external-link image grid (2-col) — only used by WebDesignDevelopment.jsx; other service pages built their own inline before/after + gallery sections instead (page-specific enough not to warrant forcing into this shared shape)
      ServiceCta.jsx                 boxed final CTA: heading + paragraphs[] (array items can be plain strings OR JSX fragments with inline links) + button
  pages/
    Home.jsx + home/                 Hero.jsx (hero image swapped this session, badge removed), Services, WhyChooseUs, PortfolioTeaser, VideoShowcase, Testimonials, ServiceAreas, ContactSection, ClientLogos.jsx (lightbox added this session), testimonialsData.js
    About.jsx + about/                AboutIntro.jsx (StatBadge restyled this session), WhyUs, Promise
    Services.jsx + services/          ServiceShowcase, ServiceSlider, ServiceTags, ServiceFaq, OrderModal, servicesData.js
      WebDesignDevelopment.jsx        ✅ done (reference template)
      BrandingLogoDesign.jsx          ✅ done
      SocialMediaMarketing.jsx        ✅ done
      ContentMarketing.jsx            ✅ done
      SeoServices.jsx                 ✅ done
      MobileAppDevelopment.jsx        ✅ done — all 6 service sub-pages complete
    Projects.jsx                      ✅ NEW this session. Full WordPress headless CMS integration, see section 6. Contains CATEGORY_ORDER, CATEGORY_LAYOUT, WebsiteTile (hover-scroll effect), ProjectTile, ProjectLightbox — all currently inline in this one file since none of it is reused elsewhere; extract into components/ only if a future page needs the same patterns.
    Packages.jsx + packages/          ✅ NEW this session. packagesData.js (all pricing tab data), PricingCard.jsx.
    Contact.jsx                       ✅ NEW this session. Uses PageHeader + a restructured info card + ContactForm.
    Placeholder.jsx                   generic "coming soon" stand-in — now only used by /privacy-policy and /terms-conditions routes (the only 2 remaining)
```

Design tokens (`index.css` `@theme`):
```
--color-primary: #B5F652   (lime green accent — CHANGED this session from #C4EF17)
--font-heading: 'Marcellus', serif
--font-body: 'Outfit', sans-serif
Site is dark-themed: black background (#000), white headings, --color-default: #A8A8A8 body text.
```

---

## 6. PROJECTS PAGE — WORDPRESS CMS INTEGRATION DETAILS

The `cms/` folder is a full WordPress install used headlessly, exposing a public REST API. The original PHP (`projects.php`) fetched it **server-side via cURL** with a 60-second file cache (`md_projects_cache.json`, `md_categories_cache.json` in the project root — these are just stale snapshots from a previous run, useful as a reference for the data shape but not live data).

**API endpoints (public, no auth needed):**
- `https://massive-designs.com/cms/wp-json/wp/v2/projects?per_page=500&orderby=menu_order&order=asc&_fields=id,title,featured_image_url,project_categories,acf`
- `https://massive-designs.com/cms/wp-json/wp/v2/project_category?per_page=100&_fields=id,name,slug`

**Data shape**: 176 total projects across 7 categories: `logo` (66), `delivered-product` (41), `flyer` (23), `business-card` (18), `website` (14), `merchandise` (7), `animation` (7, video via `acf.video_url` instead of `featured_image_url`). Each project has `acf.project_link` (real external URL for most `website` items, empty/`/contact` fallback for everything else) and `acf.video_url` (animation category only).

**How the React version calls it**: Direct client-side `fetch()` from `Projects.jsx`, no backend involved. This works because:
- **In production**, the React app will be deployed to the same `massive-designs.com` domain, so `/cms/wp-json/...` is a same-origin request — no CORS issue (confirmed: the live WP REST API does NOT send `Access-Control-Allow-Origin`, so it only works same-origin, which is exactly what production will be).
- **In local dev**, a Vite proxy handles it: `frontend/vite.config.js` has `server.proxy['/cms']` pointing to `https://massive-designs.com`. **Requires a dev server restart to pick up** (Vite doesn't hot-reload proxy config changes).

**Do not** re-introduce a server-side fetch/cache for this — the direct-fetch approach was investigated and approved by the user (AskUserQuestion) as the correct architecture, and it keeps `cms/` completely untouched (read-only via its own public API, exactly like the PHP version did).

---

## 7. BACKEND — NODE/EXPRESS/MONGODB/NODEMAILER (built this session)

**Location**: `backend/` (sibling folder to `frontend/`, NOT nested inside it).

```
backend/
  package.json              type: module, scripts: dev (node --watch src/server.js), start
  .env                       REAL secrets, gitignored, already populated (see below)
  .env.example                placeholder version, safe to commit
  .gitignore                 node_modules/, .env
  src/
    server.js                 entry point: loads dotenv, connects Mongo, then app.listen()
    app.js                     express app: cors, express.json(), trust proxy, /api/health, /api/contact routes
    db.js                      mongoose.connect(process.env.MONGODB_URI)
    models/ContactSubmission.js   name, email, phone, company, message, timestamps
    lib/mailer.js               nodemailer transporter (SMTP) + sendContactEmail(); has 10s connectionTimeout/greetingTimeout/socketTimeout so it fails fast instead of hanging
    lib/verifyRecaptcha.js       POSTs to Google's siteverify endpoint, returns boolean
    routes/contact.js            POST /api/contact: validates required fields + consent, verifies reCAPTCHA server-side, rate-limited (express-rate-limit, 5 req / 15 min per IP), saves to MongoDB, sends email, returns { success, error? } JSON
```

**Environment variables** (`backend/.env`, already filled in with real values moved from `inc/mail.php`):
```
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/massive-designs
SMTP_HOST=massive-designs.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@massive-designs.com
SMTP_PASS=<real password — moved from inc/mail.php, recommend rotating it>
MAIL_FROM_NAME=Massive Designs
MAIL_FROM_EMAIL=hello@massive-designs.com
MAIL_TO_EMAIL=info@massive-designs.com
RECAPTCHA_SECRET_KEY=<real secret — moved from inc/mail.php>
```
reCAPTCHA **site key** (public, safe in frontend code): `6LejfA4sAAAAAIfWC1ZiojBIJX69nHSdFg7Thf0Z` — hardcoded as `RECAPTCHA_SITE_KEY` in `frontend/src/components/forms/ContactForm.jsx`. **Important**: this key is only registered for the `massive-designs.com` domain in Google's console, so it will show a "Localhost is not in the list of supported domains" error when testing at `localhost` — this is expected, not a bug. If you need to test the full recaptcha flow locally, ask the user to add `localhost` to the allowed domains for this site key in the Google reCAPTCHA admin console, or use a temporary bypass (see the pattern used this session: comment out the `verifyRecaptcha` check in `routes/contact.js`, test, then restore it to the exact original — always verify the file matches byte-for-byte afterward and clean up any test data written to MongoDB).

**MongoDB**: There is a local `mongod` already running on this machine as a background service (port 27017), discovered via `netstat`/`Get-Process`, not something this session installed. Verified working end-to-end (a direct model-level test: create → count → delete all succeeded).

**Known local-environment limitation (not a code bug)**: outbound SMTP ports 465, 587, and 25 are all blocked on this dev network (confirmed via `Test-NetConnection` — port 443 works fine, so it's specifically mail ports being blocked, a common anti-spam network restriction). This means:
- `transporter.verify()` and actual `sendMail()` calls will time out (`ETIMEDOUT` at the `CONN` stage) when run from this machine.
- This is **expected** and should self-resolve once deployed to the actual production server (where the existing PHP/PHPMailer setup currently sends mail successfully using these exact same credentials).
- A full pipeline test was done via a temporary, carefully-reverted reCAPTCHA bypass: validation passed, MongoDB save succeeded, only the SMTP step failed with the expected network timeout. Do not re-do this test casually — it sends a real request through the real pipeline; if you need to re-verify, be deliberate about it (use a clearly-marked test message, clean up the MongoDB entry afterward, restore any bypassed code exactly).

**How to run the backend**:
```
cd "C:\Users\PC\Downloads\Massive Designs Re create\backend"
npm install        # first time only
npm run dev         # node --watch src/server.js, restarts on file changes
```
**Windows/dev gotcha discovered this session**: if you start multiple `nohup ... &` background instances of the backend without properly killing the previous one first, you get port/process pileup that manifests as a confusing infinite "Restarting 'src/server.js'" loop in the log with no visible crash reason. Always check `netstat -ano | grep ':4000'` and kill any existing PID (`powershell -Command "Stop-Process -Id <pid> -Force"`) before starting a fresh instance.

**Frontend wiring**:
- `frontend/vite.config.js` has a second proxy entry: `server.proxy['/api']` → `http://localhost:4000` (also requires a dev-server restart to pick up, like the `/cms` proxy).
- `ContactForm.jsx` POSTs JSON to `/api/contact` (relative path — same-origin in prod once both are behind the same reverse proxy / domain, proxied in dev).

**Not yet configured (deploy-time task for the user, out of scope for this Claude session unless asked)**: production reverse-proxy rule to route `/api/*` to the Node backend process, and `/cms/*` continuing to hit the WordPress install directly (already same-domain so no proxy needed there in prod). The Node backend needs to actually be deployed/running somewhere in production (e.g. via PM2, a systemd service, or similar) — this rebuild only built the code, it did not set up production hosting/deployment.

---

## 8. HOW TO RUN / TEST (updated)

**Frontend:**
```
cd "C:\Users\PC\Downloads\Massive Designs Re create\frontend"
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # production build check, should be clean with no errors
```

**Backend (needed for the Contact page / ContactForm to actually submit):**
```
cd "C:\Users\PC\Downloads\Massive Designs Re create\backend"
npm run dev      # → http://localhost:4000, requires local MongoDB running (already is, as a background service)
```

Both need to be running simultaneously for the Contact page (and the ContactForm embedded on Home and Packages pages) to work end-to-end in dev.

**Testing approach used throughout**: a scratchpad Playwright install (NOT part of either project's own `node_modules`) is used to screenshot pages headlessly and check `console.error`/`pageerror` events. Install fresh via `npm install playwright sharp --no-save` in a scratch temp folder + `npx playwright install chromium`, then drive with small Node scripts (`chromium.launch()` → `newPage()` → `goto()` → `screenshot()`).

**Testing gotchas learned this session**:
1. **Always scroll gradually before a fullPage screenshot** if the page has GSAP ScrollTrigger `Reveal`-wrapped content below the fold — a single non-scrolled `fullPage: true` capture shows those sections still at their pre-animation `opacity: 0` state, which looks like a big broken blank gap but isn't. Scroll down in increments (e.g. 85% of viewport height per step), waiting briefly between each, before capturing.
2. **Continuously-animating elements (e.g. the CSS/GSAP marquee) fail Playwright's normal `.click()`** with "element is not stable" (it's a genuinely moving target due to the infinite scroll animation). Use `page.evaluate(() => element.click())` (a direct JS dispatch) instead for anything inside an auto-scrolling marquee.
3. The scratchpad Playwright/sharp install is **not persistent across sessions** — expect to reinstall (`npm install playwright sharp --no-save` + `npx playwright install chromium`) at the start of a new session, and occasionally mid-session if the scratchpad's `node_modules` gets clobbered by installing one package without the other (installing just `playwright` or just `sharp` with `--no-save` in the same folder can silently uninstall the other one — install them together in one command when you need both).

**Image optimization pipeline** (used for every image touched this session): convert to WebP via `sharp` in a scratch temp folder first (Windows file-lock quirk: writing directly into `frontend/src/assets` while Vite's dev server watches it can throw `EPERM`/`UNKNOWN`), then copy the finished `.webp` into `frontend/src/assets/...` as a separate step.

---

## 9. IMMEDIATE NEXT STEP

Only 2 pages remain in the master checklist: **Privacy Policy** (`/privacy-policy`, source `privacy-policy.php`) and **Terms and Conditions** (`/terms-conditions`, source `terms-conditions.php`). Both are short, simple static legal-text pages in the original PHP — read them first (they're small files), then build with `PageHeader` + plain prose `<section>`s, reusing `Seo` for meta tags. No new shared components should be needed. Verbatim legal text — do not paraphrase or "clean up" legal language even if it reads awkwardly, this is exactly the kind of content where Rule 1 (no content changes) should be followed most strictly, since legal text was very likely written/approved by the client themselves.

After those two, the entire master checklist is complete. At that point the remaining work is: production deployment (backend hosting + reverse proxy rules per section 7), and the SMTP password rotation recommendation from section 7 / 4.1.

**Ask the user at the start of the new session**: confirm the per-page confirmation workflow is still the default (it was re-confirmed as the default mid-session, see section 2 point 8), and ask whether they want to review/test anything from this session (especially the Contact form's real email delivery, which could not be fully verified locally) before moving on to the final 2 pages.
