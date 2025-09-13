import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  width?: string;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  lines = 3,
  avatar = false,
  width = 'w-full',
  height = 'h-4'
}) => {
  const shimmerAnimation = {
    backgroundPosition: ['0%', '100%'],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear" as const
    }
  };

  return (
    <div className={cn('animate-pulse', className)}>
      {avatar && (
        <motion.div
          className="w-10 h-10 bg-muted rounded-full mb-3"
          animate={shimmerAnimation}
        />
      )}
      
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'bg-muted rounded mb-2',
            height,
            index === lines - 1 ? 'w-3/4' : width
          )}
          animate={shimmerAnimation}
        />
      ))}
    </div>
  );
};