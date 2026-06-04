-- Adds the harvest unit (kg / gab) to plant_logs so the care log syncs fully.
-- Paste into Supabase → SQL Editor → Run. Safe to re-run.
alter table public.plant_logs add column if not exists unit text;
