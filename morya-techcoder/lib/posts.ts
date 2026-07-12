import type { BlogPost } from "@/types/blog";
import type { BlogCategory } from "@/lib/categories";

/** A category value plus the "All" pseudo-category used by the list filter. */
export type CategoryFilter = BlogCategory | "All";

/**
 * Filters posts by category and a free-text query (matches title, excerpt,
 * and tags). Kept here — not inside a component — so the same logic can back
 * the blog list, a future global search, and tests.
 */
export function filterPosts(
  posts: BlogPost[],
  { query, category }: { query: string; category: CategoryFilter }
): BlogPost[] {
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

/** Returns the N most recent posts (posts arrive already sorted by date). */
export function getFeaturedPosts(posts: BlogPost[], count = 3): BlogPost[] {
  return posts.slice(0, count);
}

/** Returns up to `count` posts in a given category (all of them if omitted). */
export function getPostsByCategory(
  posts: BlogPost[],
  category: BlogCategory,
  count?: number
): BlogPost[] {
  const inCategory = posts.filter((post) => post.category === category);
  return count ? inCategory.slice(0, count) : inCategory;
}

/** Returns related posts in the same category, excluding the current post. */
export function getRelatedPosts(
  posts: BlogPost[],
  current: BlogPost,
  count = 2
): BlogPost[] {
  return posts
    .filter((post) => post.category === current.category && post.id !== current.id)
    .slice(0, count);
}
