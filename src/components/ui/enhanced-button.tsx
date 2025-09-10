import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  glowEffect?: boolean;
  pulseOnHover?: boolean;
  children: React.ReactNode;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, glowEffect = false, pulseOnHover = true, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={pulseOnHover ? { scale: 1.05 } : {}}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden",
            glowEffect && "animate-pulse-glow",
            className
          )}
          {...props}
        >
          {glowEffect && (
            <motion.div
              className="absolute inset-0 bg-gradient-primary opacity-20 blur-lg"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";