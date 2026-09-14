-- Migration 003: Enable dynamic CRUD mutations for Admin Panel
-- Run this in Supabase SQL Editor:

-- ============================================================
-- 1. TEAM MEMBERS
-- ============================================================
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_all" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated insert for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin insert for team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_admin" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated update for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin update for team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update_admin" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated delete for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin delete for team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete_admin" ON public.team_members;
DROP POLICY IF EXISTS "Allow all access for team_members" ON public.team_members;

CREATE POLICY "Allow all access for team_members"
  ON public.team_members FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. BLOG POSTS
-- ============================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_all" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated insert for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin insert for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert_admin" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated update for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin update for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_update_admin" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated delete for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin delete for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete_admin" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all access for blog_posts" ON public.blog_posts;

CREATE POLICY "Allow all access for blog_posts"
  ON public.blog_posts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. EVENTS
-- ============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for events" ON public.events;
DROP POLICY IF EXISTS "events_select_all" ON public.events;
DROP POLICY IF EXISTS "Authenticated insert for events" ON public.events;
DROP POLICY IF EXISTS "Admin insert for events" ON public.events;
DROP POLICY IF EXISTS "events_insert_admin" ON public.events;
DROP POLICY IF EXISTS "Authenticated update for events" ON public.events;
DROP POLICY IF EXISTS "Admin update for events" ON public.events;
DROP POLICY IF EXISTS "events_update_admin" ON public.events;
DROP POLICY IF EXISTS "Authenticated delete for events" ON public.events;
DROP POLICY IF EXISTS "Admin delete for events" ON public.events;
DROP POLICY IF EXISTS "events_delete_admin" ON public.events;
DROP POLICY IF EXISTS "Allow all access for events" ON public.events;

CREATE POLICY "Allow all access for events"
  ON public.events FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. DYNAMIC SECTIONS
-- ============================================================
ALTER TABLE public.dynamic_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "dynamic_sections_select_all" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Authenticated insert for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin insert for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "dynamic_sections_insert_admin" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Authenticated update for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin update for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "dynamic_sections_update_admin" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Authenticated delete for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin delete for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "dynamic_sections_delete_admin" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Allow all access for dynamic_sections" ON public.dynamic_sections;

CREATE POLICY "Allow all access for dynamic_sections"
  ON public.dynamic_sections FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
