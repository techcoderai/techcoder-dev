/**
 * Single source of truth for blog categories.
 *
 * Add a new category here once and it automatically propagates to:
 *   - the `BlogCategory` union type (derived from these keys)
 *   - the blog list filters and home page sections (`CATEGORY_KEYS`)
 *   - card / badge colors (`categoryColors`)
 *   - the Keystatic editor's category dropdown (`categoryOptions`)
 *
 * This removes the previous duplication where the category list lived in
 * four different files that could silently drift apart.
 */
export const CATEGORIES = {
  AI: {
    label: "AI & Machine Learning",
    description: "Latest breakthroughs and practical AI engineering",
    badge: "bg-tc-cat-ai-bg text-tc-cat-ai-text border border-tc-cat-ai-border",
    dot: "bg-tc-cat-ai-text",
  },
  WebDev: {
    label: "Web Development",
    description: "Modern frameworks, tools, and best practices",
    badge: "bg-tc-cat-webdev-bg text-tc-cat-webdev-text border border-tc-cat-webdev-border",
    dot: "bg-tc-cat-webdev-text",
  },
  Tricks: {
    label: "Tips & Tricks",
    description: "Shortcuts and hacks that boost your productivity",
    badge: "bg-tc-cat-tricks-bg text-tc-cat-tricks-text border border-tc-cat-tricks-border",
    dot: "bg-tc-cat-tricks-text",
  },
} as const;

/** Union of all valid category keys, derived from `CATEGORIES`. */
export type BlogCategory = keyof typeof CATEGORIES;

/** Ordered list of category keys — use for filters and iteration. */
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as BlogCategory[];

/** Badge + dot color classes per category (used by cards and badges). */
export const categoryColors: Record<BlogCategory, { badge: string; dot: string }> =
  Object.fromEntries(
    CATEGORY_KEYS.map((key) => [
      key,
      { badge: CATEGORIES[key].badge, dot: CATEGORIES[key].dot },
    ])
  ) as Record<BlogCategory, { badge: string; dot: string }>;

/** `{ label, value }` options for the Keystatic category select field. */
export const categoryOptions = CATEGORY_KEYS.map((key) => ({
  label: CATEGORIES[key].label,
  value: key,
}));
