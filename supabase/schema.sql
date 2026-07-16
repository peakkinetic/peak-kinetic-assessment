-- Peak Kinetic Performance — run in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Athletes roster
create table if not exists public.athletes (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  position text default 'Athlete',
  sport text default '',
  team text default '',
  age integer,
  height text,
  weight text,
  dominant_side text default 'Right' check (dominant_side in ('Left', 'Right')),
  jersey_number integer default 0,
  gender text not null check (gender in ('Male', 'Female')),
  status text default 'Active' check (status in ('Active', 'Rehab', 'Evaluating')),
  headshot_initials text,
  coach text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Each assessment session links one athlete to one classification type
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes (id) on delete cascade,
  classification_id text not null,
  label text not null,
  status text not null default 'in-progress'
    check (status in ('scheduled', 'in-progress', 'complete')),
  coach text default '',
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists assessments_athlete_id_idx on public.assessments (athlete_id);
create index if not exists assessments_classification_id_idx on public.assessments (classification_id);

-- Individual test scores tied to an assessment session
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  module_id text not null,
  test_id text,
  value numeric,
  unit text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists assessment_results_assessment_id_idx
  on public.assessment_results (assessment_id);

-- Enable RLS (policies can be added when coach auth is wired up)
alter table public.athletes enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_results enable row level security;

-- Temporary open policies for development — replace with auth-based policies in production
create policy "Allow all athletes" on public.athletes for all using (true) with check (true);
create policy "Allow all assessments" on public.assessments for all using (true) with check (true);
create policy "Allow all assessment_results" on public.assessment_results for all using (true) with check (true);
