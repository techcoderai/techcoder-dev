# TechCoder — Agent Orientation

@AGENTS.md

**TechCoder** is an MDX-based tech publishing platform: Next.js 16 (App
Router) + React 19 + Tailwind CSS v4, with [Keystatic](https://keystatic.com)
(a Git-based CMS) as a visual editor on top of plain `.mdx`/`.json` files.
Static site generation, no database.

**This file is a map, not the manual.** Full, current documentation lives in
[`docs/`](./docs/README.md) — read [docs/README.md](./docs/README.md) first,
then [docs/architecture.md](./docs/architecture.md) and
[docs/conventions.md](./docs/conventions.md). Everything below is either a
pointer into `docs/` or a rule specific to working here as an agent.
**When you change architecture or behavior, update the relevant doc in the
same change** — stale docs are worse than no docs, because they're actively
misleading.

## Fast orientation

- Content lives in Git: `content/posts/*.mdx` (articles) and
  `content/authors/*.json` (bylines). No database.
- One-way data flow: `content/loader.ts` (data) → server components → client
  components (props only). Never import `content/loader.ts` into a client
  component — it's `server-only`.
- `lib/categories.ts` is the single source of truth for categories.
  `types/blog.ts` holds the shared `Author`/`PostSummary`/`PostDetail` types.
- `/keystatic` and `/api/keystatic/*` are dev-only — gated by
  `KEYSTATIC_ENABLED` in `lib/keystatic.ts`, 404 in production.
- Full directory map with the reasoning behind non-obvious pairs (e.g. why
  both `MagicBorderCard` and `ArticleCard` exist): [docs/folder-structure.md](./docs/folder-structure.md).

## Two footguns that don't look like what they are

Both are detailed in [docs/troubleshooting.md](./docs/troubleshooting.md); the
short version, because they're easy to reintroduce without realizing it:

1. **Post/author image paths must include the entry's own slug**:
   `/content/blog/<slug>/<file>`, matching a real file at
   `public/content/blog/<slug>/<file>`. A bare filename or a path missing the
   slug renders fine on the live site (the loader is lenient) but silently
   gets deleted from frontmatter the next time that entry is saved in
   Keystatic — Keystatic's image field locates the file by stripping exactly
   that prefix. See [docs/architecture.md](./docs/architecture.md#11-every-managed-image-path-includes-its-own-entrys-slug).
2. **Wrapper/repeating MDX components must be written multi-line.**
   `<Pro>text</Pro>` on one line parses as *inline* MDX JSX; Keystatic's
   editor needs it as a *block* element and fails to open the whole post if
   it isn't. Always: open tag, content, close tag, each on its own line. See
   [docs/mdx-components.md](./docs/mdx-components.md).

## Adding things (quick reference — see docs/conventions.md for the rest)

- **A category:** edit `lib/categories.ts` only; everything else derives from it.
- **An MDX component:** create it in `components/mdx/`, add it to
  `content/mdx-components.tsx` (rendering) **and**
  `content/keystatic-components.tsx` (authoring) under the same key, document
  it in [docs/mdx-components.md](./docs/mdx-components.md). Only add one if it
  has an editorial job Markdown can't express — pure styling belongs in
  `article.css`.
- **A post/author field:** update the schema in `keystatic.config.ts`, the
  type in `types/blog.ts`, and the resolution logic in `content/loader.ts` —
  all three, or Keystatic's schema will drift from what the site actually
  reads (this has happened before; it produces a hard-to-diagnose "Key on
  object value X is not allowed" crash when opening `/keystatic`).

## Repo-specific facts worth knowing

- `next-mdx-remote` sets `blockJS: false` in `content/compile.ts` — required
  because Keystatic writes non-string props (arrays/objects/numbers) as JSX
  expressions, and the default strips them silently.
- `FileTree`/`Folder`/`File` and `Table` render on the live site but are not
  registered in Keystatic's editor (arbitrary nesting doesn't fit its flat
  children model / Markdown tables now render natively) — using either
  anywhere in a post's body makes that post unopenable in `/keystatic`.
- Reading time is always computed from the body (`calcReadingTime`, 238 wpm)
  — never add it as a frontmatter field.
- `npm run dev` after a large dependency change (e.g. bumping
  `@keystatic/core`) can leave a stale Turbopack cache that manifests as an
  endless retry loop pegging the CPU. `rm -rf .next node_modules/.cache` fixes it.

## Environment

See [`.env.example`](./.env.example). Nothing is required to run the site;
`RESEND_API_KEY`/`RESEND_AUDIENCE_ID` enable the newsletter form, and
`ENABLE_KEYSTATIC=true` re-enables `/keystatic` in a local production build
(`next build && next start`) — never set it on a real deployment while
storage is `local`.
