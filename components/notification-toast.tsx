/**
 * Notification Toast Component
 * Displays notifications in the UI with auto-dismiss
 */

import { View, Text, Pressable, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useColors } from "@/hooks/use-colors";
import type { NotificationPayload } from "@/lib/notifications-service";

interface NotificationToastProps {
  notification: NotificationPayload | null;
  onDismiss?: () => void;
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (notification) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, slideAnim, onDismiss]);

  if (!notification) return null;

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "casting_offer":
        return colors.accent1;
      case "message":
        return colors.accent2;
      case "earnings_milestone":
      case "gift_received":
        return colors.success;
      case "subscriber_milestone":
        return colors.accent3;
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "casting_offer":
        return "🎬";
      case "message":
        return "💬";
      case "earnings_milestone":
        return "💰";
      case "subscriber_milestone":
        return "📈";
      case "gift_received":
        return "🎁";
      default:
        return "📢";
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 12,
          marginTop: 12,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 20 }}>{getIcon()}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: colors.background,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: colors.background,
              opacity: 0.9,
            }}
            numberOfLines={2}
          >
            {notification.body}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (onDismiss) onDismiss();
          }}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 16, color: colors.background }}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
