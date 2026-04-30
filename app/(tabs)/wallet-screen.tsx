/**
 * WALLET Screen - Monetization Hub
 * Total Earnings, 1k subscriber progress bar, Cash Out button, transactions ledger
 */

import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";

interface Transaction {
  id: string;
  type: "gift" | "casting" | "payout" | "topup";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "gift",
    description: "Platinum Record Gift",
    amount: 50,
    date: "Today",
    status: "completed",
  },
  {
    id: "2",
    type: "casting",
    description: "Casting Fee - Luna Starz",
    amount: 150,
    date: "Yesterday",
    status: "completed",
  },
  {
    id: "3",
    type: "payout",
    description: "Stripe Payout",
    amount: -2400,
    date: "2 days ago",
    status: "completed",
  },
  {
    id: "4",
    type: "topup",
    description: "Starz Token Top-Up (100 tokens)",
    amount: -49.99,
    date: "3 days ago",
    status: "completed",
  },
];

export default function WalletScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("wallet");

  const totalEarnings = 3847.50;
  const currentSubscribers = 847;
  const subscriberProgress = (currentSubscribers / 1000) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Total Earnings Card */}
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 16,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 20,
            borderWidth: 2,
            borderColor: colors.accent1,
            shadowColor: colors.accent1,
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
            TOTAL EARNINGS
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: colors.accent1,
              marginBottom: 4,
            }}
          >
            ${totalEarnings.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>
            Available for withdrawal
          </Text>
        </View>

        {/* 1k Subscriber Progress */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground }}>
                🎯 MONETIZATION PROGRESS
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: colors.accent2,
                }}
              >
                {currentSubscribers} / 1,000
              </Text>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                width: "100%",
                height: 12,
                backgroundColor: colors.background,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: `${subscriberProgress}%`,
                  height: "100%",
                  backgroundColor: colors.accent2,
                  borderRadius: 6,
                }}
              />
            </View>

            {/* Progress Text */}
            <Text style={{ fontSize: 11, color: colors.muted }}>
              {subscriberProgress.toFixed(1)}% to unlock casting fees
            </Text>

            {/* Unlock Info */}
            {subscriberProgress < 100 ? (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 10, color: colors.muted }}>
                  📌 Reach 1,000 subscribers to charge casting fees and unlock Elite status
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.success,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  backgroundColor: `${colors.success}20`,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.success }}>
                  ✅ Congratulations! You've unlocked casting fees!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Cash Out Button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Pressable
            style={{
              width: "100%",
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.primary,
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.background }}>
              💳 CASH OUT VIA STRIPE
            </Text>
          </Pressable>
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            📊 RECENT TRANSACTIONS
          </Text>

          <FlatList
            scrollEnabled={false}
            data={TRANSACTIONS}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                {/* Left Side - Type & Description */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: colors.foreground,
                      marginBottom: 2,
                    }}
                  >
                    {item.type === "gift"
                      ? "🎁 Gift Received"
                      : item.type === "casting"
                      ? "🎬 Casting Fee"
                      : item.type === "payout"
                      ? "💸 Payout"
                      : "⭐ Token Top-Up"}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>
                    {item.description}
                  </Text>
                  <Text style={{ fontSize: 9, color: colors.muted, marginTop: 2 }}>
                    {item.date}
                  </Text>
                </View>

                {/* Right Side - Amount & Status */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color:
                        item.amount > 0
                          ? colors.success
                          : item.amount < 0
                          ? colors.muted
                          : colors.foreground,
                      marginBottom: 4,
                    }}
                  >
                    {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor:
                        item.status === "completed"
                          ? `${colors.success}20`
                          : item.status === "pending"
                          ? `${colors.warning}20`
                          : `${colors.error}20`,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: "bold",
                        color:
                          item.status === "completed"
                            ? colors.success
                            : item.status === "pending"
                            ? colors.warning
                            : colors.error,
                      }}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
