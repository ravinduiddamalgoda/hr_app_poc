'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationContextType } from '../types';

// Create context with undefined default value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string): string => {
    const id = uuidv4();
    const newNotification: Notification = {
      id,
      type,
      message,
      timestamp: new Date(),
    };
    
    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return id;
  };

  const removeNotification = (id: string): void => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Helper methods for different notification types
  const success = (message: string): string => addNotification('success', message);
  const error = (message: string): string => addNotification('error', message);
  const info = (message: string): string => addNotification('info', message);
  const warning = (message: string): string => addNotification('warning', message);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the notification context
export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}