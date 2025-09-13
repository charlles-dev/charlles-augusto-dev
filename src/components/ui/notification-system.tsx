import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle {...iconProps} className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info {...iconProps} className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "border rounded-lg p-4 shadow-lg",
              getStyles(notification.type)
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                )}
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};