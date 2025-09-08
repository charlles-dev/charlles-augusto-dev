import { useState } from "react";
import { Menu, X, Home, User, Briefcase, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingNav } from "@/components/ui/floating-nav";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Home", name: "Home", link: "home", icon: <Home className="h-4 w-4" /> },
    { id: "about", label: "Sobre", name: "Sobre", link: "about", icon: <User className="h-4 w-4" /> },
    { id: "projects", label: "Projetos", name: "Projetos", link: "projects", icon: <Briefcase className="h-4 w-4" /> },
    { id: "experience", label: "Experiência", name: "Experiência", link: "experience", icon: <BookOpen className="h-4 w-4" /> },
    { id: "contact", label: "Contato", name: "Contato", link: "contact", icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Floating Navigation */}
      <FloatingNav navItems={navItems} />
      
      {/* Main Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer">
                Charlles Augusto
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium relative group"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                      whileHover={{ width: "100%" }}
                    />
                  </motion.button>
                ))}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/auth" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
                      Admin
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-foreground"
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="px-2 pt-2 pb-3 space-y-1 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg mt-2"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  exit={{ y: -20 }}
                >
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors duration-300 rounded-md hover:bg-primary/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                  <motion.a
                    href="/auth"
                    className="flex items-center w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors duration-300 rounded-md hover:bg-primary/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-3">⚙️</span>
                    Admin
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;