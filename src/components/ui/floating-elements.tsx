import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 6,
  className = ""
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const PulsingDot = ({ 
  color = "bg-primary",
  size = "w-2 h-2",
  className = ""
}: {
  color?: string;
  size?: string;
  className?: string;
}) => {
  return (
    <motion.div
      className={`${size} ${color} rounded-full ${className}`}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};