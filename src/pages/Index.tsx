import React, { lazy, Suspense } from 'react';
import Navigation from "@/components/Navigation";
import { SkipLink } from '@/components/accessibility/FocusManager';
import Hero from "@/components/Hero";
import { SectionSkeleton } from "@/components/loading/SectionSkeleton";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingElement } from "@/components/ui/floating-elements";
import { SEO } from "@/components/SEO";
import { usePageSEO } from "@/hooks/usePageSEO";

// Lazy loading dos componentes por seção
const About = lazy(() => import("@/components/About"));
const Projects = lazy(() => import("@/components/Projects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

// Lazy loading dos componentes avançados
const TestimonialsSection = lazy(() => import("@/components/advanced/TestimonialsSection"));

const Index = () => {
  usePageSEO({
    title: 'Charlles Augusto - Desenvolvedor Full-Stack',
    description: 'Desenvolvedor Full-Stack especializado em Cybersecurity com experiência em Python, React, Java, Golang e IA. Transformando ideias em soluções digitais seguras e escaláveis.',
    keywords: ['desenvolvedor full stack', 'cybersecurity', 'python', 'react', 'java', 'golang', 'inteligência artificial', 'desenvolvimento web', 'segurança digital'],
    type: 'profile'
  });

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-bg relative">
        <ScrollProgress progress={0} />
        <FloatingElement>
          <div className="w-2 h-2 bg-primary/20 rounded-full" />
        </FloatingElement>
        <SkipLink />
        <Navigation />
        <Hero />
        
        <main id="main-content" className="outline-none">
          <Suspense fallback={<SectionSkeleton type="hero" />}>
            <About />
          </Suspense>
        
          <Suspense fallback={<SectionSkeleton type="projects" />}>
            <Projects />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton type="hero" />}>
            <TestimonialsSection />
          </Suspense>
        
          <Suspense fallback={<SectionSkeleton type="experience" />}>
            <Experience />
          </Suspense>
        
          <Suspense fallback={<SectionSkeleton type="education" />}>
            <Education />
          </Suspense>
        
          <Suspense fallback={<SectionSkeleton type="hero" />}>
            <Contact />
          </Suspense>
        
          <Suspense fallback={<SectionSkeleton type="hero" />}>
            <Footer />
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default Index;
