import { useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      fallbackMessage = 'Ocorreu um erro inesperado',
      logError = true,
    } = options;

    if (logError) {
      console.error('Error handled:', error);
    }

    let message = fallbackMessage;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    }

    if (showToast) {
      toast.error(message, {
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => toast.dismiss(),
        },
      });
    }

    return message;
  }, []);

  return { handleError };
};