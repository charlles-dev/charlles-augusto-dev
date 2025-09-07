import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Streamly",
      description: "Plataforma de streaming moderna com interface intuitiva e recursos avançados de gerenciamento de conteúdo.",
      technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
      github: "https://github.com/charlles-augusto/streamly",
      demo: "https://streamly-demo.com",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "BFD Labs",
      description: "Laboratório de desenvolvimento de soluções inovadoras focadas em segurança e automação de processos.",
      technologies: ["Python", "FastAPI", "React", "AI/ML"],
      github: "https://github.com/charlles-augusto/bfd-labs",
      demo: "https://bfd-labs.com",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "SecureAuth API",
      description: "Sistema de autenticação robusto com múltiplos fatores e análise de comportamento para detecção de anomalias.",
      technologies: ["Golang", "JWT", "Redis", "PostgreSQL"],
      github: "https://github.com/charlles-augusto/secure-auth",
      demo: null,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "CyberMonitor",
      description: "Dashboard de monitoramento de segurança em tempo real com alertas inteligentes e análise preditiva.",
      technologies: ["Python", "Django", "React", "WebSocket"],
      github: "https://github.com/charlles-augusto/cyber-monitor",
      demo: "https://cyber-monitor-demo.com",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meus <span className="bg-gradient-primary bg-clip-text text-transparent">Projetos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluções inovadoras que combinam tecnologia de ponta com segurança de classe mundial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-tech transition-all duration-500 bg-gradient-card border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    {project.github && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {tech}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
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
        </div>
      </div>
    </section>
  );
};

export default Projects;