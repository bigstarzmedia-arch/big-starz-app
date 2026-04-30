/**
 * Notifications Context Provider
 * Manages app-wide notification state and distribution
 */

import { createContext, useContext, useState, useCallback } from "react";
import type { NotificationPayload } from "./notifications-service";

interface NotificationsContextType {
  notification: NotificationPayload | null;
  showNotification: (notification: NotificationPayload) => void;
  dismissNotification: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  const showNotification = useCallback((notification: NotificationPayload) => {
    setNotification(notification);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notification,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext must be used within NotificationsProvider");
  }
  return context;
}
