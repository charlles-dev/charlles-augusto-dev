import { Calendar, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Experience = () => {
  const experiences = [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "Proxxima Telecom",
      location: "São Paulo, SP",
      period: "2022 - Presente",
      description: "Desenvolvimento de soluções escaláveis para telecomunicações com foco em segurança e performance. Liderança técnica em projetos de migração para cloud e implementação de práticas DevSecOps.",
      technologies: ["Python", "React", "Kubernetes", "AWS", "PostgreSQL"],
      type: "work"
    },
    {
      id: 2,
      title: "Cybersecurity Specialist",
      company: "Projeto Bolsa Futuro Digital",
      location: "Remote",
      period: "2021 - 2022",
      description: "Desenvolvimento de ferramentas de análise de vulnerabilidades e implementação de protocolos de segurança. Criação de dashboards para monitoramento de ameaças em tempo real.",
      technologies: ["Python", "Django", "Docker", "Redis", "Machine Learning"],
      type: "project"
    },
    {
      id: 3,
      title: "Full-Stack Developer",
      company: "Tech Solutions Ltd",
      location: "Rio de Janeiro, RJ",
      period: "2020 - 2021",
      description: "Desenvolvimento de aplicações web robustas e APIs RESTful. Colaboração em equipes ágeis para entrega de produtos de alta qualidade.",
      technologies: ["Java", "Spring Boot", "React", "MySQL", "Docker"],
      type: "work"
    },
    {
      id: 4,
      title: "Bacharelado em Ciência da Computação",
      company: "Universidade Federal do Rio de Janeiro",
      location: "Rio de Janeiro, RJ",
      period: "2017 - 2020",
      description: "Formação sólida em fundamentos da computação com foco em segurança da informação e desenvolvimento de software.",
      technologies: ["Algoritmos", "Estrutura de Dados", "Redes", "Segurança"],
      type: "education"
    }
  ];

  const getIconByType = (type: string) => {
    switch (type) {
      case "work":
        return <Building className="w-5 h-5 text-primary" />;
      case "project":
        return <Building className="w-5 h-5 text-secondary" />;
      case "education":
        return <Building className="w-5 h-5 text-accent" />;
      default:
        return <Building className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "work":
        return "border-l-primary";
      case "project":
        return "border-l-secondary";
      case "education":
        return "border-l-accent";
      default:
        return "border-l-muted";
    }
  };

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Minha <span className="bg-gradient-secondary bg-clip-text text-transparent">Experiência</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trajetória profissional construída com dedicação e paixão pela tecnologia
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id}
                className={`relative flex items-start animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 ${getBorderColor(exp.type)} bg-background flex items-center justify-center z-10`}>
                  {getIconByType(exp.type)}
                </div>

                {/* Content */}
                <Card className={`ml-8 flex-1 hover:shadow-tech transition-all duration-300 bg-gradient-card border-l-4 ${getBorderColor(exp.type)}`}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <CardTitle className="text-xl text-foreground">{exp.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.period}
                      </div>
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                      <Building className="w-4 h-4 mr-2" />
                      {exp.company}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed mb-4">
                      {exp.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-muted text-muted-foreground">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;