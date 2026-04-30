/**
 * Notifications Demo Component
 * Shows how to use the notification system with example triggers
 */

import { View, Text, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useNotificationsContext } from "@/lib/notifications-context";
import {
  createCastingOfferNotification,
  createMessageNotification,
  createEarningsMilestoneNotification,
  createSubscriberMilestoneNotification,
  createGiftReceivedNotification,
} from "@/lib/notifications-service";
import * as Haptics from "expo-haptics";

export function NotificationsDemoButtons() {
  const colors = useColors();
  const { showNotification } = useNotificationsContext();

  const handleCastingOffer = () => {
    const notification = createCastingOfferNotification("SSENSE", "$1500-$2000");
    showNotification(notification);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleMessage = () => {
    const notification = createMessageNotification("Sarah Chen", "Hey! Are you available for the shoot next week?");
    showNotification(notification);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEarnings = () => {
    const notification = createEarningsMilestoneNotification(500, "$500 Earned");
    showNotification(notification);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSubscribers = () => {
    const notification = createSubscriberMilestoneNotification(1000);
    showNotification(notification);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleGift = () => {
    const notification = createGiftReceivedNotification("Alex", "Diamond Gift", 50);
    showNotification(notification);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ gap: 8 }}>
      <Pressable
        onPress={handleCastingOffer}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: colors.accent1,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
          🎬 Test Casting Offer
        </Text>
      </Pressable>

      <Pressable
        onPress={handleMessage}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: colors.accent2,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
          💬 Test Message
        </Text>
      </Pressable>

      <Pressable
        onPress={handleEarnings}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: colors.success,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
          💰 Test Earnings
        </Text>
      </Pressable>

      <Pressable
        onPress={handleSubscribers}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: colors.accent3,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
          📈 Test 1K Subscribers
        </Text>
      </Pressable>

      <Pressable
        onPress={handleGift}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          backgroundColor: colors.primary,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
          🎁 Test Gift Received
        </Text>
      </Pressable>
    </View>
  );
}
