-- Optional overrides for assessment type display names and descriptions.
-- Run in Supabase SQL Editor after schema.sql.

create table if not exists public.assessment_classification_overrides (
  classification_id text primary key,
  label text not null default '',
  description text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.assessment_classification_overrides enable row level security;

create policy "Allow all assessment_classification_overrides"
  on public.assessment_classification_overrides
  for all
  using (true)
  with check (true);
