-- Migration: Create content tables for admin panel with Core Team Access Control
-- Tasks 1.1-1.4: team_members, blog_posts, events, dynamic_sections, admin_users

-- ============================================================
-- 0. ADMIN USERS TABLE & RLS HELPER
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'core_team',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select_auth" ON admin_users;
CREATE POLICY "admin_users_select_auth"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Helper function to verify core team admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
$$;

-- ============================================================
-- 1.1  team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  position      text        NOT NULL,
  image_url     text        NOT NULL DEFAULT '',
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_members_select_all" ON team_members;
CREATE POLICY "team_members_select_all"
  ON team_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "team_members_insert_admin" ON team_members;
CREATE POLICY "team_members_insert_admin"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "team_members_update_admin" ON team_members;
CREATE POLICY "team_members_update_admin"
  ON team_members FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "team_members_delete_admin" ON team_members;
CREATE POLICY "team_members_delete_admin"
  ON team_members FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 1.2  blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  source        text        NOT NULL DEFAULT '',
  source_url    text        NOT NULL DEFAULT '',
  date          text        NOT NULL DEFAULT '',
  snippet       text        NOT NULL DEFAULT '',
  image_url     text        NOT NULL DEFAULT '',
  category      text        NOT NULL DEFAULT '',
  read_time     text        NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_select_all" ON blog_posts;
CREATE POLICY "blog_posts_select_all"
  ON blog_posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "blog_posts_insert_admin" ON blog_posts;
CREATE POLICY "blog_posts_insert_admin"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "blog_posts_update_admin" ON blog_posts;
CREATE POLICY "blog_posts_update_admin"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "blog_posts_delete_admin" ON blog_posts;
CREATE POLICY "blog_posts_delete_admin"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 1.3  events
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date          text        NOT NULL DEFAULT '',
  name          text        NOT NULL,
  venue         text        NOT NULL DEFAULT '',
  details       text        NOT NULL DEFAULT '',
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all" ON events;
CREATE POLICY "events_select_all"
  ON events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "events_insert_admin" ON events;
CREATE POLICY "events_insert_admin"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "events_update_admin" ON events;
CREATE POLICY "events_update_admin"
  ON events FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "events_delete_admin" ON events;
CREATE POLICY "events_delete_admin"
  ON events FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 1.4  dynamic_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS dynamic_sections (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  subtitle       text        NOT NULL DEFAULT '',
  content_blocks jsonb       NOT NULL DEFAULT '[]'::jsonb,
  display_order  integer     NOT NULL DEFAULT 0,
  is_visible     boolean     NOT NULL DEFAULT true,
  section_type   text        NOT NULL DEFAULT 'cards',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dynamic_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dynamic_sections_select_all" ON dynamic_sections;
CREATE POLICY "dynamic_sections_select_all"
  ON dynamic_sections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "dynamic_sections_insert_admin" ON dynamic_sections;
CREATE POLICY "dynamic_sections_insert_admin"
  ON dynamic_sections FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "dynamic_sections_update_admin" ON dynamic_sections;
CREATE POLICY "dynamic_sections_update_admin"
  ON dynamic_sections FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "dynamic_sections_delete_admin" ON dynamic_sections;
CREATE POLICY "dynamic_sections_delete_admin"
  ON dynamic_sections FOR DELETE
  TO authenticated
  USING (is_admin());
