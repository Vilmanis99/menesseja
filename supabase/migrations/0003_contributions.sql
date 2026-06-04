-- User-submitted ancestral wisdom (recipes, folk beliefs, customs) for the
-- "digitize senču gudrība" mission. Submissions start as 'pending' and appear
-- publicly only once the team approves them (status='approved') in the dashboard.
-- Paste into Supabase → SQL Editor → Run. Safe to re-run.

create table if not exists public.contributions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,  -- keep the wisdom if the account is deleted
  type        text not null check (type in ('recepte', 'ticejums', 'paraza')),
  title       text not null check (char_length(title) between 2 and 200),
  body        text not null check (char_length(body) between 5 and 4000),
  region      text,
  author_name text,                                               -- e.g. "Vecmāmiņa Anna, Kurzeme"
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);
create index if not exists contributions_status_idx on public.contributions(status, created_at desc);

alter table public.contributions enable row level security;

-- Public reads only APPROVED items; a user can also see their own submissions.
drop policy if exists contributions_read on public.contributions;
create policy contributions_read on public.contributions for select
  using (status = 'approved' or auth.uid() = user_id);

-- Authenticated users may submit, but cannot self-approve: the check pins
-- user_id to themselves and forces the initial status to 'pending'.
drop policy if exists contributions_insert on public.contributions;
create policy contributions_insert on public.contributions for insert
  with check (auth.uid() = user_id and status = 'pending');

-- A user may delete their own submission; approval/rejection is admin-only
-- (done from the dashboard / service role, which bypasses RLS).
drop policy if exists contributions_delete on public.contributions;
create policy contributions_delete on public.contributions for delete
  using (auth.uid() = user_id);

-- Public, PII-free view of approved wisdom for display.
create or replace view public.approved_contributions as
  select id, type, title, body, region, author_name, created_at
  from public.contributions
  where status = 'approved'
  order by created_at desc;

alter view public.approved_contributions set (security_invoker = false);
grant select on public.approved_contributions to anon, authenticated;
