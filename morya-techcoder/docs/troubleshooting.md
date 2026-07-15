# Troubleshooting

## The `/keystatic` page is blank or won't load
- Make sure you're running `npm run dev` (the editor needs the API routes at
  `/api/keystatic/...`).
- Hard-refresh the browser (the admin is a client app and caches aggressively).
- Check the terminal for errors in `keystatic.config.ts`.

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
The post probably uses a component that isn't registered in the Keystatic editor
(e.g. `Steps`, `Tabs`, `FileTree`). Edit that post in your **code editor**
instead, or register the component in `content/keystatic-components.tsx`.

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

## Reset a stuck dev server
```bash
pkill -f "next dev"; rm -rf .next; npm run dev
```
