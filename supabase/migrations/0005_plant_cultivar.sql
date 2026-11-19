-- A gardener can grow several named varieties of the same crop.
alter table public.plants add column if not exists cultivar varchar(100);
