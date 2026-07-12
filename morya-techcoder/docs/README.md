# TechCoder Documentation

Complete, beginner-friendly documentation for the TechCoder platform. Start
here, then dive into whichever topic you need.

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
| [troubleshooting.md](./troubleshooting.md) | Common problems and their fixes. |
| [migration-notes.md](./migration-notes.md) | What changed in the Keystatic + architecture refactor. |

## 30-second orientation

- **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4.
- **Content:** Blog posts are `.mdx` files in `content/posts/`. No database.
- **Editing:** Run `npm run dev` and open `http://localhost:3000/keystatic`.
- **Rendering:** `content/loader.ts` reads the files; `content/mdx-components.tsx`
  maps MDX tags to React components; pages render them as static HTML.

## For AI assistants

If you are an LLM working in this repo:

- Read [architecture.md](./architecture.md) and [conventions.md](./conventions.md) first.
- Blog data flows one way: `content/posts/*.mdx` → `content/loader.ts` →
  server components → UI components. Never fetch content in client components.
- The single source of truth for categories is `lib/categories.ts`.
- All blog types live in `types/blog.ts`.
- Use the `--tc-*` design tokens (see `app/globals.css`); never hardcode colors.
