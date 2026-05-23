// Push notifications module - alerts creators when videos complete, gifts received, followers join
import * as Notifications from 'expo-notifications';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data: Record<string, any>;
  sound?: string;
  badge?: number;
}

export interface NotificationEvent {
  type: 'video_complete' | 'gift_received' | 'follower_joined' | 'casting_offer' | 'message_received';
  userId: string;
  creatorName: string;
  amount?: number;
  videoTitle?: string;
  timestamp: Date;
}

// Configure notifications
export async function configureNotifications() {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Send notification for video completion
export async function notifyVideoComplete(
  userId: string,
  videoTitle: string,
  tier: 'free' | 'pro' | 'elite'
): Promise<void> {
  // Mock implementation - in production, send via push service
  const notification: PushNotificationPayload = {
    title: '🎬 Your Video is Ready!',
    body: `"${videoTitle}" has been generated and is ready to share`,
    data: {
      type: 'video_complete',
      videoTitle,
      tier,
      timestamp: new Date().toISOString(),
    },
    sound: 'default',
    badge: 1,
  };

  await sendNotification(userId, notification);
}

// Send notification for gift received
export async function notifyGiftReceived(
  userId: string,
  senderName: string,
  giftType: string,
  amount: number
): Promise<void> {
  // Mock implementation - in production, send via push service
  const giftEmojis: Record<string, string> = {
    rose: '🌹',
    diamond: '💎',
    crown: '👑',
    rocket: '🚀',
    fire: '🔥',
  };

  const emoji = giftEmojis[giftType] || '🎁';

  const notification: PushNotificationPayload = {
    title: `${emoji} Gift Received!`,
    body: `${senderName} sent you a ${giftType}! You earned $${amount}`,
    data: {
      type: 'gift_received',
      senderName,
      giftType,
      amount,
      timestamp: new Date().toISOString(),
    },
    sound: 'default',
    badge: 1,
  };

  await sendNotification(userId, notification);
}

// Send notification for new follower
export async function notifyFollowerJoined(
  userId: string,
  followerName: string,
  followerCount: number
): Promise<void> {
  const notification: PushNotificationPayload = {
    title: '👥 New Follower!',
    body: `${followerName} started following you! You now have ${followerCount} followers`,
    data: {
      type: 'follower_joined',
      followerName,
      followerCount,
      timestamp: new Date().toISOString(),
    },
    sound: 'default',
    badge: 1,
  };

  await sendNotification(userId, notification);
}

// Send notification for casting offer
export async function notifyCastingOffer(
  userId: string,
  creatorName: string,
  videoTitle: string,
  rate: number
): Promise<void> {
  const notification: PushNotificationPayload = {
    title: '🎬 Casting Offer!',
    body: `${creatorName} wants to cast you in "${videoTitle}" for $${rate}`,
    data: {
      type: 'casting_offer',
      creatorName,
      videoTitle,
      rate,
      timestamp: new Date().toISOString(),
    },
    sound: 'default',
    badge: 1,
  };

  await sendNotification(userId, notification);
}

// Send notification for message received
export async function notifyMessageReceived(
  userId: string,
  senderName: string,
  messagePreview: string
): Promise<void> {
  const notification: PushNotificationPayload = {
    title: `💬 Message from ${senderName}`,
    body: messagePreview.substring(0, 100),
    data: {
      type: 'message_received',
      senderName,
      messagePreview,
      timestamp: new Date().toISOString(),
    },
    sound: 'default',
    badge: 1,
  };

  await sendNotification(userId, notification);
}

// Core notification sender
async function sendNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<void> {
  try {
    // In production, this would send to device push tokens stored in database
    // For now, just log the notification
    console.log(`[Notification] Sent to user ${userId}: ${payload.title}`);
    console.log(`[Notification Body] ${payload.body}`);
    console.log(`[Notification Data]`, payload.data);
  } catch (error) {
    console.error(`[Notification Error] Failed to send to user ${userId}:`, error);
  }
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

// Get notification history for user
export async function getNotificationHistory(
  userId: string,
  limit: number = 20
): Promise<NotificationEvent[]> {
  // Mock data - in production, fetch from database
  return [
    {
      type: 'video_complete',
      userId,
      creatorName: 'You',
      videoTitle: 'AI Music Video - Cyberpunk',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      type: 'gift_received',
      userId,
      creatorName: 'LuxeCreator',
      amount: 50,
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      type: 'follower_joined',
      userId,
      creatorName: 'NewFan123',
      timestamp: new Date(Date.now() - 86400000),
    },
  ];
}
