# Folder Structure

```
morya-techcoder/
├── app/                            # Next.js App Router (routing lives here)
│   ├── layout.tsx                  # Root layout: <html>, fonts, theme script (minimal)
│   ├── globals.css                 # Design tokens (--tc-*), typography, animations
│   ├── sitemap.ts                  # Static sitemap: routes, topics, posts, images
│   ├── robots.ts                   # Crawler policy; excludes CMS/API routes
│   ├── (site)/                     # Route group for the public site (no URL segment)
│   │   ├── layout.tsx              # Navbar + Footer + ambient background
│   │   ├── page.tsx                # Home page                    → /
│   │   ├── about/page.tsx          # About page                   → /about
│   │   ├── contact/page.tsx        # Contact page                 → /contact
│   │   ├── privacy/page.tsx        # Privacy policy                → /privacy
│   │   ├── terms/page.tsx          # Terms of service               → /terms
│   │   ├── topics/[category]/      # Rich topic landing page (all 6 topics,
│   │   │   page.tsx                # including "coming soon" ones) → /topics/:category
│   │   └── blog/
│   │       ├── page.tsx            # Full article list + client search/filter → /blog
│   │       ├── loading.tsx         # Streamed loading state for the list
│   │       ├── category/[category]/
│   │       │   page.tsx            # Plain filtered list for one category (renders
│   │       │                       # `BlogIndex`) → /blog/category/:category — a
│   │       │                       # thinner alternative to /topics/:category
│   │       └── [slug]/
│   │           ├── layout.tsx      # Article-only mono font + ReadingLayer (Framer)
│   │           ├── article.css     # Route-scoped prose styles
│   │           ├── loading.tsx     # Streamed loading state for an article
│   │           └── page.tsx        # Article                      → /blog/:slug (SSG)
│   ├── keystatic/[[...params]]/
│   │   ├── page.tsx                # Server gate: 404s unless KEYSTATIC_ENABLED
│   │   └── keystatic-app.tsx       # The editor itself (client component)
│   └── api/
│       ├── keystatic/[...params]/route.ts  # Keystatic read/write API, gated the same way
│       └── newsletter/route.ts             # POST { email } → subscribes via Resend
│
├── components/
│   ├── layout/                     # Navbar, Footer, NavLinks
│   ├── sections/                   # Big page sections (Hero, HomeContent, BlogIndex, FAQ, …)
│   ├── ui/                         # Small reusable UI (cards, badges, CodeBlock, …)
│   ├── reading/                    # Article reading chrome — progress bar, floating
│   │   │                          # TOC/actions, the context that wires them together
│   │   ├── ReadingChromeProvider.tsx  # Context: current article + Contents sheet state
│   │   ├── SetReadingChrome.tsx       # Registers the current article (called from the page)
│   │   ├── ArticleActions.tsx         # Share/copy/bookmark/print/focus + progress
│   │   └── ReadingLayer.tsx           # Top progress bar + floating indicator + TOC sheet
│   └── mdx/                        # Building blocks used INSIDE articles — one file per
│                                    # component (or component family); see mdx-components.md
│
├── content/
│   ├── posts/*.mdx                 # The blog posts themselves
│   ├── authors/*.json              # The Authors collection (name, role, bio, avatar, url)
│   ├── loader.ts                   # Reads/parses posts + resolves authors → PostDetail[] (DATA only)
│   ├── compile.ts                  # compileBlogContent — MDX → React (article routes only)
│   ├── rehype-image-size.ts        # Reads intrinsic image dimensions at compile time
│   ├── mdx-components.tsx          # MDX tag → React component map     (PRESENTATION)
│   └── keystatic-components.tsx    # Insertable components for the Keystatic editor (AUTHORING)
│
├── hooks/                          # Reusable client hooks
│   ├── useScrollProgress.ts        # Imperative rAF scroll progress (no re-renders)
│   ├── useReadingState.ts          # Active heading + completed-sections scroll-spy
│   └── useActiveHeading.ts         # IntersectionObserver active-heading (desktop TOC)
│
├── lib/                            # Pure logic (no React, no I/O side effects except fs reads)
│   ├── categories.ts               # SINGLE SOURCE OF TRUTH for categories
│   ├── category-icons.ts           # lucide icon name → component map
│   ├── featureFlags.ts             # Progressive feature rollout (Testimonials, FAQ, …)
│   ├── keystatic.ts                # KEYSTATIC_ENABLED — the one flag both admin routes consult
│   ├── assets.ts                   # resolveAsset() — normalizes a stored image value to a src
│   ├── author.ts                   # getAuthor()/getAuthors() — resolves the Authors collection
│   ├── newsletter.ts               # subscribeToNewsletter() — talks to the Resend API
│   ├── posts.ts                    # filterPosts / getFeaturedPosts / getRelatedPosts …
│   └── utils.ts                    # cn, formatDate, slugify, getHeadings, calcReadingTime
│
├── types/
│   └── blog.ts                     # Author, PostSummary, PostDetail, ReviewMeta, SeoMeta
│
├── public/
│   └── content/
│       ├── blog/<slug>/            # Post images, namespaced by the post's own slug —
│       │                           # see keystatic.md#uploading-images for why this is mandatory
│       └── authors/<author-slug>/  # Author avatars, namespaced the same way
│
├── docs/                           # You are here
│
├── keystatic.config.ts             # Keystatic schema: the `posts` and `authors` collections
├── .env.example                    # Every environment variable the app reads, documented
├── next.config.ts
└── tsconfig.json                   # `@/*` path alias → project root
```

## Where do I put a new file?

| I'm adding… | Put it in… |
| --- | --- |
| A new page/route | `app/(site)/<route>/page.tsx` |
| A component used across pages | `components/ui/` |
| A large page section | `components/sections/` |
| A component used inside articles | `components/mdx/` (and register it in `content/mdx-components.tsx` **and** `content/keystatic-components.tsx` — see [mdx-components.md](./mdx-components.md#adding-your-own-component)) |
| Pure logic / a helper | `lib/` |
| A shared TypeScript type | `types/blog.ts` |
| A reusable client hook | `hooks/` |
| A blog post | `content/posts/` (or just use `/keystatic`) |
| An author | `content/authors/` (or `/keystatic` → Team → Authors) |
| A blog image | `public/content/blog/<post-slug>/` — the slug subfolder is mandatory, see [keystatic.md](./keystatic.md#uploading-images) |

## Two components named similarly

A few pairs look redundant but aren't — each has a distinct caller:

- `components/ui/MagicBorderCard.tsx` vs `components/ui/ArticleCard.tsx` — both
  are article cards used by different homepage rails (see
  [architecture.md](./architecture.md#8-homepage-editorial-variety) on why the
  home page deliberately uses several distinct card/rail layouts).
- `components/sections/BlogListContent.tsx` (client search/filter, used by
  `/blog`) vs `components/sections/BlogIndex.tsx` + `components/ui/BlogList.tsx`
  (plain server-rendered list, used by `/blog/category/[category]`).

If you're about to add a third variant, check whether one of these already
does what you need first.

## Known loose end

`components/ui/MotionProvider.tsx` implements a centralized
`reducedMotion="user"` policy for Framer Motion, but nothing currently mounts
it in the tree — components that need reduced-motion awareness call
`useReducedMotion()` individually instead. It's not wired up; don't assume
importing it anywhere actually changes existing animations' behavior.

## Folders we intentionally did NOT create

To avoid enterprise complexity for a solo project, there is no `features/`,
`services/`, or `store/`. Business logic that would live in `services/` is small
enough to live in `lib/`. Introduce those folders only when a real need appears.
