# Deployment

The site is set up for **Vercel**. It uses `@vercel/analytics`, and
`lib/site.ts` reads Vercel's `VERCEL_PROJECT_PRODUCTION_URL`. It's a standard
Next.js build, so any Node host that runs `next build && next start` also works.

## What a production build does

`npm run build` renders almost every page to static HTML:

- All articles (`/blog/[slug]`), topic pages, the home page, and info pages.
- Share images (`/og`, `/og/blog/[slug]`), `sitemap.xml`, `robots.txt`.
- Drafts (`draft: true`) are **excluded**.
- `/keystatic` and `/api/keystatic/*` return **404**. See [keystatic.md](./keystatic.md#storage-and-production).

Only `/api/newsletter` runs at request time.

Content changes need a rebuild. Publishing a post means merging the `.mdx`
file to `main` and letting the host rebuild.

## Vercel project settings

The repo doesn't record the live Vercel configuration. These are the values
the project structure requires. Check them against the dashboard if a deploy
behaves oddly.

| Setting | Value |
| --- | --- |
| Root Directory | `morya-techcoder` |
| Build Command | `npm run build` (default) |
| Install Command | `npm ci` (default) |
| Node.js version | 22.x (matches CI) |

## Environment variables

| Variable | Needed? | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | For the newsletter | Without it the form returns an error. |
| `RESEND_FROM_EMAIL` | For welcome emails | Must be a Resend-verified sender. |
| `RESEND_AUDIENCE_ID` | Rarely | Only for older audience-scoped Resend workspaces. |
| `NEXT_PUBLIC_SITE_URL` | Only off Vercel | Public origin for canonicals/sitemap. On Vercel it's inferred. |
| `ENABLE_KEYSTATIC` | **Never** on a real deploy | Exposes an unauthenticated file-write API. |

## After deploying

- Open `/sitemap.xml` and `/robots.txt` and check the URLs use the production domain.
- Paste an article URL into a social share debugger (LinkedIn Post Inspector,
  Facebook Sharing Debugger) to check the preview image.
- Check the response headers include `Content-Security-Policy` and
  `Strict-Transport-Security`.

## Security headers

`next.config.ts` sends these on every route:

- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- In production only, a `Content-Security-Policy`. It allows scripts from the
  site and Vercel Analytics, images from any HTTPS origin, and frames from
  YouTube (nocookie), CodePen, CodeSandbox, and StackBlitz.

It uses `'unsafe-inline'` instead of nonces, because nonces would force every
page to render per request instead of at build time.

**If a new embed or third-party script is blocked**, open the browser console
and look for a CSP error. Then add its origin to the right directive in
`next.config.ts`. The CSP isn't sent in `npm run dev`, so test with
`npm run build && npm run start`.
