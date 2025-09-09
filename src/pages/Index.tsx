import React, { lazy, Suspense } from 'react';
import Navigation from "@/components/Navigation";
import { SkipLink } from '@/components/accessibility/FocusManager';
import Hero from "@/components/Hero";
import { SectionSkeleton } from "@/components/loading/SectionSkeleton";

// Lazy loading dos componentes por seção
const About = lazy(() => import("@/components/About"));
const Projects = lazy(() => import("@/components/Projects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
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
  );
};

export default Index;
