import { Shield, Code2, Brain, Server, Database, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const technologies = [
    { name: "Python", icon: <Code2 className="w-8 h-8" />, color: "text-yellow-500" },
    { name: "React", icon: <Globe className="w-8 h-8" />, color: "text-blue-400" },
    { name: "Java", icon: <Code2 className="w-8 h-8" />, color: "text-orange-500" },
    { name: "Golang", icon: <Server className="w-8 h-8" />, color: "text-cyan-400" },
    { name: "AI/ML", icon: <Brain className="w-8 h-8" />, color: "text-purple-500" },
    { name: "Docker", icon: <Database className="w-8 h-8" />, color: "text-blue-600" },
    { name: "Linux", icon: <Server className="w-8 h-8" />, color: "text-green-500" },
    { name: "Cybersecurity", icon: <Shield className="w-8 h-8" />, color: "text-red-500" },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre <span className="bg-gradient-primary bg-clip-text text-transparent">Mim</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desenvolvedor com paixão por criar soluções seguras e inovadoras
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Minha Jornada</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Sou um desenvolvedor full-stack com forte foco em segurança cibernética. 
                Minha trajetória é marcada pela curiosidade constante e pela busca por 
                excelência técnica em cada projeto.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Combino conhecimentos sólidos em desenvolvimento de software com 
                expertise em segurança, criando aplicações robustas e confiáveis. 
                Sempre em busca de novas tecnologias e desafios que me permitam crescer profissionalmente.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Full-Stack Development
              </span>
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                Cybersecurity
              </span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Machine Learning
              </span>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <h3 className="text-2xl font-bold mb-8 text-center">Tecnologias</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <Card 
                  key={tech.name} 
                  className="group hover:shadow-tech transition-all duration-300 cursor-pointer bg-gradient-card border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${tech.color} mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {tech.icon}
                    </div>
                    <p className="font-semibold text-sm">{tech.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;