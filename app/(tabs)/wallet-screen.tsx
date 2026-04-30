/**
 * WALLET Screen - Creator Earnings Dashboard
 * TikTok-style monetization hub with Big Starz dark theme
 * Total Earnings, 1k subscriber progress, transactions, cash out
 */

import { ScrollView, View, Text, Pressable, FlatList, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

interface Transaction {
  id: string;
  type: "gift" | "casting" | "payout" | "topup" | "music";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const TRANSACTIONS: Transaction[] = [
  { id: "1", type: "gift", description: "Platinum Record Gift from @NeonDreams", amount: 50, date: "2 min ago", status: "completed" },
  { id: "2", type: "casting", description: "Casting Fee - Gucci Campaign", amount: 150, date: "1 hour ago", status: "completed" },
  { id: "3", type: "music", description: "Music Stream Revenue", amount: 23.50, date: "3 hours ago", status: "completed" },
  { id: "4", type: "gift", description: "Diamond Star Gift from @CyberVibe", amount: 100, date: "Yesterday", status: "completed" },
  { id: "5", type: "payout", description: "Stripe Payout to Bank", amount: -2400, date: "2 days ago", status: "completed" },
  { id: "6", type: "topup", description: "Starz Token Purchase (100 tokens)", amount: -49.99, date: "3 days ago", status: "pending" },
  { id: "7", type: "casting", description: "Casting Fee - Nike Collab", amount: 300, date: "4 days ago", status: "completed" },
  { id: "8", type: "music", description: "Beat License Sale", amount: 75, date: "5 days ago", status: "completed" },
];

const QUICK_STATS = [
  { label: "This Week", value: "$847.50", color: "#00FF00" },
  { label: "This Month", value: "$3,247", color: "#FF007F" },
  { label: "Pending", value: "$150", color: "#FFD700" },
];

export default function WalletScreen() {
  const totalEarnings = 12847.50;
  const currentSubscribers = 847;
  const subscriberGoal = 1000;
  const subscriberProgress = (currentSubscribers / subscriberGoal) * 100;

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "gift": return "\u{1F381}";
      case "casting": return "\u{1F3AC}";
      case "payout": return "\u{1F4B8}";
      case "topup": return "\u2B50";
      case "music": return "\u{1F3B5}";
    }
  };

  const getTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "gift": return "Gift Received";
      case "casting": return "Casting Fee";
      case "payout": return "Payout";
      case "topup": return "Token Purchase";
      case "music": return "Music Revenue";
    }
  };

  const handleCashOut = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header */}
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 0, 127, 0.2)",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#FFFFFF", letterSpacing: 2 }}>
            WALLET
          </Text>
          <Text style={{ fontSize: 11, color: "#FF007F", marginTop: 2, letterSpacing: 1 }}>
            CREATOR EARNINGS
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Earnings Card */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(255, 0, 127, 0.3)",
              shadowColor: "#FF007F",
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#888888", letterSpacing: 1 }}>TOTAL EARNINGS</Text>
              <Image source={{ uri: LOGO_URL }} style={{ width: 28, height: 28 }} resizeMode="contain" />
            </View>
            <Text style={{ fontSize: 42, fontWeight: "900", color: "#FFFFFF", marginTop: 8 }}>
              ${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={{ fontSize: 12, color: "#00FF00", marginTop: 4 }}>
              {"\u2191"} +$847.50 this week
            </Text>

            {/* Quick Stats */}
            <View style={{ flexDirection: "row", marginTop: 20, gap: 12 }}>
              {QUICK_STATS.map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: 12,
                    padding: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#888888", marginBottom: 4 }}>{stat.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: stat.color }}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 1k Subscriber Progress */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(157, 0, 255, 0.3)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1 }}>
                {"\u{1F3AF}"} MONETIZATION GATE
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#9D00FF" }}>
                {currentSubscribers.toLocaleString()} / {subscriberGoal.toLocaleString()}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={{ height: 8, backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: 4, overflow: "hidden" }}>
              <View
                style={{
                  width: `${subscriberProgress}%`,
                  height: "100%",
                  backgroundColor: "#9D00FF",
                  borderRadius: 4,
                }}
              />
            </View>

            <Text style={{ fontSize: 11, color: "#888888", marginTop: 8 }}>
              {subscriberProgress < 100
                ? `${Math.ceil(subscriberGoal - currentSubscribers)} more subscribers to unlock casting fees`
                : "Casting fees unlocked!"}
            </Text>
          </View>

          {/* Cash Out Button */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Pressable
              onPress={handleCashOut}
              style={({ pressed }) => ({
                backgroundColor: "#FF007F",
                paddingVertical: 16,
                borderRadius: 30,
                alignItems: "center",
                shadowColor: "#FF007F",
                shadowOpacity: 0.6,
                shadowRadius: 14,
                elevation: 8,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
                {"\u{1F4B3}"} CASH OUT VIA STRIPE
              </Text>
            </Pressable>
          </View>

          {/* Recent Transactions */}
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", marginBottom: 14, letterSpacing: 1 }}>
              RECENT ACTIVITY
            </Text>

            {TRANSACTIONS.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(51, 51, 51, 0.5)",
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(26, 26, 26, 0.8)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{getTypeIcon(item.type)}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFFFFF", marginBottom: 2 }}>
                    {getTypeLabel(item.type)}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#888888" }} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#555555", marginTop: 2 }}>{item.date}</Text>
                </View>

                {/* Amount */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: item.amount > 0 ? "#00FF00" : "#888888",
                    }}
                  >
                    {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
                  </Text>
                  <View
                    style={{
                      marginTop: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor:
                        item.status === "completed"
                          ? "rgba(0, 255, 0, 0.1)"
                          : item.status === "pending"
                          ? "rgba(255, 215, 0, 0.1)"
                          : "rgba(255, 0, 0, 0.1)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "600",
                        color:
                          item.status === "completed"
                            ? "#00FF00"
                            : item.status === "pending"
                            ? "#FFD700"
                            : "#FF4444",
                      }}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
