import React, { useRef, useEffect, useState } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: number;
}

export const ParallaxSection = ({ 
  children, 
  className,
  offset = 0,
  speed = 0.5 
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset - 100 * speed]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};