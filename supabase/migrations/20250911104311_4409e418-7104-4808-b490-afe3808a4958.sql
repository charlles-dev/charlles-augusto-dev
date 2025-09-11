-- Fase 2: Sistema completo de contato, blog, testimonials e analytics

-- Tabela para mensagens de contato
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  is_spam BOOLEAN NOT NULL DEFAULT false,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para testimonials/reviews
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_position TEXT,
  client_company TEXT,
  client_image TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  project_reference TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para artigos/blog
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website'
);

-- Tabela para analytics/metrics
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  page_path TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact_messages (admin only access)
CREATE POLICY "Admin can view all contact messages" 
ON public.contact_messages 
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update contact messages" 
ON public.contact_messages 
FOR UPDATE USING (true);

CREATE POLICY "Admin can delete contact messages" 
ON public.contact_messages 
FOR DELETE USING (true);

-- RLS policies for testimonials (public read for approved, admin full access)
CREATE POLICY "Anyone can view approved testimonials" 
ON public.testimonials 
FOR SELECT USING (is_approved = true AND status = 'published');

CREATE POLICY "Anyone can submit testimonials" 
ON public.testimonials 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage testimonials" 
ON public.testimonials 
FOR ALL USING (true);

-- RLS policies for articles (public read for published, admin full access)
CREATE POLICY "Anyone can view published articles" 
ON public.articles 
FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage articles" 
ON public.articles 
FOR ALL USING (true);

-- RLS policies for newsletter (public subscribe, admin manage)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL USING (true);

-- RLS policies for analytics (public insert, admin view)
CREATE POLICY "Anyone can track analytics events" 
ON public.analytics_events 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view analytics" 
ON public.analytics_events 
FOR SELECT USING (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX idx_testimonials_approved_featured ON public.testimonials(is_approved, is_featured);
CREATE INDEX idx_testimonials_display_order ON public.testimonials(display_order);
CREATE INDEX idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_newsletter_active ON public.newsletter_subscribers(is_active);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- Insert some sample testimonials
INSERT INTO public.testimonials (client_name, client_position, client_company, content, rating, is_approved, is_featured, status, display_order) VALUES 
('Ana Silva', 'CEO', 'TechStart Ltda', 'Charlles desenvolveu nossa plataforma com excelência técnica e atenção aos detalhes. Superou nossas expectativas!', 5, true, true, 'published', 1),
('João Santos', 'CTO', 'Innovation Hub', 'Profissional excepcional, entrega rápida e código de alta qualidade. Recomendo fortemente!', 5, true, true, 'published', 2),
('Maria Costa', 'Product Manager', 'StartupXYZ', 'Trabalho impecável! Charlles transformou nossa ideia em uma aplicação robusta e escalável.', 5, true, false, 'published', 3);