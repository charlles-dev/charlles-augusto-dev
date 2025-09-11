import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Mail, BookOpen, Check } from 'lucide-react';
import { RevealSection } from '@/components/ui/reveal-section';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsletterSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      // Track analytics event
      await supabase.from('analytics_events').insert({
        event_type: 'newsletter_signup',
        event_data: { source: 'website' },
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
      });

      // Insert newsletter subscription
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: data.email,
          name: data.name || null,
          source: 'website',
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Email já cadastrado',
            description: 'Este email já está na nossa lista de newsletter.',
            variant: 'destructive',
          });
          return;
        }
        throw error;
      }

      setIsSubscribed(true);
      form.reset();
      toast({
        title: 'Inscrição confirmada!',
        description: 'Obrigado por se inscrever. Você receberá nossas novidades!',
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: 'Erro ao se inscrever',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <RevealSection className="w-full">
        <Card className="border-primary/20 bg-gradient-card">
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Inscrição Confirmada!
            </h3>
            <p className="text-sm text-muted-foreground">
              Obrigado por se inscrever na nossa newsletter!
            </p>
          </CardContent>
        </Card>
      </RevealSection>
    );
  }

  return (
    <RevealSection className="w-full">
      <Card className="border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-primary text-lg">
            <BookOpen className="mr-2 h-5 w-5" />
            Newsletter
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Receba novidades sobre tecnologia, projetos e dicas de desenvolvimento
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Seu nome (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary hover:shadow-emerald transition-all duration-300"
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Inscrevendo...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Inscrever-se
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </RevealSection>
  );
};