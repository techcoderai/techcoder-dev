# Mobile-First Design

TechCoder is designed **mobile-first**: the base (unprefixed) Tailwind styles
target phones, and `sm:` / `md:` / `lg:` prefixes progressively restore the
roomier desktop treatment. The goal is a premium editorial experience closer to
Apple News, Linear, and Medium than a scaled-down desktop site — optimized for
one-handed use, thumb-friendly tap targets, fast content discovery, and
readability.

> Rule of thumb: write the phone layout first with **no** breakpoint prefix,
> then add `sm:`/`lg:` overrides for larger screens. Never squeeze the desktop
> layout into a narrow viewport.

## Design tokens & rhythm (`app/globals.css`)

- **Section rhythm** — `.section-padding` is `3.5rem` (56px) on mobile, expanding
  to `7rem` / `8.75rem` at `md`/`lg`. Keep inter-section gaps in the 48–64px band
  on mobile (e.g. `gap-14 sm:gap-20`, `mb-14 sm:mb-20`).
- **Typography** — mobile-first sizes: hero (`.display-xl`) starts at 44px,
  section titles (`.heading-lg`) at 32px, and reading body / prose paragraphs at
  17–18px. Bump specific headings with responsive utilities where a section needs
  it (e.g. rail headers use `text-[1.375rem] md:text-2xl`).
- **Tactile feedback** — the `.press` utility gives pill buttons and cards a
  `scale(0.97)` press. `.card-premium` gets a subtle `:active` press on touch
  devices (`@media (hover: none)`). Tap highlight is disabled globally. All of
  this is skipped under `prefers-reduced-motion`.
- **Momentum / snap** — `.snap-rail` provides native momentum + x-mandatory snap
  for horizontal rails; `.scrollbar-none` hides the scrollbar.
- **Anchor offset** — prose headings carry `scroll-margin-top: 5.5rem` so
  in-page TOC jumps clear the fixed navbar + progress bar.

## Component behavior

- **Navbar** (`components/layout/Navbar.tsx`) — leaner on mobile
  (`h-12`/`h-14`) growing to `h-14`/`h-16` at `sm+`. Keeps the glass effect and
  logo; the menu toggle is a 44px thumb target.
- **Reading progress** (`components/ui/ReadingProgress.tsx`) — a 3px, fully
  rounded, orange-gradient bar pinned at `top-0` with `z-[70]` so it always sits
  above the navbar (`z-50`).
- **Category cards** (`components/sections/TopicGrid.tsx`) — mobile renders
  compact ~96px horizontal rows (icon left, label + one-line description right);
  `sm+` unfolds into the vertical card grid.
- **Article cards** (`components/ui/MagicBorderCard.tsx`) — 16:9 media, 2-line
  title + 2-line excerpt, tightened padding/metadata for quick scanning.
- **Carousels** (`components/ui/CardCarousel.tsx`) — on mobile a single primary
  card fills ~84–87vw showing a ~10% peek of the next card; fixed pixel widths
  return at `sm+`. Infinite loop, momentum, and pause-on-interaction are shared
  across breakpoints.
## Immersive reading experience (`components/reading/`)

Article pages get a native-app reading layer, wired through a small context so
the global navbar and the reading chrome share one source of truth:

- **`ReadingChromeProvider`** — wraps the site layout (above the navbar). Holds
  only low-frequency state: the current article `chrome` (`title`, `backHref`,
  `headings`) and whether the Contents sheet is open. The per-frame scroll
  percentage is **never** stored here.
- **`SetReadingChrome`** — a client helper the (server) article page renders to
  register/clear its metadata; non-article routes fall back to the normal navbar.
- **`ReadingLayer`** — renders nothing off-article. On an article it mounts:
  - the smooth top **`ReadingProgress`** bar (all breakpoints);
  - a mobile **floating circular progress + Contents indicator** (orange gradient
    SVG ring showing live %, tap opens the sheet). At ~100% it swaps to a
    checkmark + "100% Read" with a single calm ring pulse (`animate-read-pulse`);
  - a premium **bottom sheet** TOC with nested h2/h3, active-section highlight
    (animated orange dot), per-section completion checkmarks, smooth scrolling,
    body scroll-lock, `Escape`/backdrop close, and a "100% Read" completion
    footer.
- **Dynamic navbar** — on mobile, once the hero scrolls away
  (`scrolled && chrome`), the navbar morphs into a reading toolbar: **Back**,
  the **article title fading in**, **Contents**, and **Share**
  (`navigator.share` → clipboard fallback). The logo scales down / hides to make
  room. Desktop keeps the sidebar TOC and standard navbar.

### Performance-minded scroll wiring

- **`useScrollProgress(cb)`** — rAF-batched scroll → callback. Consumers write
  the value straight to a ref (`style.width`, `strokeDashoffset`, `textContent`),
  so the progress bar and ring animate at 60fps with **zero React re-renders**.
- **`useReadingState(headings)`** — separate scroll-spy for active + completed
  sections; these change only when crossing a section, so they can live in state
  cheaply. Mounted only while the sheet is open.

## Performance

- Animate transform/opacity only (GPU-friendly); avoid layout-shifting
  properties. Media uses fixed aspect ratios to prevent CLS.
- Everything honors `prefers-reduced-motion`.
