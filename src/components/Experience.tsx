import { Calendar, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  technologies: string[];
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando experiências...</p>
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
                      
                      <motion.div 
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
                      </motion.div>
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