import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Custom hook for displaying toast notifications
 * Provides a consistent API for showing different types of toasts
 */
export function useToast() {
  const showToast = (type: ToastType, options: ToastOptions) => {
    const { title, description, duration, action } = options;

    const toastOptions = {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    };

    switch (type) {
      case 'success':
        return toast.success(title, toastOptions);
      case 'error':
        return toast.error(title, toastOptions);
      case 'warning':
        return toast.warning(title, toastOptions);
      case 'info':
        return toast.info(title, toastOptions);
      case 'loading':
        return toast.loading(title, toastOptions);
      default:
        return toast(title, toastOptions);
    }
  };

  return {
    toast: showToast,
    success: (title: string, description?: string) => showToast('success', { title, description }),
    error: (title: string, description?: string) => showToast('error', { title, description }),
    warning: (title: string, description?: string) => showToast('warning', { title, description }),
    info: (title: string, description?: string) => showToast('info', { title, description }),
    loading: (title: string, description?: string) => showToast('loading', { title, description }),
    dismiss: toast.dismiss,
    promise: toast.promise,
  };
}

// Export direct toast functions for non-hook usage
export const showToast = {
  success: (title: string, description?: string) => toast.success(title, { description }),
  error: (title: string, description?: string) => toast.error(title, { description }),
  warning: (title: string, description?: string) => toast.warning(title, { description }),
  info: (title: string, description?: string) => toast.info(title, { description }),
  loading: (title: string, description?: string) => toast.loading(title, { description }),
  dismiss: toast.dismiss,
  promise: toast.promise,
};
