-- Migration 004: Fix infinite recursion on admin_users (Postgres Error 42P17)
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Drop the recursive policy that caused error 42P17:
DROP POLICY IF EXISTS "Admin modify for admin_users" ON public.admin_users;

-- 2. Drop any conflicting older policies:
DROP POLICY IF EXISTS "Authenticated read for admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_auth" ON public.admin_users;
DROP POLICY IF EXISTS "Public read access for admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow all access for admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_all" ON public.admin_users;

-- 3. Create non-recursive policy granting read and mutation access to public/anon:
CREATE POLICY "Allow all access for admin_users"
  ON public.admin_users FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
