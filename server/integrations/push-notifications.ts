/**
 * Push Notifications Service
 * Handles real-time notifications for gifts, casting approvals, and subscriber milestones
 * Uses Expo Notifications API
 */

import * as Notifications from "expo-notifications";

export interface NotificationPayload {
  type: "gift" | "casting_approval" | "subscriber_milestone" | "casting_application";
  title: string;
  body: string;
  data: Record<string, any>;
}

/**
 * Send push notification to a user
 */
export async function sendPushNotification(
  expoPushToken: string,
  payload: NotificationPayload
): Promise<void> {
  if (!expoPushToken) {
    console.warn("No Expo push token provided");
    return;
  }

  const message = {
    to: expoPushToken,
    sound: "default" as const,
    title: payload.title,
    body: payload.body,
    data: {
      type: payload.type,
      ...payload.data,
    },
    badge: 1,
    priority: "high" as const,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Push notification failed: ${response.statusText}`);
    }

    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

/**
 * Send gift received notification
 */
export async function notifyGiftReceived(
  expoPushToken: string,
  giftName: string,
  senderName: string,
  giftValue: number
): Promise<void> {
  await sendPushNotification(expoPushToken, {
    type: "gift",
    title: "🎁 Gift Received!",
    body: `${senderName} sent you a ${giftName} worth $${giftValue}!`,
    data: {
      giftName,
      senderName,
      giftValue,
      action: "view_gift",
    },
  });
}

/**
 * Send casting approval notification
 */
export async function notifyCastingApproval(
  expoPushToken: string,
  castingName: string,
  brandName: string,
  compensation: number
): Promise<void> {
  await sendPushNotification(expoPushToken, {
    type: "casting_approval",
    title: "🎬 Casting Approved!",
    body: `You've been approved for ${castingName} with ${brandName} - ${compensation} tokens earned!`,
    data: {
      castingName,
      brandName,
      compensation,
      action: "view_casting",
    },
  });
}

/**
 * Send subscriber milestone notification
 */
export async function notifySubscriberMilestone(
  expoPushToken: string,
  milestoneCount: number
): Promise<void> {
  let title = "";
  let body = "";
  let emoji = "🎉";

  if (milestoneCount === 100) {
    title = "🌟 100 Subscribers!";
    body = "You've reached 100 subscribers! Keep growing your audience.";
  } else if (milestoneCount === 500) {
    title = "⭐ 500 Subscribers!";
    body = "Halfway to the 1k milestone! You're on fire!";
  } else if (milestoneCount === 1000) {
    title = "💎 1,000 Subscribers - Elite Status Unlocked!";
    body = "Congratulations! You can now charge casting fees. Start monetizing today!";
    emoji = "💎";
  } else if (milestoneCount === 5000) {
    title = "👑 5,000 Subscribers - Platinum Status!";
    body = "You're a Big Starz superstar! Premium rates unlocked.";
    emoji = "👑";
  }

  if (title) {
    await sendPushNotification(expoPushToken, {
      type: "subscriber_milestone",
      title,
      body,
      data: {
        milestoneCount,
        action: "view_profile",
      },
    });
  }
}

/**
 * Send casting application received notification
 */
export async function notifyCastingApplication(
  expoPushToken: string,
  applicantName: string,
  castingName: string
): Promise<void> {
  await sendPushNotification(expoPushToken, {
    type: "casting_application",
    title: "📝 New Casting Application",
    body: `${applicantName} applied for ${castingName}. Review their portfolio now!`,
    data: {
      applicantName,
      castingName,
      action: "view_applications",
    },
  });
}

/**
 * Configure notification handler
 */
export function configureNotificationHandler(
  handleNotification: (notification: Notifications.Notification) => void
): (() => void) | void {
  // Set notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Listen for notifications when app is in foreground
  const subscription = Notifications.addNotificationReceivedListener(handleNotification);

  // Listen for notification responses (when user taps notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const notification = response.notification;
      console.log("Notification response:", notification.request.content.data);
      // Handle notification tap - navigate to appropriate screen
      handleNotificationResponse(notification);
    }
  );

  return () => {
    subscription.remove();
    responseSubscription.remove();
  }
}

/**
 * Handle notification response (user taps notification)
 */
function handleNotificationResponse(notification: Notifications.Notification): void {
  const data = notification.request.content.data;
  const action = data.action as string;

  switch (action) {
    case "view_gift":
      console.log("Navigate to Vibe Live screen");
      break;
    case "view_casting":
      console.log("Navigate to Casting Detail screen");
      break;
    case "view_profile":
      console.log("Navigate to Profile screen");
      break;
    case "view_applications":
      console.log("Navigate to Casting Applications screen");
      break;
    default:
      console.log("Unknown notification action:", action);
  }
}

/**
 * Register for push notifications (call on app startup)
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push notification permissions");
      return null;
    }

    // Get Expo push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Expo push token:", token.data);
    return token.data;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
}
