import type { BlogCategory } from "@/lib/categories";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/**
 * Everything needed to render a post in a card, list, or related-posts grid.
 * Deliberately excludes the article body so list views cannot serialize an
 * entire article into the client payload.
 */
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  readingTime: string;
  coverImage: string;
  thumbnail: string;
  ogImage: string;
  /** Optional difficulty label. Falls back to a value derived from category. */
  difficulty?: Difficulty;
  /** Optional "last updated" ISO date shown alongside the publish date. */
  updated?: string;
  /** Optional list of prerequisites shown in a callout at the top of the article. */
  prerequisites?: string[];
  /** When true, the post is hidden in production but visible in `next dev`. */
  draft?: boolean;
  /** Optional SEO overrides. Falls back to `title` / `excerpt` when empty. */
  seo?: { title?: string; description?: string };
}

/** A summary plus the raw MDX/markdown body. Only used by the article route. */
export interface PostDetail extends PostSummary {
  body: string;
}
