import "server-only";
import fs from "fs";
import path from "path";
import type { Author } from "@/types/blog";
import { resolveAsset } from "@/lib/assets";

const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");
const AVATAR_PUBLIC_PATH = "/content/authors";

/**
 * The author credited when a post doesn't pick one explicitly. Keeps
 * `content/posts/*` from having to name an author on every single file.
 */
const DEFAULT_AUTHOR_SLUG = "techcoder";

const FALLBACK: Author = { slug: DEFAULT_AUTHOR_SLUG, name: "TechCoder" };

function loadAuthors(): Map<string, Author> {
  const authors = new Map<string, Author>();
  if (!fs.existsSync(AUTHORS_DIR)) return authors;

  for (const entry of fs.readdirSync(AUTHORS_DIR)) {
    if (!entry.endsWith(".json")) continue;
    const slug = entry.slice(0, -".json".length);
    try {
      const data = JSON.parse(fs.readFileSync(path.join(AUTHORS_DIR, entry), "utf-8"));
      if (data.name) {
        authors.set(slug, {
          ...data,
          slug,
          avatar: resolveAsset(data.avatar, AVATAR_PUBLIC_PATH) || undefined,
        });
      }
    } catch {
      // Skip a malformed entry rather than take the whole site down.
    }
  }
  return authors;
}

const authors = loadAuthors();

/** Every author in `content/authors/*`, for team pages and the like. */
export function getAuthors(): Author[] {
  return [...authors.values()];
}

/** Looks up an author by slug, falling back to the default when unset or unknown. */
export function getAuthor(slug?: string | null): Author {
  if (slug && authors.has(slug)) return authors.get(slug)!;
  return authors.get(DEFAULT_AUTHOR_SLUG) ?? FALLBACK;
}
