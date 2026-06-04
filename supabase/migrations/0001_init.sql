-- Mēness Sēja — Phase 2 backend schema
-- Paste this into the Supabase dashboard → SQL Editor → Run (or `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP POLICY guards.

-- ────────────────────────────────────────────────────────────────────────────
-- Helpers
-- ────────────────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";  -- gen_random_uuid()

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- profiles  (1:1 with auth.users)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  region        text,                       -- kurzeme | vidzeme | zemgale | latgale | pieriga
  gardener_type text,                        -- from the onboarding quiz
  level         int  not null default 1,
  xp            int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, ''), '@', 1))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────────────────────
-- plants + plant_logs  (the user's garden, synced across devices)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.plants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  crop_id     text not null,
  area        text not null,
  sown_date   date,
  status      text,
  seed        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists plants_user_idx on public.plants(user_id);
create index if not exists plants_crop_created_idx on public.plants(crop_id, created_at);

create table if not exists public.plant_logs (
  id         uuid primary key default gen_random_uuid(),
  plant_id   uuid not null references public.plants(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null default current_date,
  type       text not null,                  -- laistits | meslots | kaite | raza | piezime
  note       text,
  amount     numeric,
  created_at timestamptz not null default now()
);
create index if not exists plant_logs_plant_idx on public.plant_logs(plant_id);

-- ────────────────────────────────────────────────────────────────────────────
-- community_posts + post_likes
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  region     text,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists posts_region_created_idx on public.community_posts(region, created_at desc);

create table if not exists public.post_likes (
  post_id  uuid not null references public.community_posts(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ────────────────────────────────────────────────────────────────────────────
-- polls + poll_votes  (aptaujas with real results)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.polls (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  options    text[] not null,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_votes (
  poll_id      uuid not null references public.polls(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  option_index int not null,
  created_at   timestamptz not null default now(),
  primary key (poll_id, user_id)
);

-- ────────────────────────────────────────────────────────────────────────────
-- badges  (earned achievements)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.badges (
  user_id    uuid not null references auth.users(id) on delete cascade,
  badge_key  text not null,
  earned_at  timestamptz not null default now(),
  primary key (user_id, badge_key)
);

-- ════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════════════
alter table public.profiles        enable row level security;
alter table public.plants          enable row level security;
alter table public.plant_logs      enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_likes      enable row level security;
alter table public.polls           enable row level security;
alter table public.poll_votes      enable row level security;
alter table public.badges          enable row level security;

-- profiles: public read (for community names), self write
drop policy if exists profiles_read   on public.profiles;
drop policy if exists profiles_write  on public.profiles;
create policy profiles_read  on public.profiles for select using (true);
create policy profiles_write on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- plants / plant_logs: fully private to owner
drop policy if exists plants_owner on public.plants;
create policy plants_owner on public.plants for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists plant_logs_owner on public.plant_logs;
create policy plant_logs_owner on public.plant_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- community_posts: anyone reads, authenticated writes own
drop policy if exists posts_read   on public.community_posts;
drop policy if exists posts_insert  on public.community_posts;
drop policy if exists posts_modify  on public.community_posts;
create policy posts_read   on public.community_posts for select using (true);
create policy posts_insert on public.community_posts for insert with check (auth.uid() = user_id);
create policy posts_modify on public.community_posts for update using (auth.uid() = user_id);
drop policy if exists posts_delete on public.community_posts;
create policy posts_delete on public.community_posts for delete using (auth.uid() = user_id);

-- post_likes: anyone reads counts, self toggles own like
drop policy if exists likes_read on public.post_likes;
drop policy if exists likes_write on public.post_likes;
create policy likes_read  on public.post_likes for select using (true);
create policy likes_write on public.post_likes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- polls: public read; votes self-only
drop policy if exists polls_read on public.polls;
create policy polls_read on public.polls for select using (true);

drop policy if exists votes_read  on public.poll_votes;
drop policy if exists votes_write on public.poll_votes;
create policy votes_read  on public.poll_votes for select using (true);
create policy votes_write on public.poll_votes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- badges: public read (shareable), self write
drop policy if exists badges_read  on public.badges;
drop policy if exists badges_write on public.badges;
create policy badges_read  on public.badges for select using (true);
create policy badges_write on public.badges for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- Aggregate views for national "Topi" (owner-rights views → only expose counts,
-- never individual rows, so no PII leaks past RLS)
-- ════════════════════════════════════════════════════════════════════════════
create or replace view public.top_crops_30d as
  select crop_id, count(*)::int as plantings
  from public.plants
  where seed = false and created_at > now() - interval '30 days'
  group by crop_id
  order by plantings desc;

create or replace view public.poll_results as
  select p.id as poll_id, v.option_index, count(*)::int as votes
  from public.polls p
  join public.poll_votes v on v.poll_id = p.id
  group by p.id, v.option_index;

-- Explicit: these views run with the owner's rights (the default) so they can
-- aggregate across all users past RLS — but they SELECT only grouped counts, so
-- no individual row / PII is ever exposed. Pinned here so the intent is obvious.
alter view public.top_crops_30d set (security_invoker = false);
alter view public.poll_results  set (security_invoker = false);

grant select on public.top_crops_30d, public.poll_results to anon, authenticated;
