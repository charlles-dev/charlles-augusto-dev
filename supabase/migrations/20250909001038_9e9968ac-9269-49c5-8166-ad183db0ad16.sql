-- Create education/academic formation table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  location TEXT,
  gpa TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view education" 
ON public.education 
FOR SELECT 
USING (true);

-- Create policy for authenticated admin access
CREATE POLICY "Authenticated users can manage education" 
ON public.education 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add display_order column to existing tables for ordering
ALTER TABLE public.projects ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.experiences ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;

-- Insert sample education data
INSERT INTO public.education (institution, degree, field_of_study, period, description, location, display_order) VALUES
('Universidade Federal do Rio de Janeiro', 'Bacharelado', 'Ciência da Computação', '2018 - 2022', 'Formação em desenvolvimento de software, algoritmos e estruturas de dados.', 'Rio de Janeiro, RJ', 1),
('Rocketseat', 'Certificação', 'Desenvolvimento Full Stack', '2022', 'Especialização em React, Node.js e tecnologias modernas de desenvolvimento web.', 'Online', 2);