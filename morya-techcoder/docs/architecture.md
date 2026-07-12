# Architecture

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) | Server Components by default. |
| UI | **React 19** | Client components only where interactivity is needed. |
| Styling | **Tailwind CSS v4** | Design tokens as CSS variables in `app/globals.css`. |
| Content | **MDX files** + `gray-matter` + `next-mdx-remote/rsc` | No database. |
| CMS | **Keystatic** (Git-based) | Visual editor at `/keystatic`, writes `.mdx`. |
| Icons | `lucide-react` | |
| Embeds | `react-tweet` | Server-rendered tweets. |

## Core principle: one-way content flow

```
content/posts/*.mdx
      │  (read + parse frontmatter, at server startup)
      ▼
content/loader.ts  ──uses──►  content/mdx-components.tsx  ──uses──►  components/mdx/*
      │  (BlogPost[] data)                    (MDX tag → React component map)
      ▼
Server Components (app/(site)/…)  ──props──►  Client Components (islands)
      ▼
Static HTML (SSG)
```

Content is **never** fetched in the browser. It is read once on the server and
baked into static HTML at build time. This keeps the site fast, cheap to host,
and simple to reason about.

## Where the pieces live

- **`content/loader.ts`** — *data only*. Reads every `.mdx` file, parses
  frontmatter, de-duplicates by slug, hides drafts in production, and exposes
  `blogPosts`, `getBlogBySlug`, `getCategories`, and `compileBlogContent`.
- **`content/mdx-components.tsx`** — *presentation only*. Maps MDX tags
  (`img`, `h2`, `Callout`, `YouTube`, …) to React components.
- **`components/mdx/*`** — the reusable article building blocks.
- **`lib/`** — pure, framework-agnostic logic: `categories.ts` (single source of
  truth for categories), `posts.ts` (filtering/related helpers), `utils.ts`
  (`cn`, `formatDate`, `slugify`, `getHeadings`).
- **`types/blog.ts`** — the `BlogPost` / `Difficulty` types shared everywhere.
- **`hooks/`** — reusable client behaviors (`useReadingProgress`, `useActiveHeading`).

## Major decisions and why

### 1. Keep MDX + files instead of a headless CMS
Files in Git give versioning, previews via branches, zero hosting cost, and no
lock-in. For a solo developer this is dramatically simpler than running a
database or paying for a SaaS CMS. See [keystatic.md](./keystatic.md).

### 2. Add Keystatic as an *editor on top of files*
Keystatic gives a visual editor (image uploads, live preview, validation) but
still writes plain `.mdx` into `content/posts/`. The rendering pipeline did not
change — Keystatic is purely an authoring convenience. If we ever remove it, the
site keeps working.

### 3. Single source of truth for categories (`lib/categories.ts`)
Previously the category list was duplicated in four files that could drift. Now
a `CATEGORIES` object derives the type, the filters, the colors, and the
Keystatic dropdown. Add a category once; everything updates.

### 4. Separate data, presentation, and business logic
`loader.ts` (data) ≠ `mdx-components.tsx` (presentation) ≠ `lib/posts.ts`
(business logic). Components stay focused on rendering; logic is testable in
isolation.

### 5. `(site)` route group
The public site (Navbar, Footer, ambient background) lives in `app/(site)/` so
that `/keystatic` can render as a clean full-screen app without the site chrome.
Route groups don't change URLs — `/` and `/blog` are unaffected.

### 6. Draft mode via `NODE_ENV`
Posts with `draft: true` are visible in `npm run dev` but filtered out of
production builds. This gives "preview before publishing" with zero extra infra.

## Rendering & caching

- `blogPosts` is computed once when `content/loader.ts` is first imported and
  cached for the process lifetime — perfect for static generation.
- `/` and `/blog` are static; `/blog/[slug]` is statically generated via
  `generateStaticParams`. `/keystatic` and its API are dynamic (editor only).
