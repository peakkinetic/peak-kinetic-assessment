-- Optional coach auth setup for Supabase projects
-- Run after schema.sql once you are ready to create real coach accounts.

-- Coach profile metadata linked to Supabase Auth users
create table if not exists public.coach_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.coach_profiles enable row level security;

create policy "Coaches can read own profile"
  on public.coach_profiles
  for select
  using (auth.uid() = id);

create policy "Coaches can update own profile"
  on public.coach_profiles
  for update
  using (auth.uid() = id);

-- Example: create a coach in Supabase Auth, then insert profile row
-- insert into public.coach_profiles (id, display_name)
-- values ('00000000-0000-0000-0000-000000000001', 'Coach Moody');

-- Future hardening:
-- 1. Add coach_user_id uuid references auth.users(id) to athletes + assessments
-- 2. Replace open RLS policies with auth.uid() checks
-- 3. Stop using the service role key for normal coach CRUD in server actions
