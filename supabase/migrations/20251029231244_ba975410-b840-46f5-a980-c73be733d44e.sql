-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update RLS policies for existing tables to require admin role

-- Articles: Only admins can insert/update/delete
DROP POLICY IF EXISTS "Admin can manage articles" ON public.articles;
CREATE POLICY "Admin can manage articles"
ON public.articles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Projects: Only admins can modify
DROP POLICY IF EXISTS "Admin can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can delete projects" ON public.projects;

CREATE POLICY "Admin can manage projects"
ON public.projects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Experiences: Only admins can modify
DROP POLICY IF EXISTS "Admin can insert experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin can update experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin can delete experiences" ON public.experiences;

CREATE POLICY "Admin can manage experiences"
ON public.experiences
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Education: Only admins can modify
DROP POLICY IF EXISTS "Admin can insert education" ON public.education;
DROP POLICY IF EXISTS "Admin can update education" ON public.education;
DROP POLICY IF EXISTS "Admin can delete education" ON public.education;

CREATE POLICY "Admin can manage education"
ON public.education
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials: Only admins can manage
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
CREATE POLICY "Admin can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Contact Messages: Only admins can view/manage
DROP POLICY IF EXISTS "Admin can view all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can delete contact messages" ON public.contact_messages;

CREATE POLICY "Admin can manage contact messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter: Only admins can view subscribers
DROP POLICY IF EXISTS "Admin can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin can manage newsletter subscribers"
ON public.newsletter_subscribers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin Notifications: Only admins
DROP POLICY IF EXISTS "Admin can manage notifications" ON public.admin_notifications;
CREATE POLICY "Admin can manage notifications"
ON public.admin_notifications
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Media Library: Only admins
DROP POLICY IF EXISTS "Admin can manage media library" ON public.media_library;
CREATE POLICY "Admin can manage media library"
ON public.media_library
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Article Versions: Only admins
DROP POLICY IF EXISTS "Admin can manage article versions" ON public.article_versions;
CREATE POLICY "Admin can manage article versions"
ON public.article_versions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Search Analytics: Only admins can view
DROP POLICY IF EXISTS "Admin can view search analytics" ON public.search_analytics;
CREATE POLICY "Admin can view search analytics"
ON public.search_analytics
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Analytics Events: Only admins can view
DROP POLICY IF EXISTS "Admin can view analytics" ON public.analytics_events;
CREATE POLICY "Admin can view analytics"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Article Comments: Only admins can approve/manage (keep existing select and insert for public)
DROP POLICY IF EXISTS "Admin can manage comments" ON public.article_comments;
CREATE POLICY "Admin can manage comments"
ON public.article_comments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));