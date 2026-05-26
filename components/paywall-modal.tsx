/**
 * Big Starz Paywall Modal - 4-TIER PRICING
 * 
 * Support for Budget ($2.40), Pro ($24), and Elite ($98.40) tiers
 * Clean design with tier selection and feature comparison
 */

import { View, Text, Pressable, Modal, ScrollView, Platform, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { useSubscription } from "@/lib/subscription-context";
import { TIERS, type TierType } from "@/server/pricing";

export function PaywallModal() {
  const { paywallVisible, hidePaywall, subscribe } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<TierType>('pro');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    try {
      const subscriptionType = selectedTier === 'elite' ? 'starz_elite' : 'starz_pro';
      await subscribe(subscriptionType);
      hidePaywall();
    } finally {
      setLoading(false);
    }
  };

  const tier = TIERS[selectedTier];

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

          {/* Tier Selection */}
          <View style={{ gap: 12, marginBottom: 24 }}>
            {Object.values(TIERS).filter(t => t.id !== 'free').map(t => (
              <Pressable
                key={t.id}
                onPress={() => setSelectedTier(t.id as TierType)}
                style={{
                  backgroundColor: selectedTier === t.id ? "rgba(255,0,85,0.2)" : "rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: selectedTier === t.id ? "#FF0055" : "#333333",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>
                    {t.name}
                  </Text>
                  <Text style={{ color: "#FFD700", fontSize: 16, fontWeight: "900" }}>
                    ${t.price.toFixed(2)}/mo
                  </Text>
                </View>
                <Text style={{ color: "#AAAAAA", fontSize: 12, marginBottom: 8 }}>
                  {t.generationsPerMonth === 999999 ? "Unlimited" : `${t.generationsPerMonth} generations/month`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Subscribe Button */}
          <Pressable
            onPress={handleSubscribe}
            disabled={loading}
            style={{
              backgroundColor: "#FF0055",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 16,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 1 }}>
                SUBSCRIBE TO {tier.name.toUpperCase()}
              </Text>
            )}
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
