import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from '@/components/advanced/ContactForm';
import { NewsletterSignup } from '@/components/advanced/NewsletterSignup';
import { RevealSection } from '@/components/ui/reveal-section';

const Contact = () => {
  return (
    <section 
      id="contato" 
      className="py-20 bg-gradient-to-br from-muted/50 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Entre em Contato</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vamos conversar sobre seu próximo projeto e como posso ajudar a transformar suas ideias em realidade
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <RevealSection className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-primary">Informações de Contato</h3>
                
                <div className="space-y-6">
                  <Card className="border-primary/20 bg-gradient-card hover:shadow-tech transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">Email</h4>
                          <a 
                            href="mailto:charlles.floriano@aluno.senai.br"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            charlles.floriano@aluno.senai.br
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 bg-gradient-card hover:shadow-tech transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">Telefone</h4>
                          <a 
                            href="tel:+5511999999999"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            +55 (11) 99999-9999
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 bg-gradient-card hover:shadow-tech transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">Localização</h4>
                          <p className="text-muted-foreground">São Paulo, Brasil</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Newsletter Signup */}
              <NewsletterSignup />
            </RevealSection>

            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;