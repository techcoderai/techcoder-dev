# The Blog System

## How a post becomes a page

1. A post is an `.mdx` file in `content/posts/` with **YAML frontmatter** at the
   top and MDX content below.
2. `content/loader.ts` runs on the server, reads every file, and turns it into a
   `BlogPost` object (see `types/blog.ts`).
3. `app/(site)/blog/page.tsx` serializes compact `BlogPostSummary` objects to
   the client-side filter; raw MDX bodies never cross that boundary.
   `app/(site)/blog/[slug]/page.tsx` renders each article and compiles the MDX
   body with `compileBlogContent`.
4. Custom tags in the MDX (like `<Callout>`) are resolved via
   `content/mdx-components.tsx`.

## The MDX pipeline

`content/compile.ts` is the whole rendering contract. Everything in it runs at
build time, so articles ship as static HTML with no rendering libraries in the
browser:

| Plugin | What it enables |
| --- | --- |
| `remark-gfm` | Markdown tables, strikethrough, task lists, autolinks |
| `rehype-pretty-code` (Shiki) | Syntax highlighting, language labels, `title=` filenames, `{1,3-5}` line highlighting |
| `rehypeImageSize` | Real intrinsic dimensions for local images, so nothing shifts as they load |

It also sets `blockJS: false`. `next-mdx-remote` defaults to stripping **every**
JSX attribute expression as a defence against untrusted MDX, which silently
turns `<Comparison rows={[…]} />` into `<Comparison />`. Our content comes from
this repository and is reviewed in Git, so that default is wrong here.
`blockDangerousJS` stays on, so expressions still can't reach `eval`, `process`,
`fs`, or the Function constructor.

## Frontmatter fields

```yaml
---
title: "Next.js 16 + Tailwind v4"        # required
excerpt: "A short summary for cards."     # required — also the meta description
date: 2026-01-15                          # required — publish date (sorts posts)
category: Programming                     # Programming | AI | Technology | Reviews | Guides
tags: ["nextjs", "tailwind"]
thumbnail: /content/blog/hero.png         # hero / card image
thumbnailAlt: "The Next.js logo"          # optional; falls back to the title
difficulty: Intermediate                  # Beginner | Intermediate | Advanced
updated: 2026-02-01                       # optional "last updated" date
prerequisites: ["Basic React"]            # optional; shown as a callout
draft: false                              # true = hidden in production
featured: false                           # true = eligible for the homepage rail
review:                                   # Reviews only — see below
  product: "Framework 13"
  rating: 4.5
  price: "$1,049"
seo:                                      # all optional
  title: "Custom <title>"
  description: "Custom meta description"
  ogImage: /content/blog/og.png           # falls back to thumbnail
  canonical: "https://example.com/original"
  noindex: false
---
```

Only `title`, `excerpt`, and `date` are strictly required. Everything else has a
sensible fallback (e.g. `difficulty` is derived from `category` when omitted).

**Reading time is not a field** — it's computed from the body on every load
(`calcReadingTime`, 238 wpm). A stored word count goes stale on the first edit.

`ogImage` used to sit at the top level and moved under `seo`. The loader still
honours the old position, so existing posts keep working.

## Reviews

A review is an ordinary article in the `Reviews` category, plus a `review` block
in frontmatter. The split is deliberate:

| Lives in frontmatter | Lives in the body |
| --- | --- |
| `rating`, `price`, `product` | The written judgement (`<Verdict>`), pros and cons (`<ProsCons>`), comparisons |

Frontmatter carries only what the site needs **outside** the prose: the sidebar
summary card and the `Review` structured data, which makes the score eligible
for rich results. `BlogPosting` has nowhere to put a rating, so reviews emit a
second JSON-LD graph.

Nothing appears in both places — a rating stored twice will eventually disagree
with itself.

## Authors

The byline is a Keystatic **singleton** at `content/settings/author.json`, read
through `lib/author.ts`. Posts carry no author field, because there is nothing
to choose per article and copying the same name into every file invites drift.

When a second writer joins, this becomes a collection and posts gain an optional
`author` field defaulting to this record. Every consumer already goes through
`getAuthor()`, so nothing else has to change.

## Routing

| URL | File | Rendering |
| --- | --- | --- |
| `/` | `app/(site)/page.tsx` | Static |
| `/blog` | `app/(site)/blog/page.tsx` | Static shell + client filter |
| `/blog/:slug` | `app/(site)/blog/[slug]/page.tsx` | Static (SSG per post) |

The slug comes from the filename: `content/posts/my-post.mdx` → `/blog/my-post`.
(Keystatic may store posts as `my-post/index.mdx`; the loader handles both.)

`/blog/[slug]` sets `dynamicParams = false`: every publishable slug is known at
build time, so anything else is rejected by the router with a real 404. Without
it the route's `loading.tsx` would stream a 200 before `notFound()` could run,
and every mistyped URL — and every draft — would answer with a soft 404 that
search engines happily index.

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
- `compileBlogContent(body)` — compiles an MDX string to a React element
  (`content/compile.ts`; imported only by the article page).

From `lib/posts.ts`:
- `toPostSummary(post)` — strips article-only fields before client serialization.
- `filterPosts(posts, { query, category })`
- `getFeaturedPosts(posts, n)` — posts with `featured: true` (falls back to newest if none flagged)
- `getPostsByCategory(posts, category, n?)`
- `getRelatedPosts(posts, current, n)`

### Featuring a post on the homepage

Set `featured: true` in the post’s frontmatter (or tick **Featured** in Keystatic).
Only flagged posts appear in “Featured articles”. If nothing is flagged yet, the
helper falls back to the newest posts so the rail isn’t empty during setup.

## Performance and discovery

- Article-only typography lives in `app/(site)/blog/[slug]/article.css`, keeping
  prose rules out of the homepage stylesheet.
- JetBrains Mono is scoped to the article layout and is not preloaded on
  non-article routes.
- Article hero images use `next/image` with `preload`; card images remain lazy.
- `app/sitemap.ts` includes published posts, browsable topic pages, and post
  thumbnails. Drafts, `noindex` articles, "coming soon" topics, and every admin
  route are excluded.
- Article metadata includes canonical, Open Graph, Twitter, author, and
  `BlogPosting` structured data — plus a `Review` graph when the post has a
  rating.
- Keystatic is not part of the public surface at all: `/keystatic` and
  `/api/keystatic/*` 404 in production. See
  [keystatic.md](./keystatic.md#storage-and-production).
