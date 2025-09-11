import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { RevealSection } from '@/components/ui/reveal-section';
import { ParallaxSection } from '@/components/ui/parallax-section';

interface Testimonial {
  id: string;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_image: string | null;
  content: string;
  rating: number;
  project_reference: string | null;
  is_featured: boolean;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .eq('status', 'published')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Testimonials</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const featuredTestimonials = testimonials.filter(t => t.is_featured);
  const regularTestimonials = testimonials.filter(t => !t.is_featured);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <RevealSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Feedback real de projetos desenvolvidos com excelência e dedicação
          </p>
        </RevealSection>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <div className="mb-16">
            <RevealSection className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-primary/20 bg-gradient-card hover:shadow-tech transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Destaque
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="text-foreground mb-6 italic">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage 
                          src={testimonial.client_image || ''} 
                          alt={testimonial.client_name}
                        />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {testimonial.client_name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-primary">
                          {testimonial.client_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.client_position}
                          {testimonial.client_company && 
                            ` • ${testimonial.client_company}`
                          }
                        </p>
                        {testimonial.project_reference && (
                          <p className="text-xs text-primary/70 mt-1">
                            Projeto: {testimonial.project_reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RevealSection>
          </div>
        )}

        {/* Regular Testimonials */}
        {regularTestimonials.length > 0 && (
          <RevealSection className="grid gap-6 md:grid-cols-2">
            {regularTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="border-border/50 bg-card hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-foreground mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={testimonial.client_image || ''} 
                        alt={testimonial.client_name}
                      />
                      <AvatarFallback>
                        {testimonial.client_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{testimonial.client_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.client_position}
                        {testimonial.client_company && 
                          ` • ${testimonial.client_company}`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RevealSection>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;