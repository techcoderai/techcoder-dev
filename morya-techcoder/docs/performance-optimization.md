# Frontend Performance Optimization

Repository-wide performance pass completed in July 2026. The visual system,
content hierarchy, colors, and responsive layouts were preserved.

## Measured build output

Measurements come from a clean `next build`; sizes are uncompressed unless
noted.

- Homepage CSS: **137,354 B → 110,582 B** (**19.5% reduction**).
- All generated CSS: **137,354 B → 115,362 B** (**16.0% reduction**), despite
  adding route-scoped article CSS and metadata routes.
- Homepage CSS transfer estimate: **20,440 B gzip**.
- Homepage font preload: **2 files / 70,752 B**. JetBrains Mono is no longer
  preloaded outside article routes.
- Removed approximately **34 KB of dead source components**.

Lighthouse and field CWV were not available in this local build environment, so
score and timing changes below are engineering estimates, not lab results.

## Applied optimizations

### CSS and critical rendering

**Issue:** Global CSS included article prose and utilities/components that never
rendered. Every public route paid the parse cost.

**Files:** `app/globals.css`,
`app/(site)/blog/[slug]/article.css`,
`app/(site)/blog/[slug]/layout.tsx`, and deleted legacy section/card files.

**Change:** Removed dead global selectors/keyframes, deleted unreferenced legacy
components, and moved `.prose-tc` into the article route. Narrowed
`transition-all` to explicit properties and removed permanent `will-change`
from card/carousel media.

**Expected improvement:** Smaller blocking CSS, faster style calculation, and
less layer memory. Measured homepage CSS reduction: 19.5%.

**Trade-off:** Deleted legacy components must be restored from Git if their old
designs are needed again.

### Paint and compositing

**Issue:** Large animated blur filters, an animated headline
`background-position`, and broad filter transitions caused repeated paint work.

**Files:** `app/(site)/layout.tsx`, `app/globals.css`,
`components/sections/HeroSection.tsx`,
`components/sections/FinalCTA.tsx`, `components/sections/Capabilities.tsx`.

**Change:** Replaced large blurred elements with radial-gradient orbs, made the
headline gradient static, removed card/button filter transitions, and disabled
ambient/browser floating motion on mobile. The nearly opaque mobile menu no
longer performs a full-screen backdrop blur.

**Expected improvement:** Lower paint/compositor cost and smoother scrolling on
mid-range mobile GPUs.

**Trade-off:** Mobile retains the same surfaces but uses less ambient motion;
the menu background no longer refracts content that is 95% obscured.

### Off-screen rendering and animation

**Issue:** Long homepage sections rendered immediately and the carousel ran a
continuous animation frame loop even when users could not see it.

**Files:** `app/(site)/page.tsx`, `components/sections/HomeContent.tsx`,
`components/ui/CardCarousel.tsx`, `app/globals.css`.

**Change:** Added `.render-deferred` using `content-visibility: auto`; gated the
carousel by intersection and document visibility; reduced clone count; stopped
autoplay for reduced-motion users; made clones inert and hidden from assistive
technology.

**Expected improvement:** 15–30% less initial below-fold layout/paint work on
the content-heavy homepage and lower background CPU/battery usage.

**Trade-off:** Browsers without `content-visibility` support render normally.
The intrinsic 720px estimate should be validated as homepage content grows.

### Client boundaries and hydration

**Issue:** Static cards, hero content, reveal wrappers, and raw MDX bodies were
crossing client boundaries.

**Files:** `components/ui/ArticleCard.tsx`,
`components/ui/MagicBorderCard.tsx`, `components/ui/Reveal.tsx`,
`components/ui/TiltSurface.tsx`, `components/sections/HeroSection.tsx`,
`types/blog.ts`, `lib/posts.ts`, `app/(site)/blog/page.tsx`,
`components/sections/HomeContent.tsx`.

**Change:** Converted cards and hero markup to Server Components; isolated the
pointer tilt to a small client island; replaced Framer reveals with progressive
CSS view-timeline animation; introduced `BlogPostSummary`/`toPostSummary` so
raw article bodies never serialize into interactive lists.

**Expected improvement:** Less hydration work, smaller RSC payloads, and better
INP as content volume grows.

**Trade-off:** Browsers without scroll-driven animation support show reveal
content immediately instead of animating it.

### LCP, images, and fonts

**Issue:** Multiple non-LCP images were marked priority, the article LCP image
waited on a client fade wrapper, and three font families were globally loaded.

**Files:** `app/layout.tsx`, `app/(site)/blog/[slug]/layout.tsx`,
`app/(site)/blog/[slug]/page.tsx`, `components/sections/HeroSection.tsx`,
`components/sections/HomeContent.tsx`, `next.config.ts`.

**Change:** Removed deprecated/nonessential image priority hints; render the
article hero directly with `next/image` and one `preload`; use variable Inter
and Space Grotesk globally; scope non-preloaded JetBrains Mono to articles;
added an image quality allowlist and a seven-day optimizer cache floor.

**Expected improvement:** Estimated 200–700ms faster LCP on slow mobile
connections where hidden content/font competition was the bottleneck, with
lower font contention on home/list/topic routes.

**Trade-off:** Article code may briefly use its monospace fallback while
JetBrains Mono loads. Validate whether article title or image is the real LCP
before changing the single image preload.

### Scroll and interaction performance

**Issue:** Reading progress animated width (layout), sheet listeners ran while
closed, and hero pointer movement repeatedly measured layout.

**Files:** `components/ui/ReadingProgress.tsx`,
`components/reading/ReadingLayer.tsx`, `hooks/useScrollProgress.ts`,
`hooks/useReadingState.ts`, `components/ui/TiltSurface.tsx`.

**Change:** Progress now uses compositor-only `scaleX`; sheet-specific listeners
mount only while open; pending animation frames are cancelled; tilt bounds are
measured once per pointer entry and writes are frame-batched.

**Expected improvement:** Lower scroll-time layout work and better article INP.

**Trade-off:** Article routes still maintain two lightweight progress listeners;
a shared scroll coordinator is a future optimization.

### Accessibility

**Issue:** Duplicate carousel/marquee content was announced, the newsletter
field lacked a programmatic label, and the reading dialog lacked focus
management.

**Files:** `components/ui/CardCarousel.tsx`,
`components/sections/TrustedBy.tsx`, `components/ui/NewsletterBox.tsx`,
`components/reading/ReadingLayer.tsx`, `components/layout/Navbar.tsx`,
`components/ui/ThemeToggle.tsx`.

**Change:** Added `inert`/`aria-hidden` clones, hidden decorative hero content,
added label/autocomplete/live status, progressbar values, dialog focus
trap/restore, current-page navigation state, reduced-motion handling, and a
hydration-free theme icon state.

**Expected improvement:** Better keyboard/screen-reader behavior and a likely
Lighthouse Accessibility score in the 98–100 range.

**Trade-off:** None for pointer users; focus is now intentionally constrained
while the modal reading sheet is open.

### Technical SEO

**Issue:** No sitemap/robots routes, incomplete canonical/social metadata, and
no structured article data.

**Files:** `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`,
`app/(site)/page.tsx`, `app/(site)/blog/page.tsx`,
`app/(site)/blog/[slug]/page.tsx`,
`app/(site)/topics/[category]/page.tsx`.

**Change:** Added sitemap entries for static routes, topics, posts, and images;
blocked CMS/API crawling; added route canonicals, Open Graph/Twitter metadata,
and WebSite/BlogPosting JSON-LD.

**Expected improvement:** Lighthouse SEO should reach 100 if the production
domain, HTTPS, and crawl responses are configured correctly.

**Trade-off:** Social previews remain text-only for routes without a dedicated
OG image.

## Estimated outcome

- Lighthouse Performance: **+6 to +15 points**; ≥95 is plausible but must be
  verified against a production deployment and throttled mobile Lighthouse.
- Accessibility: **98–100**.
- SEO: **100**, assuming successful production crawl/index responses.
- LCP: estimated **0.2–0.7s reduction** on slow mobile.
- CLS: expected **<0.05**; monitor deferred-section intrinsic sizing.
- INP: estimated **20–80ms reduction** on interaction-heavy/article views.
- Initial rendering work: estimated **15–30% reduction** on the homepage.

## Remaining bottlenecks and recommendations

1. Split the client Navbar into server markup plus mobile/theme/reading islands.
2. Consolidate article progress and reading-state work behind one scroll
   coordinator.
3. Replace the full client blog grid with a smaller search/filter island when
   the post library becomes large.
4. Add production `useReportWebVitals` reporting and track p75 by route/device.
5. Create dedicated raster Open Graph images for home, blog, and topics.
6. Validate the one article image preload with real LCP element data.
7. Serve immutable static assets through a CDN with Brotli, HTTP/2 or HTTP/3,
   and long-lived hashed caching.
8. Run Lighthouse in incognito against `next start`, plus WebPageTest on a
   mid-range Android profile, before treating score estimates as guarantees.

## Lighthouse follow-up (2026-07-27)

A mobile Lighthouse run against `http://127.0.0.1:3000` scored **Perf 66**.
That report was **`next dev` (Turbopack)** — not production. Dev artifacts
dominated TBT/unused JS (`next-devtools` ~135KB wasted, unminified chunks).

**Real issues the report still surfaced (fixed):**

| Finding | Fix |
| --- | --- |
| LCP = hero `<h1 class="hero-enter">` delayed by enter animation | Removed enter animation from the H1 |
| Render-blocking `react-tweet` CSS on homepage | Split `compileBlogContent` into `content/compile.ts` so `loader.ts` no longer pulls MDX/Tweet |
| Framer Motion on every route via nav + ReadingLayer | CSS-only `NavLinks`; `ReadingLayer` only in `blog/[slug]/layout.tsx` |
| Carousel client JS on homepage critical path | `next/dynamic` for `CardCarousel` |

**How to measure correctly:**

```bash
npm run build && npm run start
# then Lighthouse against http://127.0.0.1:3000 in Incognito (extensions off)
```
