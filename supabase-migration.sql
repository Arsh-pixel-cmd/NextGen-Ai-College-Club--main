-- ============================================================
-- Admin Panel: Supabase Database Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. TEAM MEMBERS TABLE
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

CREATE POLICY "Public read access for team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert for team_members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update for team_members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete for team_members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (true);


-- 2. BLOG POSTS TABLE
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

CREATE POLICY "Public read access for blog_posts"
  ON public.blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert for blog_posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update for blog_posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete for blog_posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (true);


-- 3. EVENTS TABLE
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

CREATE POLICY "Public read access for events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert for events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update for events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete for events"
  ON public.events FOR DELETE
  TO authenticated
  USING (true);


-- 4. DYNAMIC SECTIONS TABLE
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

CREATE POLICY "Public read access for dynamic_sections"
  ON public.dynamic_sections FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert for dynamic_sections"
  ON public.dynamic_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update for dynamic_sections"
  ON public.dynamic_sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete for dynamic_sections"
  ON public.dynamic_sections FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- SEED DATA (from current hardcoded components)
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
  ('Laura Taylor', 'Data Scientist', 'https://picsum.photos/seed/member8/400/600', 8);

-- Seed blog_posts (from NewsSection.tsx)
INSERT INTO public.blog_posts (title, source, source_url, date, snippet, image_url, category, read_time) VALUES
  ('The Future of Generative AI', 'AI Today', 'aitoday.com', 'Nov 5, 2025', 'Exploring the next wave of creativity and innovation powered by advanced AI models and what it means for developers and artists alike.', 'https://picsum.photos/seed/news1/400/300', 'Insights', '5 min read'),
  ('AI in Healthcare: A Revolution', 'ML Insights', 'mlinsights.io', 'Nov 4, 2025', 'How machine learning is transforming diagnostics, patient care, and the future of medicine.', 'https://picsum.photos/seed/news2/400/300', 'Health', '7 min read'),
  ('Ethical AI: Navigating the New Frontier', 'Ethics Weekly', 'ethics.org', 'Nov 2, 2025', 'A look into the frameworks ensuring fairness and accountability in artificial intelligence systems.', 'https://picsum.photos/seed/news3/400/300', 'Ethics', '6 min read'),
  ('Quantum Computing Meets AI', 'Quantum AI', 'quantamai.net', 'Oct 30, 2025', 'The convergence of two powerful technologies poised to solve some of the world''s most complex problems.', 'https://picsum.photos/seed/news4/400/300', 'Future Tech', '9 min read'),
  ('The Rise of AIOps', 'DevOps Journal', 'devopsjournal.com', 'Oct 28, 2025', 'Automating IT operations through artificial intelligence and machine learning.', 'https://picsum.photos/seed/news5/400/300', 'Automation', '8 min read');

-- Seed events (from EventsSection.tsx)
INSERT INTO public.events (date, name, venue, details, display_order) VALUES
  ('Oct 26', 'AI Hackathon Kickoff', 'Online', 'The grand kickoff for our annual AI hackathon. Form teams and get ready to build!', 1),
  ('Nov 12', 'Workshop: Intro to PyTorch', 'Room 404, Tech Hall', 'A hands-on workshop covering the fundamentals of PyTorch for building neural networks.', 2),
  ('Nov 28', 'Guest Lecture: AI Ethics', 'Auditorium', 'A talk from a leading industry expert on the ethical implications of modern AI.', 3),
  ('Dec 15', 'Project Showcase & Mixer', 'Main Atrium', 'Members showcase their semester projects, followed by a festive mixer.', 4);
