-- Keep reader profiles in sync with their sign-in identity.
--
-- Accounts created before the profiles migration were backfilled as "Reader"
-- with no avatar. Google also refreshes name/picture in user metadata on every
-- sign-in. This derives both from metadata in one place, repairs existing
-- rows, and keeps avatars current without overwriting a name the reader chose.

create or replace function public.profile_seed_from_metadata(meta jsonb)
returns table (display_name text, avatar_url text)
language plpgsql
immutable
set search_path = ''
as $$
declare
  name text;
  avatar text;
begin
  meta := coalesce(meta, '{}'::jsonb);
  name := coalesce(
    nullif(btrim(meta ->> 'display_name'), ''),
    nullif(btrim(meta ->> 'full_name'), ''),
    nullif(btrim(meta ->> 'name'), ''),
    'Reader'
  );
  -- Metadata is client-controlled at sign-up: strip control characters.
  name := btrim(left(regexp_replace(name, '[[:cntrl:]]', '', 'g'), 50));
  if name = '' then
    name := 'Reader';
  end if;

  avatar := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
  if avatar is null or avatar !~ '^https://[a-z0-9-]+\.googleusercontent\.com/' then
    avatar := null;
  end if;

  return query select name, avatar;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  select new.id, s.display_name, s.avatar_url
  from public.profile_seed_from_metadata(new.raw_user_meta_data) s
  on conflict (id) do nothing;
  return new;
end;
$$;

-- On metadata changes (e.g. every Google sign-in): refresh the avatar, and fill
-- the name only while it's still the "Reader" placeholder.
create or replace function public.handle_user_metadata_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles p
  set
    avatar_url = coalesce(s.avatar_url, p.avatar_url),
    display_name = case when p.display_name = 'Reader' then s.display_name else p.display_name end
  from public.profile_seed_from_metadata(new.raw_user_meta_data) s
  where p.id = new.id
    and (
      p.avatar_url is distinct from coalesce(s.avatar_url, p.avatar_url)
      or (p.display_name = 'Reader' and s.display_name <> 'Reader')
    );
  return new;
end;
$$;

create trigger on_auth_user_metadata_updated
  after update of raw_user_meta_data on auth.users
  for each row
  when (old.raw_user_meta_data is distinct from new.raw_user_meta_data)
  execute function public.handle_user_metadata_update();

-- Repair profiles created by the earlier backfill.
update public.profiles p
set
  avatar_url = coalesce(p.avatar_url, s.avatar_url),
  display_name = case when p.display_name = 'Reader' then s.display_name else p.display_name end
from auth.users u
cross join lateral public.profile_seed_from_metadata(u.raw_user_meta_data) s
where u.id = p.id
  and ((p.display_name = 'Reader' and s.display_name <> 'Reader')
       or (p.avatar_url is null and s.avatar_url is not null));

-- Internal helpers: not callable through the API.
revoke all on function public.profile_seed_from_metadata(jsonb) from public, anon, authenticated;
revoke all on function public.handle_user_metadata_update() from public, anon, authenticated;
