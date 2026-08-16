import type { PostSummary } from "@/types/blog";
import type { BlogCategory } from "@/lib/categories";

/**
 * Lowercased text a post can be matched against. Built on the server and sent
 * to the search island so the client never needs the post objects themselves.
 */
export function searchIndexOf(post: PostSummary): string {
  return [post.title, post.excerpt, ...post.tags].join(" ").toLowerCase();
}

/** Returns the N most recent posts (posts arrive already sorted by date). */
export function getFeaturedPosts(posts: PostSummary[], count = 3): PostSummary[] {
  return posts.slice(0, count);
}

/** Returns up to `count` posts in a given category (all of them if omitted). */
export function getPostsByCategory(
  posts: PostSummary[],
  category: BlogCategory,
  count?: number
): PostSummary[] {
  const inCategory = posts.filter((post) => post.category === category);
  return count ? inCategory.slice(0, count) : inCategory;
}

/** Returns related posts in the same category, excluding the current post. */
export function getRelatedPosts(
  posts: PostSummary[],
  current: PostSummary,
  count = 2
): PostSummary[] {
  return posts
    .filter((post) => post.category === current.category && post.id !== current.id)
    .slice(0, count);
}
