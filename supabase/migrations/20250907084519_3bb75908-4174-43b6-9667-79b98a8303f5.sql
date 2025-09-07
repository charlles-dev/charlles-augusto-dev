-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github TEXT,
  demo TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT,
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (portfolio is public)
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view experiences" 
ON public.experiences 
FOR SELECT 
USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can manage projects" 
ON public.projects 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage experiences" 
ON public.experiences 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.projects (name, description, technologies, github, demo) VALUES
('Streamly', 'Plataforma de streaming moderna com interface intuitiva e recursos avançados de gerenciamento de conteúdo.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker'], 'https://github.com/charlles-augusto/streamly', 'https://streamly-demo.com'),
('BFD Labs', 'Laboratório de desenvolvimento de soluções inovadoras focadas em segurança e automação de processos.', ARRAY['Python', 'FastAPI', 'React', 'AI/ML'], 'https://github.com/charlles-augusto/bfd-labs', 'https://bfd-labs.com'),
('SecureAuth API', 'Sistema de autenticação robusto com múltiplos fatores e análise de comportamento para detecção de anomalias.', ARRAY['Golang', 'JWT', 'Redis', 'PostgreSQL'], 'https://github.com/charlles-augusto/secure-auth', null),
('CyberMonitor', 'Dashboard de monitoramento de segurança em tempo real com alertas inteligentes e análise preditiva.', ARRAY['Python', 'Django', 'React', 'WebSocket'], 'https://github.com/charlles-augusto/cyber-monitor', 'https://cyber-monitor-demo.com');

INSERT INTO public.experiences (title, company, description, period, location, technologies) VALUES
('Desenvolvedor Full-Stack', 'Proxxima Telecom', 'Desenvolvimento de soluções completas para telecomunicações, incluindo sistemas de monitoramento de rede, APIs RESTful e interfaces web responsivas. Implementação de arquiteturas escaláveis com foco em performance e segurança.', '2022 - Presente', 'São Paulo, SP', ARRAY['Python', 'React', 'PostgreSQL', 'Linux']),
('Bolsista de Pesquisa', 'Projeto Bolsa Futuro Digital', 'Pesquisa e desenvolvimento em cibersegurança e inteligência artificial. Desenvolvimento de ferramentas de análise de vulnerabilidades e sistemas de detecção de ameaças usando machine learning.', '2021 - 2022', 'São Paulo, SP', ARRAY['Python', 'AI/ML', 'Cybersecurity', 'Data Analysis']);