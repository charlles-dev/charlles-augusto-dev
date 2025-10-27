-- Add scheduled_at field to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone;

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  related_entity_type text,
  related_entity_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admin can manage all notifications
CREATE POLICY "Admin can manage notifications"
ON public.admin_notifications
FOR ALL
USING (true);

-- Create search_analytics table
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term text NOT NULL,
  results_count integer NOT NULL DEFAULT 0,
  clicked_result_id uuid,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can track searches
CREATE POLICY "Anyone can track searches"
ON public.search_analytics
FOR INSERT
WITH CHECK (true);

-- Admin can view search analytics
CREATE POLICY "Admin can view search analytics"
ON public.search_analytics
FOR SELECT
USING (true);

-- Create index for search analytics
CREATE INDEX IF NOT EXISTS idx_search_analytics_term ON public.search_analytics(search_term);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON public.search_analytics(created_at DESC);

-- Create trigger function for new comment notifications
CREATE OR REPLACE FUNCTION public.notify_new_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, related_entity_type, related_entity_id)
  VALUES (
    'new_comment',
    'Novo comentário recebido',
    'Novo comentário de ' || NEW.author_name || ' aguardando aprovação',
    'article_comment',
    NEW.id
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new comments
DROP TRIGGER IF EXISTS on_new_comment ON public.article_comments;
CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.article_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_comment();

-- Create trigger function for new contact message notifications
CREATE OR REPLACE FUNCTION public.notify_new_contact_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, related_entity_type, related_entity_id)
  VALUES (
    'new_contact',
    'Nova mensagem de contato',
    'Nova mensagem de ' || NEW.name || ' (' || NEW.email || ')',
    'contact_message',
    NEW.id
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new contact messages
DROP TRIGGER IF EXISTS on_new_contact_message ON public.contact_messages;
CREATE TRIGGER on_new_contact_message
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_contact_message();