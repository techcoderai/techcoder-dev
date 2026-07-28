# Motion & Interaction System

One vocabulary for every interaction, tuned to feel calm, editorial and
premium — closer to Apple / Linear / Vercel than a template with random hover
effects. Motion reinforces hierarchy; it never competes with reading. Everything
animates `transform` / `opacity` wherever possible, and everything respects
`prefers-reduced-motion` (a global rule in `globals.css` collapses durations).

## Tokens (`app/globals.css` → `:root`)

Never hardcode durations or easings — reference these:

| Token | Value | Use |
| --- | --- | --- |
| `--tc-dur-fast` | `150ms` | taps, presses, tiny nudges |
| `--tc-dur` | `250ms` | standard hovers, color shifts |
| `--tc-dur-slow` | `400ms` | elevation, reveals, larger moves |
| `--tc-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | default ease-out (settled, no overshoot) |
| `--tc-ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | symmetric moves |
| `--tc-ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | material-soft |

Framer Motion equivalents use the array form `[0.22, 1, 0.36, 1]`.

## Shadow system

`--tc-shadow-md` / `--tc-shadow-lg` are **layered** (near · medium · far) so
elevation reads as depth, not darkness. Hover swaps a card to the larger, softer
stack — it never just gets darker. Avoid one-off `box-shadow` values.

## Interaction patterns

- **Cards** (`.card-premium`) — hover: `translateY(-4px) scale(1.01)`, layered
  shadow, image zoom to `1.04`, title → primary, category chip brightens,
  metadata (`.card-premium-meta`) recedes to `0.72`. Press: brief `scale(0.998)`.
- **Moving border** (`.moving-border`) — reusable class: a soft orange gradient
  sweeps the 1px edge on hover (conic-gradient masked to a ring via the
  `--tc-border-angle` `@property` + `borderAngle` keyframe), stopping smoothly on
  leave. No glow, no neon. Used by article cards and category cards; add it to
  any rounded element.
- **Buttons** (`.btn-primary` / `.btn-secondary`) — hover: lift + brighter +
  stronger shadow (icons slide via per-usage `group-hover:translate-x-*`).
  Press: `scale(0.97)` + reduced shadow at `--tc-dur-fast`.
- **`.press`** — lightweight tactile `scale(0.97)` for pills / icon buttons.
- **Category icons** (`TopicGrid`) — hover: `rotate(5deg) scale(1.05)` + warm
  background wash.
- **Nav links** — expanding gradient underline (`scale-x`), not a fade. The
  navbar gains stronger blur + a layered shadow and the logo scales on scroll.
- **TOC active item** (`TableOfContents`) — a single orange indicator glides
  between items via a Framer `layoutId` spring; the active label eases color and
  slides `translate-x-0.5`.
- **Links / titles** (`.link-underline`) — underline grows from the left on
  hover of the element or its `.group`.

## Images

Article hero images render directly with `next/image` and `preload` so the LCP
candidate is discoverable immediately and never waits for hydration. Card media
uses the shared transform-only `.card-premium-media` zoom. Avoid load-triggered
opacity effects on above-the-fold images because they delay LCP reporting.

## Page transitions

Public routes intentionally do not use a client `template.tsx`. Static content
paints immediately instead of waiting for hydration before becoming visible.
Section-level reveals provide the motion hierarchy without delaying route FCP or
LCP.

## Desktop navigation (`components/layout/NavLinks.tsx`)

A single soft radial "pill" glides between links via a shared Framer `layoutId`
(settling on the active route when nothing is hovered). Each label is gently
magnetic toward the cursor (spring, capped at a few px), an underline
(`.nav-underline`) expands from the center on hover and persists on the active
route, and colour eases. All magnetic/layout motion is disabled under reduced
motion. The navbar shell still compacts + strengthens blur on scroll
(`.nav-shell-scrolled`) and the logo scales down.

## Article reading companion (`components/reading/ArticleActions.tsx`)

Desktop sidebar tool card: live **% read** + **time remaining** (updated
imperatively via `useScrollProgress`, no re-renders), plus **Share** (native
sheet → copy fallback), **Copy Link** (with a `Check` confirmation),
**Bookmark** (`localStorage` via `useSyncExternalStore`, `animate-bookmark-pop`),
**Print**, and **Reading Mode**. Reading Mode toggles `html.reading-focus`,
which calmly dims regions tagged `.reading-dim` (tags, newsletter, related) and
eases the prose measure. Mobile keeps the native share sheet (navbar Share).

## Table of contents

Both the desktop sidebar (`TableOfContents`) and the mobile bottom sheet
(`ReadingLayer`) share `useReadingState`: a Framer `layoutId` indicator glides to
the active heading, completed sections earn a `Check`, and a `done/total` count
shows section progress. Headings nest (h3 indented under h2).

## Other polish

- **Scroll-to-top** (`ScrollToTop`) — fades in past 700px; bottom-left on mobile
  (clear of the reading indicator), bottom-right on desktop.
- **Spotlight cursor** (`SpotlightCursor`) — a barely-there warm radial that
  trails the pointer via a CSS var on rAF. Desktop fine-pointer only; hidden
  under reduced motion and painted behind content.
- **Skeletons** (`app/(site)/blog/loading.tsx`, `.../[slug]/loading.tsx`) — layout-
  matched shimmer (`.skeleton`) so route swaps don't jump.
- **View Transitions** — `ThemeToggle` cross-fades the theme swap via
  `document.startViewTransition` (progressive enhancement); `::view-transition-*`
  root timing is set in `globals.css`. Both no-op under reduced motion.

## Glass

Restrained glassmorphism only where it earns its cost: the navbar, floating
cards, and the reading TOC. Do not add `backdrop-filter` broadly.

Large ambient glows use radial gradients instead of large blurred elements.
Long homepage sections use `.render-deferred` (`content-visibility: auto`) so
off-screen layout and paint work is skipped until the section approaches the
viewport. Continuous carousel work pauses when off-screen or when the document
is hidden.
