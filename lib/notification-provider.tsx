import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as NotificationService from '@/lib/notifications';

/**
 * Notification Provider
 * 
 * Sets up notification listeners and handles notification navigation
 * Wrap your app with this provider to enable push notifications
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Set up notification listeners
    const unsubscribe = NotificationService.setupNotificationListeners(
      // Notification received (foreground)
      (notification) => {
        console.log('Notification received:', notification);
      },
      // Notification tapped (background or foreground)
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped with data:', data);

        // Navigate based on notification type
        if (data.screen) {
          switch (data.screen) {
            case 'chat':
              router.push(`/(tabs)/chat`);
              break;
            case 'casting':
              router.push(`/creator-detail?creatorId=${data.castingId}`);
              break;
            case 'create':
              router.push(`/(tabs)/create`);
              break;
            case 'vibe':
              router.push(`/(tabs)`);
              break;
            default:
              break;
          }
        }
      }
    );

    // Register device for push notifications
    // TODO: Get userId from auth context
    const userId = '1';
    NotificationService.registerDeviceForPushNotifications(userId).catch((error) => {
      console.error('Failed to register device for notifications:', error);
    });

    return unsubscribe;
  }, [router]);

  return <>{children}</>;
}
