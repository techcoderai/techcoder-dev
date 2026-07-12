# The Blog System

## How a post becomes a page

1. A post is an `.mdx` file in `content/posts/` with **YAML frontmatter** at the
   top and MDX content below.
2. `content/loader.ts` runs on the server, reads every file, and turns it into a
   `BlogPost` object (see `types/blog.ts`).
3. `app/(site)/blog/page.tsx` renders the list; `app/(site)/blog/[slug]/page.tsx`
   renders each article and compiles the MDX body with `compileBlogContent`.
4. Custom tags in the MDX (like `<Callout>`) are resolved via
   `content/mdx-components.tsx`.

## Frontmatter fields

```yaml
---
title: "Next.js 16 + Tailwind v4"        # required
excerpt: "A short summary for cards."     # required — also the meta description
date: 2026-01-15                          # required — publish date (sorts posts)
category: WebDev                          # AI | WebDev | Tricks
tags: ["nextjs", "tailwind"]
thumbnail: /content/blog/hero.png         # hero / card image
ogImage: /content/blog/og.png             # optional; falls back to thumbnail
difficulty: Intermediate                  # Beginner | Intermediate | Advanced
updated: 2026-02-01                       # optional "last updated" date
prerequisites: ["Basic React"]            # optional; shown as a callout
draft: false                              # true = hidden in production
seo:                                      # optional SEO overrides
  title: "Custom <title>"
  description: "Custom meta description"
---
```

Only `title`, `excerpt`, and `date` are strictly required. Everything else has a
sensible fallback (e.g. `difficulty` is derived from `category` when omitted).

## Routing

| URL | File | Rendering |
| --- | --- | --- |
| `/` | `app/(site)/page.tsx` | Static |
| `/blog` | `app/(site)/blog/page.tsx` | Static shell + client filter |
| `/blog/:slug` | `app/(site)/blog/[slug]/page.tsx` | Static (SSG per post) |

The slug comes from the filename: `content/posts/my-post.mdx` → `/blog/my-post`.
(Keystatic may store posts as `my-post/index.mdx`; the loader handles both.)

## Adding a post by hand (no Keystatic)

1. Create `content/posts/my-new-post.mdx`.
2. Paste the frontmatter block above and edit the values.
3. Write your article below the closing `---`.
4. Put images in `public/content/blog/` and reference them as
   `/content/blog/your-image.png`.
5. Run `npm run dev` and visit `/blog/my-new-post`. Done — no registration step.

> Prefer the visual editor? See [keystatic.md](./keystatic.md).

## Draft workflow (preview before publishing)

Set `draft: true` while writing. The post shows up at `npm run dev` (so you can
preview it) but is **excluded from production builds**. Flip it to `false` (or
remove it) when you're ready to publish.

## Categories

Categories are defined once in `lib/categories.ts`. To add one, edit the
`CATEGORIES` object there — the type, the blog filters, the card colors, and the
Keystatic dropdown all update automatically. See
[conventions.md](./conventions.md#adding-a-category).

## Key helper functions

From `content/loader.ts`:
- `blogPosts` — all posts, newest first.
- `getBlogBySlug(slug)` — one post.
- `getCategories()` — categories actually present in the content.
- `compileBlogContent(body)` — compiles an MDX string to a React element.

From `lib/posts.ts`:
- `filterPosts(posts, { query, category })`
- `getFeaturedPosts(posts, n)`
- `getPostsByCategory(posts, category, n?)`
- `getRelatedPosts(posts, current, n)`
