import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <CheckCircle2 className="h-5 w-5" />,
    duration: 4000,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="h-5 w-5" />,
    duration: 5000,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    icon: <AlertCircle className="h-5 w-5" />,
    duration: 4000,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    icon: <Info className="h-5 w-5" />,
    duration: 3000,
  });
};

export const showLoadingToast = (message: string, description?: string) => {
  return toast.loading(message, {
    description,
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
  });
};

export const showPromiseToast = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
