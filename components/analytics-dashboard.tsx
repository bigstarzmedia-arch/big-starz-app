import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalFollowers: number;
  engagementRate: number;
  earnings: number;
}

interface TopVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
}

interface AnalyticsDashboardProps {
  creatorName: string;
}

const MOCK_ANALYTICS: Record<TimeRange, AnalyticsData> = {
  daily: {
    totalViews: 12400,
    totalLikes: 890,
    totalFollowers: 2450,
    engagementRate: 7.2,
    earnings: 45.50,
  },
  weekly: {
    totalViews: 87300,
    totalLikes: 6200,
    totalFollowers: 2450,
    engagementRate: 7.1,
    earnings: 312.75,
  },
  monthly: {
    totalViews: 345600,
    totalLikes: 24800,
    totalFollowers: 2450,
    engagementRate: 7.0,
    earnings: 1245.30,
  },
};

const TOP_VIDEOS: TopVideo[] = [
  {
    id: '1',
    title: 'AI Music Video - Cyberpunk',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=150&fit=crop',
    views: 45200,
    likes: 3420,
    comments: 280,
    engagement: 8.2,
  },
  {
    id: '2',
    title: 'Face Clone Test',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=150&fit=crop',
    views: 32100,
    likes: 2100,
    comments: 190,
    engagement: 7.1,
  },
  {
    id: '3',
    title: 'Beat Studio Creation',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=150&fit=crop',
    views: 28900,
    likes: 1890,
    comments: 156,
    engagement: 6.8,
  },
];

const TRAFFIC_SOURCES = [
  { source: 'Vibe Feed', percentage: 45, color: '#FF1493' },
  { source: 'Search', percentage: 25, color: '#FFD700' },
  { source: 'Direct', percentage: 15, color: '#00FFFF' },
  { source: 'Hashtags', percentage: 10, color: '#9D4EDD' },
  { source: 'Other', percentage: 5, color: '#666' },
];

export function AnalyticsDashboard({ creatorName }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const analytics = MOCK_ANALYTICS[timeRange];

  const handleTimeRangeChange = (range: TimeRange) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setTimeRange(range);
  };

  const renderStatCard = (icon: string, label: string, value: string, color: string) => (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
        flex: 1,
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text style={{ fontSize: 12, color: '#999', flex: 1 }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color }}>{value}</Text>
    </View>
  );

  const renderTopVideoItem = ({ item }: { item: TopVideo }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
        gap: 12,
      }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: 80,
          height: 120,
          resizeMode: 'cover',
        }}
      />
      <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Text style={{ fontSize: 11, color: '#999' }}>
              👁️ {(item.views / 1000).toFixed(1)}K
            </Text>
            <Text style={{ fontSize: 11, color: '#999' }}>
              ❤️ {(item.likes / 1000).toFixed(1)}K
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: '#FF1493', fontWeight: '600' }}>
            {item.engagement.toFixed(1)}% engagement
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrafficSource = (source: { source: string; percentage: number; color: string }) => (
    <View style={{ marginBottom: 12, gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#fff', fontWeight: '500' }}>
          {source.source}
        </Text>
        <Text style={{ fontSize: 13, color: source.color, fontWeight: '600' }}>
          {source.percentage}%
        </Text>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: '#1A1A1A',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${source.percentage}%`,
            backgroundColor: source.color,
          }}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#000' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ marginBottom: 24, gap: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
          📊 Analytics
        </Text>
        <Text style={{ fontSize: 14, color: '#999' }}>
          Track your performance and earnings
        </Text>
      </View>

      {/* Time Range Selector */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => handleTimeRangeChange(range)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: timeRange === range ? '#FF1493' : '#1A1A1A',
              borderWidth: 1,
              borderColor: timeRange === range ? '#FF1493' : '#333',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: timeRange === range ? '#fff' : '#999',
                textTransform: 'capitalize',
              }}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Metrics */}
      <View style={{ marginBottom: 24, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {renderStatCard('👁️', 'Views', (analytics.totalViews / 1000).toFixed(1) + 'K', '#FF1493')}
          {renderStatCard('❤️', 'Likes', (analytics.totalLikes / 1000).toFixed(1) + 'K', '#FF1493')}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {renderStatCard('👥', 'Followers', (analytics.totalFollowers / 1000).toFixed(1) + 'K', '#FFD700')}
          {renderStatCard('🔥', 'Engagement', analytics.engagementRate.toFixed(1) + '%', '#00FFFF')}
        </View>
      </View>

      {/* Earnings Section */}
      <View
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          borderWidth: 2,
          borderColor: '#FFD700',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFD700' }}>
          💰 Total Earnings
        </Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFD700' }}>
          ${analytics.earnings.toFixed(2)}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#FFD700',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#000' }}>
              Withdraw
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#333',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#555',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Videos */}
      <View style={{ marginBottom: 24, gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
          🎬 Top Performing Videos
        </Text>
        <FlatList
          data={TOP_VIDEOS}
          keyExtractor={(item) => item.id}
          renderItem={renderTopVideoItem}
          scrollEnabled={false}
        />
      </View>

      {/* Traffic Sources */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
          📍 Traffic Sources
        </Text>
        <View
          style={{
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#333',
          }}
        >
          {TRAFFIC_SOURCES.map((source, idx) => (
            <View key={idx}>{renderTrafficSource(source)}</View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
