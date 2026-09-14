-- Migration: Allow public read access on admin_users for email-only admin verification
-- Run this in Supabase SQL Editor:

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read for admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_auth" ON public.admin_users;
DROP POLICY IF EXISTS "Public read access for admin_users" ON public.admin_users;

CREATE POLICY "Public read access for admin_users"
  ON public.admin_users FOR SELECT
  USING (true);
