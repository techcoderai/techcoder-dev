# Folder Structure

```
morya-techcoder/
├── app/                      # Next.js App Router (routing lives here)
│   ├── layout.tsx            # Root layout: <html>, fonts, theme script (minimal)
│   ├── globals.css           # Design tokens (--tc-*), typography, animations
│   ├── (site)/               # Route group for the public site (no URL segment)
│   │   ├── layout.tsx        # Navbar + Footer + ambient background
│   │   ├── page.tsx          # Home page  →  /
│   │   └── blog/
│   │       ├── page.tsx      # Blog list  →  /blog
│   │       └── [slug]/page.tsx  # Article  →  /blog/:slug (SSG)
│   ├── keystatic/[[...params]]/page.tsx   # Keystatic admin UI  →  /keystatic
│   └── api/keystatic/[...params]/route.ts # Keystatic read/write API
│
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Big page sections (Hero, HomeContent, FAQ, …)
│   ├── ui/                   # Small reusable UI (cards, badges, CodeBlock, …)
│   └── mdx/                  # Building blocks used INSIDE articles
│
├── content/
│   ├── posts/*.mdx           # The blog posts themselves
│   ├── loader.ts             # Reads/parses posts → BlogPost[]  (DATA)
│   ├── mdx-components.tsx     # MDX tag → React component map    (PRESENTATION)
│   └── keystatic-components.tsx  # Insertable components for the Keystatic editor
│
├── hooks/                    # Reusable client hooks
│   ├── useReadingProgress.ts
│   └── useActiveHeading.ts
│
├── lib/                      # Pure logic (no React, no I/O side effects)
│   ├── categories.ts         # SINGLE SOURCE OF TRUTH for categories
│   ├── posts.ts              # filterPosts / getFeaturedPosts / getRelatedPosts …
│   └── utils.ts              # cn, formatDate, slugify, getHeadings
│
├── types/
│   └── blog.ts               # BlogPost, Difficulty (shared types)
│
├── public/
│   └── content/blog/         # Blog images (Keystatic uploads land here)
│
├── docs/                     # You are here
│
├── keystatic.config.ts       # Keystatic schema + storage config (repo root)
├── next.config.ts
└── tsconfig.json             # `@/*` path alias → project root
```

## Where do I put a new file?

| I'm adding… | Put it in… |
| --- | --- |
| A new page/route | `app/(site)/<route>/page.tsx` |
| A component used across pages | `components/ui/` |
| A large page section | `components/sections/` |
| A component used inside articles | `components/mdx/` (and register it in `content/mdx-components.tsx`) |
| Pure logic / a helper | `lib/` |
| A shared TypeScript type | `types/` |
| A reusable client hook | `hooks/` |
| A blog post | `content/posts/` (or just use `/keystatic`) |
| A blog image | `public/content/blog/` (Keystatic does this for you) |

## Folders we intentionally did NOT create

To avoid enterprise complexity for a solo project, there is no `features/`,
`services/`, or `store/`. Business logic that would live in `services/` is small
enough to live in `lib/`. Introduce those folders only when a real need appears.
