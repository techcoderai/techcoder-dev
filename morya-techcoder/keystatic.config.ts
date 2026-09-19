import { config, collection, fields } from "@keystatic/core";
import { categoryOptions } from "@/lib/categories";
import { mdxEditorComponents } from "@/content/keystatic-components";

/**
 * Where uploaded blog images are written and served from.
 *
 * Keystatic always nests an entry's images under its own slug — the stored
 * frontmatter value is `${IMAGE_PUBLIC_PATH}/<slug>/<filename>`, and it
 * strips exactly that prefix to find the file on disk. A value missing the
 * slug segment (or a bare filename) can't be resolved, so Keystatic treats
 * the field as unset — and the next save from the editor deletes it, even
 * if that save only touched unrelated text. This isn't a config option; any
 * post whose thumbnail/ogImage/avatar might ever be opened in Keystatic must
 * use the full `<publicPath>/<slug>/<filename>` form, including hand-written
 * posts predating Keystatic.
 */
const IMAGE_DIR = "public/content/blog";
const IMAGE_PUBLIC_PATH = "/content/blog";

/** Keep field asset filenames stable so saved references never go stale. */
function imageField(options: Parameters<typeof fields.image>[0]) {
  const field = fields.image(options);
  return {
    ...field,
    serialize(
      value: Parameters<typeof field.serialize>[0],
      args: Parameters<typeof field.serialize>[1]
    ) {
      return field.serialize(value, {
        ...args,
        suggestedFilenamePrefix: undefined,
      });
    },
  };
}

/**
 * Keystatic configuration — the Git-based CMS that powers /keystatic.
 *
 * Storage is `local`: the editor reads and writes files directly in this repo,
 * and you commit them with Git. No database, no external service. The admin UI
 * and its API are only mounted outside production (see `lib/keystatic.ts`),
 * so the deployed site has no editing surface at all.
 *
 * Each post is a single `.mdx` file in `content/posts/`. The fields below
 * become YAML frontmatter; the `content` field becomes the MDX body. This is
 * exactly the format `content/loader.ts` already reads, so the rendering
 * pipeline is unchanged — Keystatic is purely an authoring UI on top of it.
 *
 * Field order matters: with `entryLayout: "content"` the body fills the main
 * pane and everything else stacks in the sidebar, so the fields are ordered the
 * way an article actually gets made — identity, then artwork, then publishing,
 * then the optional tails (review data, SEO).
 */
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "TechCoder" },
    navigation: {
      Publishing: ["posts"],
      Team: ["authors"],
    },
  },
  collections: {
    posts: collection({
      label: "Articles",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "category", "date"],
      // Adds an "open preview" link to the editor. During `npm run dev` this
      // shows the real article — drafts included — in TechCoder's own styling,
      // which is the whole preview story (see docs/keystatic.md).
      previewUrl: "/blog/{slug}",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "The headline, as it appears on the article and in search results.",
            validation: { length: { min: 1, max: 120 } },
          },
          slug: {
            label: "Slug (URL)",
            description: "Auto-generated from the title. This becomes /blog/<slug>.",
            validation: {
              length: { min: 1 },
              pattern: {
                regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Use lowercase letters, numbers, and single hyphens only.",
              },
            },
          },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description:
            "One or two sentences shown on cards and used as the meta description. Around 150 characters reads best in search results.",
          multiline: true,
          validation: { length: { min: 1, max: 220 } },
        }),
        category: fields.select({
          label: "Category",
          description: "Decides which topic page and homepage rail the article appears in.",
          options: categoryOptions,
          defaultValue: "Programming",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description: "Lowercase, specific, and reused across articles — they power search.",
          itemLabel: (props) => props.value || "Tag",
        }),
        thumbnail: imageField({
          label: "Hero image",
          description: "Shown on cards and at the top of the article. 16:9 works best.",
          directory: IMAGE_DIR,
          publicPath: IMAGE_PUBLIC_PATH,
        }),
        thumbnailAlt: fields.text({
          label: "Hero image alt text",
          description:
            "Describe the image for screen readers and when it fails to load. Falls back to the title.",
        }),
        author: fields.relationship({
          label: "Author",
          description: "Who wrote it. Defaults to the primary author when left unset.",
          collection: "authors",
        }),
        date: fields.date({
          label: "Publish date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updated: fields.date({
          label: "Last updated",
          description: "Set this when you meaningfully revise a published article.",
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are hidden in production but visible with `npm run dev`.",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show this article in the homepage “Featured articles” rail.",
          defaultValue: false,
        }),
        priority: fields.number({
          label: "Featured priority",
          description: "Lower numbers appear first among featured articles.",
          validation: { min: 0 },
        }),
        difficulty: fields.select({
          label: "Difficulty",
          description: "How much prior knowledge the reader needs.",
          options: [
            { label: "Beginner", value: "Beginner" },
            { label: "Intermediate", value: "Intermediate" },
            { label: "Advanced", value: "Advanced" },
          ],
          defaultValue: "Intermediate",
        }),
        prerequisites: fields.array(fields.text({ label: "Prerequisite" }), {
          label: "Prerequisites",
          description: "Shown as a “Before you start” checklist. Useful for tutorials.",
          itemLabel: (props) => props.value || "Prerequisite",
        }),
        review: fields.object(
          {
            product: fields.text({
              label: "Product reviewed",
              description: "Defaults to the article title.",
            }),
            rating: fields.number({
              label: "Rating (0–5)",
              description: "Shown in the article sidebar and in search results.",
              validation: { min: 0, max: 5 },
            }),
            price: fields.text({
              label: "Price",
              description: "As displayed, e.g. “$1,049”.",
            }),
          },
          {
            label: "Review details",
            description:
              "Only for Reviews. The written judgement itself goes in the body — insert a “TechCoder verdict” block.",
          }
        ),
        seo: fields.object(
          {
            title: fields.text({
              label: "SEO title",
              description: "Overrides the headline in search results. Aim for under 60 characters.",
              validation: { length: { max: 70 } },
            }),
            description: fields.text({
              label: "SEO description",
              description: "Overrides the excerpt in search results. Aim for under 160 characters.",
              multiline: true,
              validation: { length: { max: 200 } },
            }),
            ogImage: imageField({
              label: "Social share image",
              description: "Falls back to the hero image. 1200×630 is the safe size.",
              directory: IMAGE_DIR,
              publicPath: IMAGE_PUBLIC_PATH,
            }),
            canonical: fields.url({
              label: "Canonical URL",
              description:
                "Only when this article was first published elsewhere. Leave empty otherwise.",
            }),
            noindex: fields.checkbox({
              label: "Hide from search engines",
              description: "Keeps the article public but out of Google and the sitemap.",
              defaultValue: false,
            }),
          },
          { label: "SEO" }
        ),
        content: fields.mdx({
          label: "Body",
          description:
            "Write the article. Press “/” or use the “+” menu to insert images, code, tables, callouts, and TechCoder blocks.",
          options: {
            heading: [2, 3, 4],
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            link: true,
            orderedList: true,
            unorderedList: true,
            blockquote: true,
            divider: true,
            codeBlock: true,
            table: true,
            image: {
              directory: IMAGE_DIR,
              publicPath: IMAGE_PUBLIC_PATH,
              schema: {
                alt: fields.text({
                  label: "Alt text",
                  description:
                    "What the image shows, for screen readers. Required unless the image is purely decorative.",
                  validation: { length: { min: 1 } },
                }),
                title: fields.text({
                  label: "Caption",
                  description: "Optional. Displayed under the image.",
                }),
              },
            },
          },
          components: mdxEditorComponents,
        }),
      },
    }),
    authors: collection({
      label: "Authors",
      slugField: "name",
      path: "content/authors/*",
      format: { data: "json" },
      columns: ["name", "role"],
      schema: {
        name: fields.slug({
          name: {
            label: "Name",
            validation: { length: { min: 1 } },
          },
        }),
        role: fields.text({
          label: "Role",
          description: "Shown under the byline, e.g. “Founder, TechCoder”.",
        }),
        bio: fields.text({
          label: "Short bio",
          description: "One or two sentences, shown at the end of an article.",
          multiline: true,
        }),
        avatar: fields.image({
          label: "Avatar",
          directory: "public/content/authors",
          publicPath: "/content/authors",
        }),
        url: fields.url({
          label: "Website or profile",
          description: "Used in the article's structured data.",
        }),
      },
    }),
  },
});
