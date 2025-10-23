-- Create article_reactions table for likes/reactions system
CREATE TABLE IF NOT EXISTS public.article_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,
  user_ip TEXT NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_article_reaction UNIQUE (article_id, user_ip)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_reactions_article_id ON public.article_reactions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_reactions_created_at ON public.article_reactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_reactions
CREATE POLICY "Anyone can view reactions" ON public.article_reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add reactions" ON public.article_reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own reactions" ON public.article_reactions
  FOR DELETE USING (true);

-- Add likes_count column to articles table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'articles' 
                 AND column_name = 'likes_count') THEN
    ALTER TABLE public.articles ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Function to update article likes count
CREATE OR REPLACE FUNCTION public.update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.article_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically update likes count
DROP TRIGGER IF EXISTS trigger_update_article_likes_count ON public.article_reactions;
CREATE TRIGGER trigger_update_article_likes_count
  AFTER INSERT OR DELETE ON public.article_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_article_likes_count();