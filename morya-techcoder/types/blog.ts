import type { BlogCategory } from "@/lib/categories";

// Re-exported so UI components can import all blog types from one place.
export type { BlogCategory };

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/**
 * The shape of a single blog post after it has been loaded from disk and had
 * its frontmatter parsed. This is the contract shared between the content
 * layer (`content/loader.ts`) and every UI component that renders a post.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  readingTime: string;
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
  /** Raw MDX/markdown body of the article. */
  body: string;
}
