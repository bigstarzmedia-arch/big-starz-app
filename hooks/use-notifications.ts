import { useState, useCallback, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationType = 'follow' | 'like' | 'comment' | 'casting' | 'message' | 'milestone';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
}

/**
 * Hook for managing real-time notifications
 * Handles push notifications, local notifications, and notification history
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permissions
  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestNotificationPermissions();
    }
  }, []);

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  // Send local notification
  const sendLocalNotification = useCallback(
    async (
      title: string,
      body: string,
      type: NotificationType,
      data?: Record<string, any>
    ) => {
      if (Platform.OS === 'web') return;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { type, ...data },
            sound: 'default',
            badge: unreadCount + 1,
          },
          trigger: null, // Send immediately
        });

        // Add to local notification list
        addNotification(title, body, type, data);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    },
    [unreadCount]
  );

  // Add notification to state
  const addNotification = useCallback(
    (
      title: string,
      body: string,
      type: NotificationType,
      data?: Record<string, any>
    ) => {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type,
        title,
        body,
        data,
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    []
  );

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  }, []);

  // Trigger specific notification types
  const notifyFollow = useCallback(
    (creatorName: string, creatorId: string) => {
      sendLocalNotification(
        `${creatorName} followed you!`,
        'Check out their profile and follow back',
        'follow',
        { creatorId }
      );
    },
    [sendLocalNotification]
  );

  const notifyLike = useCallback(
    (creatorName: string, videoId: string) => {
      sendLocalNotification(
        `${creatorName} liked your video!`,
        'Your video is getting love ❤️',
        'like',
        { videoId }
      );
    },
    [sendLocalNotification]
  );

  const notifyComment = useCallback(
    (creatorName: string, videoId: string, comment: string) => {
      sendLocalNotification(
        `${creatorName} commented on your video`,
        comment.substring(0, 50) + (comment.length > 50 ? '...' : ''),
        'comment',
        { videoId }
      );
    },
    [sendLocalNotification]
  );

  const notifyCastingOffer = useCallback(
    (creatorName: string, castingId: string, amount: number) => {
      sendLocalNotification(
        `Casting offer from ${creatorName}!`,
        `They want to hire you for $${amount}`,
        'casting',
        { castingId, amount }
      );
    },
    [sendLocalNotification]
  );

  const notifyMessage = useCallback(
    (creatorName: string, conversationId: string) => {
      sendLocalNotification(
        `New message from ${creatorName}`,
        'Tap to reply',
        'message',
        { conversationId }
      );
    },
    [sendLocalNotification]
  );

  const notifyMilestone = useCallback(
    (milestone: string, count: number) => {
      sendLocalNotification(
        `🎉 Milestone reached!`,
        `You've hit ${count} ${milestone}!`,
        'milestone',
        { milestone, count }
      );
    },
    [sendLocalNotification]
  );

  return {
    notifications,
    unreadCount,
    sendLocalNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    notifyFollow,
    notifyLike,
    notifyComment,
    notifyCastingOffer,
    notifyMessage,
    notifyMilestone,
  };
}
