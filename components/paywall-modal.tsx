/**
 * Big Starz Paywall Modal - THREE-TIER MODEL
 * 
 * Free: Sora API, 5 videos/month
 * Starz Pro ($30/month): Kling API, 50 videos/month
 * Starz Elite ($99/month): HeyGen API, unlimited videos
 */

import { View, Text, Pressable, Modal, ScrollView, Platform } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

export function PaywallModal() {
  const { paywallVisible, hidePaywall, subscribe, state, tiers } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<"starz_pro" | "starz_elite">("starz_pro");

  const handleSubscribe = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await subscribe(selectedTier);
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
              CHOOSE YOUR TIER
            </Text>
          </View>

          {/* Tier Cards */}
          <View style={{ gap: 16, marginBottom: 32 }}>
            {/* FREE TIER */}
            <Pressable
              onPress={() => setSelectedTier("starz_pro")}
              style={{
                backgroundColor: selectedTier === "starz_pro" ? "rgba(255,0,85,0.1)" : "rgba(26,26,26,0.8)",
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: selectedTier === "starz_pro" ? "#FF0055" : "#333333",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>FREE</Text>
                <Text style={{ color: "#00FF00", fontSize: 12, fontWeight: "700", backgroundColor: "rgba(0,255,0,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  STARTER
                </Text>
              </View>
              <Text style={{ color: "#AAAAAA", fontSize: 13, marginBottom: 12 }}>
                Perfect for trying out Big Starz
              </Text>
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Sora AI video generation</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ 5 videos/month</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Basic editing tools</Text>
                <Text style={{ color: "#999999", fontSize: 12 }}>✗ Priority processing</Text>
              </View>
            </Pressable>

            {/* STARZ PRO */}
            <Pressable
              onPress={() => setSelectedTier("starz_pro")}
              style={{
                backgroundColor: selectedTier === "starz_pro" ? "rgba(255,0,85,0.15)" : "rgba(26,26,26,0.8)",
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: selectedTier === "starz_pro" ? "#FF0055" : "#333333",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>STARZ PRO</Text>
                  <Text style={{ color: "#FF0055", fontSize: 20, fontWeight: "900", marginTop: 4 }}>$30/month</Text>
                </View>
                <Text style={{ color: "#FF0055", fontSize: 12, fontWeight: "700", backgroundColor: "rgba(255,0,85,0.3)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  POPULAR
                </Text>
              </View>
              <Text style={{ color: "#AAAAAA", fontSize: 13, marginBottom: 12 }}>
                Most creators choose this
              </Text>
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Kling AI video generation</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ 50 videos/month</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Advanced editing tools</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Priority processing</Text>
              </View>
              {selectedTier === "starz_pro" && (
                <Pressable
                  onPress={handleSubscribe}
                  style={{
                    backgroundColor: "#FF0055",
                    borderRadius: 12,
                    paddingVertical: 12,
                    marginTop: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>
                    SUBSCRIBE NOW
                  </Text>
                </Pressable>
              )}
            </Pressable>

            {/* STARZ ELITE */}
            <Pressable
              onPress={() => setSelectedTier("starz_elite")}
              style={{
                backgroundColor: selectedTier === "starz_elite" ? "rgba(255,0,85,0.15)" : "rgba(26,26,26,0.8)",
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: selectedTier === "starz_elite" ? "#FF0055" : "#333333",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View>
                  <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>STARZ ELITE</Text>
                  <Text style={{ color: "#00FFFF", fontSize: 20, fontWeight: "900", marginTop: 4 }}>$99/month</Text>
                </View>
                <Text style={{ color: "#00FFFF", fontSize: 12, fontWeight: "700", backgroundColor: "rgba(0,255,255,0.3)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  PREMIUM
                </Text>
              </View>
              <Text style={{ color: "#AAAAAA", fontSize: 13, marginBottom: 12 }}>
                For professional creators
              </Text>
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ HeyGen AI video generation</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Unlimited videos</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Advanced editing tools</Text>
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>✓ Priority processing</Text>
                <Text style={{ color: "#00FFFF", fontSize: 12 }}>✓ Analytics dashboard</Text>
              </View>
              {selectedTier === "starz_elite" && (
                <Pressable
                  onPress={handleSubscribe}
                  style={{
                    backgroundColor: "#00FFFF",
                    borderRadius: 12,
                    paddingVertical: 12,
                    marginTop: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#000000", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>
                    SUBSCRIBE NOW
                  </Text>
                </Pressable>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#888888", fontSize: 12, textAlign: "center" }}>
              All plans include 30-day free trial. Cancel anytime.
            </Text>
            <Text style={{ color: "#666666", fontSize: 11, textAlign: "center" }}>
              Billing occurs on the first day of each month.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
