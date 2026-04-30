/**
 * Token Balance Widget
 * Shows current Starz Token balance in premium screens.
 * Tapping when empty triggers the paywall.
 */

import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

export function TokenBalance() {
  const { state, canGenerate, showPaywall } = useSubscription();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!canGenerate) {
      showPaywall();
    }
  };

  const percentage = (state.tokenBalance / state.maxTokens) * 100;
  const barColor = percentage > 50 ? "#00FF00" : percentage > 20 ? "#FFD700" : "#FF4444";

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(26,26,26,0.8)",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "rgba(255,215,0,0.3)",
        gap: 8,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <Text style={{ fontSize: 14 }}>{"\u2B50"}</Text>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
            {state.tokenBalance} Tokens
          </Text>
          <Text style={{ color: "#888888", fontSize: 10 }}>
            {state.totalGenerations} used
          </Text>
        </View>
        <View style={{ height: 3, backgroundColor: "rgba(51,51,51,0.8)", borderRadius: 2, overflow: "hidden" }}>
          <View style={{ width: `${percentage}%` as any, height: 3, backgroundColor: barColor, borderRadius: 2 }} />
        </View>
      </View>
    </Pressable>
  );
}
