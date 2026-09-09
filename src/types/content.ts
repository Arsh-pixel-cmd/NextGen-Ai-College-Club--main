export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  source: string;
  source_url: string;
  date: string;
  snippet: string;
  image_url: string;
  category: string;
  read_time: string;
  created_at: string;
}

export interface Event {
  id: string;
  date: string;
  name: string;
  venue: string;
  details: string;
  display_order: number;
  created_at: string;
}

export interface ContentBlock {
  type: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
}

export interface DynamicSection {
  id: string;
  title: string;
  subtitle: string;
  content_blocks: ContentBlock[];
  display_order: number;
  is_visible: boolean;
  section_type: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  created_at: string;
}
