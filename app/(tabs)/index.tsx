import { View, Text, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useRef, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/language-provider';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface Video {
  id: string;
  creator: string;
  title: string;
  videoUri: string;
  thumbnail: string;
  likes: number;
  comments: number;
  liked: boolean;
}

// Real Sora videos from CDN
const VIDEOS: Video[] = [
  {
    id: '1',
    creator: '@NeonVex',
    title: 'AI Music Video - Cyberpunk',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/uVFjRxyGEvVYafOu.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=1000&fit=crop',
    likes: 8400,
    comments: 342,
    liked: false,
  },
  {
    id: '2',
    creator: '@CosmicVibe',
    title: 'Face Clone Collab',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/ZIHqcEAjIsUDSuBR.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=1000&fit=crop',
    likes: 5200,
    comments: 218,
    liked: false,
  },
  {
    id: '3',
    creator: '@GlitchQueen',
    title: 'Sora Generated - Fashion',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/hMlOhQFwMbKZrZpM.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=1000&fit=crop',
    likes: 12100,
    comments: 567,
    liked: false,
  },
  {
    id: '4',
    creator: '@SonicDreams',
    title: 'AI Studio Creation',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/OzQsvSebycxKzkTE.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=1000&fit=crop',
    likes: 7800,
    comments: 294,
    liked: false,
  },
  {
    id: '5',
    creator: '@PixelArtist',
    title: 'Neon Aesthetic',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/MltsfIVvclVFQrND.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=1000&fit=crop',
    likes: 9300,
    comments: 421,
    liked: false,
  },
  {
    id: '6',
    creator: '@LuxeBeats',
    title: 'Premium Music Video',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/rltHzsiGkGPADNsM.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=1000&fit=crop',
    likes: 6500,
    comments: 189,
    liked: false,
  },
  {
    id: '7',
    creator: '@SynthWave',
    title: 'Retro Future Vibes',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/pAjQvfVEKvfEjKvZ.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=1000&fit=crop',
    likes: 11200,
    comments: 489,
    liked: false,
  },
  {
    id: '8',
    creator: '@DigitalDream',
    title: 'AI Collaboration',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/YqKvnLwZvOqLrKvZ.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=1000&fit=crop',
    likes: 7900,
    comments: 356,
    liked: false,
  },
];

// Separate component for video item to avoid hook issues
function VideoItem({
  item,
  index,
  onLike,
  onShare,
  liked,
}: {
  item: Video;
  index: number;
  onLike: (index: number) => void;
  onShare: () => void;
  liked: boolean;
}) {
  const player = useVideoPlayer(item.videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={{ height: screenHeight, width: screenWidth }} className="bg-black">
      {/* Video Background */}
      <VideoView
        style={{ flex: 1 }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300 }}
      />

      {/* Creator Info - Bottom Left */}
      <View style={{ position: 'absolute', bottom: 100, left: 16, zIndex: 10 }}>
        <View className="flex-row items-center gap-3 mb-3">
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#EC4899' }}
          />
          <View>
            <Text className="text-white font-bold text-base">{item.creator}</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-pink-500 font-bold text-xs">★ Big Starz</Text>
            </View>
          </View>
        </View>
        <Text className="text-white font-semibold text-lg max-w-xs">{item.title}</Text>
      </View>

      {/* Engagement Buttons - Right Side */}
      <View style={{ position: 'absolute', bottom: 120, right: 16, zIndex: 10 }} className="gap-6">
        {/* Like Button */}
        <TouchableOpacity
          onPress={() => onLike(index)}
          style={{ alignItems: 'center' }}
          activeOpacity={0.7}
        >
          <View
            className={`w-14 h-14 rounded-full items-center justify-center ${
              liked ? 'bg-pink-500' : 'bg-white/20'
            }`}
          >
            <Text className="text-2xl">{liked ? '❤️' : '🤍'}</Text>
          </View>
          <Text className={`text-xs font-bold mt-1 ${liked ? 'text-pink-500' : 'text-white'}`}>
            {(item.likes / 1000).toFixed(1)}K
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.7}>
          <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
            <Text className="text-2xl">💬</Text>
          </View>
          <Text className="text-xs font-bold text-white mt-1">
            {(item.comments / 1000).toFixed(1)}K
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity onPress={onShare} style={{ alignItems: 'center' }} activeOpacity={0.7}>
          <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
            <Text className="text-2xl">🔗</Text>
          </View>
          <Text className="text-xs font-bold text-white mt-1">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const t = useTranslation();
  const [videos, setVideos] = useState(VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleLike = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newVideos = [...videos];
    newVideos[index].liked = !newVideos[index].liked;
    newVideos[index].likes += newVideos[index].liked ? 1 : -1;
    setVideos(newVideos);
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const renderVideo = ({ item, index }: { item: Video; index: number }) => (
    <VideoItem
      item={item}
      index={index}
      onLike={handleLike}
      onShare={handleShare}
      liked={videos[index].liked}
    />
  );

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        pagingEnabled
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
          setCurrentIndex(index);
        }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
