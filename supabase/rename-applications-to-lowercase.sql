-- Run once in Supabase: SQL Editor → New query → Run
-- PostgREST / supabase-js expect lowercase public.applications.

DO $$
BEGIN
  IF to_regclass('public."Applications"') IS NOT NULL
     AND to_regclass('public.applications') IS NULL THEN
    ALTER TABLE public."Applications" RENAME TO applications;
  END IF;
END
$$;