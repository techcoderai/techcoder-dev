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

## Opening a post in Keystatic throws a parse error
The post uses a component that isn't registered in the Keystatic editor — today
that means `FileTree` (with its `Folder`/`File` children) or `Table`. Edit that
post in your **code editor**, or register the component in
`content/keystatic-components.tsx`.

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

**Cause:** This was fixed on 2026-07-12. If you see this error, you're on an old version.

**What happened:** MDX wraps inline images in `<p>` tags, but our MdxImage component returned `<figure>` tags (invalid HTML).

**Fix:** Already implemented in `components/mdx/MdxImage.tsx` and `content/mdx-components.tsx`. The fix:
1. MdxImage returns plain `<img>` when no caption (for markdown `![alt](src)`)
2. Custom paragraph handler unwraps single-image paragraphs
3. `<figure>` only used with explicit `<Image caption="..." />` component

**See:** [docs/hydration-error-fix.md](./hydration-error-fix.md) for full technical details.

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
