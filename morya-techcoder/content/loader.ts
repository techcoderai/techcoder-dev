import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { calcReadingTime } from "@/lib/utils";
import type { PostDetail, PostSummary, Difficulty, ReviewMeta, SeoMeta } from "@/types/blog";
import { ACTIVE_CATEGORY_KEYS, type BlogCategory } from "@/lib/categories";
import { mdxComponents } from "@/content/mdx-components";
import { getAuthor } from "@/lib/author";
import { resolveAsset } from "@/lib/assets";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Drafts are hidden in production but stay visible in `next dev` for preview. */
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

/** Public path where Keystatic writes uploaded blog images. */
const IMAGE_PUBLIC_PATH = "/content/blog";

/**
 * Normalizes a frontmatter date to `YYYY-MM-DD`.
 *
 * Unquoted YAML dates (which Keystatic writes) are parsed into JS `Date`
 * objects by gray-matter, while hand-written quoted dates stay strings. Without
 * this, `<time dateTime>` emits a non-ISO value and a `Date` ends up in the RSC
 * payload.
 */
function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

/**
 * Normalizes the SEO block. `ogImage` moved under `seo` when the schema was
 * reorganized; the legacy top-level key is still honoured so older posts (and
 * anything hand-written against the old shape) keep their share image.
 */
function resolveSeo(data: Record<string, unknown>): SeoMeta | undefined {
  const seo = (data.seo ?? {}) as SeoMeta;
  const ogImage = resolveAsset(seo.ogImage ?? data.ogImage, IMAGE_PUBLIC_PATH);
  const result: SeoMeta = {
    title: seo.title || undefined,
    description: seo.description || undefined,
    ogImage: ogImage || undefined,
    canonical: seo.canonical || undefined,
    noindex: seo.noindex || undefined,
  };
  return Object.values(result).some(Boolean) ? result : undefined;
}

/** A review block only counts as present once it carries an actual score. */
function resolveReview(value: unknown): ReviewMeta | undefined {
  const review = (value ?? {}) as ReviewMeta;
  if (typeof review.rating !== "number") return undefined;
  return {
    product: review.product || undefined,
    rating: review.rating,
    price: review.price || undefined,
  };
}

/** Recursively collects every `.md` / `.mdx` file under content/posts. */
function findPostFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findPostFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

/**
 * Derives the URL slug from a file path. Supports both layouts:
 *   content/posts/my-post.mdx        -> "my-post"        (flat file)
 *   content/posts/my-post/index.mdx  -> "my-post"        (Keystatic folder)
 */
function slugFromPath(filePath: string): string {
  const base = path.basename(filePath).replace(/\.mdx?$/, "");
  return base === "index" ? path.basename(path.dirname(filePath)) : base;
}

/**
 * Reads all posts from disk, parses frontmatter, and returns them sorted by
 * date (newest first). Runs once at module load — the result is cached for the
 * lifetime of the server process, which is ideal for static generation.
 *
 * To add a post, just drop a `.mdx` file in content/posts/ (or use Keystatic
 * at /keystatic) — it is discovered automatically, no registration needed.
 */
function loadPosts(): PostDetail[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const bySlug = new Map<string, PostDetail>();

  findPostFiles(POSTS_DIR)
    // Prefer `.mdx` over a legacy `.md` twin for the same slug.
    .sort((a, b) => Number(b.endsWith(".mdx")) - Number(a.endsWith(".mdx")))
    .forEach((filePath, index) => {
      const slug = slugFromPath(filePath);
      if (bySlug.has(slug)) return; // first (preferred) file wins

      const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
      const seo = resolveSeo(data);
      bySlug.set(slug, {
        id: String(index + 1),
        title: data.title ?? slug,
        slug,
        excerpt: data.excerpt ?? "",
        date: toISODate(data.date),
        category: (data.category as BlogCategory) ?? "Programming",
        tags: data.tags ?? [],
        readingTime: calcReadingTime(content),
        coverImage: resolveAsset(data.coverImage, IMAGE_PUBLIC_PATH),
        thumbnail: resolveAsset(data.thumbnail, IMAGE_PUBLIC_PATH),
        thumbnailAlt: data.thumbnailAlt || undefined,
        ogImage: seo?.ogImage ?? resolveAsset(data.ogImage, IMAGE_PUBLIC_PATH),
        difficulty: (data.difficulty as Difficulty) || undefined,
        updated: toISODate(data.updated) || undefined,
        prerequisites: data.prerequisites || undefined,
        draft: data.draft ?? false,
        featured: data.featured ?? false,
        priority: typeof data.priority === "number" ? data.priority : undefined,
        review: resolveReview(data.review),
        seo,
        author: getAuthor(typeof data.author === "string" ? data.author : undefined),
        body: content.trim(),
      });
    });

  return [...bySlug.values()]
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** All published (and, in dev, draft) blog posts, sorted newest first. */
const blogPosts: PostDetail[] = loadPosts();

/**
 * Body-free view of every post, for cards, lists, and related-post grids.
 * Rendering a list from these makes it impossible to leak an article body into
 * a client component's props.
 */
export const postSummaries: PostSummary[] = blogPosts.map(
  ({ body: _body, ...summary }) => summary
);

// Named export used by main-branch code that expects `blogPosts`.
export { blogPosts };

/** Looks up a single blog post, including its body, by URL slug. */
export function getBlogBySlug(slug: string): PostDetail | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Every slug that should be pre-rendered at build time. */
export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

/**
 * Returns the categories that actually have posts, in the canonical order
 * defined by `ACTIVE_CATEGORY_KEYS` (so blog filters read Programming → AI →
 * Technology … rather than in whatever order the newest posts happen to fall).
 */
export function getCategories(): BlogCategory[] {
  const present = new Set(postSummaries.map((post) => post.category));
  return ACTIVE_CATEGORY_KEYS.filter((category) => present.has(category));
}

/**
 * Compiles an MDX/markdown body string into a renderable React element using
 * the shared component map. Used on the blog detail page (server-rendered).
 */
export async function compileBlogContent(rawBody: string) {
  const { content } = await compileMDX({
    source: rawBody,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });
  return content;
}
