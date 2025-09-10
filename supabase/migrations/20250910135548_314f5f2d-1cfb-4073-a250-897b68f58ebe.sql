-- Adicionar apenas os índices para melhor performance (triggers já existem)
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects (is_featured);

CREATE INDEX IF NOT EXISTS idx_education_status ON public.education (status);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON public.education (display_order);
CREATE INDEX IF NOT EXISTS idx_education_is_featured ON public.education (is_featured);

CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences (status);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON public.experiences (display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_is_featured ON public.experiences (is_featured);