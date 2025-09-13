import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [count, setCount] = useState(start);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const increment = (end - start) / (duration * 60); // 60fps
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= end) {
          clearInterval(timer);
          return end;
        }
        return Math.min(prev + increment, end);
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isIntersecting, start, end, duration]);

  return (
    <motion.span
      ref={elementRef}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {prefix}{Math.floor(count)}{suffix}
    </motion.span>
  );
};