# Supabase — member gallery

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side reads/writes (gallery, admin) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Fallback if service role unset (applications insert) |

Without these variables the app falls back to in-memory repositories and sample gallery cards.

## Migrations

Run SQL in order under `supabase/migrations/`:

1. `001_member_profiles.sql` — `member_profiles`, `weekly_batches`, `batch_actions`, `member_matches`

Existing application SQL:

- `supabase/rename-applications-to-lowercase.sql`
- `supabase/admin-read-applications-rls.sql`

## `member_profiles` fields (gallery-relevant)

| Column | Notes |
|--------|-------|
| `raised_in_borough` | Manhattan, Brooklyn, Queens, Bronx, Staten Island, or “Raised in the city” |
| `summer_destination` / `summer_other` | Shown on weekly cards when set |
| `favorite_nyc_detail` | Max 120 chars; detail / mutual introductions only |
| `discoverable`, `approved`, `active` | Eligibility for weekly batch |

## Seeding test members (manual)

```sql
insert into public.member_profiles (
  user_id, first_name, age, neighborhood, raised_in_borough,
  school_line, summer_destination, favorite_nyc_detail,
  photo_url, bio, approved, active, discoverable
) values
  ('user-test-1', 'Alex', 32, 'Upper East Side', 'Manhattan',
   'Chapin → Dartmouth', 'Hamptons', 'The 6 train at dawn.',
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', 'Bio here.',
   true, true, true),
  ('user-test-2', 'Jamie', 35, 'West Village', 'Brooklyn',
   'Trinity → Georgetown', 'Nantucket', null,
   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600', 'Bio here.',
   true, true, true),
  ('user-test-3', 'Sam', 29, 'Brooklyn Heights', 'Brooklyn',
   'Poly Prep → Williams', 'Newport', 'Brooklyn Bridge walk.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600', 'Bio here.',
   true, true, true);
```

Sign in as a seeded memory user or link `user_id` to your session user id when wiring auth.