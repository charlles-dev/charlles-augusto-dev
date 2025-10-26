-- Create article versions table for content history
CREATE TABLE IF NOT EXISTS public.article_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  version_number INTEGER NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_summary TEXT
);

-- Enable RLS
ALTER TABLE public.article_versions ENABLE ROW LEVEL SECURITY;

-- Admin can manage versions
CREATE POLICY "Admin can manage article versions"
ON public.article_versions
FOR ALL
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_article_versions_article_id ON public.article_versions(article_id);
CREATE INDEX idx_article_versions_created_at ON public.article_versions(created_at DESC);

-- Create media library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  folder TEXT DEFAULT 'uncategorized',
  alt_text TEXT,
  caption TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Admin can manage media
CREATE POLICY "Admin can manage media library"
ON public.media_library
FOR ALL
USING (true);

-- Create index for faster searches
CREATE INDEX idx_media_library_folder ON public.media_library(folder);
CREATE INDEX idx_media_library_file_type ON public.media_library(file_type);

-- Create trigger for updated_at
CREATE TRIGGER update_media_library_updated_at
BEFORE UPDATE ON public.media_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();