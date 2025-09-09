import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  period: string;
  description?: string;
  location?: string;
  gpa?: string;
  display_order: number;
}

const Education = () => {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando formação acadêmica...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="education">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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

        <div className="grid gap-6 md:gap-8">
          {educations.map((education, index) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {education.degree} em {education.field_of_study}
                      </CardTitle>
                      <p className="text-lg font-semibold text-primary mt-1">
                        {education.institution}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 md:text-right">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{education.period}</span>
                      </div>
                      {education.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{education.location}</span>
                        </div>
                      )}
                      {education.gpa && (
                        <Badge variant="secondary" className="w-fit md:ml-auto">
                          GPA: {education.gpa}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {education.description && (
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
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