-- Adicionar triggers para updated_at em todas as tabelas
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects (is_featured);

CREATE INDEX IF NOT EXISTS idx_education_status ON public.education (status);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON public.education (display_order);
CREATE INDEX IF NOT EXISTS idx_education_is_featured ON public.education (is_featured);

CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences (status);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON public.experiences (display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_is_featured ON public.experiences (is_featured);