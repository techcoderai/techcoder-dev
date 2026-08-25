# Authoring Workflow

The goal: go from idea to published article with as little friction as possible,
without ever needing to understand the MDX underneath.

## The happy path (visual editor)

1. `npm run dev`
2. Open `http://localhost:3000/keystatic`
3. **Articles → Create Article**
4. Fill Title, Excerpt, Category, Tags, and upload a **Hero image**
5. Write the body. Press `/` or click **+** to insert:
   - images (with alt text and a caption), code blocks, tables
   - editorial blocks: **TL;DR, Key takeaway, Verdict, Pros/Cons, Comparison,
     Production insight, Pull quote, Related articles, Callout**
   - embeds: **YouTube, X, GitHub, CodePen, sandboxes, link cards**
6. Leave **Draft** on while writing → click the **preview link** to see the real
   page at `/blog/<slug>`
7. Turn **Draft** off → **Save**
8. `git add -A && git commit -m "post: my new article" && git push`

You should never need to open the `.mdx` file to publish a normal article.

## The power-user path (your code editor)

For hand-written Markdown, or the two components the editor doesn't expose
(`FileTree`, `Table`):

1. Create `content/posts/my-post.mdx`
2. Copy the frontmatter template from [blog-system.md](./blog-system.md#frontmatter-fields)
3. Write MDX; use any component from [mdx-components.md](./mdx-components.md)
4. Drop images in `public/content/blog/`
5. Preview with `npm run dev`, then commit

Both paths produce identical files. Mix and match freely — a post created in the
editor can be finished in a code editor and vice versa.

## Previewing before publishing

- Keep `draft: true` → the post is visible in `npm run dev` only.
- Use the preview link in the editor sidebar; it opens the real article, with
  the real styles and components.
- Production builds (`npm run build`) exclude drafts, and drafts return a proper
  404 there rather than an indexable "not found" page.
- Flip to `draft: false` when ready.

## Writing a review

1. Category → **Reviews**
2. Fill the **Review details** block in the sidebar: product, rating, price.
   That drives the sidebar summary card and the review structured data.
3. In the body, insert a **TechCoder verdict** block for the written judgement,
   and **Pros / Cons** for the trade-offs.

The score lives only in frontmatter and the prose lives only in the body — don't
repeat either.

## Writing a buying guide

1. Category → **Buying Guides**
2. Insert a **Buying guide picks** block
3. Add a **Recommendation** for each pick: award ("Best overall", "Best budget"),
   product, price, link, and a sentence on why it won
4. Use a **Comparison table** or a Markdown table for the spec grid

## A good post checklist

- [ ] Title and excerpt are concise (excerpt doubles as the meta description — aim for ~150 characters)
- [ ] Category and 2–5 tags set
- [ ] Hero image added (16:9 looks best on cards), with alt text
- [ ] Every in-body image has alt text
- [ ] Headings use `##` / `###` (they become the table of contents automatically)
- [ ] Code blocks specify a language (```` ```ts ````)
- [ ] A TL;DR at the top if the article is long
- [ ] SEO title/description set only if the defaults don't read well
- [ ] Draft turned off
