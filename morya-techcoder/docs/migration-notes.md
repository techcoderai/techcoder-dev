# Migration Notes

What changed in the Keystatic + architecture refactor, and how to work with it.

## Summary

The site's behavior and design are unchanged. The improvements are structural:
cleaner separation of concerns, a single source of truth for categories, a
visual editor (Keystatic), and a reusable MDX component library.

## Content

- **Removed duplicate posts.** Every post previously existed as *both* `.md` and
  `.mdx` (identical), which caused each post to load twice. The `.md` copies were
  deleted; `.mdx` is now the single format.
- **New optional frontmatter:** `draft`, `seo.title`, `seo.description`. Image
  paths (`thumbnail`, `ogImage`) are normalized by the loader.

## Files moved / renamed

| Before | After | Why |
| --- | --- | --- |
| `content/blogs.ts` (types) | `types/blog.ts` | Types belong in `types/`; the old name implied data. |
| `content/loader.tsx` | `content/loader.ts` + `content/mdx-components.tsx` | Split data loading from the MDX presentation map. |
| `app/page.tsx`, `app/blog/**` | `app/(site)/page.tsx`, `app/(site)/blog/**` | Route group so `/keystatic` renders without site chrome. URLs unchanged. |
| Category colors + lists (4 places) | `lib/categories.ts` | Single source of truth. |

## Files added

- `lib/posts.ts` — `filterPosts`, `getFeaturedPosts`, `getPostsByCategory`,
  `getRelatedPosts` (logic extracted from components).
- `hooks/useReadingProgress.ts`, `hooks/useActiveHeading.ts`.
- `components/mdx/*` — Callout, YouTube, Tweet, Steps, InfoCard, FileTree,
  Terminal, Badge, Tabs, Table, MdxImage.
- `keystatic.config.ts`, `content/keystatic-components.tsx`,
  `app/keystatic/[[...params]]/page.tsx`, `app/api/keystatic/[...params]/route.ts`.
- `docs/*`.

## Files removed

- `components/ui/BlogCard.tsx` — was unused (`MagicBorderCard` is the real card).
- `getAllTags()` in the loader — was unused. Re-add when tag filtering ships.

## Dependencies added

- `@keystatic/core`, `@keystatic/next` — the Git-based CMS.
- `react-tweet` — server-rendered tweet embeds.

## Import changes you might notice

- `@/content/blogs` → `@/types/blog`
- Category list/colors → `@/lib/categories` (`CATEGORIES`, `CATEGORY_KEYS`,
  `categoryColors`, `categoryOptions`)

## Nothing to do to keep publishing

Adding a post still means "put an `.mdx` in `content/posts/`" — now with an
optional visual editor at `/keystatic`. No build or registration step changed.
