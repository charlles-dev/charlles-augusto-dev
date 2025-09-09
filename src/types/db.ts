export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  image: string | null;
  technologies: string[];
  github: string | null;
  demo: string | null;
  display_order: number;
}

export interface BaseItem {
  id: string;
  created_at: string;
  updated_at: string;
  display_order: number;
  title: string;
  description: string;
  image_url?: string;
}

export interface Education extends BaseItem {
  title: string;
  description: string;
  institution: string;
  degree: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  image_url?: string;
}

export interface Experience extends BaseItem {
  title: string;
  description: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  image_url?: string;
}

export type ItemType = 'projects' | 'education' | 'experiences';

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      education: {
        Row: Education;
        Insert: Omit<Education, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface SortableItem {
  id: string;
  display_order: number;
  name?: string;
  title?: string;
  institution?: string;
  company?: string;
  degree?: string;
  status?: 'draft' | 'published';
  is_featured?: boolean;
}