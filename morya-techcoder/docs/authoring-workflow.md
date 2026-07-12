# Authoring Workflow

The goal: go from idea to published article with as little friction as possible.

## The happy path (visual editor)

1. `npm run dev`
2. Open `http://localhost:3000/keystatic`
3. **Create Blog post**
4. Fill Title, Excerpt, Category, Tags, and upload a **Hero image**
5. Write the body — insert **Callouts, code, YouTube, Tweets** from the **+** menu
6. Leave **Draft** on while writing → preview at `/blog/<slug>` in another tab
7. Turn **Draft** off → **Save**
8. `git add -A && git commit -m "post: my new article" && git push`

## The power-user path (your code editor)

If you prefer writing Markdown by hand or need advanced components:

1. Create `content/posts/my-post.mdx`
2. Copy the frontmatter template from [blog-system.md](./blog-system.md#frontmatter-fields)
3. Write MDX; use any component from [mdx-components.md](./mdx-components.md)
4. Drop images in `public/content/blog/`
5. Preview with `npm run dev`, then commit

Both paths produce identical files. Mix and match freely.

## Previewing before publishing

- Keep `draft: true` → the post is visible in `npm run dev` only.
- Production builds (`npm run build`) automatically exclude drafts.
- Flip to `draft: false` when ready.

## A good post checklist

- [ ] Title and excerpt are concise (excerpt doubles as the meta description)
- [ ] Category and 2–5 tags set
- [ ] Hero image added (16:9 looks best on cards)
- [ ] Headings use `##` / `###` (they become the table of contents automatically)
- [ ] Code blocks specify a language (```` ```ts ````)
- [ ] Draft turned off
