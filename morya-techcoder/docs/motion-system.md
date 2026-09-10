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
- **Nav links** — a shared indicator travels between items; hover adds a 1px
  lift and a center-out underline. See [Desktop navigation](#desktop-navigation-componentslayoutnavlinkstsx).
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

Three layers, deliberately quiet. No animation library, no React state, and
nothing that animates a layout property.

**Shared active indicator.** One 20px rounded bar, positioned by writing
`--nav-ind-x` and moved with `translate3d` over `240ms var(--tc-ease)`. Because
it is a single persistent node in the site layout, navigating Home → Articles
reads as one object gliding rather than two states swapping. Its width is
**fixed on purpose**: animating width would hit layout and would flatten the
rounded ends. Hovering the current item scales it to `1.3` via `--nav-ind-s`,
composed into the same transform.

Transitions are switched on (`data-ready`) one frame *after* the first
measurement, so the bar fades in where it belongs instead of sliding in from the
left edge on load. It re-measures on resize and on `document.fonts.ready`, since
web fonts change label widths after hydration.

**Pointer-following highlight.** A short, wide radial ellipse tracking the
pointer's X across the group, peaking around 7% (light) / 11% (dark). The
position is written to `--nav-mx` on `requestAnimationFrame` — the same approach
as `SpotlightCursor` — and `--nav-mx` is registered with `@property` as a
`<length>`, so **the browser interpolates it** and we don't run a lerp loop of
our own. The ellipse is short vertically so it fades out before the group's
edges rather than showing a cut edge. Listeners are never attached on coarse
pointers or under reduced motion.

It uses the `--tc-glow-soft` token rather than `color-mix`. The build emits a
solid-color fallback ahead of every `color-mix`, which for a wash this large
would mean a solid orange blob in browsers that lack it; the token is already an
rgba, so every browser renders it identically.

**Per-item states.** Hover: colour eases, the label lifts `1px`, a faint warm
wash fades in, and a 2px underline grows from the center via `scaleX` (not
width). Active: the same wash slightly stronger plus a 1px warm hairline drawn
with an *inset box-shadow* rather than a border, so it has no box-model effect.
The active item deliberately keeps `font-weight: 500` — bolding it would change
its width and shove the whole row sideways. Keyboard focus gets the same
treatment as hover.

**Shell.** A single threshold at `72px` (rAF-deferred read, and an unchanged
boolean is a no-op in React, so this renders at most twice per visit) swaps the
bar to its compact state: tighter padding, `.nav-shell-scrolled` surface + blur,
a layered shadow, and the logo at `0.94`. `backdrop-filter` is intentionally
excluded from the transition list — animating a blur is expensive and it is
imperceptible arriving with the background fade. On mobile this same threshold
reveals the article reading toolbar, which is why the two stay coupled.

**Logo / CTA / theme toggle.** The logo mark lifts `1.5px` and tilts `-3deg`,
its halo fades in, and "Coder" brightens via `filter`. The navbar CTA refines
`.btn-primary` for this context only (`.nav-cta`): a shallower `-1px` lift, a
slow gradient drift via `background-position`, a `3px` arrow nudge, and
`scale(0.98)` on press. The theme toggle tilts its icons `12deg` on a *wrapper*
element, because the icons themselves already animate `transform` for the
sun/moon crossfade.

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
  under reduced motion and painted behind content. A cursor-reactive grid
  variant (`GridCursorField`) also exists, unmounted, for possible future use.
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
