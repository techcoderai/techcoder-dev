# Troubleshooting

## `/keystatic` returns 404

**If you're on a deployed site: that's intended.** The editor writes to the
local filesystem, which doesn't exist on a serverless host, so both `/keystatic`
and `/api/keystatic/*` are switched off in production. See
[keystatic.md](./keystatic.md#storage-and-production).

**If you're running locally**, check that you started `npm run dev` and not
`npm run start` — `next start` runs in production mode, where the gate applies.

## The `/keystatic` page is blank or won't load
- Make sure you're running `npm run dev` (the editor needs the API routes at
  `/api/keystatic/...`).
- Hard-refresh the browser (the admin is a client app and caches aggressively).
- Check the terminal for errors in `keystatic.config.ts`.

## A component's props arrive `undefined` (arrays, numbers, objects)

**Cause:** `next-mdx-remote` strips every JSX attribute expression unless
`blockJS: false` is set. `<Comparison rows={[…]} />` silently becomes
`<Comparison />`, so the component renders nothing and no error is thrown.

**Fix:** `content/compile.ts` already sets `blockJS: false`. If you copy the
compile setup elsewhere, carry that option with it — string props keep working,
so the breakage looks like a component bug rather than a pipeline one.

## A Markdown table renders as literal pipes

`remark-gfm` isn't in the pipeline. MDX doesn't enable GitHub-flavoured Markdown
by default — check the `remarkPlugins` array in `content/compile.ts`.

## Code blocks have no colors

Check the fence has a language (```` ```ts ````, not just ```` ``` ````), and
that `rehype-pretty-code` is still in `rehypePlugins`. Highlighting runs at build
time, so a change there needs a restart of `npm run dev`.

## A post I created in Keystatic doesn't appear on the site

**Most common cause:** Next.js is using cached content from before you created the post.

**Solution:**
```bash
# Stop dev server (Ctrl+C), then restart:
npm run dev

# Or clear cache first:
rm -rf .next && npm run dev
```

**Why:** The content loader (`content/loader.ts`) runs once at startup and caches all posts in memory. New posts written to disk aren't picked up until the server restarts.

**Other checks:**
- Is **Draft** turned off? Drafts are hidden in production builds (visible in dev only).
- Did you save? Keystatic writes the file on **Save** click.
- Check the `date` field is set correctly (YYYY-MM-DD format).

## "Module not found: server-only"
You imported `content/loader.ts` into a **client** component (a file with
`"use client"`). Load content in a server component and pass it down as props.
See [conventions.md](./conventions.md#server-vs-client-components).

## An MDX component isn't rendering (shows as raw text)
- Confirm the tag name matches an entry in `content/mdx-components.tsx`
  (names are case-sensitive: `<Callout>`, not `<callout>`).
- If you just added the component, restart `npm run dev`.

## Opening a post in Keystatic throws a parse/validation error

Keystatic parses a post's **entire** body and frontmatter to open it in the
editor — one bad spot anywhere in the file fails the whole document, not just
that field. Check, in order:

1. **`Missing component definition for X`** — the post uses a component that
   isn't registered in the Keystatic editor. Today that's `FileTree` (with its
   `Folder`/`File` children) or `Table`. Edit that post in your **code
   editor**, or register the component in `content/keystatic-components.tsx`.
   See [mdx-components.md](./mdx-components.md#filetree-code-only).

2. **`mdxJsxTextElement`/`mdxJsxFlowElement has unexpected children`** — a
   *registered* wrapper/repeating component (`Pro`, `Con`, `InfoCard`, `Step`,
   `Tab`, …) was written single-line: `<Pro>text</Pro>`. MDX parses a
   self-contained single-line tag as *inline* JSX, but these components need
   to be *block* JSX. Rewrite it multi-line — open tag, text, close tag, each
   on their own line:
   ```mdx
   <Pro>
   text
   </Pro>
   ```
   See [mdx-components.md](./mdx-components.md#proscons) for the full rule.

3. **`Key on object value "X" is not allowed`** — the frontmatter has a key
   that isn't in the collection's schema in `keystatic.config.ts` (commonly:
   an old field left over after the schema was reorganized, e.g. a top-level
   `ogImage` when the schema now expects `seo.ogImage`). Move or remove the
   stray key so it matches the current schema exactly.

## An image disappears from frontmatter after editing in Keystatic

**Symptom:** you edit a post's text (not its images) in Keystatic, save, and
the `thumbnail`/`ogImage`/avatar reference is gone from the frontmatter — even
though the image file is still sitting untouched in `public/`.

**Cause:** Keystatic's image field always expects the stored value to be
`<publicPath>/<entry-slug>/<filename>` — the entry's own slug is a mandatory
subfolder, not a config option. If the value doesn't have that exact prefix
(a bare filename, or a path missing the slug), Keystatic can't find the file
when it loads the entry into the form, silently treats the field as unset, and
your next save writes out that "unset" state — deleting the reference. The
site itself still rendered the image fine right up until that save, because
`content/loader.ts`'s `resolveAsset()` is more lenient about path shape than
Keystatic's own editor is.

**Fix:** move the file to `public/content/blog/<slug>/<filename>` (or
`public/content/authors/<author-slug>/<filename>` for an avatar) and point the
frontmatter at `/content/blog/<slug>/<filename>`. See
[keystatic.md#uploading-images](./keystatic.md#uploading-images) and
[architecture.md](./architecture.md) for why this convention exists. Any image
uploaded *through* the Keystatic UI already gets this right automatically —
this only bites hand-placed images.

## Images don't show
- Path must start with `/content/blog/...` and the file must exist in
  `public/content/blog/`.
- SVGs are allowed but sandboxed (see `next.config.ts`).

## A Tweet embed is empty
`react-tweet` fetches tweet data at build time. Check the tweet ID is the long
number from the URL and that the tweet is public.

## `useSearchParams` build warning on `/blog`
The blog list reads `?category=` via `useSearchParams`, which is why
`app/(site)/blog/page.tsx` wraps `<BlogListContent>` in `<Suspense>`. If you add
another `useSearchParams` consumer, wrap it in `<Suspense>` too.

## Build fails after adding a category
Make sure you edited `lib/categories.ts` (the single source of truth) and didn't
leave a hardcoded category string somewhere. Search the repo for the old list.

## Hydration error: `<figure> cannot be a descendant of <p>`

**Cause:** MDX wraps a markdown image (`![alt](src)`) in a `<p>` tag. `<figure>`
is a block element and can't be a child of `<p>`, so if `MdxImage` ever returns
`<figure>`/`<figcaption>` again, this comes back.

**Current fix:** `components/mdx/MdxImage.tsx` always returns a `<span className="block">`
wrapper (with a `<span>` for the caption, not `<figcaption>`) — `<span>` is an
inline element and is valid inside `<p>`; the `block` utility class makes it
*look* like a block without changing the HTML nesting rules. This means the
image has no semantic `<figure>`/`<figcaption>`; that trade-off was deliberate
(screen readers still get the alt text, and the visual result is identical).

**If you hit this error:** something reintroduced a real block element
(`<figure>`, `<div>`, …) inside `MdxImage`. Revert to the `<span>` pattern
rather than adding a custom paragraph-unwrapping handler — that was tried
first and doesn't work reliably against MDX's transformed element tree.

## Hydration error blaming `themeScript` / `app/layout.tsx`

**Cause:** Almost always a **browser extension** injecting `<script>` tags into
`<head>` before React hydrates. The diff typically shows something like:

```
src="chrome-extension://…/assets/page-scripts.js"
```

React then compares that injected node to our theme bootstrap script and reports
a mismatch. This is not an app bug.

**What we do in code:**
- Do **not** put a manual `<head>` in the root layout (App Router owns head via
  the Metadata API).
- Keep the theme FOUC script as the first child of `<body>` with
  `suppressHydrationWarning` on `<html>`, `<body>`, and the script itself
  (`app/layout.tsx`).

**What to do when debugging:**
1. Re-check in a private/incognito window with extensions disabled.
2. If the mismatch disappears, ignore it in normal browsing — the extension is
   the culprit.
3. Only dig further if it still reproduces with all extensions off.

## Lighthouse Performance looks terrible (60s) on localhost

**Cause:** You audited `next dev`. Dev serves unminified JS, Turbopack chunks,
and Next DevTools (~100KB+ unused). That tanks TBT / TTI and is not what users
get in production.

**Fix:** Always measure production:

```bash
npm run build
npm run start
```

Then run Lighthouse (Incognito, extensions off) against the production server.

## Reset a stuck dev server
```bash
pkill -f "next dev"; rm -rf .next; npm run dev
```

## Opening a blog post spikes CPU forever / `FATAL: An unexpected Turbopack error occurred`

**Symptom:** visiting `/blog/<slug>` triggers an endless loop of identical GET
requests and pegs the CPU; the terminal repeats a Turbopack error ending in
`Next.js package not found`.

**Cause:** almost always a stale `.next` cache — most commonly a `.next` that
still contains a full **production build** (`next build`) output, with `next
dev`/Turbopack running on top of it. HMR then retries the same failing build
step on every request, which is the CPU spike.

**Fix:**
```bash
rm -rf .next node_modules/.cache
npm run dev
```
If that doesn't resolve it, it's usually a corrupted or platform-mismatched
`node_modules` (e.g. after switching Node versions, or a native `@next/swc-*`
binary for the wrong architecture on macOS):
```bash
rm -rf node_modules package-lock.json
npm install
```
Do this after any large dependency change too (e.g. bumping `@keystatic/core`)
— a stale cache referencing the old package layout produces the same symptom.
