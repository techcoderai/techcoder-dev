import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calcReadingTime } from "@/lib/utils";
import type { BlogPost, Difficulty, ReviewMeta, SeoMeta } from "@/types/blog";
import { ACTIVE_CATEGORY_KEYS, type BlogCategory } from "@/lib/categories";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Drafts are hidden in production but stay visible in `next dev` for preview. */
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

/** Public path where Keystatic writes uploaded blog images. */
const IMAGE_PUBLIC_PATH = "/content/blog";

/**
 * Normalizes an image reference from frontmatter into a usable `src`.
 * Absolute URLs and root-relative paths pass through unchanged; a bare
 * filename (as some Keystatic image fields store) is resolved under the
 * public image directory.
 */
function resolveAsset(value: unknown): string {
  if (typeof value !== "string" || value === "") return "";
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  return `${IMAGE_PUBLIC_PATH}/${value}`;
}

/**
 * Normalizes the SEO block. `ogImage` moved under `seo` when the schema was
 * reorganized; the legacy top-level key is still honoured so older posts (and
 * anything hand-written against the old shape) keep their share image.
 */
function resolveSeo(data: Record<string, unknown>): SeoMeta | undefined {
  const seo = (data.seo ?? {}) as SeoMeta;
  const ogImage = resolveAsset(seo.ogImage ?? data.ogImage);
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
function loadPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const bySlug = new Map<string, BlogPost>();

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
        date: data.date ?? "",
        category: (data.category as BlogCategory) ?? "Programming",
        tags: data.tags ?? [],
        readingTime: calcReadingTime(content),
        thumbnail: resolveAsset(data.thumbnail),
        thumbnailAlt: data.thumbnailAlt || undefined,
        ogImage: seo?.ogImage ?? "",
        difficulty: (data.difficulty as Difficulty) || undefined,
        updated: data.updated || undefined,
        prerequisites: data.prerequisites || undefined,
        draft: data.draft ?? false,
        featured: data.featured ?? false,
        review: resolveReview(data.review),
        seo,
        body: content.trim(),
      });
    });

  return [...bySlug.values()]
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** All published (and, in dev, draft) blog posts, sorted newest first. */
export const blogPosts: BlogPost[] = loadPosts();

/** Looks up a single blog post by its URL slug. */
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * Returns the categories that actually have posts, in the canonical order
 * defined by `ACTIVE_CATEGORY_KEYS` (so blog filters read Programming → AI →
 * Technology … rather than in whatever order the newest posts happen to fall).
 */
export function getCategories(): BlogCategory[] {
  const present = new Set(blogPosts.map((post) => post.category));
  return ACTIVE_CATEGORY_KEYS.filter((category) => present.has(category));
}
