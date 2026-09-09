-- ============================================================
-- Admin Panel: Supabase Database Setup & Core Team Access Control
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ============================================================
-- 1. ADMIN USERS TABLE (Core Team Access Control)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'core_team',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read for admin_users" ON public.admin_users;
CREATE POLICY "Authenticated read for admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin modify for admin_users" ON public.admin_users;
CREATE POLICY "Admin modify for admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    )
  );

-- Helper function: Checks if the currently authenticated user is in admin_users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
$$;


-- ============================================================
-- 2. TEAM MEMBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for team_members" ON public.team_members;
CREATE POLICY "Public read access for team_members"
  ON public.team_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin insert for team_members" ON public.team_members;
CREATE POLICY "Admin insert for team_members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated update for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin update for team_members" ON public.team_members;
CREATE POLICY "Admin update for team_members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated delete for team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admin delete for team_members" ON public.team_members;
CREATE POLICY "Admin delete for team_members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 3. BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  snippet TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for blog_posts" ON public.blog_posts;
CREATE POLICY "Public read access for blog_posts"
  ON public.blog_posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin insert for blog_posts" ON public.blog_posts;
CREATE POLICY "Admin insert for blog_posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated update for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin update for blog_posts" ON public.blog_posts;
CREATE POLICY "Admin update for blog_posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated delete for blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin delete for blog_posts" ON public.blog_posts;
CREATE POLICY "Admin delete for blog_posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 4. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for events" ON public.events;
CREATE POLICY "Public read access for events"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert for events" ON public.events;
DROP POLICY IF EXISTS "Admin insert for events" ON public.events;
CREATE POLICY "Admin insert for events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated update for events" ON public.events;
DROP POLICY IF EXISTS "Admin update for events" ON public.events;
CREATE POLICY "Admin update for events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated delete for events" ON public.events;
DROP POLICY IF EXISTS "Admin delete for events" ON public.events;
CREATE POLICY "Admin delete for events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 5. DYNAMIC SECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dynamic_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  section_type TEXT NOT NULL DEFAULT 'cards',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dynamic_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for dynamic_sections" ON public.dynamic_sections;
CREATE POLICY "Public read access for dynamic_sections"
  ON public.dynamic_sections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin insert for dynamic_sections" ON public.dynamic_sections;
CREATE POLICY "Admin insert for dynamic_sections"
  ON public.dynamic_sections FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated update for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin update for dynamic_sections" ON public.dynamic_sections;
CREATE POLICY "Admin update for dynamic_sections"
  ON public.dynamic_sections FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated delete for dynamic_sections" ON public.dynamic_sections;
DROP POLICY IF EXISTS "Admin delete for dynamic_sections" ON public.dynamic_sections;
CREATE POLICY "Admin delete for dynamic_sections"
  ON public.dynamic_sections FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================
-- 6. CORE TEAM SEED DATA
-- Replace or add your core team members' email addresses here!
-- When these users sign in with Supabase Auth, they will be granted admin access.
-- ============================================================
-- INSERT INTO public.admin_users (email, name, role) VALUES
--   ('your-email@example.com', 'Your Name', 'core_team')
-- ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- 7. INITIAL CONTENT SEED DATA
-- ============================================================

-- Seed team_members (from MembersSection.tsx)
INSERT INTO public.team_members (name, position, image_url, display_order) VALUES
  ('Alex Doe', 'President', 'https://picsum.photos/seed/member1/400/600', 1),
  ('Jane Smith', 'Vice President', 'https://picsum.photos/seed/member2/400/600', 2),
  ('Sam Wilson', 'Lead Developer', 'https://picsum.photos/seed/member3/400/600', 3),
  ('Emily Brown', 'Project Manager', 'https://picsum.photos/seed/member4/400/600', 4),
  ('Chris Lee', 'UI/UX Designer', 'https://picsum.photos/seed/member5/400/600', 5),
  ('Jessica Ray', 'AI Researcher', 'https://picsum.photos/seed/member6/400/600', 6),
  ('Mike Chen', 'Backend Developer', 'https://picsum.photos/seed/member7/400/600', 7),
  ('Laura Taylor', 'Data Scientist', 'https://picsum.photos/seed/member8/400/600', 8)
ON CONFLICT DO NOTHING;

-- Seed blog_posts (from NewsSection.tsx)
INSERT INTO public.blog_posts (title, source, source_url, date, snippet, image_url, category, read_time) VALUES
  ('The Future of Generative AI', 'AI Today', 'https://aitoday.com', 'Nov 5, 2025', 'Exploring the next wave of creativity and innovation powered by advanced AI models and what it means for developers and artists alike.', 'https://picsum.photos/seed/news1/400/300', 'Insights', '5 min read'),
  ('AI in Healthcare: A Revolution', 'ML Insights', 'https://mlinsights.io', 'Nov 4, 2025', 'How machine learning is transforming diagnostics, patient care, and the future of medicine.', 'https://picsum.photos/seed/news2/400/300', 'Health', '7 min read'),
  ('Ethical AI: Navigating the New Frontier', 'Ethics Weekly', 'https://ethics.org', 'Nov 2, 2025', 'A look into the frameworks ensuring fairness and accountability in artificial intelligence systems.', 'https://picsum.photos/seed/news3/400/300', 'Ethics', '6 min read'),
  ('Quantum Computing Meets AI', 'Quantum AI', 'https://quantamai.net', 'Oct 30, 2025', 'The convergence of two powerful technologies poised to solve some of the world''s most complex problems.', 'https://picsum.photos/seed/news4/400/300', 'Future Tech', '9 min read'),
  ('The Rise of AIOps', 'DevOps Journal', 'https://devopsjournal.com', 'Oct 28, 2025', 'Automating IT operations through artificial intelligence and machine learning.', 'https://picsum.photos/seed/news5/400/300', 'Automation', '8 min read')
ON CONFLICT DO NOTHING;

-- Seed events (from EventsSection.tsx)
INSERT INTO public.events (date, name, venue, details, display_order) VALUES
  ('Oct 26', 'AI Hackathon Kickoff', 'Online', 'The grand kickoff for our annual AI hackathon. Form teams and get ready to build!', 1),
  ('Nov 12', 'Workshop: Intro to PyTorch', 'Room 404, Tech Hall', 'A hands-on workshop covering the fundamentals of PyTorch for building neural networks.', 2),
  ('Nov 28', 'Guest Lecture: AI Ethics', 'Auditorium', 'A talk from a leading industry expert on the ethical implications of modern AI.', 3),
  ('Dec 15', 'Project Showcase & Mixer', 'Main Atrium', 'Members showcase their semester projects, followed by a festive mixer.', 4)
ON CONFLICT DO NOTHING;
