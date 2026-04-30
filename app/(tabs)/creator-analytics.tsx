/**
 * Creator Analytics Dashboard
 * Shows gift earnings breakdown, referral performance, and watermark removal impact
 */

import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

interface EarningsData {
  source: string;
  amount: number;
  percentage: number;
  icon: string;
}

interface ReferralData {
  platform: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  earnings: number;
}

const EARNINGS_DATA: EarningsData[] = [
  { source: "Platinum Records", amount: 1250, percentage: 45, icon: "💿" },
  { source: "Neon Stars", amount: 680, percentage: 24, icon: "⭐" },
  { source: "Diamond Gifts", amount: 420, percentage: 15, icon: "💎" },
  { source: "Other Gifts", amount: 350, percentage: 16, icon: "🎁" },
];

const REFERRAL_DATA: ReferralData[] = [
  { platform: "TikTok", clicks: 2847, conversions: 127, conversionRate: 4.5, earnings: 381 },
  { platform: "Instagram", clicks: 1923, conversions: 89, conversionRate: 4.6, earnings: 267 },
  { platform: "X (Twitter)", clicks: 1456, conversions: 52, conversionRate: 3.6, earnings: 156 },
  { platform: "Facebook", clicks: 892, conversions: 31, conversionRate: 3.5, earnings: 93 },
];

export default function CreatorAnalyticsScreen() {
  const [selectedTab, setSelectedTab] = useState<"earnings" | "referrals" | "watermark">("earnings");

  const totalEarnings = EARNINGS_DATA.reduce((sum, item) => sum + item.amount, 0);
  const totalReferralEarnings = REFERRAL_DATA.reduce((sum, item) => sum + item.earnings, 0);

  return (
    <ScreenContainer className="bg-black">
      <ScrollView className="flex-1 bg-black">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800">
          <Text className="text-3xl font-bold text-white">Analytics</Text>
          <Text className="text-xs text-gray-400 mt-1">Your Creator Dashboard</Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row px-4 py-4 border-b border-gray-800 gap-2">
          {(["earnings", "referrals", "watermark"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: selectedTab === tab ? "#FF007F" : "rgba(255, 0, 127, 0.1)",
                borderWidth: selectedTab === tab ? 0 : 1,
                borderColor: "#FF007F",
              }}
            >
              <Text className={selectedTab === tab ? "text-white font-bold text-sm" : "text-pink-400 text-sm"}>
                {tab === "earnings" && "💰 Earnings"}
                {tab === "referrals" && "🔗 Referrals"}
                {tab === "watermark" && "🎬 Watermark"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Earnings Tab */}
        {selectedTab === "earnings" && (
          <>
            {/* Total Earnings Card */}
            <View className="px-4 py-6">
              <View
                style={{
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                  borderWidth: 1,
                  borderColor: "#D4AF37",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <Text className="text-sm text-gray-400 mb-2">TOTAL GIFT EARNINGS</Text>
                <Text className="text-4xl font-bold text-white mb-1">${totalEarnings.toLocaleString()}</Text>
                <Text className="text-xs text-gray-400">This month</Text>
              </View>
            </View>

            {/* Earnings Breakdown */}
            <View className="px-4 py-4 border-t border-gray-800">
              <Text className="text-lg font-bold text-white mb-4">Breakdown by Gift Type</Text>

              {EARNINGS_DATA.map((item, idx) => (
                <View key={idx} className="mb-4">
                  <View className="flex-row justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-2">{item.icon}</Text>
                      <View>
                        <Text className="text-white font-semibold">{item.source}</Text>
                        <Text className="text-xs text-gray-400">{item.percentage}% of total</Text>
                      </View>
                    </View>
                    <Text className="text-pink-500 font-bold">${item.amount}</Text>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <View
                      style={{
                        height: "100%",
                        width: `${item.percentage}%`,
                        backgroundColor: "#FF007F",
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Payout Info */}
            <View className="px-4 py-4 border-t border-gray-800 mb-6">
              <Text className="text-lg font-bold text-white mb-3">Payout History</Text>
              <View className="bg-gray-900 rounded-xl p-4">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-400">Last Payout</Text>
                  <Text className="text-white font-semibold">$1,250 • Apr 28</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-400">Next Payout</Text>
                  <Text className="text-white font-semibold">May 5</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-400">Stripe Account</Text>
                  <Text className="text-green-400 font-semibold">Connected ✓</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Referrals Tab */}
        {selectedTab === "referrals" && (
          <>
            {/* Total Referral Earnings */}
            <View className="px-4 py-6">
              <View
                style={{
                  backgroundColor: "rgba(0, 128, 255, 0.1)",
                  borderWidth: 1,
                  borderColor: "#0080FF",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <Text className="text-sm text-gray-400 mb-2">REFERRAL EARNINGS THIS MONTH</Text>
                <Text className="text-4xl font-bold text-white mb-1">${totalReferralEarnings.toLocaleString()}</Text>
                <Text className="text-xs text-gray-400">10% commission on each signup</Text>
              </View>
            </View>

            {/* Platform Performance */}
            <View className="px-4 py-4 border-t border-gray-800">
              <Text className="text-lg font-bold text-white mb-4">Performance by Platform</Text>

              {REFERRAL_DATA.map((item, idx) => (
                <View key={idx} className="bg-gray-900 rounded-xl p-4 mb-3">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-white font-semibold">{item.platform}</Text>
                    <Text className="text-green-400 font-bold">${item.earnings}</Text>
                  </View>

                  <View className="flex-row justify-between text-xs text-gray-400 mb-2">
                    <Text>{item.clicks.toLocaleString()} clicks</Text>
                    <Text>{item.conversions} conversions</Text>
                    <Text>{item.conversionRate}% rate</Text>
                  </View>

                  {/* Conversion Progress */}
                  <View className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <View
                      style={{
                        height: "100%",
                        width: `${Math.min(item.conversionRate * 10, 100)}%`,
                        backgroundColor: "#0080FF",
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Copy Referral Link */}
            <View className="px-4 py-4 border-t border-gray-800 mb-6">
              <Pressable
                style={{
                  backgroundColor: "rgba(0, 128, 255, 0.2)",
                  borderWidth: 1,
                  borderColor: "#0080FF",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  alignItems: "center",
                }}
              >
                <Text className="text-blue-400 font-semibold">📋 Copy Your Referral Link</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Watermark Tab */}
        {selectedTab === "watermark" && (
          <>
            {/* Watermark Impact */}
            <View className="px-4 py-6">
              <View
                style={{
                  backgroundColor: "rgba(157, 0, 255, 0.1)",
                  borderWidth: 1,
                  borderColor: "#9D00FF",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <Text className="text-sm text-gray-400 mb-2">WATERMARK STATUS</Text>
                <Text className="text-2xl font-bold text-white mb-1">Premium Member</Text>
                <Text className="text-xs text-green-400">✓ Watermark Removed</Text>
              </View>
            </View>

            {/* Watermark Info */}
            <View className="px-4 py-4 border-t border-gray-800">
              <Text className="text-lg font-bold text-white mb-4">Watermark Impact Analysis</Text>

              <View className="bg-gray-900 rounded-xl p-4 mb-4">
                <View className="flex-row items-start mb-4">
                  <Text className="text-2xl mr-3">📊</Text>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">Free Users</Text>
                    <Text className="text-sm text-gray-400">Videos include Big Starz Media watermark</Text>
                    <Text className="text-xs text-pink-400 mt-2">Impact: -12% average engagement</Text>
                  </View>
                </View>
              </View>

              <View className="bg-gray-900 rounded-xl p-4 mb-4">
                <View className="flex-row items-start mb-4">
                  <Text className="text-2xl mr-3">⭐</Text>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">Premium Members ($30/mo)</Text>
                    <Text className="text-sm text-gray-400">Watermark automatically removed</Text>
                    <Text className="text-xs text-green-400 mt-2">Impact: +18% average engagement</Text>
                  </View>
                </View>
              </View>

              <View className="bg-gray-900 rounded-xl p-4">
                <View className="flex-row items-start mb-4">
                  <Text className="text-2xl mr-3">👑</Text>
                  <View className="flex-1">
                    <Text className="text-white font-semibold mb-1">Elite Members ($5k earnings)</Text>
                    <Text className="text-sm text-gray-400">Watermark removed + priority placement</Text>
                    <Text className="text-xs text-yellow-400 mt-2">Impact: +35% average engagement</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Upgrade CTA */}
            <View className="px-4 py-4 border-t border-gray-800 mb-6">
              <Pressable
                style={{
                  backgroundColor: "#FF007F",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text className="text-white font-bold">Upgrade to Premium - Remove Watermark</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
