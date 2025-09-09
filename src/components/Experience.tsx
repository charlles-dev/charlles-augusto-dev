import { Calendar, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location?: string | null;
  description: string;
  technologies: string[] | null;
  display_order: number;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchExperiences();
  }, [handleError]);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        handleError(error, { 
          fallbackMessage: 'Erro ao carregar experiências. Tente novamente mais tarde.' 
        });
      } else {
        setExperiences(data || []);
      }
    } catch (error) {
      handleError(error, { 
        fallbackMessage: 'Erro inesperado ao carregar experiências.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando experiências...</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent h-full"></div>
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="ml-8 flex-1">
                    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/20">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Minha <span className="bg-gradient-secondary bg-clip-text text-transparent">Experiência</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trajetória profissional construída com dedicação e paixão pela tecnologia
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced Timeline line */}
          <motion.div 
            className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                className="relative flex items-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Enhanced Timeline dot */}
                <motion.div
                      className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-primary bg-background flex items-center justify-center z-10 relative overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      animate={activeIndex === index ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0"
                        animate={activeIndex === index ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <Building className="w-5 h-5 text-primary relative z-10" />
                    </motion.div>

                {/* Enhanced Content */}
                <motion.div
                  className="ml-8 flex-1"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="hover:shadow-tech transition-all duration-300 bg-gradient-card border-l-4 border-l-primary relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    <CardHeader className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CardTitle className="text-xl text-foreground">{exp.title}</CardTitle>
                        </motion.div>
                        <motion.div 
                          className="flex items-center text-sm text-muted-foreground"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          {exp.period}
                        </motion.div>
                      </div>
                      <motion.div 
                        className="flex items-center text-primary font-semibold"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Building className="w-4 h-4 mr-2" />
                        {exp.company}
                      </motion.div>
                      {exp.location && (
                        <motion.div 
                          className="flex items-center text-sm text-muted-foreground"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {exp.location}
                        </motion.div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <CardDescription className="text-base leading-relaxed mb-4">
                        {exp.description}
                      </CardDescription>
                      
                      {exp.technologies && <motion.div 
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        {exp.technologies.map((tech, techIndex) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: 0.4 + techIndex * 0.1 
                            }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <Badge variant="outline" className="border-muted text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;