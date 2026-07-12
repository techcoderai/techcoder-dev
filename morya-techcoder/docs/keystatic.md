# Keystatic (the visual editor)

Keystatic is a **Git-based CMS**. It gives you a friendly editor in the browser,
but instead of saving to a database it writes plain `.mdx` files into
`content/posts/` — the exact files the site already reads. You then commit those
files with Git like any other change.

## Why Keystatic (vs the alternatives)

| Option | Why not |
| --- | --- |
| Headless CMS (Sanity/Contentful) | Adds a database, monthly cost, and content lock-in. Overkill for one person. |
| Notion as CMS | Lossy mapping to our components; images expire; extra sync step. |
| Plain files only | Great, but no image-upload UI, no live preview, easy to typo frontmatter. |
| **Keystatic** ✅ | Visual editor + image uploads + live preview, **and still just writes `.mdx` to Git.** No database, no lock-in, no runtime cost. |

If you ever stop using Keystatic, the site keeps working — it only reads files.

## Opening the editor

```bash
npm run dev
```

Then open **http://localhost:3000/keystatic**. You'll see the "Blog posts"
collection.

## The publishing workflow

```
/keystatic → "Create Blog post" → fill fields → upload hero image
          → write the body (insert components from the “+” menu)
          → set Draft off → "Save"  → git commit & push
```

That's it. "Save" writes the `.mdx` file (and any uploaded images) to disk.

## Fields you'll see

The form fields map directly to the frontmatter described in
[blog-system.md](./blog-system.md#frontmatter-fields): Title, Excerpt, Publish
date, Draft, Category, Tags, Difficulty, Hero image, Social share image, Last
updated, Prerequisites, SEO overrides, and the **Body** (the MDX editor).

## Uploading images

- **Hero image:** use the "Hero image" field. The file is saved to
  `public/content/blog/` and referenced automatically.
- **Inside the article:** in the Body editor, use the "+" (insert) menu → Image,
  or paste/drag an image. It also lands in `public/content/blog/`.

You never type image paths by hand in the editor.

## Inserting components

In the Body editor, type `/` or click the **+** button to insert a registered
component: **Callout, Terminal, Info card, YouTube, Tweet/X**. Fill in the small
form (e.g. the YouTube video ID) and it renders in the article.

More advanced components (Steps, Tabs, FileTree, Table, Badge, InfoCards grid)
are available in MDX but are best written directly in the `.mdx` file with your
code editor — see [mdx-components.md](./mdx-components.md). If a post uses those,
edit it in code rather than the visual editor.

## Storage: local now, GitHub later

Today `keystatic.config.ts` uses:

```ts
storage: { kind: "local" }
```

This edits files on your machine during `npm run dev`. To edit content on a
**deployed** site (e.g. on Vercel) through GitHub, switch to:

```ts
storage: {
  kind: "github",
  repo: "your-username/techcoder",
},
```

…and follow Keystatic's GitHub app setup (it walks you through connecting the
repo and adds the required environment variables). Until you need cloud editing,
`local` is simpler and recommended.

## How it's wired (for reference)

- `keystatic.config.ts` — the schema (collections, fields, image directories).
- `app/keystatic/[[...params]]/page.tsx` — renders the admin UI (`makePage`).
- `app/api/keystatic/[...params]/route.ts` — read/write API (`makeRouteHandler`).
- `content/keystatic-components.tsx` — the components you can insert in the editor.
