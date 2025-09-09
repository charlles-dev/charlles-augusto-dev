import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  period: string;
  description?: string | null;
  location?: string | null;
  gpa?: string | null;
  display_order: number;
}

const Education = () => {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchEducations();
  }, [handleError]);

  const fetchEducations = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        handleError(error, { 
          fallbackMessage: 'Erro ao carregar formação acadêmica. Tente novamente mais tarde.' 
        });
      } else {
        setEducations(data || []);
      }
    } catch (error) {
      handleError(error, { 
        fallbackMessage: 'Erro inesperado ao carregar formação acadêmica.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando formação acadêmica...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="group">
                <Card className="h-full overflow-hidden border-border/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
                  <CardHeader className="pt-6">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2 animate-pulse"></div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="education">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Formação Acadêmica
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minha jornada educacional e certificações
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educations.map((education, index) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: reducedMotion ? 0 : index * 0.1 }}
              whileHover={reducedMotion ? {} : { y: -8 }}
              className="group"
            >
              <Card className="h-full overflow-hidden border-border/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <GraduationCap className="w-16 h-16 text-primary/70 mx-auto mb-2" />
                      <p className="text-sm font-medium text-primary/80">Formação</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      {education.period}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pt-6">
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-500">
                    {education.degree}
                  </CardTitle>
                  <p className="text-base font-semibold text-primary mt-1">
                    {education.field_of_study}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-2">
                    {education.institution}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    {education.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{education.location}</span>
                      </div>
                    )}
                    {education.gpa && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        GPA: {education.gpa}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                {education.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {education.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;