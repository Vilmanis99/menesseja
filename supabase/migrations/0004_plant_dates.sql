-- Older sown_date values may only record when an entry was added to the garden.
-- Leave the new dates empty until the gardener supplies the actual event.
alter table public.plants
  add column if not exists sown_on date,
  add column if not exists planted_on date,
  drop constraint if exists plants_sowing_before_planting,
  add constraint plants_sowing_before_planting check (sown_on <= planted_on);
