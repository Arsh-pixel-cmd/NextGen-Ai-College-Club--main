-- Migration 006: Add full article content column to blog_posts
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';

-- Update existing sample posts with rich default content
UPDATE public.blog_posts
SET content = 'Artificial intelligence has shifted from analytical and predictive tasks into the domain of human creativity. Generative AI models are now capable of composing musical scores, writing software, creating cinematic videos, and designing architecture.

For developers and college students, this represents a fundamental paradigm shift. Instead of writing boilerplate code from scratch, programmers act as directors and architects—guiding neural models, establishing boundaries, and orchestrating multi-agent systems.

The NextGen AI Club is committed to hands-on experimentation with these frontier models. Join our upcoming workshops to master prompt engineering, model fine-tuning, and building autonomous systems from the ground up.'
WHERE title ILIKE '%Future of Generative AI%' AND (content IS NULL OR content = '');

UPDATE public.blog_posts
SET content = 'Machine learning and deep learning algorithms are making revolutionary strides across healthcare diagnostics, drug discovery, and personalized treatments.

From detecting early-stage oncology indicators in radiological imaging with unprecedented accuracy to modeling protein folding with AlphaFold, AI is empowering doctors to make earlier, more precise interventions.

At NextGen AI Club, our members are currently researching multimodal medical imaging models to assist rural clinics with automated screening tools. The intersection of ethics, clinical safety, and neural network architectures offers immense opportunities for future innovators.'
WHERE title ILIKE '%Healthcare%' AND (content IS NULL OR content = '');

UPDATE public.blog_posts
SET content = 'As AI systems take on consequential roles in hiring, legal sentencing, credit scoring, and healthcare, the demand for algorithmic fairness and accountability has never been more urgent.

Bias in training data can amplify societal prejudices, while "black box" neural networks make auditing decisions difficult. Emerging frameworks in explainable AI (XAI), differential privacy, and alignment research aim to address these vulnerabilities before autonomous agents are broadly deployed.

Our club actively explores model alignment and red-teaming techniques, ensuring that the developers of tomorrow are equipped to build systems that are not only powerful, but fundamentally safe and just.'
WHERE title ILIKE '%Ethical AI%' AND (content IS NULL OR content = '');
