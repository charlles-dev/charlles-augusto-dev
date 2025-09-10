import { Shield, Code2, Brain, Server, Database, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { RevealSection } from "@/components/ui/reveal-section";
import { ParallaxSection } from "@/components/ui/parallax-section";

const About = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  
  const technologies = [
    { name: "Python", icon: <Code2 className="w-8 h-8" />, color: "text-yellow-500", description: "Automação e IA" },
    { name: "React", icon: <Globe className="w-8 h-8" />, color: "text-blue-400", description: "Frontend moderno" },
    { name: "Java", icon: <Code2 className="w-8 h-8" />, color: "text-orange-500", description: "Backend robusto" },
    { name: "Golang", icon: <Server className="w-8 h-8" />, color: "text-cyan-400", description: "Performance alta" },
    { name: "AI/ML", icon: <Brain className="w-8 h-8" />, color: "text-purple-500", description: "Inteligência artificial" },
    { name: "Docker", icon: <Database className="w-8 h-8" />, color: "text-blue-600", description: "Containerização" },
    { name: "Linux", icon: <Server className="w-8 h-8" />, color: "text-green-500", description: "Sistemas Unix" },
    { name: "Cybersecurity", icon: <Shield className="w-8 h-8" />, color: "text-red-500", description: "Segurança digital" },
  ];

  return (
    <ParallaxSection speed={0.3}>
      <section id="about" className="py-20 bg-background relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre <span className="bg-gradient-primary bg-clip-text text-transparent">Mim</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Desenvolvedor com paixão por criar soluções seguras e inovadoras
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <RevealSection direction="left" delay={0.2}>
              <div className="space-y-6">
                <div>
                  <motion.h3 
                    className="text-2xl font-bold mb-4 text-foreground"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Minha Jornada
                  </motion.h3>
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
                  {["Full-Stack Development", "Cybersecurity", "Machine Learning"].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        index === 0 ? "bg-primary/10 text-primary" :
                        index === 1 ? "bg-secondary/10 text-secondary" :
                        "bg-accent/10 text-accent"
                      }`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection direction="right" delay={0.4}>
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">
                  Tecnologias
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      viewport={{ once: true }}
                    >
                      <Card 
                        className="group hover:shadow-tech transition-all duration-300 cursor-pointer bg-gradient-card border-border/50 relative overflow-hidden"
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                        />
                        <CardContent className="p-6 text-center relative z-10">
                          <motion.div 
                            className={`${tech.color} mb-3 flex justify-center`}
                            whileHover={{ 
                              scale: 1.2, 
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.3 }
                            }}
                            animate={hoveredTech === tech.name ? { y: -5 } : { y: 0 }}
                          >
                            {tech.icon}
                          </motion.div>
                          <motion.p 
                            className="font-semibold text-sm mb-1"
                            animate={hoveredTech === tech.name ? { scale: 1.1 } : { scale: 1 }}
                          >
                            {tech.name}
                          </motion.p>
                          <motion.p 
                            className="text-xs text-muted-foreground"
                            initial={{ opacity: 0, height: 0 }}
                            animate={hoveredTech === tech.name ? 
                              { opacity: 1, height: "auto" } : 
                              { opacity: 0, height: 0 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            {tech.description}
                          </motion.p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </ParallaxSection>
  );
};

export default About;