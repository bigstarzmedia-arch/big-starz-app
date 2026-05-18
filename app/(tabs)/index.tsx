import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useTranslation } from '@/lib/language-provider';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const COLUMN_WIDTH = (screenWidth - 32) / 2;

interface Video {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  duration: string;
  likes: number;
  genre: string;
  badge: 'wrench' | 'crown' | 'diamond';
  trending?: boolean;
}

// Mock video data with real thumbnails
const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Dragon Phoenix Remix',
    creator: 'Mei Ling',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop',
    duration: '0:47',
    likes: 142800,
    genre: 'Electronic',
    badge: 'wrench',
    trending: true,
  },
  {
    id: '2',
    title: 'Sacred Drums x Lo-fi',
    creator: 'Alex Chen',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop',
    duration: '1:03',
    likes: 89200,
    genre: 'Fusion',
    badge: 'diamond',
  },
  {
    id: '3',
    title: 'Neon Nights',
    creator: 'Luna Park',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=500&fit=crop',
    duration: '2:15',
    likes: 156400,
    genre: 'Synthwave',
    badge: 'crown',
  },
  {
    id: '4',
    title: 'Cosmic Journey',
    creator: 'Nova Star',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=500&fit=crop',
    duration: '1:32',
    likes: 98700,
    genre: 'Ambient',
    badge: 'wrench',
  },
  {
    id: '5',
    title: 'Electric Dreams',
    creator: 'Pixel Art',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=500&fit=crop',
    duration: '0:58',
    likes: 124500,
    genre: 'Electronic',
    badge: 'diamond',
  },
  {
    id: '6',
    title: 'Jazz Fusion',
    creator: 'Blue Note',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop',
    duration: '1:45',
    likes: 76300,
    genre: 'Jazz',
    badge: 'crown',
  },
];

const CATEGORIES = ['For You', 'Music', 'Live', 'Fashion', 'AI Picks'];

const getBadgeEmoji = (badge: string) => {
  switch (badge) {
    case 'wrench':
      return '🔧';
    case 'crown':
      return '👑';
    case 'diamond':
      return '💎';
    default:
      return '';
  }
};

function VideoCard({ video }: { video: Video }) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={{ width: COLUMN_WIDTH }}>
      <View className="bg-slate-900 rounded-2xl overflow-hidden mb-4">
        {/* Thumbnail */}
        <View className="relative">
          <Image
            source={{ uri: video.thumbnail }}
            style={{ width: '100%', height: 300 }}
            resizeMode="cover"
          />

          {/* Badge - Top Left */}
          <View className="absolute top-3 left-3 w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
            <Text className="text-lg">{getBadgeEmoji(video.badge)}</Text>
          </View>

          {/* Badge - Top Right */}
          <View className="absolute top-3 right-3 w-10 h-10 bg-cyan-500 rounded-full items-center justify-center">
            <Text className="text-lg">💎</Text>
          </View>

          {/* Duration - Bottom Left */}
          <View className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded">
            <Text className="text-white text-xs font-bold">{video.duration}</Text>
          </View>

          {/* Play Button - Bottom Center */}
          <View className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-xs">▶</Text>
          </View>
        </View>

        {/* Info */}
        <View className="p-3">
          <Text className="text-white font-bold text-sm mb-1">{video.title}</Text>
          <Text className="text-gray-400 text-xs mb-2">{video.creator}</Text>

          {/* Stats */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Text className="text-pink-500">❤️</Text>
              <Text className="text-gray-300 text-xs">
                {video.likes > 1000000
                  ? (video.likes / 1000000).toFixed(1) + 'M'
                  : (video.likes / 1000).toFixed(1) + 'K'}
              </Text>
            </View>
            <Text className="text-yellow-500 text-lg">🎁</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const t = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('For You');

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-pink-500 font-black text-2xl">BIG STARZ</Text>
            <Text className="text-yellow-400 font-black text-sm -mt-1">MEDIA</Text>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Stars & Count */}
            <View className="bg-yellow-900/50 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Text className="text-yellow-400 text-lg">⭐</Text>
              <Text className="text-yellow-400 font-bold text-sm">2,840</Text>
            </View>

            {/* Pro Badge */}
            <View className="border-2 border-cyan-500 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Text className="text-cyan-500 text-sm">💎</Text>
              <Text className="text-cyan-500 font-bold text-xs">PRO</Text>
            </View>

            {/* Search */}
            <TouchableOpacity>
              <Text className="text-2xl">🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border-2 ${
                selectedCategory === category
                  ? 'bg-pink-500 border-pink-500'
                  : 'bg-transparent border-slate-700'
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  selectedCategory === category ? 'text-white' : 'text-slate-400'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Badge */}
        <View className="px-4 mb-4">
          <View className="border-2 border-pink-500 bg-pink-500/10 px-4 py-2 rounded-full w-fit flex-row items-center gap-2">
            <Text className="text-lg">🔥</Text>
            <Text className="text-pink-500 font-bold text-sm">TRENDING NOW</Text>
          </View>
        </View>

        {/* Video Grid */}
        <View className="px-4 pb-20">
          <FlatList
            data={VIDEOS}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => <VideoCard video={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
