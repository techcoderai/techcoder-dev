-- TechCoder: reader accounts, article likes and comments.
--
-- Articles stay in Git (MDX). Rows reference them by their canonical URL slug
-- (`/blog/<slug>`); there is deliberately no `articles` table. The app server
-- validates slugs against published content before every write.
--
-- Security model
--   * RLS is enabled on every table; every privilege is granted explicitly.
--   * Identity always comes from auth.uid() — `user_id` / `reporter_id` columns
--     default to it and policies check it, so clients cannot act as someone else.
--   * Column-level grants limit what each role can write (e.g. users can only
--     ever change their own display_name/username, moderators only a status).
--   * Moderators are users whose app_metadata.role = 'moderator'. app_metadata
--     can only be changed with the service role, never by the user.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_moderator()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'moderator', false);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (char_length(display_name) between 1 and 50 and display_name = btrim(display_name)),
  username text unique
    check (username ~ '^[a-z0-9_]{3,30}$'),
  -- Only HTTPS avatars from Google's CDN are stored (copied at sign-up).
  avatar_url text
    check (avatar_url ~ '^https://[a-z0-9-]+\.googleusercontent\.com/'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public reader identity shown next to comments. One row per auth user.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Creates the profile row for every new auth user (email or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  name text;
  avatar text;
begin
  name := coalesce(
    nullif(btrim(meta ->> 'display_name'), ''),
    nullif(btrim(meta ->> 'full_name'), ''),
    nullif(btrim(meta ->> 'name'), ''),
    'Reader'
  );
  -- Strip control characters; user metadata is client-controlled at sign-up.
  name := btrim(left(regexp_replace(name, '[[:cntrl:]]', '', 'g'), 50));
  if name = '' then
    name := 'Reader';
  end if;

  avatar := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
  if avatar is null or avatar !~ '^https://[a-z0-9-]+\.googleusercontent\.com/' then
    avatar := null;
  end if;

  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, name, avatar)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that existed before this migration.
insert into public.profiles (id, display_name)
select u.id, 'Reader'
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- article_likes
-- ---------------------------------------------------------------------------

create table public.article_likes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  article_slug text not null
    check (article_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(article_slug) <= 200),
  created_at timestamptz not null default now(),
  -- One like per user per article, enforced by the database.
  primary key (user_id, article_slug)
);

create index article_likes_article_slug_idx on public.article_likes (article_slug);

-- Public like count without exposing who liked what.
create or replace function public.article_like_count(p_slug text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.article_likes where article_slug = p_slug;
$$;

-- ---------------------------------------------------------------------------
-- article_comments
-- ---------------------------------------------------------------------------

create table public.article_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  article_slug text not null
    check (article_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(article_slug) <= 200),
  body text not null
    check (char_length(body) between 1 and 2000 and body = btrim(body)),
  -- approved: public · pending: hidden awaiting review (auto-set by reports) · removed: hidden by a moderator
  status text not null default 'approved'
    check (status in ('approved', 'pending', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index article_comments_slug_status_created_idx
  on public.article_comments (article_slug, status, created_at desc);
create index article_comments_user_created_idx
  on public.article_comments (user_id, created_at desc);

create trigger article_comments_set_updated_at
  before update on public.article_comments
  for each row execute function public.set_updated_at();

-- Abuse protection: per-user comment rate limit, enforced in the database so it
-- holds across serverless instances. PT429 surfaces as HTTP 429 via PostgREST.
create or replace function public.enforce_comment_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.article_comments
    where user_id = new.user_id and created_at > now() - interval '1 minute'
  ) >= 3 or (
    select count(*) from public.article_comments
    where user_id = new.user_id and created_at > now() - interval '1 day'
  ) >= 50 then
    raise exception 'Comment rate limit exceeded' using errcode = 'PT429';
  end if;
  return new;
end;
$$;

create trigger article_comments_rate_limit
  before insert on public.article_comments
  for each row execute function public.enforce_comment_rate_limit();

-- ---------------------------------------------------------------------------
-- comment_reports
-- ---------------------------------------------------------------------------

create table public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.article_comments (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  unique (comment_id, reporter_id)
);

create index comment_reports_reporter_created_idx
  on public.comment_reports (reporter_id, created_at desc);

create or replace function public.enforce_report_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.comment_reports
    where reporter_id = new.reporter_id and created_at > now() - interval '1 hour'
  ) >= 10 then
    raise exception 'Report rate limit exceeded' using errcode = 'PT429';
  end if;
  return new;
end;
$$;

create trigger comment_reports_rate_limit
  before insert on public.comment_reports
  for each row execute function public.enforce_report_rate_limit();

-- Three distinct reports hide a comment until a moderator reviews it.
create or replace function public.hide_reported_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.comment_reports where comment_id = new.comment_id) >= 3 then
    update public.article_comments
    set status = 'pending'
    where id = new.comment_id and status = 'approved';
  end if;
  return new;
end;
$$;

create trigger comment_reports_auto_hide
  after insert on public.comment_reports
  for each row execute function public.hide_reported_comment();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.article_likes enable row level security;
alter table public.article_comments enable row level security;
alter table public.comment_reports enable row level security;

-- profiles: a reader sees their own row; everyone sees the public name/avatar
-- of people with at least one visible comment (no browsable user directory).
create policy "Profiles: read own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Profiles: read commenters"
  on public.profiles for select
  to anon, authenticated
  using (exists (
    select 1 from public.article_comments c
    where c.user_id = profiles.id and c.status = 'approved'
  ));

create policy "Profiles: update own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- article_likes: users see, add and remove only their own likes.
create policy "Likes: read own"
  on public.article_likes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Likes: insert own"
  on public.article_likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Likes: delete own"
  on public.article_likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- article_comments
create policy "Comments: public read approved"
  on public.article_comments for select
  to anon, authenticated
  using (status = 'approved');

create policy "Comments: read own"
  on public.article_comments for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Comments: moderators read all"
  on public.article_comments for select
  to authenticated
  using ((select public.is_moderator()));

create policy "Comments: insert own"
  on public.article_comments for insert
  to authenticated
  with check ((select auth.uid()) = user_id and status = 'approved');

create policy "Comments: delete own"
  on public.article_comments for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Comments: moderators update status"
  on public.article_comments for update
  to authenticated
  using ((select public.is_moderator()))
  with check ((select public.is_moderator()));

-- comment_reports: any signed-in reader may report someone else's visible
-- comment, once; only moderators can read reports.
create policy "Reports: insert own"
  on public.comment_reports for insert
  to authenticated
  with check (
    (select auth.uid()) = reporter_id
    and exists (
      select 1 from public.article_comments c
      where c.id = comment_id
        and c.status = 'approved'
        and c.user_id <> (select auth.uid())
    )
  );

create policy "Reports: moderators read"
  on public.comment_reports for select
  to authenticated
  using ((select public.is_moderator()));

-- ---------------------------------------------------------------------------
-- Privileges (explicit; RLS still applies on top of these)
-- ---------------------------------------------------------------------------

revoke all on public.profiles, public.article_likes, public.article_comments, public.comment_reports
  from anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant update (display_name, username) on public.profiles to authenticated;

grant select (article_slug, created_at) on public.article_likes to authenticated;
grant insert (article_slug) on public.article_likes to authenticated;
grant delete on public.article_likes to authenticated;

grant select on public.article_comments to anon, authenticated;
grant insert (article_slug, body) on public.article_comments to authenticated;
grant update (status) on public.article_comments to authenticated;
grant delete on public.article_comments to authenticated;

grant select on public.comment_reports to authenticated;
grant insert (comment_id, reason) on public.comment_reports to authenticated;

revoke all on function public.article_like_count(text) from public;
grant execute on function public.article_like_count(text) to anon, authenticated;

-- Trigger-only functions must not be callable through the API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.enforce_comment_rate_limit() from public, anon, authenticated;
revoke all on function public.enforce_report_rate_limit() from public, anon, authenticated;
revoke all on function public.hide_reported_comment() from public, anon, authenticated;
