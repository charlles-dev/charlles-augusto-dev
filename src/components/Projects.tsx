import { ExternalLink, Github, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { RevealSection } from "@/components/ui/reveal-section";
import { ParallaxSection } from "@/components/ui/parallax-section";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  github?: string | null;
  demo?: string | null;
  image?: string | null;
  display_order: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchProjects();
  }, [handleError]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        handleError(error, { 
          fallbackMessage: 'Erro ao carregar projetos. Tente novamente mais tarde.' 
        });
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      handleError(error, { 
        fallbackMessage: 'Erro inesperado ao carregar projetos.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="group">
                <div className="h-full overflow-hidden border-border/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-lg">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <ParallaxSection speed={0.2}>
      <section id="projects" className="py-20 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meus <span className="bg-gradient-primary bg-clip-text text-transparent">Projetos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Soluções inovadoras que combinam tecnologia de ponta com segurança de classe mundial
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <RevealSection key={project.id} direction="up" delay={index * 0.1}>
                <motion.div
                  whileHover={reducedMotion ? {} : { y: -8 }}
                  className="group h-full"
                >
                  <Card className="h-full overflow-hidden border-border/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      {project.image ? (
                        <motion.img 
                          src={project.image} 
                          alt={project.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="text-center">
                            <Eye className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Imagem em breve</p>
                          </div>
                        </div>
                      )}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      <motion.div 
                        className="absolute top-4 right-4 flex gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {project.github && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="bg-background/90 backdrop-blur-sm hover:bg-background border-border/50"
                            asChild
                          >
                            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="Ver código">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.demo && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="bg-background/90 backdrop-blur-sm hover:bg-background border-border/50"
                            asChild
                          >
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="Ver demo">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    </div>
                    
                    <CardHeader className="pt-6">
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-500">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground mt-2 line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <motion.div
                            key={tech}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Badge 
                              variant="secondary" 
                              className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1 hover:bg-primary/20 transition-colors duration-300"
                            >
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </RevealSection>
            ))}
          </div>

          <RevealSection direction="up" delay={0.5}>
            <div className="text-center mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" asChild>
                  <a 
                    href="https://github.com/charlles-augusto" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Ver Mais no GitHub
                  </a>
                </Button>
              </motion.div>
            </div>
          </RevealSection>
        </div>
      </section>
    </ParallaxSection>
  );
};

export default Projects;