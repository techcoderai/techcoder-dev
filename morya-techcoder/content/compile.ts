import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/content/mdx-components";

/**
 * Compiles an MDX/markdown body into a renderable React element.
 *
 * Kept separate from `content/loader.ts` so list/home routes can import post
 * metadata without pulling the MDX component graph (Tweet → react-tweet CSS,
 * Callout, etc.) into the critical path.
 */
export async function compileBlogContent(rawBody: string) {
  const { content } = await compileMDX({
    source: rawBody,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });
  return content;
}
