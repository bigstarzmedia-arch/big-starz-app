import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

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
    creator: '@VibeCreator',
    title: 'Cinematic Sora',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/PBfKKJcaqYcqUCnE.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=1000&fit=crop',
    likes: 11200,
    comments: 512,
    liked: false,
  },
  {
    id: '8',
    creator: '@StudioPro',
    title: 'AI Generated Masterpiece',
    videoUri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/VViCazzzkvqtaNGb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=1000&fit=crop',
    likes: 14800,
    comments: 723,
    liked: false,
  },
];

export default function VibeScreen() {
  const [videos, setVideos] = useState<Video[]>(VIDEOS);
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
          : v
      )
    );
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderVideo = ({ item }: { item: Video }) => (
    <VideoCard video={item} onToggleLike={toggleLike} />
  );

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideo}
        pagingEnabled
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight - 80}
        decelerationRate="fast"
      />
    </ScreenContainer>
  );
}

function VideoCard({ video, onToggleLike }: { video: Video; onToggleLike: (id: string) => void }) {
  const player = useVideoPlayer(video.videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={{ width: screenWidth, height: screenHeight - 80, backgroundColor: '#000', position: 'relative' }}>
      {/* Video Player */}
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />



      {/* Dark Overlay */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />

      {/* Creator Info - Bottom Left */}
      <View style={{ position: 'absolute', bottom: 20, left: 16, zIndex: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFF', marginBottom: 4 }}>
          {video.creator}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 8 }}>
          {video.title}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              backgroundColor: '#FF0055',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>Big Starz</Text>
          </View>
          <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>
            ❤️ {(video.likes / 1000).toFixed(1)}K
          </Text>
        </View>
      </View>

      {/* Action Buttons - Right Side */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 100,
          gap: 20,
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Like Button */}
        <TouchableOpacity
          onPress={() => onToggleLike(video.id)}
          style={{ alignItems: 'center', gap: 4 }}
        >
          <Text style={{ fontSize: 32 }}>{video.liked ? '❤️' : '🤍'}</Text>
          <Text style={{ fontSize: 11, color: '#FFF', fontWeight: '600' }}>
            {(video.likes / 1000).toFixed(1)}K
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 32 }}>💬</Text>
          <Text style={{ fontSize: 11, color: '#FFF', fontWeight: '600' }}>
            {(video.comments / 100).toFixed(0)}K
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 32 }}>📤</Text>
          <Text style={{ fontSize: 11, color: '#FFF', fontWeight: '600' }}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
