-- ============================================================================
-- HAPPY EVENTS — Supabase Row-Level Security (RLS) Hardening Migration
-- Fixes Supabase Security Advisor: rls_disabled_in_public
-- ============================================================================
-- Architecture note:
-- HAPPY EVENTS accesses PostgreSQL exclusively from the Next.js server backend.
-- Enabling RLS on all public tables + revoking anon/authenticated privileges
-- completely blocks direct public access via the Supabase Data API (PostgREST)
-- while keeping server-side access (postgres / service_role) 100% functional.
-- ============================================================================

DO $$
DECLARE
  tbl RECORD;
  policy_name TEXT;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    -- 1. Enable Row-Level Security on the table
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.tablename);

    -- 2. Create explicit policy for service_role (prevents rls_enabled_no_policy advisor notice)
    policy_name := 'service_role_full_access_' || tbl.tablename;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', policy_name, tbl.tablename);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true);',
      policy_name,
      tbl.tablename
    );

    -- 3. Revoke public PostgREST access (anon & authenticated roles)
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated;', tbl.tablename);
  END LOOP;
END
$$;

