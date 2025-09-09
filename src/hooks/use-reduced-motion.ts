import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export const reducedMotionVariants = {
  fadeIn: (reducedMotion: boolean) => ({
    initial: { opacity: 0 },
    animate: reducedMotion 
      ? { opacity: 1, transition: { duration: 0.1 } }
      : { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  }),
  slideUp: (reducedMotion: boolean) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 50 },
    animate: reducedMotion 
      ? { opacity: 1, y: 0, transition: { duration: 0.1 } }
      : { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }),
  scale: (reducedMotion: boolean) => ({
    initial: { opacity: 0, scale: reducedMotion ? 1 : 0.8 },
    animate: reducedMotion 
      ? { opacity: 1, scale: 1, transition: { duration: 0.1 } }
      : { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }),
  staggerContainer: (reducedMotion: boolean) => ({
    initial: {},
    animate: {},
    transition: {
      staggerChildren: reducedMotion ? 0 : 0.1,
    },
  }),
};