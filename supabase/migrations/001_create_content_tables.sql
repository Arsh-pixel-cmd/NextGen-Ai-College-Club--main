-- Migration: Create content tables for admin panel
-- Tasks 1.1-1.4: team_members, blog_posts, events, dynamic_sections

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

-- Public read
CREATE POLICY "team_members_select_all"
  ON team_members FOR SELECT
  USING (true);

-- Authenticated write
CREATE POLICY "team_members_insert_auth"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "team_members_update_auth"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "team_members_delete_auth"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

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

CREATE POLICY "blog_posts_select_all"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "blog_posts_insert_auth"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "blog_posts_update_auth"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "blog_posts_delete_auth"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

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

CREATE POLICY "events_select_all"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "events_insert_auth"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "events_update_auth"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "events_delete_auth"
  ON events FOR DELETE
  TO authenticated
  USING (true);

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

CREATE POLICY "dynamic_sections_select_all"
  ON dynamic_sections FOR SELECT
  USING (true);

CREATE POLICY "dynamic_sections_insert_auth"
  ON dynamic_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "dynamic_sections_update_auth"
  ON dynamic_sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "dynamic_sections_delete_auth"
  ON dynamic_sections FOR DELETE
  TO authenticated
  USING (true);
