# Reader accounts, likes and responses

Optional reader accounts (Supabase Auth) let people like articles and post
top-level responses. Articles themselves are unchanged: still MDX in Git, still
statically generated, still readable without signing in.

## How it fits together

```
Static article HTML (SSG, unchanged)
   │  after hydration
   ▼
EngagementProvider (client island, app/(site)/blog/[slug]/layout.tsx)
   │  fetch, same origin
   ▼
Route Handlers  app/api/articles/[slug]/{engagement,like,comments}
                app/api/comments/[id]{,/report}
   │  1. slug must be a published post (content/loader.ts)
   │  2. Origin must match the site (CSRF), body must be JSON
   │  3. input validated (lib/engagement/validation.ts)
   │  4. reader verified with supabase.auth.getUser()
   ▼
Supabase Postgres as the signed-in reader (publishable key + user JWT)
   └── RLS policies, column grants, CHECK constraints and rate-limit triggers
       enforce everything again in the database
```

- **Sessions** live in first-party cookies managed by `@supabase/ssr`
  (`lib/supabase/client.ts` in the browser, `lib/supabase/server.ts` on the
  server). The app never uses the service-role/secret key.
- **`proxy.ts`** refreshes the session only for `/account` and `/auth/*` — the
  Server Components that read it. Article and list pages never run it.
  Route Handlers refresh the session themselves.
- **`components/auth/AuthProvider.tsx`** holds UI-only session state (navbar
  avatar, composer visibility). It imports supabase-js lazily, and only when a
  session cookie exists or the reader starts signing in, so anonymous readers
  never download it. It is never used for authorization.
- Articles are referenced by their canonical URL slug (`/blog/<slug>`). There
  is no `articles` table. Every write is checked against `getAllSlugs()`, so
  drafts and unknown slugs return 404.

### Routes

| Route | What it does |
| --- | --- |
| `/auth/sign-in` | Google + email/password sign-in. Keeps `?next=`. |
| `/auth/sign-up` | Account creation (display name, email, password). |
| `/auth/forgot-password` | Sends a reset link. The response doesn't reveal whether the email has an account. |
| `/auth/update-password` | Sets a new password (from the reset link or the profile page). |
| `/auth/callback` | Handles every auth redirect: OAuth/PKCE `?code=` or email `?token_hash=&type=`. |
| `/account` | Profile: avatar, display name (editable), email, password link, sign out. |
| `GET /api/articles/:slug/engagement` | Like count, your like, approved responses. Public. |
| `PUT /api/articles/:slug/like` | `{ liked: boolean }`. Sets your like, so repeating the request is safe. |
| `POST /api/articles/:slug/comments` | `{ body }`. Posts a response. |
| `DELETE /api/comments/:id` | Deletes your own response. A moderator's call hides someone else's instead. |
| `POST /api/comments/:id/report` | `{ reason? }`. Reports someone else's response. |

`?next=` and every redirect go through `safeNextPath()`, which only accepts
same-site relative paths, so they can't be used as open redirects.

### UI

- **Navbar** (`components/auth/AccountMenu.tsx`) shows "Sign in" when signed
  out (a person icon on phones). When signed in it shows an avatar or initials
  that opens a Profile / Sign out menu. The menu supports arrow keys and
  Escape, and closes on outside click.
- **Article page** shows a hairline action row after the tags
  (`ArticleActionBar`), with a heart, the like count, and a responses count
  that links to `#responses`. The responses section (`Responses`, `CommentItem`)
  sits after the author bio. It has a composer when you're signed in and
  "Sign in to respond" when you're not. Responses form a flat, divided list.
- Likes update the count immediately, then take the server's count. On
  failure the like rolls back. The button ignores clicks while a request is
  running.
- Responses render as plain text (`whitespace-pre-line`). No HTML, Markdown
  or links are interpreted.

## Database

Migration: [`supabase/migrations/20261012090000_reader_accounts_likes_comments.sql`](../supabase/migrations/20261012090000_reader_accounts_likes_comments.sql)

| Table | Columns | Notes |
| --- | --- | --- |
| `profiles` | `id` (= auth user), `display_name`, `username?`, `avatar_url?`, timestamps | Created by trigger on sign-up from the sign-up name, or Google name and picture. Each Google sign-in refreshes the picture and fills the name only while it's still "Reader". Avatars only from `*.googleusercontent.com`. |
| `article_likes` | `user_id`, `article_slug`, `created_at` | **Primary key `(user_id, article_slug)`**: one like per reader per article. |
| `article_comments` | `id`, `user_id`, `article_slug`, `body` (1–2000 chars), `status` (`approved`/`pending`/`removed`), timestamps | New responses are `approved`. |
| `comment_reports` | `id`, `comment_id`, `reporter_id`, `reason?` (≤500), `created_at` | Unique `(comment_id, reporter_id)`. |

`user_id`/`reporter_id` default to `auth.uid()`, and clients aren't granted
write access to those columns. A reader can't act as anyone else even when
calling the Supabase API directly.

### RLS policies

| Table | Policy | Rule |
| --- | --- | --- |
| profiles | read own | `auth.uid() = id` |
| profiles | read commenters | anyone can read profiles that have ≥1 approved response, so there's no browsable user list |
| profiles | update own | `auth.uid() = id`; column grant limits it to `display_name`, `username` |
| article_likes | read / insert / delete own | `auth.uid() = user_id`. Totals come from `article_like_count(slug)` (security definer), which never exposes who liked what. |
| article_comments | public read approved | `status = 'approved'` (anon + authenticated) |
| article_comments | read own / moderators read all | `auth.uid() = user_id` / `is_moderator()` |
| article_comments | insert own | `auth.uid() = user_id and status = 'approved'`; only `article_slug`, `body` are writable |
| article_comments | delete own | `auth.uid() = user_id` |
| article_comments | moderators update status | `is_moderator()`; column grant limits it to `status` |
| comment_reports | insert own | `auth.uid() = reporter_id`, target is approved and not your own |
| comment_reports | moderators read | `is_moderator()` |

### Abuse protection

- Comments: max 3 per minute and 50 per day per reader (trigger, `PT429` → HTTP 429).
- Reports: max 10 per hour per reader. Three distinct reports move a
  response to `pending`, which hides it until a moderator reviews it.
- Supabase Auth applies its own sign-in/sign-up/email rate limits. Consider
  enabling CAPTCHA (Auth → Bot protection) before launch.

### Moderation

Moderators are readers with `app_metadata.role = 'moderator'`. Only the
service role can set `app_metadata`. Readers can't change it. Grant the role in
the Supabase SQL editor:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"moderator"}'
where email = 'editor@techcoder.tech';
```

The role is read from the JWT, so the moderator must **sign out and back in**.
After that they see **Remove** on every response. Reviewing reports happens in
the Supabase dashboard (SQL editor):

```sql
-- Reported or auto-hidden responses, most reported first
select c.id, c.article_slug, c.status, c.body, p.display_name,
       count(r.id) as reports, max(r.created_at) as last_reported
from article_comments c
join profiles p on p.id = c.user_id
left join comment_reports r on r.comment_id = c.id
where c.status = 'pending' or r.id is not null
group by c.id, p.display_name
order by reports desc, last_reported desc;

-- Restore or remove
update article_comments set status = 'approved' where id = '<id>';
update article_comments set status = 'removed'  where id = '<id>';
```

## Development setup (hosted Supabase only)

There's no local Supabase server and no Docker. Development uses a hosted
project — ideally a separate dev/staging project, so test accounts and
responses stay out of production.

1. Put the project's URL and **publishable** key in `.env.local` (see
   `.env.example`).
2. Apply the migrations once from a terminal, then again whenever a file is
   added to `supabase/migrations/`:

   ```bash
   npx supabase login                      # opens a browser for an access token
   npx supabase link --project-ref <ref>   # prompts for the database password
   npx supabase db push                    # applies supabase/migrations/*
   ```

3. Configure the dashboard as described in
   [Production setup](#production-setup-supabase--google--vercel). For
   development, add these under **Auth → URL Configuration → Redirect URLs**:
   `http://localhost:3000/auth/callback**`,
   `http://127.0.0.1:3000/auth/callback**`, and
   `https://*.app.github.dev/auth/callback**` (Codespaces).
4. `npm run dev`.

While Google isn't enabled in the project, the Google button shows "Google
sign-in isn't available yet" instead of redirecting.

`supabase/config.toml` is only there because the CLI needs it to find the
project. Auth settings are managed in the dashboard, not in that file.

### Tests

```bash
npm test                         # validation unit tests (node:test, no extra deps)
npx supabase test db --linked    # pgTAP against the linked project; runs in a transaction and rolls back
```

`supabase/tests/database/rls.test.sql` checks the authorization rules directly.
It covers anonymous writes, acting as another user, duplicate likes,
column-level write limits, reporting rules, auto-hide, moderator powers and
the rate limit. Run it after any change to the migration, preferably against
a dev/staging project. CI runs only `npm test`.

## Production setup (Supabase + Google + Vercel)

### 1. Supabase project

1. Create a project and link it: `npx supabase link --project-ref <ref>`.
2. Apply migrations: `npx supabase db push`.
3. **Auth → URL Configuration**
   - Site URL: `https://techcoder.tech`
   - Redirect URLs: `https://techcoder.tech/auth/callback**`, plus
     `https://*-<team>.vercel.app/auth/callback**` for previews and
     `http://localhost:3000/auth/callback**` if you want to test locally
     against this project.
4. **Auth → Providers → Email**: enable it and turn **Confirm email**
   **off**. Readers are signed in as soon as they sign up, and the app
   redirects them straight back to the article. Set the minimum password
   length to 8 and require letters and digits. Trade-off: email addresses
   aren't proven to belong to the reader. Abuse is held back by Supabase's
   auth rate limits plus the database limits on comments and reports. If
   spam appears, enable CAPTCHA, or turn **Confirm email** back on — the
   sign-up form then shows "Check your inbox" automatically.
5. **Auth → Emails → Templates → Reset password**: change the link to
   `<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">Reset my password</a>`.
   If you turn confirmation on, do the same for **Confirm signup** with
   `type=email`. These links verify on the server, so they work even when the
   email is opened in a different browser. The default templates still work,
   but only in the browser that started the flow.
6. **Auth → SMTP**: configure a real sender (e.g. Resend SMTP). The built-in
   mailer is heavily rate-limited and not meant for production.
7. **Project Settings → API Keys**: copy the project URL and the
   **publishable** key. Don't copy the secret/service-role key — the app
   doesn't need it.

### 2. Google OAuth

1. Google Cloud Console → APIs & Services → **OAuth consent screen**: set up
   the app name, support email, `techcoder.tech` as the authorized domain, and
   the scopes `openid`, `email`, `profile`.
2. **Credentials → Create OAuth client ID → Web application**
   - Authorized JavaScript origins: `https://techcoder.tech`
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
     (shown in Supabase → Auth → Providers → Google).
3. Paste the client ID and secret into Supabase → Auth → Providers → Google and enable it.

### 3. Vercel

1. Project → Settings → Environment Variables (Production **and** Preview):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Redeploy. Both values are inlined at **build** time, and the Supabase
   origin is added to the CSP `connect-src` then too.

### 4. Verify RLS after deploying

- Dashboard → **Advisors → Security**: there should be no "RLS disabled" or
  "security definer view" findings on these tables.
- Dashboard → Database → Policies: the policies listed above, on all four tables.
- Run the pgTAP suite against the linked project (preferably a staging one):
  `npx supabase test db --linked`. It runs in a transaction and rolls back.
- Smoke test as an anonymous reader:
  `curl https://techcoder.tech/api/articles/<slug>/engagement` → `200`, and
  `curl -X PUT .../like -H 'Origin: https://techcoder.tech' -H 'Content-Type: application/json' -d '{"liked":true}'` → `401`.

## Known limitations

- Account deletion is by email request (see the privacy policy). Self-service
  deletion needs a server-side admin call with the secret key, which this app
  deliberately doesn't hold.
- The moderation queue is the SQL above, not an in-app screen.
- Responses show the latest 100 per article. There's no pagination yet.
- A reader calling the Supabase API directly could create likes or responses
  on a well-formed but non-existent slug. The site never shows them (reads
  only ask for published slugs), and the rate limits still apply.
