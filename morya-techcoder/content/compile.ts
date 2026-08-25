import "server-only";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { mdxComponents } from "@/content/mdx-components";
import { rehypeImageSize } from "@/content/rehype-image-size";

/**
 * Syntax highlighting runs at build time via Shiki, so articles ship
 * pre-highlighted HTML and no highlighter reaches the browser.
 *
 * `keepBackground: false` leaves the surface color to `--tc-bg-code`, which
 * keeps code blocks consistent with the rest of the design system instead of
 * inheriting the theme's own background.
 */
const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: false,
  defaultLang: "plaintext",
  // Empty lines collapse to zero height without a placeholder, which breaks
  // the alignment of highlighted line backgrounds.
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

/**
 * Compiles an MDX/markdown body into a renderable React element.
 *
 * Kept separate from `content/loader.ts` so list/home routes can import post
 * metadata without pulling the MDX component graph (Tweet → react-tweet CSS,
 * Callout, etc.) into the critical path.
 *
 * The plugin chain is deliberately small and entirely build-time:
 *   - `remark-gfm`        — tables, strikethrough, task lists, autolinks
 *   - `rehype-pretty-code`— Shiki highlighting, language + filename + line hints
 *   - `rehypeImageSize`   — real intrinsic dimensions for local images
 */
export async function compileBlogContent(rawBody: string) {
  const { content } = await compileMDX({
    source: rawBody,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      // next-mdx-remote defaults to stripping *every* JSX attribute expression,
      // which silently turns `<Comparison rows={[…]} />` into `<Comparison />`.
      // That default protects sites rendering MDX submitted by strangers; ours
      // comes from this repository and is reviewed in Git like any other code.
      // `blockDangerousJS` stays on, so expressions still can't reach `eval`,
      // `process`, `fs`, or the Function constructor.
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeImageSize],
      },
    },
  });
  return content;
}
