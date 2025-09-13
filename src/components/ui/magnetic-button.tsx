import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends ButtonProps {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, children, strength = 15, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = strength;

      if (distance < maxDistance) {
        const factor = (maxDistance - distance) / maxDistance;
        setPosition({
          x: deltaX * factor,
          y: deltaY * factor,
        });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Button
          ref={buttonRef}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "hover:shadow-lg hover:shadow-primary/25",
            className
          )}
          {...props}
        >
          <motion.span
            className="relative z-10"
            animate={{ x: position.x * 0.1, y: position.y * 0.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {children}
          </motion.span>
          
          <motion.div
            className="absolute inset-0 bg-gradient-primary opacity-0"
            animate={{ 
              opacity: position.x !== 0 || position.y !== 0 ? 0.1 : 0,
              scale: position.x !== 0 || position.y !== 0 ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
    );
  }
);

MagneticButton.displayName = "MagneticButton";