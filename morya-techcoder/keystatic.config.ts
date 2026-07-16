import { config, collection, fields } from "@keystatic/core";
import { categoryOptions } from "@/lib/categories";
import { mdxEditorComponents } from "@/content/keystatic-components";

/** Where uploaded blog images are written and served from. */
const IMAGE_DIR = "public/content/blog";
const IMAGE_PUBLIC_PATH = "/content/blog";

/**
 * Keystatic configuration — the Git-based CMS that powers /keystatic.
 *
 * Storage is `local`: the editor reads and writes files directly in this repo,
 * and you commit them with Git. No database, no external service. To enable
 * editing on a deployed site later, switch `kind` to `github` (see /docs).
 *
 * Each post is a single `.mdx` file in `content/posts/`. The fields below
 * become YAML frontmatter; the `content` field becomes the MDX body. This is
 * exactly the format `content/loader.ts` already reads, so the rendering
 * pipeline is unchanged — Keystatic is purely an authoring UI on top of it.
 */
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "TechCoder" },
  },
  collections: {
    posts: collection({
      label: "Blog posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: {
            label: "Slug (URL)",
            description: "Auto-generated from the title. This becomes /blog/<slug>.",
          },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "One or two sentences shown on cards and used as the meta description.",
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        date: fields.date({
          label: "Publish date",
          defaultValue: { kind: "today" },
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are hidden in production but visible with `npm run dev`.",
          defaultValue: false,
        }),
        category: fields.select({
          label: "Category",
          options: categoryOptions,
          defaultValue: "Programming",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "Tag",
        }),
        difficulty: fields.select({
          label: "Difficulty",
          options: [
            { label: "Beginner", value: "Beginner" },
            { label: "Intermediate", value: "Intermediate" },
            { label: "Advanced", value: "Advanced" },
          ],
          defaultValue: "Intermediate",
        }),
        thumbnail: fields.image({
          label: "Hero image",
          description: "Cover image shown on cards and at the top of the article.",
          directory: IMAGE_DIR,
          publicPath: IMAGE_PUBLIC_PATH,
        }),
        ogImage: fields.image({
          label: "Social share image (optional)",
          description: "Falls back to the hero image if left empty.",
          directory: IMAGE_DIR,
          publicPath: IMAGE_PUBLIC_PATH,
        }),
        updated: fields.date({ label: "Last updated (optional)" }),
        prerequisites: fields.array(fields.text({ label: "Prerequisite" }), {
          label: "Prerequisites (optional)",
          itemLabel: (props) => props.value || "Prerequisite",
        }),
        seo: fields.object(
          {
            title: fields.text({ label: "SEO title (optional)" }),
            description: fields.text({
              label: "SEO description (optional)",
              multiline: true,
            }),
          },
          { label: "SEO overrides" }
        ),
        content: fields.mdx({
          label: "Body",
          description: "Write the article. Use the “+” menu to insert callouts, videos, and more.",
          options: {
            image: {
              directory: IMAGE_DIR,
              publicPath: IMAGE_PUBLIC_PATH,
            },
          },
          components: mdxEditorComponents,
        }),
      },
    }),
  },
});
