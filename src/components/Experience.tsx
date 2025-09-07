import { Calendar, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("created_at", { ascending: false });

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
                <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-primary bg-background flex items-center justify-center z-10`}>
                  <Building className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <Card className={`ml-8 flex-1 hover:shadow-tech transition-all duration-300 bg-gradient-card border-l-4 border-l-primary`}>
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
                    {exp.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {exp.location}
                      </div>
                    )}
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