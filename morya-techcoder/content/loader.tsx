import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import Image from "next/image";
import { calcReadingTime, slugify } from "@/lib/utils";
import type { BlogPost, BlogCategory, Difficulty } from "@/content/blogs";
import HeadingLink from "@/components/ui/HeadingLink";
import CodeBlock from "@/components/ui/CodeBlock";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Recursively pulls the plain text out of MDX heading children for slug ids. */
function getNodeText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return getNodeText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

/**
 * Custom MDX components — maps markdown elements to styled React components.
 * Images use Next.js <Image> for automatic optimization.
 * Inline code uses the accent color, links use primary-dark.
 */
const mdxComponents = {
  img: (props: React.ComponentProps<"img">) => (
    <span className="block my-6">
      <Image
        src={String(props.src || "")}
        alt={props.alt || ""}
        width={800}
        height={450}
        className="rounded-xl w-full h-auto"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </span>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getNodeText(children));
    return (
      <h2 id={id} className="group scroll-mt-28">
        {children}
        <HeadingLink id={id} />
      </h2>
    );
  },
  h3: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getNodeText(children));
    return (
      <h3 id={id} className="group scroll-mt-28">
        {children}
        <HeadingLink id={id} />
      </h3>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => <CodeBlock>{children}</CodeBlock>,
};

/**
 * Reads all .md and .mdx files from content/posts/, extracts frontmatter,
 * and returns BlogPost metadata sorted by date (newest first).
 *
 * To add a new blog post:
 *   1. Create a .md or .mdx file in content/posts/
 *   2. Add YAML frontmatter: title, excerpt, date, category, tags, thumbnail, ogImage
 *   3. Write MDX/markdown content below the --- separator
 *   4. Done — the post appears automatically on the site
 */
function loadPosts(): BlogPost[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts: BlogPost[] = files.map((filename, index) => {
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      id: String(index + 1),
      title: data.title,
      slug: filename.replace(/\.mdx?$/, ""),
      excerpt: data.excerpt,
      date: data.date,
      category: data.category as BlogCategory,
      tags: data.tags || [],
      readingTime: calcReadingTime(content),
      coverImage: data.coverImage || "",
      thumbnail: data.thumbnail || "",
      ogImage: data.ogImage || "",
      difficulty: (data.difficulty as Difficulty) || undefined,
      updated: data.updated || undefined,
      prerequisites: data.prerequisites || undefined,
      body: content.trim(),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** All blog posts, sorted by date descending. */
export const blogPosts: BlogPost[] = loadPosts();

/** Looks up a single blog post by its URL slug. */
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Returns all unique categories present in the blog data. */
export function getCategories(): BlogCategory[] {
  return [...new Set(blogPosts.map((p) => p.category))];
}

/** Returns all unique tags across all posts, sorted alphabetically. */
export function getAllTags(): string[] {
  const tags = new Set(blogPosts.flatMap((p) => p.tags));
  return [...tags].sort();
}

/**
 * Compiles an MDX/markdown body string into a renderable React element.
 * Used on the blog detail page for server-side rendering.
 * Supports standard markdown images `![alt](path)` via Next.js <Image />.
 */
export async function compileBlogContent(rawBody: string) {
  const { content } = await compileMDX({
    source: rawBody,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
    },
  });
  return content;
}
