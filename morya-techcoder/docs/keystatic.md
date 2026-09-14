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
| **Keystatic** ✅ | Visual editor + image uploads, **and still just writes `.mdx` to Git.** No database, no lock-in, no runtime cost. |

If you ever stop using Keystatic, the site keeps working — it only reads files.

## Opening the editor

```bash
npm run dev
```

Then open **http://localhost:3000/keystatic**.

The sidebar has two sections:

- **Publishing → Articles** — every post.
- **Team → Authors** — everyone who can be credited on an article. Each post
  has an optional Author field that picks one; leaving it unset falls back to
  the primary author (see `lib/author.ts`).

## The publishing workflow

```
/keystatic → Articles → "Create Article"
          → fill the sidebar fields (title, excerpt, category, hero image…)
          → write the body (insert blocks from the “+” menu or by typing “/”)
          → click the preview link to see it on the real site
          → turn Draft off → "Save" → git commit & push
```

"Save" writes the `.mdx` file and any uploaded images to disk.

## Fields you'll see

The sidebar is ordered the way an article actually gets made:

| Group | Fields |
| --- | --- |
| Identity | Title, Slug, Excerpt, Category, Tags |
| Artwork | Hero image, Hero image alt text |
| Publishing | Author, Publish date, Last updated, Draft, Featured |
| Reader context | Difficulty, Prerequisites |
| Reviews | Product reviewed, Rating, Price |
| SEO | SEO title, SEO description, Social share image, Canonical URL, Hide from search engines |

They map directly to frontmatter — see
[blog-system.md](./blog-system.md#frontmatter-fields).

**Reading time is never a field.** It's calculated from the body every time the
site loads, because a number typed in by hand goes stale the moment anyone edits
a paragraph.

**Review details** appear on every article but only mean anything for Reviews.
The written judgement is *not* in frontmatter — insert a **TechCoder verdict**
block in the body. The frontmatter carries only what the site needs outside the
article: the score for the sidebar and for review rich results, and the price.

## Validation

Enough to stop a broken article shipping, not enough to be annoying:

- Title is required, up to 120 characters.
- Slug must be lowercase letters, numbers, and single hyphens.
- Excerpt is required, up to 220 characters (aim for ~150 — it's your meta description).
- Publish date is required.
- Alt text is required on images inserted into the body.
- SEO title and description have length caps that match what search engines display.

Hero image and its alt text are optional; the alt falls back to the title.

## Uploading images

- **Hero image:** use the "Hero image" field. The file is saved under
  `public/content/blog/<article-slug>/` and referenced automatically.
- **Inside the article:** in the body, use the "+" menu → Image, or paste/drag a
  file. The dialog asks for **alt text** (required) and a **caption** (optional).

You never type image paths by hand, and there is only one image system — the
same `next/image` pipeline renders the hero, body images, and product shots.
Intrinsic dimensions are read from the file at build time, so images never shift
the page as they load.

**If you hand-place an image instead of uploading it through the editor** (e.g.
writing a post by hand, per [authoring-workflow.md](./authoring-workflow.md)),
the frontmatter value *must* be the full path including the post's own slug —
`/content/blog/<slug>/<filename>` — matching a real file at
`public/content/blog/<slug>/<filename>`. This isn't cosmetic: Keystatic finds
the file by stripping exactly that prefix from the stored value. Get it wrong
(a bare filename, or a path missing the slug) and the site still renders the
image fine — the loader is lenient — but the *next* time that post is opened
and saved in Keystatic, the field reads as empty and gets silently deleted from
frontmatter, even if the edit was unrelated body text. See
[troubleshooting.md](./troubleshooting.md#an-image-disappears-from-frontmatter-after-editing-in-keystatic).

External image URLs are deliberately not supported: keeping every asset in the
repository is what makes optimization and offline builds reliable.

## Inserting components

In the body, type `/` or click **+** to insert any of the components documented
in [mdx-components.md](./mdx-components.md) — editorial blocks (TL;DR, Verdict,
Pros/Cons, Comparison…), embeds (YouTube, X, GitHub, CodePen, sandboxes), and
structural pieces (Steps, Tabs, Info cards, Terminal).

Two are hand-written MDX only: **FileTree**, because arbitrarily nested folders
don't fit Keystatic's flat children model, and **Table**, because Markdown
tables now render natively.

### Tables

The editor supports Markdown tables directly — insert one from the "+" menu and
edit cells in place. They render inside a horizontally scrollable, focusable
region, so they stay readable on a phone without losing their semantics.

For product or spec grids you may want to restyle later, insert a **Comparison
table** block instead: its rows and columns are stored as data rather than
pipes, so they stay editable field by field.

### Code

Insert a code block and pick a language — highlighting is applied at build time
by Shiki, in the rendering layer, not by the CMS. To show a filename, wrap the
code block in a **Code with filename** block.

Line highlighting (``` ```ts {2,5-7} ```) is available when writing MDX by hand;
Keystatic's code block stores only a language.

## Preview

The editor shows a preview link that opens `/blog/<slug>` on your dev server.
That's the real page, with the real styles and components, including drafts —
which are visible in `next dev` and filtered out of production builds.

This is deliberately the whole preview story. A side-by-side preview pane or
Next.js draft mode would both mean maintaining a second rendering path, and
neither would show you anything that the actual page doesn't.

## Storage and production

`keystatic.config.ts` uses:

```ts
storage: { kind: "local" }
```

The editor reads and writes the filesystem of the machine running it. That works
perfectly on your laptop and cannot work on a deployed host, where the
filesystem is read-only and ephemeral.

So **both `/keystatic` and `/api/keystatic/*` return 404 in production.** The
check lives in `lib/keystatic.ts` (`KEYSTATIC_ENABLED`) and keys off `NODE_ENV`,
which Next inlines at build time — so the branch is eliminated and the admin
bundle is never served. Set `ENABLE_KEYSTATIC=true` to opt back in temporarily
— only for exercising a production build locally (`next build && next start`);
never set it on a real deployment while storage is `local`.

This is access control, not SEO. `robots.txt` still disallows those paths, but
that only asks crawlers not to look; it does nothing about anyone typing the
URL. Gating the API matters as much as gating the UI: it's the half that writes
files.

### If you later want to edit on the deployed site

1. Switch to GitHub storage:
   ```ts
   storage: { kind: "github", repo: "your-username/techcoder" },
   ```
2. Follow Keystatic's GitHub app setup — it walks you through connecting the
   repo and adds the required environment variables.
3. Change `KEYSTATIC_ENABLED` to gate on **authentication** rather than the
   environment. Do not simply set it to `true`: with GitHub storage the API
   proxies writes to your repository, so an ungated route is a public write
   endpoint.

Until you need that, `local` is simpler and safer.

## How it's wired (for reference)

- `keystatic.config.ts` — the schema (collections, fields, image directories).
- `content/keystatic-components.tsx` — the components you can insert in the editor.
- `content/mdx-components.tsx` — how those same components render on the site.
- `app/keystatic/[[...params]]/page.tsx` — server route that 404s outside dev.
- `app/keystatic/[[...params]]/keystatic-app.tsx` — the editor itself (client).
- `app/api/keystatic/[...params]/route.ts` — read/write API, gated the same way.
- `lib/keystatic.ts` — the single flag (`KEYSTATIC_ENABLED`) both routes consult.
- `content/authors/*.json` — the Authors collection.
- `lib/author.ts` — resolves a post's Author field to a full record, falling back to a default author when unset.
