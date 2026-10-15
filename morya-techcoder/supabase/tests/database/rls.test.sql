-- RLS / authorization tests for reader accounts, likes, comments and reports.
-- Run with: npx supabase test db --linked (runs in a transaction, rolls back)
begin;
create extension if not exists pgtap with schema extensions;

select plan(41);

-- Fixtures -------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data, raw_app_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'rls-test-alice@example.invalid',
   '{"display_name":"  Alice  ","avatar_url":"https://evil.example.com/x.png"}', '{}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'rls-test-bob@example.invalid',
   '{"full_name":"Bob G","avatar_url":"https://lh3.googleusercontent.com/a/abc"}', '{}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'rls-test-carol@example.invalid', '{}', '{}', 'authenticated', 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'rls-test-dave@example.invalid', '{}', '{}', 'authenticated', 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', 'rls-test-mod@example.invalid', '{}', '{"role":"moderator"}', 'authenticated', 'authenticated');

create or replace function pg_temp.login(uid uuid, app jsonb default '{}')
returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims',
           json_build_object('sub', uid, 'role', 'authenticated', 'app_metadata', app)::text, true);
$$;

create or replace function pg_temp.logout()
returns void language sql as $$
  select set_config('role', 'anon', true),
         set_config('request.jwt.claims', '{"role":"anon"}', true);
$$;

create or replace function pg_temp.as_admin()
returns void language sql as $$
  select set_config('role', 'postgres', true),
         set_config('request.jwt.claims', '', true);
$$;

-- Profiles created by trigger ------------------------------------------------
select is((select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice', 'display name is trimmed from sign-up metadata');
select is((select avatar_url from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  null, 'non-Google avatar URLs are discarded');
select is((select avatar_url from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  'https://lh3.googleusercontent.com/a/abc', 'Google avatar is kept');
select is((select display_name from public.profiles where id = '33333333-3333-3333-3333-333333333333'),
  'Reader', 'fallback display name');

-- Google sign-in refreshes metadata: placeholder name + avatar get filled, a
-- chosen name is kept.
update auth.users
set raw_user_meta_data = '{"full_name":"Carol Google","avatar_url":"https://lh3.googleusercontent.com/a/carol"}'
where id = '33333333-3333-3333-3333-333333333333';
select is((select display_name || ' ' || avatar_url from public.profiles where id = '33333333-3333-3333-3333-333333333333'),
  'Carol Google https://lh3.googleusercontent.com/a/carol', 'metadata update fills placeholder name and avatar');
update auth.users
set raw_user_meta_data = '{"full_name":"Someone Else","avatar_url":"https://lh3.googleusercontent.com/a/new"}'
where id = '33333333-3333-3333-3333-333333333333';
select is((select display_name from public.profiles where id = '33333333-3333-3333-3333-333333333333'),
  'Carol Google', 'metadata update never overwrites a real name');
select is((select avatar_url from public.profiles where id = '33333333-3333-3333-3333-333333333333'),
  'https://lh3.googleusercontent.com/a/new', 'metadata update refreshes the avatar');

-- Anonymous visitors ---------------------------------------------------------
select pg_temp.logout();
select throws_ok($$ insert into public.article_likes (article_slug) values ('rls-test-article') $$,
  '42501', null, 'anon cannot like');
select throws_ok($$ insert into public.article_comments (article_slug, body) values ('rls-test-article', 'hi') $$,
  '42501', null, 'anon cannot comment');

-- Likes ----------------------------------------------------------------------
select pg_temp.login('11111111-1111-1111-1111-111111111111');
select lives_ok($$ insert into public.article_likes (article_slug) values ('rls-test-article') $$, 'alice likes');
select throws_ok($$ insert into public.article_likes (article_slug) values ('rls-test-article') $$,
  '23505', null, 'second like by the same user is rejected');
select throws_ok($$ insert into public.article_likes (user_id, article_slug)
  values ('22222222-2222-2222-2222-222222222222', 'rls-test-article') $$,
  '42501', null, 'cannot like as another user');
select throws_ok($$ insert into public.article_likes (article_slug) values ('Bad Slug!') $$,
  '23514', null, 'malformed slug rejected');

select pg_temp.login('22222222-2222-2222-2222-222222222222');
select lives_ok($$ insert into public.article_likes (article_slug) values ('rls-test-article') $$, 'bob likes');
select is((select count(*)::int from public.article_likes), 1, 'bob only sees his own like rows');
delete from public.article_likes where article_slug = 'rls-test-article';
select is(public.article_like_count('rls-test-article'), 1, 'bob unliking only removes his like');

select pg_temp.logout();
select is(public.article_like_count('rls-test-article'), 1, 'anon can read like count');
select throws_ok($$ select * from public.article_likes $$, '42501', null, 'anon cannot read like rows');

-- Comments -------------------------------------------------------------------
select pg_temp.login('11111111-1111-1111-1111-111111111111');
select lives_ok($$ insert into public.article_comments (article_slug, body)
  values ('rls-test-article', 'Great read') $$, 'alice comments');
select throws_ok($$ insert into public.article_comments (id, article_slug, body)
  values (gen_random_uuid(), 'rls-test-article', 'x') $$, '42501', null, 'cannot choose comment id');
select pg_temp.as_admin();
update public.article_comments set id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' where body = 'Great read';
select pg_temp.login('11111111-1111-1111-1111-111111111111');
select throws_ok($$ insert into public.article_comments (article_slug, body, status)
  values ('rls-test-article', 'x', 'approved') $$, '42501', null, 'cannot set status directly');
select throws_ok($$ insert into public.article_comments (user_id, article_slug, body)
  values ('22222222-2222-2222-2222-222222222222', 'rls-test-article', 'spoof') $$,
  '42501', null, 'cannot comment as another user');
select throws_ok($$ insert into public.article_comments (article_slug, body)
  values ('rls-test-article', repeat('a', 2001)) $$, '23514', null, 'over-long comment rejected');
select throws_ok($$ insert into public.article_comments (article_slug, body)
  values ('rls-test-article', '   ') $$, '23514', null, 'blank comment rejected');

select pg_temp.logout();
select is((select count(*)::int from public.article_comments where article_slug = 'rls-test-article'), 1,
  'anon reads approved comments');
select is((select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice', 'anon reads commenter display name');
select is((select count(*)::int from public.profiles where id = '33333333-3333-3333-3333-333333333333'), 0,
  'anon cannot read profiles of non-commenters');

select pg_temp.login('22222222-2222-2222-2222-222222222222');
delete from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
update public.article_comments set status = 'removed' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select pg_temp.logout();
select is((select status from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'approved', 'another user cannot delete or hide the comment');

-- Profiles -------------------------------------------------------------------
select pg_temp.login('22222222-2222-2222-2222-222222222222');
update public.profiles set display_name = 'Hacked' where id = '11111111-1111-1111-1111-111111111111';
select lives_ok($$ update public.profiles set display_name = 'Bobby' where id = '22222222-2222-2222-2222-222222222222' $$,
  'bob renames himself');
select throws_ok($$ update public.profiles set avatar_url = 'https://lh3.googleusercontent.com/x' $$,
  '42501', null, 'avatar_url is not user-writable');
select pg_temp.logout();
select is((select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice', 'bob cannot rename alice');

-- Reports --------------------------------------------------------------------
select pg_temp.login('11111111-1111-1111-1111-111111111111');
select throws_ok($$ insert into public.comment_reports (comment_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') $$,
  '42501', null, 'cannot report own comment');

select pg_temp.login('22222222-2222-2222-2222-222222222222');
select lives_ok($$ insert into public.comment_reports (comment_id, reason) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'spam') $$,
  'bob reports');
select throws_ok($$ insert into public.comment_reports (comment_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') $$,
  '23505', null, 'duplicate report rejected');
select is((select count(*)::int from public.comment_reports), 0, 'reporters cannot read reports');

select pg_temp.login('33333333-3333-3333-3333-333333333333');
insert into public.comment_reports (comment_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select pg_temp.login('44444444-4444-4444-4444-444444444444');
insert into public.comment_reports (comment_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select pg_temp.logout();
select is((select count(*)::int from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0,
  'three reports hide the comment from the public');

-- Moderation -----------------------------------------------------------------
select pg_temp.login('55555555-5555-5555-5555-555555555555', '{"role":"moderator"}');
select is((select count(*)::int from public.comment_reports where comment_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 3, 'moderator reads reports');
update public.article_comments set status = 'removed' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select is((select status from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'removed', 'moderator removes a comment');
select throws_ok($$ update public.article_comments set body = 'edited' $$, '42501', null,
  'moderator cannot rewrite comment text');

-- Own deletion + rate limit --------------------------------------------------
select pg_temp.login('11111111-1111-1111-1111-111111111111');
delete from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select is((select count(*)::int from public.article_comments where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 0,
  'author deletes own comment');

insert into public.article_comments (article_slug, body) values ('rls-test-article', 'one'), ('rls-test-article', 'two'), ('rls-test-article', 'three');
select throws_ok($$ insert into public.article_comments (article_slug, body) values ('rls-test-article', 'four') $$,
  'PT429', null, 'fourth comment within a minute is rate limited');

select * from finish();
rollback;
