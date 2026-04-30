/**
 * Payout Settings Screen
 * Creator Stripe Connect account management and earnings
 */

import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface PayoutAccount {
  id: string;
  status: "pending" | "active" | "restricted";
  bankLinked: boolean;
  totalEarnings: number;
  lastPayout: string | null;
}

export default function PayoutSettingsScreen() {
  const colors = useColors();
  const [account, setAccount] = useState<PayoutAccount | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnectStripe = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // In production, this would call the backend to create Stripe Connect account
      // and return an onboarding URL
      Alert.alert("Stripe Connect", "Redirecting to Stripe onboarding...");

      // Simulate account creation
      setAccount({
        id: "acct_1234567890",
        status: "pending",
        bankLinked: false,
        totalEarnings: 0,
        lastPayout: null,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to connect Stripe account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Payout Settings</Text>
          <Text className="text-sm text-muted">Manage your earnings and Stripe account</Text>
        </View>

        {!account ? (
          /* Not Connected State */
          <View className="flex-1">
            <View
              className="p-6 rounded-2xl border-2 items-center justify-center mb-6"
              style={{ borderColor: colors.primary, borderStyle: "dashed" }}
            >
              <Text className="text-5xl mb-4">💳</Text>
              <Text className="text-lg font-bold text-foreground text-center mb-2">
                Connect Your Bank Account
              </Text>
              <Text className="text-sm text-muted text-center mb-6">
                Link your Stripe account to receive payouts from gifts and casting fees
              </Text>

              <Pressable
                onPress={handleConnectStripe}
                disabled={loading}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    backgroundColor: colors.primary,
                    opacity: loading ? 0.6 : 1,
                  },
                ]}
                className="w-full py-4 rounded-xl items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  {loading ? "Connecting..." : "Connect Stripe"}
                </Text>
              </Pressable>
            </View>

            {/* Info Cards */}
            <View className="gap-3">
              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">🎁 Gift Payouts</Text>
                <Text className="text-xs text-muted">
                  Receive 90% of all gift values sent during your live streams
                </Text>
              </View>

              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">🎬 Casting Fees</Text>
                <Text className="text-xs text-muted">
                  Unlock casting fee payments once you reach 1,000 subscribers
                </Text>
              </View>

              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">💰 Weekly Payouts</Text>
                <Text className="text-xs text-muted">
                  Earnings are transferred to your bank account every Friday
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* Connected State */
          <View className="flex-1">
            {/* Account Status */}
            <View className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-semibold text-foreground">Account Status</Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      account.status === "active"
                        ? "#22C55E"
                        : account.status === "pending"
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                >
                  <Text className="text-white text-xs font-bold capitalize">
                    {account.status}
                  </Text>
                </View>
              </View>

              {account.status === "pending" && (
                <Text className="text-xs text-muted">
                  Complete your Stripe onboarding to start receiving payouts
                </Text>
              )}

              {account.status === "active" && (
                <Text className="text-xs text-muted">
                  ✓ Your account is ready to receive payouts
                </Text>
              )}
            </View>

            {/* Bank Account Status */}
            <View className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-foreground mb-1">Bank Account</Text>
                  <Text className="text-xs text-muted">
                    {account.bankLinked ? "✓ Connected" : "Not connected"}
                  </Text>
                </View>
                {!account.bankLinked && (
              <Pressable
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    backgroundColor: colors.primary,
                  },
                ]}
                className="px-4 py-2 rounded-lg"
              >
                    <Text className="text-white text-xs font-bold">Add Bank</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Earnings Summary */}
            <View className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.surface }}>
              <Text className="font-semibold text-foreground mb-4">Earnings Summary</Text>

              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-muted">Total Earnings</Text>
                <Text className="text-lg font-bold text-foreground">
                  ${account.totalEarnings.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-muted">This Month</Text>
                <Text className="text-lg font-bold text-primary">$0.00</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Last Payout</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {account.lastPayout || "No payouts yet"}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              <Pressable
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    backgroundColor: colors.primary,
                  },
                ]}
                className="w-full py-3 rounded-lg items-center justify-center"
              >
                <Text className="text-white font-bold">View Payout History</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                className="w-full py-3 rounded-lg items-center justify-center"
              >
                <Text className="text-foreground font-bold">Manage Account</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
