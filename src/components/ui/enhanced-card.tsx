import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover3D?: boolean;
  glowOnHover?: boolean;
  gradient?: boolean;
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, children, hover3D = false, glowOnHover = false, gradient = false }, ref) => {
    return (
      <motion.div
        whileHover={hover3D ? { 
          rotateY: 5,
          rotateX: 5,
          scale: 1.02,
        } : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ perspective: 1000 }}
      >
        <Card
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            glowOnHover && "hover:shadow-2xl hover:shadow-primary/25",
            gradient && "bg-gradient-card",
            className
          )}
        >
          {gradient && (
            <motion.div
              className="absolute inset-0 bg-gradient-primary opacity-0"
              whileHover={{ opacity: 0.05 }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          <div className="relative z-10">
            {children}
          </div>
        </Card>
      </motion.div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";