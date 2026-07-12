# TechCoder

A developer-first publication — technical blogs, AI news, and programming
tutorials — built with Next.js 16, React 19, and Tailwind CSS v4. Content is
authored in MDX and edited visually with [Keystatic](https://keystatic.com), a
Git-based CMS. No database.

## Quick start

```bash
npm install
npm run dev
```

- Site: <http://localhost:3000>
- Content editor: <http://localhost:3000/keystatic>

## Publishing a blog post

1. Open <http://localhost:3000/keystatic> → **Create Blog post**.
2. Fill in the fields, upload a hero image, and write the body (insert callouts,
   code, videos from the **+** menu).
3. Keep **Draft** on to preview; turn it off to publish.
4. Commit the generated `.mdx` file with Git.

Prefer writing by hand? Drop an `.mdx` file in `content/posts/` — see
[docs/blog-system.md](./docs/blog-system.md).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (with the Keystatic editor). |
| `npm run build` | Production build (static generation). |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Documentation

Everything is documented in [`/docs`](./docs/README.md):

- [Architecture](./docs/architecture.md) — stack, data flow, and design decisions
- [Blog system](./docs/blog-system.md) — how posts load, render, and route
- [Keystatic](./docs/keystatic.md) — the visual editor, images, deployment
- [MDX components](./docs/mdx-components.md) — reference for every component
- [Authoring workflow](./docs/authoring-workflow.md) — fastest path to publish
- [Conventions](./docs/conventions.md) — naming and coding standards
- [Troubleshooting](./docs/troubleshooting.md) · [Migration notes](./docs/migration-notes.md)

## Project structure

```
app/          Routing. Public site in app/(site)/, editor in app/keystatic/
components/   layout · sections · ui · mdx (article building blocks)
content/      posts/*.mdx · loader.ts (data) · mdx-components.tsx (rendering)
lib/          categories.ts · posts.ts · utils.ts   (pure logic)
types/        blog.ts   (shared types)
hooks/        reusable client hooks
docs/         full documentation
keystatic.config.ts   CMS schema
```

Full breakdown: [docs/folder-structure.md](./docs/folder-structure.md).

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · MDX
(`next-mdx-remote`) · Keystatic · lucide-react · react-tweet.
