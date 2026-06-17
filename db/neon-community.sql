-- Neon (Postgres) schema for the pseudonymous community.
-- No accounts/auth: identity is a client-generated device id + chosen display name.
-- Run once against the Neon database (or it runs idempotently on boot).

create table if not exists community_posts (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  author_name text not null,
  region      text,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_community_posts_created on community_posts (created_at desc);
create index if not exists idx_community_posts_region  on community_posts (region);
create index if not exists idx_community_posts_client  on community_posts (client_id);

create table if not exists community_likes (
  post_id    uuid not null references community_posts (id) on delete cascade,
  client_id  text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, client_id)
);

-- "Senču gudrība" — pseudonymous ancestral-wisdom submissions (recipes, beliefs,
-- customs). Lightly moderated: rows start 'pending' and only show publicly once
-- set to 'approved'. The submitter sees their own rows (any status) by client_id.
create table if not exists community_contributions (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  type        text not null,                    -- 'recepte' | 'ticejums' | 'paraza'
  title       text not null,
  body        text not null,
  region      text,
  author_name text,
  status      text not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at  timestamptz not null default now()
);

create index if not exists idx_contrib_status on community_contributions (status, created_at desc);
create index if not exists idx_contrib_client on community_contributions (client_id);
