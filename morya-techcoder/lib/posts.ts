import type { PostSummary, PostDetail } from "@/types/blog";
import type { BlogCategory } from "@/lib/categories";

/** A category value plus the "All" pseudo-category used by the list filter. */
export type CategoryFilter = BlogCategory | "All";

/** Removes article-only fields before data crosses a Server/Client boundary. */
export function toPostSummary(post: PostDetail): PostSummary {
  const { body: _body, ...summary } = post;
  return summary;
}

/**
 * Lowercased text a post can be matched against. Built on the server and sent
 * to the search island so the client never needs the post objects themselves.
 */
export function searchIndexOf(post: PostSummary): string {
  return [post.title, post.excerpt, ...post.tags].join(" ").toLowerCase();
}

/**
 * Filters posts by category and a free-text query (matches title, excerpt,
 * and tags). Kept here — not inside a component — so the same logic can back
 * the blog list, a future global search, and tests.
 */
export function filterPosts<T extends PostSummary>(
  posts: T[],
  { query, category }: { query: string; category: CategoryFilter }
): T[] {
  const q = query.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });
}

/**
 * Returns posts flagged with `featured: true` (newest first), capped at
 * `count`. If nothing is flagged yet, falls back to the N most recent posts
 * so the homepage featured rail never goes blank during content setup.
 */
export function getFeaturedPosts<T extends PostSummary>(posts: T[], count = 3): T[] {
  const flagged = posts.filter((post) => post.featured);
  const pool = flagged.length > 0 ? flagged : posts;
  return pool.slice(0, count);
}

/** Returns up to `count` posts in a given category (all of them if omitted). */
export function getPostsByCategory<T extends PostSummary>(
  posts: T[],
  category: BlogCategory,
  count?: number
): T[] {
  const inCategory = posts.filter((post) => post.category === category);
  return count ? inCategory.slice(0, count) : inCategory;
}

/** Returns related posts in the same category, excluding the current post. */
export function getRelatedPosts<T extends PostSummary>(
  posts: T[],
  current: T,
  count = 2
): T[] {
  return posts
    .filter((post) => post.category === current.category && post.id !== current.id)
    .slice(0, count);
}
