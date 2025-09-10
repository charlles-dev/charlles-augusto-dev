import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  progress: number;
  className?: string;
}

export const ScrollProgress = ({ progress, className }: ScrollProgressProps) => {
  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50",
        className
      )}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-primary origin-left"
        style={{ 
          scaleX: progress / 100,
          transformOrigin: '0% 50%' 
        }}
        transition={{
          scaleX: { duration: 0.1, ease: 'easeOut' }
        }}
      />
    </motion.div>
  );
};