import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from './screen-container';

interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  earnings: number;
  engagementRate: number;
}

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const mockData: Record<'daily' | 'weekly' | 'monthly', AnalyticsData> = {
    daily: {
      views: 2450,
      likes: 342,
      comments: 89,
      shares: 156,
      earnings: 24.5,
      engagementRate: 18.2,
    },
    weekly: {
      views: 18900,
      likes: 2856,
      comments: 742,
      shares: 1203,
      earnings: 189.0,
      engagementRate: 19.4,
    },
    monthly: {
      views: 87650,
      likes: 12450,
      comments: 3210,
      shares: 5680,
      earnings: 876.5,
      engagementRate: 17.8,
    },
  };

  const data = mockData[timeRange];

  const stats = [
    { label: 'Views', value: data.views.toLocaleString(), icon: '👁️', color: 'text-blue-500' },
    { label: 'Likes', value: data.likes.toLocaleString(), icon: '❤️', color: 'text-red-500' },
    { label: 'Comments', value: data.comments.toLocaleString(), icon: '💬', color: 'text-green-500' },
    { label: 'Shares', value: data.shares.toLocaleString(), icon: '↗️', color: 'text-purple-500' },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">📊 Analytics</Text>
          <Text className="text-muted">Track your creator performance</Text>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row gap-3 mb-6">
          {(['daily', 'weekly', 'monthly'] as const).map(range => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              className={`flex-1 py-3 rounded-lg border-2 ${
                timeRange === range
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
            >
              <Text
                className={`text-center font-bold capitalize ${
                  timeRange === range ? 'text-background' : 'text-foreground'
                }`}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Stats Grid */}
        <View className="gap-4 mb-6">
          {stats.map((stat, idx) => (
            <View
              key={idx}
              className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-3xl">{stat.icon}</Text>
                <View>
                  <Text className="text-muted text-sm">{stat.label}</Text>
                  <Text className="text-foreground text-2xl font-bold">
                    {stat.value}
                  </Text>
                </View>
              </View>
              <View className="bg-primary/10 rounded-lg px-3 py-1">
                <Text className="text-primary text-xs font-bold">↑ 12%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Earnings Section */}
        <View className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary rounded-lg p-6 mb-6">
          <Text className="text-muted text-sm mb-2">💰 Total Earnings</Text>
          <Text className="text-4xl font-bold text-primary mb-4">
            ${data.earnings.toFixed(2)}
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-muted text-xs mb-1">Platform Fee (10%)</Text>
              <Text className="text-foreground font-bold">
                ${(data.earnings * 0.1).toFixed(2)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-muted text-xs mb-1">Your Earnings (90%)</Text>
              <Text className="text-primary font-bold">
                ${(data.earnings * 0.9).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Engagement Rate */}
        <View className="bg-surface border border-border rounded-lg p-4 mb-6">
          <Text className="text-foreground font-bold mb-3">📈 Engagement Rate</Text>
          <View className="flex-row items-end gap-2 h-24 mb-4">
            {[65, 78, 82, 71, 88, 92, 85].map((height, idx) => (
              <View
                key={idx}
                className="flex-1 bg-primary rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </View>
          <Text className="text-center text-primary font-bold text-lg">
            {data.engagementRate}%
          </Text>
        </View>

        {/* Top Performing Videos */}
        <View className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-3">🎬 Top Videos</Text>
          <View className="gap-3">
            {[
              { title: 'Dance Challenge', views: 12500, likes: 1850 },
              { title: 'AI Music Video', views: 9800, likes: 1420 },
              { title: 'Lip Sync Trend', views: 7650, likes: 980 },
            ].map((video, idx) => (
              <View
                key={idx}
                className="bg-surface border border-border rounded-lg p-4"
              >
                <Text className="text-foreground font-bold mb-2">{video.title}</Text>
                <View className="flex-row justify-between">
                  <Text className="text-muted text-sm">
                    👁️ {video.views.toLocaleString()} views
                  </Text>
                  <Text className="text-primary text-sm">
                    ❤️ {video.likes.toLocaleString()} likes
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Earnings by Tier */}
        <View className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-3">💎 Earnings by Tier</Text>
          <View className="gap-2">
            {[
              { tier: 'Free Tier', amount: 12.5, percentage: 1.4 },
              { tier: 'Budget Tier', amount: 145.8, percentage: 16.6 },
              { tier: 'Pro Tier', amount: 562.3, percentage: 64.1 },
              { tier: 'Elite Tier', amount: 155.9, percentage: 17.8 },
            ].map((item, idx) => (
              <View key={idx} className="flex-row items-center gap-3">
                <View className="flex-1">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-muted text-sm">{item.tier}</Text>
                    <Text className="text-foreground font-bold">
                      ${item.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="bg-surface rounded-full h-2 overflow-hidden">
                    <View
                      className="bg-primary h-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
