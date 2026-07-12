# Troubleshooting

## The `/keystatic` page is blank or won't load
- Make sure you're running `npm run dev` (the editor needs the API routes at
  `/api/keystatic/...`).
- Hard-refresh the browser (the admin is a client app and caches aggressively).
- Check the terminal for errors in `keystatic.config.ts`.

## A post I created in Keystatic doesn't appear on the site
- Is **Draft** turned off? Drafts are hidden in production builds. In
  `npm run dev` they *should* appear — if not, check the `date` field is set.
- Did you save? Keystatic writes the file on **Save**.
- The dev server picks up new files automatically; if not, restart it.

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

## Reset a stuck dev server
```bash
pkill -f "next dev"; rm -rf .next; npm run dev
```
