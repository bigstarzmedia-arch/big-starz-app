/**
 * Notifications Service
 * Handles real-time notifications for casting offers, messages, and earnings milestones
 */

import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

export type NotificationType = "casting_offer" | "message" | "earnings_milestone" | "subscriber_milestone" | "gift_received";

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: Date;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Hook to set up notification listeners
 */
export function useNotifications(onNotification?: (notification: NotificationPayload) => void) {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Handle notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const payload: NotificationPayload = {
        type: (notification.request.content.data.type as NotificationType) || "message",
        title: notification.request.content.title || "Notification",
        body: notification.request.content.body || "",
        data: notification.request.content.data,
        timestamp: new Date(),
      };

      if (onNotification) {
        onNotification(payload);
      }
    });

    // Handle notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const payload: NotificationPayload = {
        type: (response.notification.request.content.data.type as NotificationType) || "message",
        title: response.notification.request.content.title || "Notification",
        body: response.notification.request.content.body || "",
        data: response.notification.request.content.data,
        timestamp: new Date(),
      };

      if (onNotification) {
        onNotification(payload);
      }
    });

    return () => {
      if (notificationListener.current !== null) {
        notificationListener.current.remove();
      }
      if (responseListener.current !== null) {
        responseListener.current.remove();
      }
    };
  }, [onNotification]);
}

/**
 * Send a local notification
 */
export async function sendLocalNotification(payload: NotificationPayload) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: {
          type: payload.type,
          ...payload.data,
        },
        sound: "default",
        badge: 1,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

/**
 * Create a casting offer notification
 */
export function createCastingOfferNotification(brandName: string, compensation: string): NotificationPayload {
  return {
    type: "casting_offer",
    title: `🎬 New Casting Offer from ${brandName}`,
    body: `You've been selected for a casting opportunity! Compensation: ${compensation}`,
    data: { brandName, compensation },
    timestamp: new Date(),
  };
}

/**
 * Create a message notification
 */
export function createMessageNotification(senderName: string, preview: string): NotificationPayload {
  return {
    type: "message",
    title: `💬 Message from ${senderName}`,
    body: preview,
    data: { senderName, preview },
    timestamp: new Date(),
  };
}

/**
 * Create an earnings milestone notification
 */
export function createEarningsMilestoneNotification(amount: number, milestone: string): NotificationPayload {
  return {
    type: "earnings_milestone",
    title: `💰 Earnings Milestone: ${milestone}`,
    body: `You've earned $${amount}! Keep creating amazing content.`,
    data: { amount, milestone },
    timestamp: new Date(),
  };
}

/**
 * Create a subscriber milestone notification
 */
export function createSubscriberMilestoneNotification(count: number): NotificationPayload {
  const milestone =
    count === 100
      ? "100 Subscribers! 🎉"
      : count === 500
      ? "500 Subscribers! 🚀"
      : count === 1000
      ? "1K Subscribers! 👑"
      : `${count} Subscribers!`;

  return {
    type: "subscriber_milestone",
    title: `📈 ${milestone}`,
    body: `Congratulations! You've reached ${count} subscribers. Unlock exclusive features!`,
    data: { count, milestone },
    timestamp: new Date(),
  };
}

/**
 * Create a gift received notification
 */
export function createGiftReceivedNotification(senderName: string, giftName: string, amount: number): NotificationPayload {
  return {
    type: "gift_received",
    title: `🎁 ${senderName} sent you ${giftName}!`,
    body: `You earned $${amount} from this gift!`,
    data: { senderName, giftName, amount },
    timestamp: new Date(),
  };
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
}

/**
 * Get notification permissions status
 */
export async function getNotificationPermissions() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Failed to get notification permissions:", error);
    return false;
  }
}
