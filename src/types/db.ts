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
  is_featured: boolean;
  status: 'draft' | 'published';
}

export interface Experience {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  company: string;
  description: string;
  period: string;
  location: string | null;
  technologies: string[] | null;
  display_order: number;
  is_featured: boolean;
  status: 'draft' | 'published';
}

export interface Education {
  id: string;
  created_at: string;
  updated_at: string;
  institution: string;
  degree: string;
  field_of_study: string;
  period: string;
  description: string | null;
  location: string | null;
  gpa: string | null;
  display_order: number;
  is_featured: boolean;
  status: 'draft' | 'published';
}


export type Item = Project | Experience | Education;
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