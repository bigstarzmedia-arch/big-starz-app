/**
 * Push Notifications System
 * 
 * Handles real-time alerts for:
 * - New messages
 * - Casting offers
 * - Video generation completions
 * - Trending content
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPayload {
  type: 'message' | 'casting' | 'generation' | 'trending' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Request user permission for notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Get device push token for backend registration
 */
export async function getDevicePushToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      console.log('Push tokens not supported on web');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Send local notification (for testing)
 */
export async function sendLocalNotification(payload: NotificationPayload): Promise<void> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        sound: 'default',
        badge: 1,
      },
      trigger: null,
    });

    console.log('Notification sent:', notificationId);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Send message notification
 */
export async function notifyNewMessage(
  senderName: string,
  messagePreview: string,
  senderId: string
): Promise<void> {
  await sendLocalNotification({
    type: 'message',
    title: `💬 ${senderName}`,
    body: messagePreview,
    data: {
      screen: 'chat',
      senderId,
    },
  });
}

/**
 * Send casting offer notification
 */
export async function notifyCastingOffer(
  creatorName: string,
  videoTitle: string,
  rate: number,
  castingId: string
): Promise<void> {
  await sendLocalNotification({
    type: 'casting',
    title: `🎬 Casting Offer from ${creatorName}`,
    body: `"${videoTitle}" • $${rate}/hr`,
    data: {
      screen: 'casting',
      castingId,
    },
  });
}

/**
 * Send video generation completion notification
 */
export async function notifyGenerationComplete(
  videoType: string,
  videoTitle: string,
  videoId: string
): Promise<void> {
  await sendLocalNotification({
    type: 'generation',
    title: `✨ ${videoType} Ready!`,
    body: `"${videoTitle}" is ready to view`,
    data: {
      screen: 'create',
      videoId,
    },
  });
}

/**
 * Send trending content notification
 */
export async function notifyTrendingContent(
  creatorName: string,
  videoTitle: string,
  views: number,
  videoId: string
): Promise<void> {
  await sendLocalNotification({
    type: 'trending',
    title: `🔥 ${creatorName} is Trending!`,
    body: `"${videoTitle}" • ${views.toLocaleString()} views`,
    data: {
      screen: 'vibe',
      videoId,
    },
  });
}

/**
 * Send system notification
 */
export async function notifySystem(title: string, body: string): Promise<void> {
  await sendLocalNotification({
    type: 'system',
    title,
    body,
  });
}

/**
 * Set up notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
): () => void {
  // Listen for notifications when app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    }
  );

  // Listen for notification taps
  const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification tapped:', response);
      onNotificationTapped?.(response);
    }
  );

  // Return cleanup function
  return () => {
    foregroundSubscription.remove();
    backgroundSubscription.remove();
  };
}

/**
 * Register device for push notifications
 * Call this on app startup to enable push notifications from backend
 */
export async function registerDeviceForPushNotifications(userId: string): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission denied');
      return;
    }

    const token = await getDevicePushToken();
    if (!token) {
      console.log('Could not get device push token');
      return;
    }

    // TODO: Send token to backend
    // await api.notifications.registerDevice({ userId, token, platform: Platform.OS });
    console.log('Device registered for push notifications:', token);
  } catch (error) {
    console.error('Error registering device for push notifications:', error);
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

/**
 * Get notification badge count
 */
export async function getNotificationBadgeCount(): Promise<number> {
  try {
    const badge = await Notifications.getBadgeCountAsync();
    return badge;
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
}

/**
 * Set notification badge count
 */
export async function setNotificationBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
}
