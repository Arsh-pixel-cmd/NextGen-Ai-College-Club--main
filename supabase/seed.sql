-- Seed script: Populate tables with current hardcoded data
-- Task 1.5: Extract data from MembersSection.tsx, NewsSection.tsx, EventsSection.tsx

-- ============================================================
-- Blog Posts (from NewsSection.tsx hardcoded newsItems)
-- ============================================================
INSERT INTO blog_posts (title, source, source_url, date, snippet, image_url, category, read_time) VALUES
  ('The Future of Generative AI',
   'AI Today', 'aitoday.com', 'Nov 5, 2025',
   'Exploring the next wave of creativity and innovation powered by advanced AI models and what it means for developers and artists alike.',
   'https://picsum.photos/seed/news1/400/300', 'Insights', '5 min read'),

  ('AI in Healthcare: A Revolution',
   'ML Insights', 'mlinsights.io', 'Nov 4, 2025',
   'How machine learning is transforming diagnostics, patient care, and the future of medicine.',
   'https://picsum.photos/seed/news2/400/300', 'Health', '7 min read'),

  ('Ethical AI: Navigating the New Frontier',
   'Ethics Weekly', 'ethics.org', 'Nov 2, 2025',
   'A look into the frameworks ensuring fairness and accountability in artificial intelligence systems.',
   'https://picsum.photos/seed/news3/400/300', 'Ethics', '6 min read'),

  ('Quantum Computing Meets AI',
   'Quantum AI', 'quantamai.net', 'Oct 30, 2025',
   'The convergence of two powerful technologies poised to solve some of the world''s most complex problems.',
   'https://picsum.photos/seed/news4/400/300', 'Future Tech', '9 min read'),

  ('The Rise of AIOps',
   'DevOps Journal', 'devopsjournal.com', 'Oct 28, 2025',
   'Automating IT operations through artificial intelligence and machine learning.',
   'https://picsum.photos/seed/news5/400/300', 'Automation', '8 min read');

-- ============================================================
-- Events (from EventsSection.tsx hardcoded events)
-- ============================================================
INSERT INTO events (date, name, venue, details, display_order) VALUES
  ('Oct 26', 'AI Hackathon Kickoff', 'Online',
   'The grand kickoff for our annual AI hackathon. Form teams and get ready to build!', 1),

  ('Nov 12', 'Workshop: Intro to PyTorch', 'Room 404, Tech Hall',
   'A hands-on workshop covering the fundamentals of PyTorch for building neural networks.', 2),

  ('Nov 28', 'Guest Lecture: AI Ethics', 'Auditorium',
   'A talk from a leading industry expert on the ethical implications of modern AI.', 3),

  ('Dec 15', 'Project Showcase & Mixer', 'Main Atrium',
   'Members showcase their semester projects, followed by a festive mixer.', 4);

-- ============================================================
-- Team Members
-- (MembersSection.tsx only has the gallery, data was already in DB
--  or add placeholder rows if needed)
-- ============================================================
-- Add team members if the table is empty (no hardcoded data found in
-- the component — it already fetches from Supabase via useTeamMembers)
