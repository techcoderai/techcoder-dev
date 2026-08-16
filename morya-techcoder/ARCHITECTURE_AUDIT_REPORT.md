# TechCoder Repository Architecture Audit

**Review type:** Repository-wide engineering audit of AI-generated or AI-modified code  
**Review date:** 2026-08-16  
**Scope:** Next.js App Router, React, TypeScript, Tailwind CSS, MDX, Keystatic, SEO, accessibility, security, performance, maintainability  
**Application changes made during audit:** None

## Executive Summary

1. The home page's LCP element is prerendered invisible. The hero `h1` ships with `opacity: 0` and a translated transform, then depends on Framer Motion hydration before becoming visible. This is the most damaging mobile performance finding.
2. The blog index prerenders zero article markup. `useSearchParams()` inside a client component causes the main listing subtree to be client-rendered behind an empty `Suspense` boundary.
3. Keystatic's local file-write API is deployed to production without an application-level environment guard. The production build contains both `/keystatic` and `/api/keystatic/[...params]` as dynamic routes.
4. Custom CSS classes in `globals.css` are unlayered while Tailwind utilities are layered. The unlayered component rules override utilities, so written responsive classes and variants do not reliably determine the rendered result.
5. Two large, blurred, infinite animations run on every public route. They are decorative but can impose sustained compositor and GPU work on mobile devices.
6. Full raw MDX bodies are included in `BlogPost` objects passed into client components. This is small today but scales linearly with post count and is unnecessary for listing pages.
7. `MagicBorderCard` is a client component with no client behavior. It creates an avoidable client boundary and contains a `Date.now()` freshness check that can disagree between build and hydration.
8. Technical publication SEO infrastructure is incomplete: no sitemap, robots metadata, JSON-LD, canonical URLs, article metadata fields, or complete Open Graph/Twitter metadata.
9. Testimonials, publication counts, learning-path counts, and newsletter success messaging are not connected to real data. The testimonials appear fabricated and the newsletter form discards submitted email addresses.
10. The content architecture has strong foundations: server-only filesystem access, a single category registry, route-group isolation, static article generation, and a small MDX component library.

## Architecture Assessment

| Area | Score | Assessment |
|---|---:|---|
| Architecture | 6/10 | Strong content boundary, category registry, route groups, and CMS choice. Client/server boundaries are too broad and some data access is scattered into presentation components. |
| Performance | 4/10 | Invisible LCP content, large client payloads, continuous blurred animations, unthrottled progress updates, and excessive font files. |
| React / Next.js | 5/10 | Good SSG and server MDX compilation, but the blog index is effectively client-rendered and several components are unnecessarily client-side. |
| TypeScript | 7/10 | Strict mode and no `any`; frontmatter casts and dynamic icon casts hide unvalidated input. |
| CSS | 4/10 | Useful tokens and themes, but cascade-layer ordering causes systematic utility overrides and there is dead CSS. |
| SEO | 3/10 | Missing sitemap, robots, JSON-LD, canonical metadata, complete social metadata, and crawlable blog-index markup. |
| Accessibility | 4/10 | Semantic structure and focus rings are present, but contrast, reduced motion, menu focus management, tabs, and invisible keyboard controls need work. |
| Security | 3/10 | Production Keystatic exposure is the dominant concern; no application security headers are configured. |
| Maintainability | 6/10 | Good naming and documentation, but fixture-heavy components, duplicated motion systems, dead code, and generated self-assessment documentation add noise. |

## Architecture Map

### Intended conceptual structure

```text
Page composition (app/)
  -> Section components (components/sections/)
  -> UI primitives and client islands (components/ui/, hooks/)
  -> Content logic (lib/)
  -> Content loader (content/loader.ts)
  -> MDX files and Keystatic
```

### Actual structure

```text
app/layout.tsx
  -> fonts, theme script, global CSS

app/(site)/layout.tsx
  -> Navbar (client, Framer Motion)
  -> fixed animated background layers
  -> Footer (server)

app/(site)/page.tsx
  -> HeroSection (client, Framer Motion, pointer tilt)
  -> ProductShowcase (client, tabs, Framer Motion)
  -> FAQ (client, accordion, Framer Motion)
  -> Reveal wrappers around multiple sections
  -> HomeContent (server, loads all posts)
  -> MagicBorderCard (client despite no client behavior)

app/(site)/blog/page.tsx
  -> Suspense without fallback
  -> BlogListContent (client, useSearchParams, receives all posts)

app/(site)/blog/[slug]/page.tsx
  -> server SSG page
  -> compileBlogContent() with next-mdx-remote/rsc
  -> ReadingProgress (client, scroll listener)
  -> TableOfContents (client, IntersectionObserver)
  -> related MagicBorderCard cards

app/keystatic/[[...params]]/page.tsx
  -> public client admin UI

app/api/keystatic/[...params]/route.ts
  -> public dynamic local filesystem API
```

### Main architectural differences

- The repository follows the intended content/presentation split for filesystem access, but section components import the content loader directly.
- The public site has 15 client components. Several are client-side only because of animation or because a visual card was marked client-side, not because the UI requires interactivity.
- The blog route is reported as static by the build, but its main list is not present in prerendered article markup.
- `BlogPost` is used for both summary cards and detail pages, allowing raw article bodies to cross client boundaries.
- `getCategories()` lives in `content/loader.ts`, while other post queries live in `lib/posts.ts`.

## Critical Issues

### C1. Keystatic local write API is deployed to production

**Current behavior:** `app/api/keystatic/[...params]/route.ts` unconditionally exports `makeRouteHandler({ config })`, while `keystatic.config.ts` uses `{ kind: "local" }`. The build reports the API as a dynamic production route.

**Why it was probably implemented this way:** It follows the Keystatic local-development integration and works correctly during `npm run dev`.

**Is it a problem:** Yes. Inspection of `@keystatic/core@0.5.50` shows the local storage branch has no `NODE_ENV` guard. Its local handler serves `tree`, `blob`, and `update` operations.

**Risk:** On a writable deployment, anonymous users may be able to update or delete content and upload files. On read-only platforms, the admin UI and directory/file read endpoints may still be exposed.

**Severity:** Critical. Fix now.

**Recommended solution:** Gate both the admin page and API route behind an explicit production environment condition, returning `notFound()` or a 404 unless a deliberate enablement variable is set. Use authenticated GitHub storage before enabling remote production editing.

**Basis:** Actual repository/build evidence and inspected dependency implementation.

### C2. Hero LCP content is prerendered with `opacity: 0`

**Current behavior:** `HeroSection.tsx` applies Framer Motion `initial={{ opacity: 0, y: ... }}` to the badge, headline, subtitle, CTAs, and code preview. The built HTML contains the hero `h1` with inline `opacity:0`.

**Why it was probably implemented this way:** Entrance animations are a common Framer Motion pattern and look correct when hydration is fast.

**Is it a problem:** Yes. The LCP candidate is not visible in initial HTML and depends on JavaScript hydration plus animation delay.

**Risk:** Delayed or missing LCP on slower mobile devices; a JavaScript failure leaves the primary message invisible.

**Severity:** Critical. Fix now.

**Recommended solution:** Render above-the-fold text and CTAs statically. Keep motion for below-the-fold or decorative elements only, and ensure the reduced-motion path is visible immediately.

**Basis:** Built artifact evidence and established browser rendering behavior.

### C3. Blog index has no prerendered article markup

**Current behavior:** `BlogListContent.tsx` is a client component using `useSearchParams()`. `blog/page.tsx` wraps it in `Suspense` with no fallback. The generated `blog.html` contains zero `<article>` elements.

**Why it was probably implemented this way:** The Suspense wrapper satisfies Next.js requirements for `useSearchParams()` while preserving query-string filtering.

**Is it a problem:** Yes. The primary article discovery page requires client rendering.

**Risk:** Weaker crawlability, delayed internal-link discovery, blank initial content, and unnecessary JavaScript work.

**Severity:** Critical for a publication. Fix now.

**Recommended solution:** Read category/search parameters on the server and render the article grid server-side. Keep only the interactive text-search control as a small client island, or introduce category routes such as `/blog/category/[category]`.

**Basis:** Generated HTML inspection and Next.js rendering behavior.

### C4. CSS cascade layers cause custom classes to override Tailwind utilities

**Current behavior:** Custom rules such as `.card-surface`, `.chip`, `.heading-xl`, and `.section-padding` are written outside `@layer`, while Tailwind utilities are emitted inside `@layer utilities`.

**Why it was probably implemented this way:** In older Tailwind/CSS usage, placing custom CSS after the import commonly suggested that later rules would win.

**Is it a problem:** Yes. Unlayered rules have precedence over layered rules. Examples include `rounded-[26px]` losing to `.card-surface`'s `border-radius: 24px`, responsive text utilities losing to `.heading-xl`, and gradient/text utilities losing to `.chip` shorthands.

**Risk:** Source code no longer describes rendered behavior. Future fixes may lead to `!important` escalation and inconsistent responsive styling.

**Severity:** Critical for maintainability. Fix now.

**Recommended solution:** Put custom component rules in `@layer components`, then remove redundant utilities or deliberately define ownership of radius, padding, font sizing, and colors.

**Basis:** Built CSS byte-offset inspection and CSS Cascade Layers behavior.

## High Priority

### H1. Infinite blurred background animations on every route

`app/(site)/layout.tsx` runs `animate-pulse-glow` and `animate-float-slow` on large blurred fixed elements. `FinalCTA` adds another large animated blur. The navbar also uses `backdrop-filter: blur(28px) saturate(180%)`.

- **Current:** Continuous opacity/scale/translation animation on heavily blurred layers.
- **Risk:** Sustained GPU/compositor load, battery drain, and mobile scroll jank.
- **Severity:** High; fix soon.
- **Recommended:** Use static radial gradients or opacity-only animation; never scale heavily blurred layers. Reduce or remove the effect on article pages and smaller viewports.
- **Basis:** Repository evidence and established rendering practice.

### H2. Reading progress performs layout work and React updates on every scroll event

`useReadingProgress.ts` reads scroll dimensions in an unthrottled listener, calls `setProgress()` for every event, and `ReadingProgress.tsx` animates `width`.

- **Risk:** Main-thread work, repeated React renders, layout-triggering width changes.
- **Severity:** High; fix soon.
- **Recommended:** Use a passive rAF-coalesced handler writing a ref and animate `transform: scaleX()` with `transform-origin: left`.
- **Basis:** Direct code inspection and established scroll-performance practice.

### H3. `MagicBorderCard` is unnecessarily client-side

The component has no hooks or event handlers; all interaction is CSS hover. It also computes `Date.now()` during render.

- **Risk:** Extra client boundary, larger RSC payload, and possible build/hydration mismatch around the seven-day “New” badge.
- **Severity:** High; fix now.
- **Recommended:** Remove `"use client"`; compute freshness deterministically during server rendering or in the loader, and use `slug` as the stable identity.
- **Basis:** Direct component inspection and build/hydration behavior.

### H4. Raw MDX bodies cross client boundaries

`BlogPost.body` is included in the objects passed to `BlogListContent`, even though list cards never use it. The current nine posts contain about 14.4 KB of raw body text, and the cost grows with every post.

- **Risk:** Larger HTML/RSC payloads and client serialization as the publication grows.
- **Severity:** High architecturally; medium present-day impact. Fix now.
- **Recommended:** Split the contract into `PostSummary` and `PostDetail`, and expose summaries to list pages.
- **Basis:** Actual type/data flow and measured current content size.

### H5. Framer Motion ignores the reduced-motion preference

The CSS reduced-motion block affects keyframes and transitions, but Framer Motion animations remain active: hero entrances, `Reveal`, pointer tilt, tab transitions, FAQ animation, and mobile-menu motion.

- **Risk:** Vestibular discomfort and failure to honor an explicit accessibility preference.
- **Severity:** High accessibility issue; fix soon.
- **Recommended:** Add `MotionConfig reducedMotion="user"` around the public site and gate pointer tilt with `useReducedMotion()`.
- **Basis:** Actual animation inventory and library behavior.

### H6. Light-theme secondary text fails WCAG AA

`--tc-text-light: #9CA3AF` on white has approximately 2.54:1 contrast and is used for dates, metadata, eyebrows, and other meaningful text.

- **Risk:** Users with low vision may not be able to read article metadata and navigation context.
- **Severity:** High; fix soon.
- **Recommended:** Use a darker token for text and reserve the lighter value for decorative marks only.
- **Basis:** Repository token usage and contrast calculation.

### H7. Technical SEO infrastructure is incomplete

There is no `sitemap.ts`, `robots.ts`, JSON-LD, canonical metadata, `metadata.title.template`, complete Open Graph metadata, Twitter card metadata, author metadata, or article publication timestamps. Article OG dimensions are hardcoded to 800x450.

- **Risk:** Weaker indexing, sharing previews, canonicalization, and publication rich-result eligibility.
- **Severity:** High for a publication; fix soon.
- **Recommended:** Add sitemap/robots, canonical URLs, complete article metadata, `BlogPosting` and `WebSite` JSON-LD, and correct social image metadata.
- **Basis:** Actual repository absence and metadata inspection.

### H8. Fabricated social proof and non-functional newsletter

`Testimonials.tsx` contains named people, roles, and quotes without a backing data source. The UI claims 500+ articles, 320+ guides, 1,200+ snippets, and thousands of readers while the repository contains nine posts. `NewsletterBox` accepts an email, discards it, and displays “You’re in! Check your inbox.”

- **Risk:** User trust, legal/compliance exposure, and misleading collection of personal data.
- **Severity:** High; fix before real traffic.
- **Recommended:** Remove unverified testimonials and counts, derive truthful numbers or remove them, and either connect the form to a provider or present an honest coming-soon state.
- **Basis:** Direct content and form behavior evidence.

## Medium Priority

| ID | Finding | Recommendation | Basis |
|---|---|---|---|
| M1 | Three font families load 16 font files and about 356 KB; several requested weights are unused. | Reduce weights and preserve only the typography actually used. | Built asset inventory and class usage. |
| M2 | `@theme` restates font stacks instead of referencing next/font variables, weakening metric-adjusted fallback behavior. | Reference the generated variables in the Tailwind theme mapping. | Built CSS inspection and next/font behavior. |
| M3 | `TableOfContents` mounts and observes headings on mobile while its parent is `hidden lg:block`. | Render conditionally or add a deliberate mobile reading-control experience. | Component tree and CSS behavior. |
| M4 | CSS keyframes and Framer Motion both implement entrance/reveal animation. | Use CSS for cheap reveal effects and reserve Framer Motion for interactions that need it. | Repository animation inventory. |
| M5 | TrustedBy duplicates marquee content without marking the duplicate set `aria-hidden`; it runs off-screen forever. | Hide duplicate content from assistive technology and pause or remove when not visible. | DOM and animation inspection. |
| M6 | `InfoCard` namespace-imports all Lucide icons and uses a double cast for string lookup. | Use an explicit allow-list map of supported icons. | Actual import and type assertions. |
| M7 | Frontmatter category, difficulty, tags, and dates are cast or defaulted without validation. | Validate the YAML boundary and fail clearly on malformed content. | Loader implementation. |
| M8 | Module-level `blogPosts = loadPosts()` may prevent Keystatic edits from appearing without a dev-server restart. | Re-read content in development or provide an explicit cache invalidation strategy. | Loader initialization and Keystatic workflow. |
| M9 | No branded `not-found.tsx`, `error.tsx`, or `global-error.tsx` exists. | Add a branded not-found page and error boundary; leave `loading.tsx` absent unless a real async boundary is introduced. | Route tree inventory. |
| M10 | Mobile menu lacks dialog semantics/focus trap; tabs lack complete ARIA relationships; FAQ lacks `aria-controls`. | Complete keyboard and focus behavior or simplify to native semantic controls. | Custom interaction inspection. |
| M11 | Code copy and heading-link controls are invisible on keyboard focus because they rely on hover opacity. | Add focus/focus-within visibility states. | CSS and keyboard behavior. |
| M12 | No security headers are configured in `next.config.ts`. | Add a considered CSP, Referrer-Policy, X-Content-Type-Options, and Permissions-Policy; account for the inline theme script. | Configuration inventory and security practice. |
| M13 | `BlogPost.id` is an index-derived identity that changes when files are added; `slug` is already stable. | Delete `id` and use `slug` for keys and related-post exclusion. | Loader and query implementation. |

## Low Priority

- Remove unused CSS classes and keyframes: `border-glow`, `noise`, `animate-spin-slow`, `animate-blink`, `animate-float-delay-2`, `animate-fade-in`, `container-narrow`, `btn-ghost`, `theme-transition`, `animate-delay-5`, and `animate-delay-6`.
- Remove or implement the unused `coverImage` field. Several existing values point at `/images/blog/*.jpg`, which is not present in `public/`.
- Remove the unused `BlogCategory` re-export from `types/blog.ts`.
- Remove unused Next.js starter assets and unreferenced logo files after confirming they are not part of external deployment configuration.
- Add an `engines` field if `.npmrc` is intended to enforce a Node version; otherwise remove `engine-strict=true`.
- Resolve the two `!my-0` Tailwind overrides after correcting cascade layers.
- Replace `post.updated!` with a narrowed local value.
- Consolidate generated or stale review/debug documentation. `ARCHITECTURE_REVIEW_SUMMARY.md` claims zero technical debt and production readiness despite missing issues identified here.
- Add safe handling for external MDX links if the content model permits them.

## AI-Generated Code Smells

1. `void categoryOptions;` exists only to keep an otherwise unused import alive. It is documentation-by-dead-code.
2. Comments justify hypothetical future reuse for hooks and helpers that have one caller and no tests.
3. `getFeaturedPosts(posts, count = 3)` is an abstraction over `slice(0, count)` while “featured” currently means newest.
4. Loader branches support legacy `.md` twins and folder-based `index.mdx` layouts that the current repository and Keystatic configuration do not use.
5. `ARCHITECTURE_REVIEW_SUMMARY.md` is an overconfident generated self-assessment that missed security, rendering, and CSS defects.
6. `BlogPost.id` is a synthetic numeric identity where `slug` is already the stable natural key.
7. Large amounts of marketing fixture data are embedded in UI components rather than represented as verified content data.
8. Repeated section-heading comments such as “Logo”, “Actions”, “Results”, and “Tags” add narration without clarifying behavior.
9. The `K`, `F`, `S`, and `C` syntax-token helpers are duplicated between `HeroSection.tsx` and `ProductShowcase.tsx`.
10. `Icons[icon as keyof typeof Icons] as React.ElementType` uses type assertions to silence an unsafe dynamic lookup.
11. `MagicBorderCard` has a visual-effect name, but the corresponding `border-glow` class is not used; the component is a standard post card.

## Things That Are Already Good

1. `lib/categories.ts` is a strong single source of truth. The category type, ordering, colors, and Keystatic options derive from one registry.
2. `content/loader.ts` owns filesystem access and imports `server-only`; UI components do not access `fs` directly.
3. `content/mdx-components.tsx` is a clean single map from MDX tags to rendering components.
4. The MDX component library is small, focused, documented, and server-rendered by default. `Tabs` is correctly client-side because it owns interaction state.
5. Git-based Keystatic is a sensible CMS for a solo founder: versioned content, no database, and no vendor lock-in.
6. The `(site)` route group cleanly keeps public navigation and footer away from the admin UI.
7. The pre-paint theme script, dark-mode token design, and `ThemeToggle` initialization are conceptually sound.
8. `generateStaticParams` and server-side MDX compilation correctly produce static article pages.
9. TypeScript strict mode is enabled and no `any` usage was found in the application source.
10. Next Image usage on cards and article hero images has appropriate dimensions and responsive `sizes` in the inspected paths.

## Scroll Performance Audit

| Location | Mechanism | Frequency | Main-thread work | Risk |
|---|---|---|---|---|
| `hooks/useReadingProgress.ts` | Passive `scroll` and `resize` listeners | Every scroll event | Reads scroll dimensions, calls React state update, drives width style | High |
| `components/layout/Navbar.tsx` | Passive scroll listener | Every scroll event | Reads `scrollY`; state changes only around the threshold | Low |
| `hooks/useActiveHeading.ts` | IntersectionObserver | Heading boundary changes | Sorts visible entries and updates active heading | Low, but wasted when hidden on mobile |
| `components/ui/Reveal.tsx` | Framer Motion `whileInView` observers | Once per reveal | Mount-time observer setup and animation | Low to medium |
| `app/(site)/layout.tsx` | Infinite CSS blur animations | Continuous | Re-rasterizes large blurred surfaces under scale/translation | High |
| `components/layout/Navbar.tsx` | Fixed `backdrop-filter` | During scroll/compositing | Refilters content behind the navbar | High on mobile |
| `components/sections/TrustedBy.tsx` | Infinite marquee transform | Continuous, including off-screen | Composited transform | Medium |
| `globals.css` gradient text | Infinite background-position animation | Continuous | Text-layer repaint | Medium |
| `HeroSection.tsx` pointer tilt | Motion values and springs | Pointer movement, then settling | Spring animation loop | Low, desktop only |

### Shared scroll coordinator decision

A shared coordinator is **not necessary now**. There are only two direct scroll listeners, and they do different work. The dominant costs are the unthrottled reading-progress update, width animation, fixed backdrop blur, and continuously animated blurred backgrounds. Fix those local issues first. Reconsider a coordinator only if several more independent scroll consumers are added.

## Motion and Interaction Audit

| Animation | Category | Trigger | Properties | Continuous/off-screen | Reduced-motion handling |
|---|---|---|---|---|---|
| Hero text/CTA entrance | Unnecessary on LCP | Mount | Opacity, translateY | No | Framer Motion ignores CSS preference |
| Hero code-panel entrance | Helpful polish | Mount | Opacity, translateY | No | Not handled by MotionConfig |
| Hero pointer tilt | Decorative | Pointer movement | rotateX/rotateY springs | Settles after movement | Not handled |
| Hero floating cards | Decorative | Mount plus CSS loop | Opacity, scale, translateY | Yes | CSS loop only |
| Ambient glow layers | Unnecessary | Always | Opacity, scale, translate | Yes and off-screen | CSS reduced-motion works |
| Navbar morph | Essential UX | Scroll threshold | Height, padding, background | No | CSS transition only |
| Mobile menu | Essential UX | Click | Opacity, translateY | No | Framer Motion preference not configured |
| `Reveal` | Helpful polish | IntersectionObserver | Opacity, translateY | Once per item | Not handled |
| CSS fade-up | Helpful polish | Mount | Opacity, translateY | No | CSS reduced-motion works |
| Marquee | Decorative | Always | translateX | Yes and off-screen | CSS reduced-motion works |
| Animated gradient text | Decorative | Always | background-position | Yes | CSS reduced-motion works |
| Product tabs | Helpful polish | Click | Layout spring, opacity, translateY | No | Not handled |
| FAQ accordion | Essential UX | Click | Height, opacity, rotation | No | Not handled |
| Card hover lift | Helpful polish | Hover | Transform, box-shadow | No | CSS reduced-motion works |
| Reading progress | Essential UX | Scroll | Width | Every event | Transition is reduced but state work remains |

The motion vocabulary is coherent; placement and cost are the problems. Do not remove all motion. Remove it from LCP text, honor reduced motion in Framer Motion, avoid scaling blurred surfaces, and consolidate CSS/Framer reveal systems.

## Component Architecture Verdict

### Keep

- `lib/categories.ts`
- The `server-only` boundary and overall content-loader responsibility
- `content/mdx-components.tsx`
- Focused MDX components such as `Callout`, `Steps`, `FileTree`, `Terminal`, `Badge`, `Table`, `MdxImage`, `YouTube`, and `Tweet`
- `DifficultyBadge`, `Footer`, `SectionHeading`, and the overall article-page structure
- The theme token architecture and `(site)` route group
- Keystatic as the content-management choice

### Refactor

- `MagicBorderCard`: make it a server component and rename it to a truthful `PostCard` if desired.
- `BlogListContent`: move filtering inputs to the server and keep only small interaction islands client-side.
- `HeroSection`: remove entrance animation from LCP text and extract or verify fixture data.
- `(site)/layout.tsx`: reduce decorative blur and continuous animation.
- `ReadingProgress` and `useReadingProgress`: use rAF plus `scaleX` and avoid React state per scroll event.
- `Navbar`: add mobile dialog semantics and focus management.
- `InfoCard`: replace dynamic namespace icon lookup with an explicit map.
- `Tabs` and ProductShowcase tabs: complete keyboard and ARIA behavior.

### Merge

- The duplicated syntax-token helpers in `HeroSection.tsx` and `ProductShowcase.tsx`.
- Category retrieval into the same content-query module as other post retrieval, if that improves the boundary.
- Duplicated repository instruction/documentation files after confirming their intended consumers.

### Delete when verified

- Generated self-assessment and stale debugging documents.
- `BlogPost.id`, unused `coverImage`, the unused category re-export, and `void categoryOptions`.
- Dead CSS and starter assets.
- Testimonials until real, consented testimonials exist.
- `getFeaturedPosts` if “featured” remains equivalent to newest posts.

### Split

- `BlogPost` into summary and detail contracts.
- Marketing/site data from UI components into a content/data module.
- `Capabilities.tsx` only if its distinct card layouts continue to grow; it is not currently a critical God component.

## Error Handling and Content Boundaries

- Missing slugs correctly call `notFound()`, but the result uses the default Next.js 404 because no branded `not-found.tsx` exists.
- There are no route-level error boundaries for rendering or MDX failures.
- Missing images silently render empty card placeholders or no article hero; there is no development-time asset validation.
- Frontmatter values are parsed with permissive defaults and assertions. Invalid categories, difficulty values, dates, and tag shapes can produce incorrect UI or runtime failures.
- `compileBlogContent()` is intentionally server-side, but MDX is executable at build time. Future remote editing must treat repository write access as build-code execution authority.
- The newsletter form has a success state but no persistence or API integration.

## Dependency Audit

| Dependency | Use | Assessment |
|---|---|---|
| `next`, `react`, `react-dom` | App Router runtime | Necessary. |
| `@keystatic/core`, `@keystatic/next` | Local Git-based authoring UI and API | Appropriate choice, but production routes must be gated. |
| `clsx`, `tailwind-merge` | Class composition through `cn()` | Justified and small. |
| `framer-motion` | Hero, menu, reveal, tabs, FAQ | Meaningful use, but broad route cost; reduce usage before removing. |
| `gray-matter` | Frontmatter parsing | Appropriate. |
| `lucide-react` | Icons | Appropriate; avoid namespace imports. |
| `next-mdx-remote` | Server-side MDX compilation | Appropriate for current content pipeline. |
| `react-tweet` | Tweet embeds | Feature-specific; retain if embeds are editorially needed. |
| `server-only` | Prevent server loader imports in client code | Small and appropriate. |

No dependency is clearly unnecessary enough to remove immediately. The main dependency decision is whether the remaining Framer Motion interactions justify its route-wide client cost after the client boundaries are reduced.

## TypeScript Quality

Strengths:

- Strict mode is enabled.
- No `any` usage was found in application source.
- Category unions derive from the category registry.
- The content loader exposes a shared typed contract.

Issues:

- Frontmatter is untyped input but is asserted into `BlogCategory` and `Difficulty` without validation.
- `InfoCard` uses two casts around a dynamic icon lookup.
- `post.updated!` is a symptom of insufficient local narrowing.
- `BlogPost.id` is a mutable index identity and duplicates the stable slug concept.

## Recommended Refactoring Plan

### Phase 1: Correctness, security, and performance

1. Gate `/keystatic` and `/api/keystatic` in production.
2. Make hero text visible in initial HTML.
3. Server-render the blog index.
4. De-client `MagicBorderCard`.
5. Split summary/detail post data so bodies never enter list payloads.
6. Replace reading-progress state/width updates with rAF and `scaleX`.
7. Remove or simplify continuous blurred background animation.
8. Configure Framer Motion reduced-motion behavior.
9. Remove fabricated claims and fix the newsletter's truthfulness.

### Phase 2: Simplify architecture

1. Fix CSS cascade layers.
2. Choose one reveal/entrance animation system.
3. Delete dead CSS, dead fields, dead exports, unreachable compatibility branches, and starter assets.
4. Deduplicate syntax-token components.
5. Validate frontmatter at the content boundary.

### Phase 3: Improve maintainability

1. Move verified site copy and structured marketing data out of large UI components.
2. Add branded not-found and error handling.
3. Add sitemap, robots, canonical URLs, JSON-LD, and complete article/social metadata.
4. Fix mobile menu, tabs, FAQ, marquee, and keyboard-focus accessibility.
5. Reduce font weights and preserve the generated fallback variables.
6. Consolidate documentation into a smaller set of maintained documents.
7. Add focused tests for `slugify`, `getHeadings`, `filterPosts`, and frontmatter validation.

### Phase 4: Future-proof selectively

- Add a discriminated content `type` only when reviews, buying guides, or comparisons become real requirements. Prefer one shared collection over parallel collections.
- Add author relationships when a second author exists.
- Add pagination and a generated search index around the point where the post count makes client filtering expensive.
- Switch Keystatic to authenticated GitHub storage only when remote editing is needed.

## Files Requiring Attention

1. `app/api/keystatic/[...params]/route.ts` — production file-write API exposure. Critical.
2. `app/keystatic/[[...params]]/page.tsx` — public admin UI in production. Critical.
3. `components/sections/HeroSection.tsx` — invisible LCP and unverified marketing claims. Critical.
4. `app/(site)/blog/page.tsx` — empty-fallback Suspense and missing crawlable article markup. Critical.
5. `app/globals.css` — cascade-layer defect and dead CSS. Critical.
6. `app/(site)/layout.tsx` — continuous blurred background animation. High.
7. `components/ui/MagicBorderCard.tsx` — unnecessary client boundary and time-dependent rendering. High.
8. `components/sections/BlogListContent.tsx` — client rendering and raw-body data flow. High.
9. `hooks/useReadingProgress.ts` — unthrottled scroll state and layout work. High.
10. `components/layout/Navbar.tsx` — mobile menu semantics/focus and fixed backdrop blur. High.
11. `components/sections/Testimonials.tsx` — unverified named endorsements. High.
12. `components/ui/NewsletterBox.tsx` — no-op email collection and misleading success state. High.
13. `app/layout.tsx` — font payload and missing technical SEO metadata. High.
14. `content/loader.ts` — unvalidated frontmatter, module-level cache, dead fields/branches. Medium.
15. `components/sections/Capabilities.tsx` — unverified publication statistics and fixture-heavy UI. Medium.
16. `components/mdx/InfoCard.tsx` — namespace import and unsafe dynamic icon assertion. Medium.
17. `content/keystatic-components.tsx` — dead import ritual and editor/rendering mismatch. Medium.
18. `components/ui/TableOfContents.tsx` — hidden-on-mobile observer work. Medium.
19. `components/mdx/Tabs.tsx` — incomplete tab accessibility pattern. Medium.
20. `types/blog.ts` — summary/detail type conflation and unstable `id`. Medium.
21. `ARCHITECTURE_REVIEW_SUMMARY.md` — generated self-assessment that contradicts actual risk. Low.

## Do Not Touch Without a Concrete Reason

- `lib/categories.ts`: preserve the single registry and its derived types/options/colors.
- The `server-only` content-loader boundary: improve validation and caching, but keep filesystem ownership there.
- `content/mdx-components.tsx`: preserve the single MDX tag-to-component map and heading factory.
- The focused server-rendered MDX component library, excluding the specific accessibility and icon-lookup fixes above.
- The theme token architecture: fix CSS layering without replacing the token system.
- The `(site)` route group and the overall server/SSG structure of the article detail page.
- `ThemeToggle`'s DOM-class initialization strategy; it correctly avoids duplicating theme detection.
- Keystatic as the CMS choice; the deployment gate is the issue, not the CMS decision.
- `clsx` + `tailwind-merge` + `cn()`; the dependency set is otherwise lean.

## Validation Performed

- Installed dependencies with `npm ci --no-audit --no-fund --loglevel=error`.
- Ran `npx next build` successfully.
- Confirmed all nine article pages are statically generated.
- Confirmed `/keystatic` and `/api/keystatic/[...params]` are dynamic production routes.
- Inspected generated HTML, CSS, JavaScript chunk sizes, font assets, and the Keystatic local-mode handler.
- No application files were modified during the audit; this report is the only file created for the audit request.