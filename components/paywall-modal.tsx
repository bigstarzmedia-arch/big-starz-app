/**
 * Big Starz Paywall Modal - SIMPLIFIED
 * 
 * Single "Subscribe" button for Starz Pro ($30/month)
 * Clean, minimal design with no tier selection clutter
 */

import { View, Text, Pressable, Modal, ScrollView, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

export function PaywallModal() {
  const { paywallVisible, hidePaywall, subscribe } = useSubscription();

  const handleSubscribe = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await subscribe("starz_pro");
    hidePaywall();
  };

  return (
    <Modal
      visible={paywallVisible}
      animationType="slide"
      transparent
      onRequestClose={hidePaywall}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Close button */}
          <Pressable
            onPress={hidePaywall}
            style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
          >
            <Text style={{ color: "#888", fontSize: 28 }}>✕</Text>
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>⭐</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "900", letterSpacing: 2 }}>
              BIG STARZ
            </Text>
            <Text style={{ color: "#FF0055", fontSize: 16, fontWeight: "700", marginTop: 8, letterSpacing: 1 }}>
              UNLOCK PREMIUM CREATION
            </Text>
          </View>

          {/* Price Card */}
          <View style={{
            backgroundColor: "rgba(255,0,85,0.1)",
            borderRadius: 16,
            padding: 24,
            borderWidth: 2,
            borderColor: "#FF0055",
            marginBottom: 24,
            alignItems: "center",
          }}>
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginBottom: 8 }}>
              $30/month
            </Text>
            <Text style={{ color: "#AAAAAA", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
              Kling AI video generation • 50 videos/month • Advanced editing
            </Text>
            <View style={{ gap: 8, width: "100%" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: "#00FF00", fontSize: 16 }}>✓</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 13 }}>50 AI video generations</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: "#00FF00", fontSize: 16 }}>✓</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 13 }}>Advanced editing tools</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: "#00FF00", fontSize: 16 }}>✓</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 13 }}>Priority processing</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: "#00FF00", fontSize: 16 }}>✓</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 13 }}>Download & share content</Text>
              </View>
            </View>
          </View>

          {/* Subscribe Button */}
          <Pressable
            onPress={handleSubscribe}
            style={{
              backgroundColor: "#FF0055",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 1 }}>
              SUBSCRIBE NOW
            </Text>
          </Pressable>

          {/* Footer */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#888888", fontSize: 12, textAlign: "center" }}>
              Cancel anytime. No commitment.
            </Text>
            <Text style={{ color: "#666666", fontSize: 11, textAlign: "center" }}>
              Billing occurs monthly on your subscription date.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
