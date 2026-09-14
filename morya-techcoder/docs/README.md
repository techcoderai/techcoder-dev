# TechCoder Documentation

Complete, beginner-friendly documentation for the TechCoder platform. Start
with the root [README.md](../README.md) to get the app running, then use this
index for anything deeper.

## Contents

| Doc | What's inside |
| --- | --- |
| [architecture.md](./architecture.md) | The big picture: stack, data flow, and every major decision (and *why*). |
| [folder-structure.md](./folder-structure.md) | Every folder explained, and where new code should go. |
| [blog-system.md](./blog-system.md) | How posts are loaded, rendered, and routed. Adding a post by hand. |
| [keystatic.md](./keystatic.md) | Why Keystatic, using the `/keystatic` editor, images, and deployment. |
| [mdx-components.md](./mdx-components.md) | Reference for every custom MDX component with copy-paste examples. |
| [authoring-workflow.md](./authoring-workflow.md) | The fastest path from idea to published article. |
| [conventions.md](./conventions.md) | Naming, coding standards, and component guidelines. |
| [mobile-first.md](./mobile-first.md) | The mobile-first design system: rhythm, typography, interactions, and per-component behavior. |
| [motion-system.md](./motion-system.md) | Unified motion & interaction language: tokens, shadows, hover/press, moving border, transitions. |
| [performance-optimization.md](./performance-optimization.md) | Measured CSS/CWV optimization pass, trade-offs, targets, and remaining work. |
| [troubleshooting.md](./troubleshooting.md) | Common problems and their fixes — read this first when something breaks. |

## 30-second orientation

- **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4.
- **Content:** Blog posts are `.mdx` files in `content/posts/`; authors are
  `.json` files in `content/authors/`. No database.
- **Editing:** Run `npm run dev` and open `http://localhost:3000/keystatic`.
  Those routes **404 in production** — see [keystatic.md](./keystatic.md#storage-and-production).
- **Rendering:** `content/loader.ts` reads posts and resolves each one's author
  (`lib/author.ts`); `content/compile.ts` runs the MDX pipeline (GFM, Shiki,
  image sizing); `content/mdx-components.tsx` maps MDX tags to React
  components; pages render them as static HTML.
- **Setup:** `npm install && npm run dev`. Nothing in `.env` is required to run
  the site — see [`.env.example`](../.env.example) for the one optional
  feature (the newsletter form) that needs it.

## The two things most likely to bite you

Both are covered in [troubleshooting.md](./troubleshooting.md), but they're
easy to hit while contributing, so they're worth knowing before you start:

1. **Image paths for anything Keystatic might edit must include the entry's
   own slug**: `/content/blog/<post-slug>/<file>`, not a bare filename. Get
   this wrong and the image *works fine on the site* right up until someone
   edits that post in Keystatic and saves — then the reference silently
   disappears from frontmatter. See
   [keystatic.md#uploading-images](./keystatic.md#uploading-images).
2. **Wrapper/repeating MDX components (`Pro`, `Con`, `InfoCard`, …) must be
   written multi-line**, not `<Pro>text</Pro>` on one line — otherwise the
   post can't be opened in Keystatic afterward. See
   [mdx-components.md](./mdx-components.md).

## For AI assistants

If you are an LLM working in this repo:

- Read [architecture.md](./architecture.md) and [conventions.md](./conventions.md) first.
- Blog data flows one way: `content/posts/*.mdx` → `content/loader.ts` →
  server components → UI components. Never fetch content in client components.
- The single source of truth for categories is `lib/categories.ts`.
- Feature flags live in `lib/featureFlags.ts` (`isFeatureEnabled(...)`).
- All blog/author types live in `types/blog.ts`.
- Adding an MDX component means editing **two** files: `content/mdx-components.tsx`
  (how it renders) and `content/keystatic-components.tsx` (how it's authored).
  Same key in both. See [mdx-components.md](./mdx-components.md#adding-your-own-component).
- Don't add a component that only changes appearance — style it in `article.css`.
- Never store derived data in frontmatter (reading time, word counts), and never
  store the same fact in both frontmatter and a body component.
- Use the `--tc-*` design tokens (see `app/globals.css`); never hardcode colors.
- Use the motion tokens (`--tc-dur-*`, `--tc-ease*`) for animation; never hardcode
  durations/easings. See [motion-system.md](./motion-system.md).
- The UI is **mobile-first**: base styles target phones, `sm:`/`lg:` restore the
  desktop layout. See [mobile-first.md](./mobile-first.md) before touching layout.
- Read the two gotchas above (image paths, multi-line wrapper components)
  before touching any post's images or MDX body — both produce confusing,
  hard-to-trace failures that look unrelated to the actual cause.
- Whenever you change architecture or behavior described in these docs,
  update the relevant doc in the same change — see `AGENTS.md` and
  `CLAUDE.md` at the repo root.
