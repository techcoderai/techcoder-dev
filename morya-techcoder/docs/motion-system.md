# Motion & Interaction System

One vocabulary for every interaction, tuned to feel calm, editorial and
premium — closer to Apple / Linear / Vercel than a template with random hover
effects. Motion reinforces hierarchy; it never competes with reading. Everything
animates `transform` / `opacity` / `filter` only, and everything respects
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

`components/ui/FadeInImage.tsx` — a `next/image` drop-in that eases from
`opacity: 0; scale: 0.98` to rest over ~300ms on load (handles cached images via
a ref callback). Use for standalone imagery (article hero, MDX figures). **Do
not** use on `.card-premium-media` images — they already animate `transform` on
hover and a second transform transition would fight it.

## Page transitions

`app/(site)/template.tsx` re-mounts per navigation and eases page content in
(upward fade). Navbar, footer and reading chrome live in the layout (outside the
template) so they stay put; Next handles scroll restoration and the layout paints
the background, so there is no white flash. Reduced motion drops the translate.

## Glass

Restrained glassmorphism only where it earns its cost: the navbar, floating
cards, and the reading TOC. Do not add `backdrop-filter` broadly.
