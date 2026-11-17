# Native Society

Private, mobile-first introductions for NYC-raised adults from independent and boarding schools. Phase 1 is a **Next.js App Router** demo with in-memory data, mock auth, and a full UX loop from application → profile → weekly introductions → mutual matches → messaging.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo sign-in

| Role   | Email                         | Password      |
|--------|-------------------------------|---------------|
| Member | `member@nativesociety.nyc`    | `member2024`  |
| Admin  | `admin@nativesociety.nyc`     | `admin2024`   |

The approved member has a pre-seeded profile, weekly batch, and a sample match thread with James.

### Scripts

- `npm run dev` — development server
- `npm run build` — production build (run before PR)
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Phase 1 scope

| Area | Routes |
|------|--------|
| Landing | `/` |
| Application | `/apply`, `/application/status` |
| Auth | `/login`, `/signup` (password + magic-link demo) |
| Onboarding & profile | `/onboarding/profile`, `/profile` |
| Introductions | `/discover` |
| Matches & chat | `/matches`, `/matches/[id]` |
| Admin shell | `/admin` (role-gated) |
| Legal placeholders | `/privacy`, `/terms`, `/safety`, `/contact` |

## Architecture

```
src/
  app/              # App Router pages & API routes
  components/       # UI
  data/seed.ts      # In-memory seed data
  lib/
    auth/           # Session helpers (swap for Clerk / Auth.js)
    data/           # Memory DB singleton
    matching/       # Matcher rules + weekly batch
    services/       # Recommendation orchestration
  repositories/     # Interfaces + in-memory implementations
  types/            # Domain types (Postgres-ready)
```

Matching logic and filters are documented in `src/lib/matching/matcher.ts`.

## Mock vs production-ready

| Layer | Phase 1 | Later |
|-------|---------|--------|
| Database | In-memory Maps (`lib/data/memory-store.ts`) | Postgres via repository adapters |
| Auth | Base64 cookie session (`lib/auth`) | Clerk, Auth.js, or similar |
| Photos | URL text fields | Private object storage + signed URLs |
| Magic link | Returned in API JSON for demo | Email provider + hashed tokens |
| Payments | Optional fields on `User` type only | Stripe Customer / subscription |

## Environment variables (future)

Documented for when Postgres and auth are wired; **not required** for the demo.

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
EMAIL_FROM=membership@nativesociety.nyc
```

Copy `.env.example` when added — none are read in phase 1.

## Out of scope (phase 1)

Native apps, events, concierge, paid tiers UI, social feed, video/voice, AI matching UI, and payment flows.