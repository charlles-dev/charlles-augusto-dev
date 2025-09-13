import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20,
  }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4,
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};