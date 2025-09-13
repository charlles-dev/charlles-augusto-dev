import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { freezeOnceVisible = false, ...observerOptions } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting;
      
      if (!hasBeenVisible && isElementIntersecting) {
        setHasBeenVisible(true);
      }

      if (freezeOnceVisible && hasBeenVisible) {
        return;
      }

      setIsIntersecting(isElementIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '-10% 0px -10% 0px',
      ...observerOptions,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [freezeOnceVisible, hasBeenVisible, observerOptions]);

  return {
    elementRef,
    isIntersecting,
    hasBeenVisible,
  };
};