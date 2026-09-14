import type { BlogCategory } from "@/lib/categories";

// Re-exported so UI components can import all blog types from one place.
export type { BlogCategory };

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/**
 * Catalog facts about a reviewed product. Only what the site needs *outside*
 * the article body lives here — the sidebar summary and the review structured
 * data. The written judgement is a `<Verdict>` block in the body.
 */
export interface ReviewMeta {
  /** Defaults to the article title when not set. */
  product?: string;
  /** 0–5. Drives the sidebar score and the `Review` structured data. */
  rating?: number;
  /** Free-form, as displayed — e.g. "$1,049". */
  price?: string;
}

/** Optional per-article SEO overrides. Everything falls back to the article. */
export interface SeoMeta {
  title?: string;
  description?: string;
  /** Social share image. Falls back to the hero image. */
  ogImage?: string;
  /** Set only when the article was first published somewhere else. */
  canonical?: string;
  /** Keeps the article public but out of search engines and the sitemap. */
  noindex?: boolean;
}

/** A person who can be credited on an article. Loaded from `content/authors/*`. */
export interface Author {
  /** Derived from the filename — stable even if `name` is edited later. */
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  url?: string;
}

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
  coverImage?: string;
  thumbnail: string;
  /** Describes the hero image. Falls back to the title when not set. */
  thumbnailAlt?: string;
  ogImage: string;
  /** Optional difficulty label. Falls back to a value derived from category. */
  difficulty?: Difficulty;
  /** Optional "last updated" ISO date shown alongside the publish date. */
  updated?: string;
  /** Optional list of prerequisites shown in a callout at the top of the article. */
  prerequisites?: string[];
  /** When true, the post is hidden in production but visible in `next dev`. */
  draft?: boolean;
  /**
   * When true, the post is eligible for the homepage "Featured articles"
   * section. Controlled from Keystatic or MDX frontmatter.
   */
  featured?: boolean;
  /** Present only on reviews. Powers the sidebar score and review rich results. */
  review?: ReviewMeta;
  /** Optional SEO overrides. Falls back to `title` / `excerpt` when empty. */
  seo?: SeoMeta;
  /** Who wrote it. Defaults to the primary author when the post doesn't specify one. */
  author: Author;
}

/** A summary plus the raw MDX/markdown body. Only used by the article route. */
export interface PostDetail extends PostSummary {
  body: string;
}

// Aliases so auto-merged files that use the main-branch naming continue to compile.
/** @deprecated Use PostDetail */
export type BlogPost = PostDetail;
/** @deprecated Use PostSummary */
export type BlogPostSummary = PostSummary;
