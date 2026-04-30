/**
 * Big Starz Paywall Modal
 * 
 * Blocks ALL generation features until user subscribes ($30/month).
 * Shows pricing, features, and token economy explanation.
 * In production: triggers RevenueCat purchase flow.
 */

import { View, Text, Pressable, Modal, ScrollView, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

const FEATURES = [
  { icon: "\u{1F3AC}", title: "AI Video Beautification", desc: "Kling & HeyGen cinematic rendering" },
  { icon: "\u{1F3A4}", title: "Voice Clone & Synthesis", desc: "ElevenLabs premium voice AI" },
  { icon: "\u{1F3B5}", title: "AI Lyric Generation", desc: "Genre-specific songwriting assistant" },
  { icon: "\u{1F464}", title: "3D Cameo Avatar", desc: "Face mesh scan + AI beautify" },
  { icon: "\u{1F4B0}", title: "Casting Marketplace", desc: "Hire & get hired for music videos" },
  { icon: "\u{1F680}", title: "Direct Social Export", desc: "One-tap TikTok/Instagram share" },
];

const TOP_UP_PACKS = [
  { tokens: 10, price: "$5.99", popular: false },
  { tokens: 25, price: "$12.99", popular: true },
  { tokens: 50, price: "$22.99", popular: false },
];

export function PaywallModal() {
  const { paywallVisible, hidePaywall, subscribe, state } = useSubscription();

  const handleSubscribe = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // In production: RevenueCat.purchasePackage(...)
    await subscribe();
  };

  return (
    <Modal
      visible={paywallVisible}
      animationType="slide"
      transparent
      onRequestClose={hidePaywall}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Close button */}
          <Pressable
            onPress={hidePaywall}
            style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
          >
            <Text style={{ color: "#888", fontSize: 28 }}>{"\u2715"}</Text>
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>{"\u2B50"}</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "900", letterSpacing: 2, textAlign: "center" }}>
              STARZ PRO
            </Text>
            <Text style={{ color: "#FF007F", fontSize: 14, fontWeight: "600", marginTop: 4, letterSpacing: 1 }}>
              UNLOCK THE FULL CREATIVE ENGINE
            </Text>
          </View>

          {/* Price */}
          <View style={{
            alignItems: "center",
            marginBottom: 24,
            backgroundColor: "rgba(255,0,127,0.08)",
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255,0,127,0.3)",
          }}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 48, fontWeight: "900" }}>$30</Text>
              <Text style={{ color: "#888888", fontSize: 16, marginLeft: 4 }}>/month</Text>
            </View>
            <Text style={{ color: "#AAAAAA", fontSize: 13, marginTop: 8, textAlign: "center" }}>
              50 Starz Tokens included {"\u2022"} 1 Token = 1 AI Generation
            </Text>
            <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
              <View style={{ backgroundColor: "rgba(0,255,0,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: "#00FF00", fontSize: 11, fontWeight: "600" }}>Cancel Anytime</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,215,0,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: "#FFD700", fontSize: 11, fontWeight: "600" }}>Non-Refundable</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginBottom: 12, letterSpacing: 1 }}>
              WHAT YOU GET:
            </Text>
            {FEATURES.map((feature, idx) => (
              <View key={idx} style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
                backgroundColor: "rgba(26,26,26,0.6)",
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: "rgba(51,51,51,0.5)",
              }}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{feature.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>{feature.title}</Text>
                  <Text style={{ color: "#888888", fontSize: 12, marginTop: 2 }}>{feature.desc}</Text>
                </View>
                <Text style={{ color: "#00FF00", fontSize: 14 }}>{"\u2713"}</Text>
              </View>
            ))}
          </View>

          {/* Token Economy Explanation */}
          <View style={{
            backgroundColor: "rgba(26,26,26,0.8)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(255,215,0,0.2)",
          }}>
            <Text style={{ color: "#FFD700", fontSize: 13, fontWeight: "700", marginBottom: 8 }}>
              {"\u{1F4B0}"} STARZ TOKEN ECONOMY
            </Text>
            <Text style={{ color: "#AAAAAA", fontSize: 12, lineHeight: 18 }}>
              Your $30 subscription grants 50 Starz Tokens per month. Each AI generation (video beautify, voice clone, lyric write) costs 1 token. Need more? Purchase Top-Up Packs anytime.
            </Text>
            <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
              {TOP_UP_PACKS.map((pack, idx) => (
                <View key={idx} style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: pack.popular ? "rgba(255,0,127,0.15)" : "rgba(26,26,26,0.5)",
                  borderRadius: 12,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: pack.popular ? "rgba(255,0,127,0.4)" : "rgba(51,51,51,0.5)",
                }}>
                  {pack.popular && (
                    <Text style={{ color: "#FF007F", fontSize: 8, fontWeight: "800", marginBottom: 2 }}>POPULAR</Text>
                  )}
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{pack.tokens}</Text>
                  <Text style={{ color: "#888", fontSize: 10 }}>tokens</Text>
                  <Text style={{ color: "#FFD700", fontSize: 12, fontWeight: "700", marginTop: 4 }}>{pack.price}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Subscribe Button */}
          <Pressable
            onPress={handleSubscribe}
            style={({ pressed }) => ({
              backgroundColor: "#FF007F",
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: "center",
              shadowColor: "#FF007F",
              shadowOpacity: 0.7,
              shadowRadius: 20,
              elevation: 10,
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.9 : 1,
              marginBottom: 12,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 1 }}>
              SUBSCRIBE — $30/MONTH
            </Text>
          </Pressable>

          {/* Restore / Terms */}
          <View style={{ alignItems: "center", gap: 8, marginBottom: 40 }}>
            <Pressable onPress={() => { /* Restore purchases via RevenueCat */ }}>
              <Text style={{ color: "#888888", fontSize: 12, textDecorationLine: "underline" }}>
                Restore Purchases
              </Text>
            </Pressable>
            <Text style={{ color: "#555555", fontSize: 10, textAlign: "center", lineHeight: 14 }}>
              Payment will be charged to your App Store/Play Store account. Subscription auto-renews monthly. All sales are non-refundable per Big Starz Terms of Service.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
