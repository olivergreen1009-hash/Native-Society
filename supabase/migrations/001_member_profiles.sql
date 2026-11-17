-- Member gallery profiles (service role from Next.js; RLS optional later)
create table if not exists public.member_profiles (
  user_id text primary key,
  first_name text not null default '',
  age int,
  neighborhood text not null default '',
  raised_in_borough text,
  school_line text,
  summer_destination text,
  summer_other text,
  favorite_nyc_detail varchar(120),
  photo_url text,
  bio text not null default '',
  interests jsonb not null default '[]'::jsonb,
  approved boolean not null default false,
  active boolean not null default true,
  discoverable boolean not null default false,
  pause_discovery boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists member_profiles_discoverable_idx
  on public.member_profiles (discoverable, approved, active)
  where discoverable and approved and active and not pause_discovery;

create table if not exists public.weekly_batches (
  id text primary key,
  viewer_user_id text not null references public.member_profiles (user_id) on delete cascade,
  week_of date not null,
  member_user_ids text[] not null default '{}',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (viewer_user_id, week_of)
);

create table if not exists public.batch_actions (
  id text primary key,
  batch_id text not null references public.weekly_batches (id) on delete cascade,
  from_user_id text not null references public.member_profiles (user_id) on delete cascade,
  to_user_id text not null references public.member_profiles (user_id) on delete cascade,
  decision text not null check (decision in ('interested', 'pass')),
  created_at timestamptz not null default now(),
  unique (from_user_id, to_user_id, batch_id)
);

create table if not exists public.member_matches (
  id text primary key,
  user_a_id text not null references public.member_profiles (user_id) on delete cascade,
  user_b_id text not null references public.member_profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a_id, user_b_id)
);