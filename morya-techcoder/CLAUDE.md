# TechCoder Platform - Codebase Knowledge

@AGENTS.md

## Project Overview

**TechCoder** is a modern, MDX-based tech publishing platform for articles, news, and developer knowledge. Built with Next.js 16.2 App Router and Tailwind CSS v4, now integrated with **Keystatic CMS** for visual content editing while maintaining a file-first architecture.

**Current Branch:** `techcoder-architecture-refactor-and-keystatic-integration`  
**Latest Commit:** `8b3a7e1 - Architectural refactoring and optimizations - Added Keystatic support for posts`

**Tech Stack:**
- Next.js 16.2 (App Router, React Server Components)
- React 19.2.4 + TypeScript
- Tailwind CSS v4 (PostCSS-based)
- MDX via next-mdx-remote v6.0.0
- **Keystatic 0.5.50** (Git-based CMS)
- Framer Motion 12.38.0 for animations
- Lucide React for icons

**Key Characteristics:**
- Static site generation (SSG) - no database required
- **Git-based CMS** (Keystatic) - visual editor that writes plain MDX to filesystem
- File-first architecture - content lives in Git, CMS is optional
- Zero-config publishing workflow
- Full TypeScript coverage with strict mode
- Light/dark theme support
- Production-ready for Vercel deployment

---

## Architecture (Post-Refactor)

### Core Principles

1. **One-Way Content Flow** - Files → Loader → Server Components → Client (props only)
2. **Single Source of Truth** - Categories, types, and logic in dedicated files (no duplication)
3. **Separation of Concerns** - Data (loader) vs Presentation (components) vs Logic (lib)
4. **Progressive Enhancement** - Keystatic is optional, site works without it
5. **Framework-Agnostic Logic** - Pure functions in `lib/` could work with any React framework

### Directory Structure

```
morya-techcoder/
├── app/                              # Next.js App Router
│   ├── globals.css                   # Design system tokens & theming
│   ├── layout.tsx                    # Root layout (fonts + theme provider)
│   ├── (site)/                       # 🆕 Route group for public site
│   │   ├── layout.tsx                # Navbar + Footer + ambient background
│   │   ├── page.tsx                  # Home page (Hero + topic grid + rails)
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog list with search & filters
│   │   │   └── [slug]/page.tsx       # Dynamic blog detail pages
│   │   └── topics/
│   │       └── [category]/page.tsx   # 🆕 Per-topic landing pages (SSG)
│   ├── keystatic/                    # 🆕 Keystatic admin UI
│   │   └── [[...params]]/page.tsx   # Visual CMS editor at /keystatic
│   └── api/keystatic/                # 🆕 Keystatic file operations API
│       └── [...params]/route.ts     # POST/GET handlers for file writes
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Glassmorphic navbar with blur-on-scroll
│   │   └── Footer.tsx                # Multi-column footer with social links
│   ├── sections/
│   │   ├── HeroSection.tsx           # Animated hero with 3D code preview
│   │   ├── TopicGrid.tsx             # 🆕 On-page topic discovery (reusable category treatment)
│   │   ├── HomeContent.tsx           # Category-grouped post grids
│   │   ├── BlogListContent.tsx       # Client-side search & filtering
│   │   └── TrustedBy, Capabilities, Testimonials, FAQ, etc.
│   ├── ui/
│   │   ├── MagicBorderCard.tsx       # Compact, elegant article card
│   │   ├── CategoryBadge.tsx         # 🆕 Reusable color-coded category pill
│   │   ├── CardCarousel.tsx          # 🆕 Responsive snapping slider (featured rail)
│   │   ├── CodeBlock.tsx             # Copy-to-clipboard code blocks
│   │   ├── TableOfContents.tsx       # Auto-generated TOC (uses useActiveHeading hook)
│   │   ├── ReadingProgress.tsx       # Scroll progress bar (uses useReadingProgress hook)
│   │   ├── NewsletterBox.tsx         # Email subscription form
│   │   ├── ThemeToggle.tsx           # Light/dark mode switcher
│   │   ├── DifficultyBadge.tsx       # Visual difficulty indicators
│   │   ├── HeadingLink.tsx           # Anchor links for headings
│   │   └── SectionHeading, Reveal, etc.
│   └── mdx/                          # 🆕 MDX component library (11 components)
│       ├── Callout.tsx               # Colored boxes (note/tip/warning/danger)
│       ├── YouTube.tsx               # Responsive video embeds
│       ├── Tweet.tsx                 # Server-rendered tweets
│       ├── Terminal.tsx              # Terminal window styling
│       ├── Steps.tsx                 # Numbered step-by-step guides
│       ├── InfoCard.tsx              # Highlight card grids
│       ├── FileTree.tsx              # Folder structure visualization
│       ├── Badge.tsx                 # Inline labels
│       ├── Tabs.tsx                  # Tabbed content (npm vs pnpm)
│       ├── Table.tsx                 # Scrollable table wrapper
│       └── MdxImage.tsx              # Next.js Image wrapper with captions
│
├── content/
│   ├── loader.ts                     # 🔄 Pure data layer (was .tsx, now .ts)
│   ├── mdx-components.tsx            # 🆕 Presentation layer (MDX → React mapping)
│   ├── keystatic-components.tsx      # 🆕 Keystatic editor component config
│   └── posts/*.mdx                   # Blog posts (MDX only, no .md duplicates)
│
├── lib/                              # 🔄 Pure logic (framework-agnostic)
│   ├── categories.ts                 # 🔄 SINGLE SOURCE OF TRUTH for categories (6 topics)
│   ├── category-icons.ts             # 🆕 Maps category icon names → lucide components
│   ├── posts.ts                      # 🆕 Business logic (filtering, featured, related)
│   └── utils.ts                      # Helpers (cn, formatDate, calcReadingTime)
│
├── types/                            # 🆕 Dedicated types directory
│   └── blog.ts                       # 🔄 Moved from content/blogs.ts
│
├── hooks/                            # 🆕 Reusable client hooks
│   ├── useReadingProgress.ts         # Extracted scroll percentage logic
│   └── useActiveHeading.ts           # Extracted intersection observer logic
│
├── docs/                             # 🆕 Comprehensive documentation (8 files)
│   ├── README.md                     # Documentation index
│   ├── architecture.md               # Stack, principles, decisions
│   ├── blog-system.md                # Content loading, routing, helpers
│   ├── keystatic.md                  # Why Keystatic, workflow, field reference
│   ├── mdx-components.md             # Component library reference
│   ├── conventions.md                # Naming, imports, styling rules
│   ├── authoring-workflow.md         # Publishing workflow (visual vs code)
│   ├── folder-structure.md           # Directory map
│   ├── migration-notes.md            # What changed in refactor
│   ├── troubleshooting.md            # Common issues and fixes
│   └── architect-review.md           # 🆕 Principal architect's assessment
│
├── keystatic.config.ts               # 🆕 Keystatic schema & collections
└── public/content/blog/              # 🆕 Uploaded blog images (Keystatic managed)
```

### Routes

- `/` - Home page (hero, topic grid, featured carousel + editorial rails)
- `/blog` - Full article library with search and category filters
- `/blog/[slug]` - Individual blog post pages (SSG via generateStaticParams)
- `/topics/[category]` - 🆕 Per-topic landing pages (SSG for all 6 topics; empty
  and "coming soon" topics render a graceful state). Slug via `categorySlug()`,
  e.g. `/topics/ai`, `/topics/dev-tools`. This is the primary category route the
  nav/footer/topic-grid link to; `/blog?category=` still works for direct links.
- `/keystatic` - Visual CMS admin interface (full-screen, no site chrome)

### Route Group Pattern

**Why `(site)/`?**
- Isolates public site layout (Navbar + Footer) from Keystatic admin UI
- Parentheses mean NO URL segment added (routes stay `/` and `/blog/...`)
- `/keystatic` renders without Navbar/Footer chrome (full-screen editor)

---

## Content Management System

### Publishing Workflow (Two Options)

#### Option 1: Visual Editor (Keystatic)
1. Navigate to `/keystatic` in your browser
2. Click "Posts" collection
3. Click "Create Entry"
4. Fill in fields (title, excerpt, category, tags, etc.)
5. Upload images via UI (stored in `public/content/blog/`)
6. Write content in visual editor with insertable components
7. Click "Save" - writes `.mdx` file to `content/posts/`

#### Option 2: Manual (Code Editor)
1. Create `.mdx` file in `content/posts/` (filename becomes URL slug)
2. Add frontmatter (title, excerpt, date, category, tags, thumbnail)
3. Write content in markdown/MDX with React components
4. Deploy - post appears automatically

**Both workflows write to the same place** - `content/posts/*.mdx` files in Git.

### Keystatic Integration

**Storage Strategy:**
- **Development:** `storage: { kind: "local" }` (writes to local filesystem)
- **Production:** `storage: { kind: "github" }` (commits directly to GitHub via API)

**Why Keystatic?**
- Visual editor + image uploads + live preview
- **Still writes plain .mdx files to Git** (no database lock-in)
- Can stop using it anytime (site keeps working)
- Better than headless CMSes (no cost, no content lock-in)
- Better than Notion-as-CMS (no lossy component mapping)

**Editor Components:**
- **Insertable from UI:** Callout, Terminal, InfoCard, YouTube, Tweet
- **Manual MDX only:** Steps, Tabs, FileTree, Table, Badge (too complex for visual editor)

### Blog Post Schema

**Location:** `types/blog.ts` (was `content/blogs.ts`)

```typescript
export type BlogCategory = keyof typeof CATEGORIES;  // Derived from lib/categories
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;                  // ISO format (YYYY-MM-DD)
  category: BlogCategory;         // "Programming" | "AI" | "Technology" | "Reviews" | "Guides" | "DevTools"
  tags: string[];
  readingTime: string;            // Auto-calculated (238 wpm)
  thumbnail: string;
  ogImage: string;
  difficulty?: Difficulty;
  updated?: string;               // Optional last updated date
  prerequisites?: string[];
  draft?: boolean;                // 🆕 Visibility toggle (dev vs prod)
  seo?: {                         // 🆕 SEO overrides
    title?: string;
    description?: string;
  };
  body: string;                   // Raw MDX content
}
```

**New Fields:**
- `draft: boolean` - Filters posts in production (visible in dev only)
- `seo: { title?, description? }` - Override default title/description for SEO

### Content Loader Architecture

**File:** `content/loader.ts` (was `loader.tsx`)

**Key Change:** Split into two files:
- **`loader.ts`** - Pure data loading (no JSX, no React imports)
- **`mdx-components.tsx`** - Presentation mapping (MDX tags → React components)

**Build-time process:**
```
1. loader.ts executes at module load
   ├─> findPostFiles() recursively scans content/posts/
   ├─> gray-matter parses YAML frontmatter + body
   ├─> resolveAsset() normalizes image paths (bare filenames → /content/blog/...)
   ├─> calcReadingTime() calculates reading time (238 wpm for technical content)
   ├─> Filters drafts (SHOW_DRAFTS = NODE_ENV !== "production")
   ├─> Sorts by date (newest first)
   └─> Caches as blogPosts array (singleton for process lifetime)

2. Exports:
   - blogPosts: BlogPost[]         (all posts, sorted)
   - getBlogBySlug(slug)            (single post lookup)
   - getCategories()                (unique categories)
   - compileBlogContent(body)       (MDX → React element)

3. Server components import directly:
   - app/(site)/page.tsx → getFeaturedPosts()
   - app/(site)/blog/page.tsx → blogPosts + getCategories()
   - app/(site)/blog/[slug]/page.tsx → getBlogBySlug() + compileBlogContent()

4. Client components receive data via props only
   - NEVER import content/loader.ts in client components (protected by "server-only")
```

**MDX Compilation:**
```typescript
// In blog detail page
const mdxContent = await compileBlogContent(post.body);

// Internally uses next-mdx-remote/rsc
compileMDX({
  source: rawBody,
  components: mdxComponents,  // from content/mdx-components.tsx
  options: { parseFrontmatter: false }
})
```

---

## Design System

### Color System (`app/globals.css`)

**Brand Colors:**
- Primary: Orange gradient (`#F97316` → `#FDBA74`)
- Accent: Rose/pink for "New" badges (`#F43F5E`)

**Category Colors (from `lib/categories.ts`), one accent per topic:**
- Programming: Blue tones
- AI (Artificial Intelligence): Orange tones (the brand accent)
- Technology: Cyan/teal tones
- Reviews: Violet tones
- Guides (Buying Guides): Emerald tones
- DevTools (Developer Tools): Slate tones — flagged `comingSoon`

**Theme:** 40+ CSS custom properties (`--tc-*` tokens) with light/dark mode support

### Single Source of Truth: Categories

**File:** `lib/categories.ts`

**Before Refactor:** Categories duplicated in 4+ files (types, filters, section headers, colors)  
**After Refactor:** Everything derives from ONE object:

```typescript
// Rich metadata per topic. Icons are string keys (lucide names) so this module
// stays framework-agnostic; lib/category-icons.ts resolves them to components.
const CATEGORY_DEFS = {
  Programming: {
    label: "Programming",
    short: "Programming",
    description: "Languages, frameworks, and the craft of writing great software.",
    icon: "Code2",
    badge: "bg-tc-cat-programming-bg text-tc-cat-programming-text border border-tc-cat-programming-border",
    dot: "bg-tc-cat-programming-text",
    accent: "text-tc-cat-programming-text",
  },
  AI: { /* Artificial Intelligence */ },
  Technology: { /* ... */ },
  Reviews: { /* ... */ },
  Guides: { /* Buying Guides */ },
  DevTools: { /* Developer Tools, comingSoon: true */ },
} as const satisfies Record<string, CategoryMeta>;

// Derived exports (automatic from the definitions)
export type BlogCategory = keyof typeof CATEGORY_DEFS;
// Widened view so optional fields (e.g. comingSoon) are accessible everywhere
export const CATEGORIES: Record<BlogCategory, CategoryMeta> = CATEGORY_DEFS;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as BlogCategory[];
// Keys that accept content today (excludes "coming soon" topics)
export const ACTIVE_CATEGORY_KEYS = CATEGORY_KEYS.filter((k) => !CATEGORIES[k].comingSoon);
export const categoryColors = /* map from CATEGORIES */;
export const categoryOptions = /* for Keystatic dropdown */;
```

**To add a category:** Edit `CATEGORIES` once. Type, UI, Keystatic dropdown, and colors all update automatically.

### Typography

- **Headings:** Space Grotesk (700-400 weights)
- **Body:** Inter (300-700 weights)
- **Mono:** JetBrains Mono (400-700 weights)
- Responsive type scale with `clamp()` functions
- Utility classes: `.display-xl`, `.heading-xl`, `.heading-lg`, etc.

### Blog Prose (`.prose-tc`)

Custom typography for MDX content with responsive font sizes, styled code blocks, orange accent links, and optimized line-height (1.8) for technical reading.

---

## Key Features

### Content Features
- **Automatic excerpt** from frontmatter
- **Tags system** with clickable tags
- **Category badges** color-coded by topic
- **"New" badges** for posts < 7 days old
- **Updated dates** shown when post revised
- **OG images** for social sharing
- **Estimated reading time** (238 wpm for technical content)
- **Difficulty indicators** (Beginner/Intermediate/Advanced)
- **Prerequisites callout** for tutorials
- **Draft mode** - posts visible in dev only (filtered in production)

### Reading Experience
- **Auto-generated Table of Contents** with active section tracking (IntersectionObserver)
- **Reading progress bar** at top of page
- **Syntax-highlighted code blocks** with copy-to-clipboard
- **Auto-collapse** for tall code blocks (>460px)
- **Related posts** at bottom of articles
- **Anchor links** on h2/h3 headings

### Search & Filtering
- **Real-time search** across title, excerpt, and tags
- **Category filters** with active state highlighting
- **URL-based filtering** (`?category=AI`)
- Client-side implementation for instant results

### MDX Component Library (11 Components)

1. **Callout** - Colored boxes (note/tip/warning/danger)
2. **YouTube** - Responsive video embeds
3. **Tweet** - Server-rendered tweets (react-tweet)
4. **Terminal** - Terminal window styling
5. **Steps + Step** - Numbered step-by-step guides
6. **InfoCards + InfoCard** - Highlight card grids
7. **FileTree + Folder + File** - Folder structure visualization
8. **Badge** - Inline labels (default/primary/success/warning/danger)
9. **Tabs + Tab** - Tabbed content (e.g., npm vs pnpm)
10. **Table** - Scrollable table wrapper
11. **MdxImage** - Next.js Image wrapper with captions

**Documentation:** See [docs/mdx-components.md](docs/mdx-components.md) for full reference with examples.

### Performance
- **Static Site Generation** for all routes (pre-rendered at build time)
- **Code splitting** per route
- **Optimized images** with Next.js Image
- **Font optimization** with next/font
- **Minimal JavaScript** - RSC-first architecture
- **Content caching** - Posts loaded once at build, cached for process lifetime

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Focus rings on all clickable items (`.focus-ring`)
- Keyboard navigation support
- Color contrast meets WCAG AA
- Respects `prefers-reduced-motion`

---

## Data Flow

### Content Publishing Flow

```
1. Author creates/edits content
   ├─> Option A: Keystatic UI at /keystatic (visual editor)
   └─> Option B: Code editor (manual MDX)
   
2. Content written to content/posts/*.mdx (both paths write to same place)

3. Build time: loader.ts executes
   ├─> findPostFiles() finds all .mdx files
   ├─> gray-matter parses frontmatter + body
   ├─> resolveAsset() normalizes image paths
   ├─> calcReadingTime() analyzes word count
   ├─> Filters drafts (dev vs production)
   └─> Returns BlogPost[] array sorted by date

4. generateStaticParams() creates routes for all slugs

5. Page rendering (SSR)
   ├─> getBlogBySlug(slug) finds post
   ├─> compileBlogContent() compiles MDX to React
   ├─> getHeadings() extracts h2/h3 for TOC
   └─> Returns fully rendered page

6. Client hydration
   ├─> ReadingProgress tracks scroll (useReadingProgress hook)
   ├─> TableOfContents highlights active section (useActiveHeading hook)
   └─> CodeBlock enables copy button
```

### Data Sources

**Server-side (build time):**
- `content/loader.ts` - Single source of truth
- `blogPosts` array exported for all pages
- `getBlogBySlug()` for individual posts
- `lib/posts.ts` - Business logic (filtering, featured, related)

**Client-side:**
- Posts passed as props to client components
- Search/filter state: React useState
- Theme preference: localStorage (`tc-theme`)
- URL params for category filtering

**State Management:**
- No external state library (Redux, Zustand, etc.)
- Theme: localStorage + HTML class toggle
- URL as source of truth for filters
- Component-local state for search, menu, scroll position

---

## Development Guidelines

### Import Rules

**Always use `@/` alias (never deep relative paths):**
```typescript
import { cn } from "@/lib/utils";
import { blogPosts } from "@/content/loader";
import { CATEGORIES } from "@/lib/categories";
import type { BlogPost } from "@/types/blog";
```

**Never import `content/loader.ts` in client components** (protected by `"use server"` and `server-only` package)

### Adding New Blog Posts

**Via Keystatic (Visual):**
1. Navigate to `/keystatic`
2. Click "Posts" → "Create Entry"
3. Fill in fields, upload images
4. Save - writes `.mdx` file automatically

**Via Code Editor (Manual):**
1. Create `.mdx` file in `content/posts/` (e.g., `my-new-post.mdx`)
2. Add frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   excerpt: "Brief description for SEO and cards"
   date: "2026-07-12"
   category: "Programming"  # or "AI" | "Technology" | "Reviews" | "Guides"
   tags: ["nextjs", "typescript"]
   thumbnail: "/content/blog/post-thumbnail.jpg"
   ogImage: "/content/blog/post-og.jpg"
   difficulty: "Intermediate"  # optional
   prerequisites: ["Basic React", "TypeScript"]  # optional
   draft: false  # optional (defaults false)
   ---
   ```
3. Write content in markdown/MDX
4. Run `npm run dev` to preview
5. Deploy - Next.js automatically generates route

### Working with Components

**Server Components (default):**
- All components in `/app` and `/content` are Server Components
- Can directly access filesystem, databases, etc.
- Use `"use server"` directive when needed

**Client Components:**
- Use `"use client"` directive at top
- Required for: useState, useEffect, event handlers, browser APIs
- Examples: `BlogListContent.tsx`, `ThemeToggle.tsx`, `CodeBlock.tsx`

**Never mix:** Server-only imports in client components will fail

### Adding New Categories

1. Edit `lib/categories.ts` - add to `CATEGORIES` object
2. Done! Type, UI filters, Keystatic dropdown, and colors all update automatically

No need to edit types, filter pills, section headers, or color mappings separately.

### Styling Conventions

- Use Tailwind utility classes (Tailwind v4 syntax)
- Design tokens via `--tc-*` CSS variables (defined in `globals.css`)
- Conditional classes with `cn()` helper (`clsx` + `tailwind-merge`)
- Avoid inline styles except for dynamic values (e.g., `style={{ width: percent }}`)
- Animation classes: `.animate-fade-up`, `.animate-float`, `.animate-pulse-slow`

---

## File Locations Reference

### Core Files
- [app/layout.tsx](app/layout.tsx) - Root layout (fonts + theme provider)
- [app/(site)/layout.tsx](app/(site)/layout.tsx) - Site layout (Navbar + Footer)
- [app/globals.css](app/globals.css) - Design system tokens & theming
- [content/loader.ts](content/loader.ts) - Content loader (data layer)
- [content/mdx-components.tsx](content/mdx-components.tsx) - MDX presentation layer
- [content/keystatic-components.tsx](content/keystatic-components.tsx) - Keystatic editor config
- [keystatic.config.ts](keystatic.config.ts) - Keystatic schema & collections
- [types/blog.ts](types/blog.ts) - TypeScript type definitions
- [lib/categories.ts](lib/categories.ts) - SINGLE SOURCE OF TRUTH for categories
- [lib/posts.ts](lib/posts.ts) - Business logic (filtering, featured, related)
- [lib/utils.ts](lib/utils.ts) - Helper functions

### Key Components
- [components/layout/Navbar.tsx](components/layout/Navbar.tsx) - Glassmorphic navbar
- [components/sections/HeroSection.tsx](components/sections/HeroSection.tsx) - Animated hero
- [components/sections/BlogListContent.tsx](components/sections/BlogListContent.tsx) - Search & filters
- [components/ui/MagicBorderCard.tsx](components/ui/MagicBorderCard.tsx) - Blog cards
- [components/ui/TableOfContents.tsx](components/ui/TableOfContents.tsx) - Auto TOC
- [components/ui/CodeBlock.tsx](components/ui/CodeBlock.tsx) - Code blocks with copy
- [components/mdx/](components/mdx/) - MDX component library (11 components)

### Custom Hooks
- [hooks/useReadingProgress.ts](hooks/useReadingProgress.ts) - Scroll percentage
- [hooks/useActiveHeading.ts](hooks/useActiveHeading.ts) - Active TOC heading

### Pages
- [app/(site)/page.tsx](app/(site)/page.tsx) - Home page
- [app/(site)/blog/page.tsx](app/(site)/blog/page.tsx) - Blog list
- [app/(site)/blog/[slug]/page.tsx](app/(site)/blog/[slug]/page.tsx) - Blog detail
- [app/keystatic/[[...params]]/page.tsx](app/keystatic/[[...params]]/page.tsx) - Keystatic admin UI

### Content
- [content/posts/](content/posts/) - All blog posts (8 MDX files)

### Documentation
- [docs/README.md](docs/README.md) - Documentation index
- [docs/architecture.md](docs/architecture.md) - Stack, principles, decisions
- [docs/blog-system.md](docs/blog-system.md) - Content loading, routing
- [docs/keystatic.md](docs/keystatic.md) - Keystatic workflow, storage modes
- [docs/mdx-components.md](docs/mdx-components.md) - Component reference
- [docs/conventions.md](docs/conventions.md) - Naming, imports, styling
- [docs/architect-review.md](docs/architect-review.md) - Principal architect assessment

---

## Common Tasks

### Run Development Server
```bash
npm run dev
# Opens http://localhost:3000
# Keystatic admin at http://localhost:3000/keystatic
```

### Build for Production
```bash
npm run build
npm run start  # Test production build locally
```

### Deploy to Vercel
```bash
git push origin main
# Auto-deploys via GitHub integration
```

Or use Vercel CLI:
```bash
vercel deploy --prod
```

---

## Important Notes

### Next.js 16.2 Changes
- Uses App Router (NOT Pages Router)
- React Server Components by default
- File-based routing in `/app` directory
- Route groups with `(folder)` syntax (no URL segment)
- `generateStaticParams()` replaces `getStaticPaths()`
- `layout.tsx` replaces `_app.tsx`

### Server-Only Code
- `content/loader.ts` uses `"use server"` and `server-only` package
- File system operations only in Server Components
- Client components receive data via props (never import loader)

### Custom Hooks
- `useReadingProgress()` - Returns 0-100 scroll percentage
- `useActiveHeading()` - Returns ID of heading currently in viewport

### Theme Persistence
- Stored in `localStorage` as `tc-theme`
- HTML class `.dark` toggles dark mode
- Inline script in layout prevents flash
- System preference detection via `prefers-color-scheme`

---

## Architectural Review Summary

**Grade:** A- (see [docs/architect-review.md](docs/architect-review.md) for full assessment)

**Strengths:**
- ⭐⭐⭐⭐⭐ Exceptional documentation (8 comprehensive docs)
- ⭐⭐⭐⭐⭐ Clean separation of concerns (data/presentation/logic)
- ⭐⭐⭐⭐⭐ Single source of truth pattern (categories)
- ⭐⭐⭐⭐⭐ Progressive enhancement (Keystatic is optional)
- ⭐⭐⭐⭐⭐ Route group pattern (clean admin UI isolation)

**Primary Gap:**
- ⚠️  Zero test coverage (add tests for `lib/` pure functions)

**Key Wins:**
1. Eliminated duplicate posts (14 files → 7 files)
2. Consolidated category definitions (4 locations → 1 location)
3. Added visual CMS without lock-in
4. Created reusable MDX component library (11 components)
5. Extracted testable pure functions

---

## Dependencies

### Production
- `next@16.2.0` - Framework
- `react@19.2.4` - UI library
- `@keystatic/core@0.5.50` - 🆕 CMS core
- `@keystatic/next@5.0.4` - 🆕 Next.js integration
- `next-mdx-remote@6.0.0` - MDX rendering
- `gray-matter@4.0.3` - Frontmatter parsing
- `framer-motion@12.38.0` - Animations
- `lucide-react@0.577.0` - Icons
- `react-tweet@3.3.1` - 🆕 Tweet embeds
- `clsx@2.1.1` + `tailwind-merge@3.5.0` - Class merging
- `server-only@0.0.1` - Enforce server-side execution

### Development
- `typescript@5` - Type checking
- `tailwindcss@4` - Styling (PostCSS-based)
- `eslint@9` - Linting
- `@types/node`, `@types/react`, `@types/react-dom` - TypeScript types

---

## Future Enhancements Ready for Integration

- **Newsletter Backend:** Form component ready in [NewsletterBox.tsx](components/ui/NewsletterBox.tsx)
- **Comments System:** Blog detail page structure supports comment section
- **Author Profiles:** Schema can be extended with author field
- **RSS Feed:** Blog posts array can be serialized to RSS/Atom
- **Sitemap:** Can be auto-generated from `blogPosts` array
- **Analytics:** Add Vercel Analytics or Google Analytics in layout
- **Search Backend:** Upgrade to Algolia/Typesense (current search is client-side)
- **i18n:** Next.js 16 has built-in i18n support

---

## Contact & Support

**Repository:** d:\techcoder-dev\morya-techcoder  
**Author:** Atharva Yadav  
**Git User:** Atharva Yadav  
**Current Branch:** techcoder-architecture-refactor-and-keystatic-integration

**Recent Changes:**
- Architectural refactoring completed (commit 8b3a7e1)
- Keystatic CMS integration
- MDX component library (11 components)
- Custom hooks extracted (useReadingProgress, useActiveHeading)
- Comprehensive documentation (8 docs files)
- Single source of truth for categories

---

_Last updated: 2026-07-12_  
_This knowledge base is maintained for Claude Code to understand the TechCoder platform architecture._
