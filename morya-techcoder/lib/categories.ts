/**
 * Single source of truth for content categories.
 *
 * Add or change a category here once and it automatically propagates to:
 *   - the `BlogCategory` union type (derived from these keys)
 *   - the blog list filters and home page sections (`CATEGORY_KEYS`)
 *   - card / badge colors (`categoryColors`)
 *   - the Keystatic editor's category dropdown (`categoryOptions`)
 *   - the on-page topic explorer (`CATEGORIES` metadata)
 *
 * This removes the previous duplication where the category list lived in
 * several files that could silently drift apart.
 *
 * Kept framework-agnostic on purpose: `icon` is a *string* key (a lucide-react
 * icon name), resolved to a component in the UI layer. That keeps this module
 * importable from both server code and the Keystatic config without pulling in
 * React.
 */
export interface CategoryMeta {
  /** Full display label, e.g. shown in section headers and the topic grid. */
  label: string;
  /** Short label for tight spots like the navbar and card badges. */
  short: string;
  /** One-line description used in section headers and topic cards. */
  description: string;
  /** lucide-react icon name, resolved in the UI (see `lib/category-icons`). */
  icon: string;
  /** Tailwind classes for the category badge (bg + text + border). */
  badge: string;
  /** Tailwind class for the small category dot. */
  dot: string;
  /** Tailwind text color used for icon accents in the topic grid. */
  accent: string;
  /** When true, the topic is announced but not yet browsable. */
  comingSoon?: boolean;
}

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
  AI: {
    label: "Artificial Intelligence",
    short: "AI",
    description: "Practical AI, from breakthrough models to everyday workflows.",
    icon: "Sparkles",
    badge: "bg-tc-cat-ai-bg text-tc-cat-ai-text border border-tc-cat-ai-border",
    dot: "bg-tc-cat-ai-text",
    accent: "text-tc-cat-ai-text",
  },
  Technology: {
    label: "Technology",
    short: "Technology",
    description: "The ideas, companies, and gadgets shaping how we live and build.",
    icon: "Cpu",
    badge: "bg-tc-cat-technology-bg text-tc-cat-technology-text border border-tc-cat-technology-border",
    dot: "bg-tc-cat-technology-text",
    accent: "text-tc-cat-technology-text",
  },
  Reviews: {
    label: "Reviews",
    short: "Reviews",
    description: "Honest, hands-on verdicts on the products worth your attention.",
    icon: "Star",
    badge: "bg-tc-cat-reviews-bg text-tc-cat-reviews-text border border-tc-cat-reviews-border",
    dot: "bg-tc-cat-reviews-text",
    accent: "text-tc-cat-reviews-text",
  },
  Guides: {
    label: "Buying Guides",
    short: "Guides",
    description: "Clear recommendations to help you choose with confidence.",
    icon: "Compass",
    badge: "bg-tc-cat-guides-bg text-tc-cat-guides-text border border-tc-cat-guides-border",
    dot: "bg-tc-cat-guides-text",
    accent: "text-tc-cat-guides-text",
  },
  DevTools: {
    label: "Developer Tools",
    short: "Dev Tools",
    description: "The tooling that makes building faster — coming soon.",
    icon: "Wrench",
    badge: "bg-tc-cat-devtools-bg text-tc-cat-devtools-text border border-tc-cat-devtools-border",
    dot: "bg-tc-cat-devtools-text",
    accent: "text-tc-cat-devtools-text",
    comingSoon: true,
  },
} as const satisfies Record<string, CategoryMeta>;

/** Union of all valid category keys, derived from the definitions above. */
export type BlogCategory = keyof typeof CATEGORY_DEFS;

/**
 * Public, uniformly-typed view of the category definitions. Widening to
 * `Record<BlogCategory, CategoryMeta>` means optional fields like `comingSoon`
 * are accessible on every entry (the `as const` literal union would otherwise
 * only expose `comingSoon` on the entries that set it).
 */
export const CATEGORIES: Record<BlogCategory, CategoryMeta> = CATEGORY_DEFS;

/** Ordered list of every category key — use for the topic explorer. */
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as BlogCategory[];

/** Category keys that accept content today (excludes "coming soon" topics). */
export const ACTIVE_CATEGORY_KEYS = CATEGORY_KEYS.filter(
  (key) => !CATEGORIES[key].comingSoon
) as BlogCategory[];

/**
 * URL slug for a category, used by the `/topics/[category]` routes.
 * @example categorySlug("AI") → "ai"; categorySlug("DevTools") → "dev-tools"
 */
export function categorySlug(category: BlogCategory): string {
  return category.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const SLUG_TO_KEY: Record<string, BlogCategory> = Object.fromEntries(
  CATEGORY_KEYS.map((key) => [categorySlug(key), key])
);

/** Resolves a URL slug back to its category key (or `undefined` if unknown). */
export function categoryFromSlug(slug: string): BlogCategory | undefined {
  return SLUG_TO_KEY[slug];
}

/** Convenience: the `/topics/[category]` href for a category. */
export function categoryHref(category: BlogCategory): string {
  return `/topics/${categorySlug(category)}`;
}

/** Badge + dot color classes per category (used by cards and badges). */
export const categoryColors: Record<BlogCategory, { badge: string; dot: string }> =
  Object.fromEntries(
    CATEGORY_KEYS.map((key) => [
      key,
      { badge: CATEGORIES[key].badge, dot: CATEGORIES[key].dot },
    ])
  ) as Record<BlogCategory, { badge: string; dot: string }>;

/**
 * `{ label, value }` options for the Keystatic category select field.
 * "Coming soon" topics are excluded — you can't author into them yet.
 */
export const categoryOptions = ACTIVE_CATEGORY_KEYS.map((key) => ({
  label: CATEGORIES[key].label,
  value: key,
}));
