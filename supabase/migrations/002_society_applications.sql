-- Native Society society-model applications (raw_data JSON) and introduction proposals.
-- Wire when Supabase is enabled; memory repo handles dev today.

-- TODO(counsel): align retention, consent, and fee disclosures with counsel-approved terms.

create table if not exists society_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  full_name text not null,
  email text not null,
  status text not null,
  admin_notes text default '',
  raw_data jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists introduction_proposals (
  id uuid primary key default gen_random_uuid(),
  recipient_member_id uuid not null,
  counterpart_member_id uuid not null,
  state text not null,
  proposal_text text not null,
  reason text not null,
  limited_profile_snapshot jsonb not null,
  recipient_response text not null default 'pending',
  counterpart_response text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);