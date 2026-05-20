import { ScrollView, View, Text, Pressable, Dimensions } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/language-provider';

const { width: screenWidth } = Dimensions.get('window');

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
}

interface ChartData {
  label: string;
  value: number;
}

export default function AnalyticsScreen() {
  const translate = useTranslation();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Mock analytics data
  const stats: StatCard[] = [
    {
      label: 'Total Views',
      value: '142.8K',
      icon: '👁️',
      color: '#00d4ff',
      trend: '+12.5%',
    },
    {
      label: 'Engagement Rate',
      value: '8.4%',
      icon: '💬',
      color: '#ff1493',
      trend: '+2.1%',
    },
    {
      label: 'Followers',
      value: '2,840',
      icon: '👥',
      color: '#ffd700',
      trend: '+145',
    },
    {
      label: 'Total Earnings',
      value: '$1,240',
      icon: '💰',
      color: '#00ff00',
      trend: '+$340',
    },
  ];

  const weeklyData: ChartData[] = [
    { label: 'Mon', value: 2400 },
    { label: 'Tue', value: 1398 },
    { label: 'Wed', value: 9800 },
    { label: 'Thu', value: 3908 },
    { label: 'Fri', value: 4800 },
    { label: 'Sat', value: 3800 },
    { label: 'Sun', value: 4300 },
  ];

  const maxValue = Math.max(...weeklyData.map((d) => d.value));

  return (
    <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-black">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="mt-6 mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Analytics</Text>
          <Text className="text-muted text-sm">Track your performance & earnings</Text>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row gap-3 mb-6">
          {(['day', 'week', 'month'] as const).map((range) => (
            <Pressable
              key={range}
              onPress={() => setTimeRange(range)}
              className={`flex-1 py-2 px-3 rounded-lg ${
                timeRange === range
                  ? 'bg-primary'
                  : 'bg-surface border border-border'
              }`}
            >
              <Text
                className={`text-center font-semibold text-sm ${
                  timeRange === range ? 'text-background' : 'text-foreground'
                }`}
              >
                {range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Grid */}
        <View className="gap-3 mb-6">
          {stats.map((stat, idx) => (
            <LinearGradient
              key={idx}
              colors={[`${stat.color}20`, `${stat.color}05`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-lg p-4 border border-border"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-muted text-sm mb-1">{stat.label}</Text>
                  <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl mb-1">{stat.icon}</Text>
                  {stat.trend && (
                    <Text className="text-success text-xs font-semibold">{stat.trend}</Text>
                  )}
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Chart */}
        <View className="bg-surface rounded-lg p-4 border border-border mb-6">
          <Text className="text-foreground font-semibold mb-4">Views This Week</Text>

          {/* Simple bar chart */}
          <View className="flex-row items-flex-end justify-between h-32 gap-2">
            {weeklyData.map((data, idx) => (
              <View key={idx} className="flex-1 items-center gap-2">
                <View
                  className="w-full bg-gradient-to-t rounded-t-lg"
                  style={{
                    height: (data.value / maxValue) * 120,
                    backgroundColor: `hsl(${idx * 50}, 100%, 50%)`,
                  }}
                />
                <Text className="text-muted text-xs">{data.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Videos */}
        <View className="mb-6">
          <Text className="text-foreground font-semibold mb-3">Top Performing Videos</Text>
          {[
            { title: 'Dragon Phoenix Remix', views: '142.8K', likes: '12.4K' },
            { title: 'Sacred Drums x Lo-fi', views: '89.2K', likes: '8.1K' },
            { title: 'Neon Nights Edit', views: '56.4K', likes: '5.2K' },
          ].map((video, idx) => (
            <View key={idx} className="bg-surface rounded-lg p-3 mb-2 border border-border">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-sm">{video.title}</Text>
                  <View className="flex-row gap-4 mt-1">
                    <Text className="text-muted text-xs">👁️ {video.views}</Text>
                    <Text className="text-muted text-xs">❤️ {video.likes}</Text>
                  </View>
                </View>
                <Text className="text-primary text-lg">→</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Earnings Breakdown */}
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-foreground font-semibold mb-3">Earnings Breakdown</Text>
          {[
            { source: 'Video Views', amount: '$640', percentage: 52 },
            { source: 'Casting Bookings', amount: '$400', percentage: 32 },
            { source: 'Affiliate Revenue', amount: '$200', percentage: 16 },
          ].map((item, idx) => (
            <View key={idx} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-muted text-sm">{item.source}</Text>
                <Text className="text-foreground font-semibold text-sm">{item.amount}</Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
