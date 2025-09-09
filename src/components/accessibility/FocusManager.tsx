import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FocusManagerProps {
  children: React.ReactNode;
}

export const FocusManager: React.FC<FocusManagerProps> = ({ children }) => {
  const [isTabbing, setIsTabbing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsTabbing(true);
      }
    };

    const handleMouseDown = () => {
      setIsTabbing(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className={cn({
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2': isTabbing
    })}>
      {children}
    </div>
  );
};

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      Ir para o conteúdo principal
    </a>
  );
};

interface AriaLiveRegionProps {
  message: string;
  type?: 'polite' | 'assertive';
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({ 
  message, 
  type = 'polite' 
}) => {
  return (
    <div
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};