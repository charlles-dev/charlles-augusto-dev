import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { FloatingElement, PulsingDot } from "@/components/ui/floating-elements";
import { RevealSection } from "@/components/ui/reveal-section";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-bg relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundBeams className="opacity-60" />
        <Spotlight className="top-10 left-10 md:left-60 md:top-20" fill="hsl(158 64% 52%)" />
        <Spotlight className="top-28 left-80 hidden md:block" fill="hsl(214 100% 59%)" />
        
        {/* Floating Elements */}
        <FloatingElement delay={0} duration={8} className="absolute top-20 left-10">
          <PulsingDot color="bg-primary/40" size="w-4 h-4" />
        </FloatingElement>
        <FloatingElement delay={2} duration={10} className="absolute top-32 right-20">
          <PulsingDot color="bg-secondary/40" size="w-3 h-3" />
        </FloatingElement>
        <FloatingElement delay={4} duration={12} className="absolute bottom-40 left-16">
          <PulsingDot color="bg-accent/40" size="w-5 h-5" />
        </FloatingElement>
        <FloatingElement delay={6} duration={14} className="absolute bottom-60 right-32">
          <PulsingDot color="bg-primary/30" size="w-2 h-2" />
        </FloatingElement>
        
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <RevealSection direction="up" delay={0.1}>
          <motion.h1 
            className="text-5xl md:text-7xl font-heading font-bold mb-6"
            animate={{ 
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Charlles Augusto
            </span>
          </motion.h1>
        </RevealSection>
        
        <RevealSection direction="up" delay={0.3}>
          <motion.h2 
            className="text-2xl md:text-3xl text-muted-foreground mb-8 font-mono"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Cybersecurity &amp; Full-Stack Developer
          </motion.h2>
        </RevealSection>
        
        <RevealSection direction="up" delay={0.5}>
          <TextGenerateEffect
            words="Desenvolvedor apaixonado por segurança cibernética e tecnologias modernas. Especializado em Python, React, Java, Golang e Inteligência Artificial."
            className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-body"
          />
        </RevealSection>
        
        <RevealSection direction="up" delay={0.7}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <EnhancedButton 
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-primary hover:shadow-emerald text-lg px-8 py-6"
              glowEffect
            >
              Entre em Contato
            </EnhancedButton>

            <EnhancedButton 
              onClick={scrollToAbout}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
            >
              Saiba Mais
            </EnhancedButton>
          </div>
        </RevealSection>

        {/* Enhanced Scroll indicator */}
        <RevealSection direction="up" delay={0.9}>
          <motion.div 
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer flex flex-col items-center"
              onClick={scrollToAbout}
            >
              <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center mb-2">
                <motion.div
                  className="w-1 h-3 bg-primary rounded-full mt-2"
                  animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Role para baixo</p>
            </motion.div>
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
};

export default Hero;