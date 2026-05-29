import { ScrollView, View, Text, Pressable, Dimensions, FlatList, Image } from 'react-native';
import { useState, useEffect as useEffectHook } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { VideoPlayerModal, type VideoData } from '@/components/video-player-modal';
import { LanguageSelector } from '@/components/language-selector';
import { TopNavigation } from '@/components/top-navigation';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/language-provider';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Vector background images
const VECTOR_BACKGROUNDS = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/vector-bg-studio-1-7ofBMqM2cmK4Wnwqxd5WyJ.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/vector-bg-stage-2-TzLtdKjRjUTSoRVQdYsdPU.webp',
];

interface Video {
  id: string;
  name: string;
  url: string;
  creator?: string;
  title?: string;
  likes?: number;
  comments?: number;
  liked?: boolean;
}

// Mock fallback videos while Google Drive videos load
const FALLBACK_VIDEOS: Video[] = [
  {
    id: '1',
    name: 'AI Music Video - Cyberpunk',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/uVFjRxyGEvVYafOu.mp4',
    creator: '@NeonVex',
    title: 'AI Music Video - Cyberpunk',
    likes: 8400,
    comments: 342,
    liked: false,
  },
  {
    id: '2',
    name: 'Face Clone Collab',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/ZIHqcEAjIsUDSuBR.mp4',
    creator: '@CosmicVibe',
    title: 'Face Clone Collab',
    likes: 5200,
    comments: 218,
    liked: false,
  },
];

function VideoItem({ video, index, onTap }: { video: Video; index: number; onTap: (index: number) => void }) {
  const [likes, setLikes] = useState(video.likes || 0);
  const [liked, setLiked] = useState(video.liked || false);
  const player = useVideoPlayer(video.url);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTap = () => {
    onTap(index);
  };

  return (
    <Pressable onPress={handleTap} style={{ height: screenHeight, width: screenWidth }}>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* Gradient overlay at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%' }}
      />

      {/* Creator info */}
      <View style={{ position: 'absolute', bottom: 80, left: 16 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
          {video.title || video.name}
        </Text>
        <Text style={{ color: '#aaa', fontSize: 14, marginTop: 4 }}>
          {video.creator || 'Big Starz Creator'}
        </Text>
      </View>

      {/* Action buttons on right */}
      <View style={{ position: 'absolute', right: 12, bottom: 100, gap: 12 }}>
        <Pressable
          onPress={handleLike}
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#ff1493',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
            {likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#00d4ff',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>💬</Text>
          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
            {(video.comments || 0) > 999 ? `${((video.comments || 0) / 1000).toFixed(1)}K` : video.comments || 0}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#ffd700',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>🔗</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const translate = useTranslation();
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);

  const handleVideoTap = (index: number) => {
    setSelectedVideoIndex(index);
    setPlayerVisible(true);
  };

  const handleLikeInPlayer = (videoId: string, liked: boolean) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, liked } : v
    ));
  };

  // Fetch Sora videos from Google Drive
  useEffectHook(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/trpc/googleDrive.getSoraVideos');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const formattedVideos: Video[] = data.map((v: any, idx: number) => ({
              id: v.id,
              name: v.name,
              url: v.url,
              creator: `@Creator${idx + 1}`,
              title: v.name.replace('.mp4', ''),
              likes: Math.floor(Math.random() * 10000),
              comments: Math.floor(Math.random() * 1000),
              liked: false,
            }));
            setVideos(formattedVideos);
          }
        }
      } catch (error) {
        console.log('Using fallback videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <>
      <TopNavigation onLanguagePress={() => setLanguageSelectorVisible(true)} />
      <LanguageSelector visible={languageSelectorVisible} onClose={() => setLanguageSelectorVisible(false)} />
      <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-black" containerClassName="bg-black">
      {/* Background vector image */}
      <Image
        source={{ uri: VECTOR_BACKGROUNDS[bgIndex % VECTOR_BACKGROUNDS.length] }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          zIndex: 0,
        }}
        resizeMode="cover"
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Loading videos...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={videos}
            renderItem={({ item, index }) => (
              <View style={{ position: 'relative', zIndex: 1 }}>
                <VideoItem video={item} index={index} onTap={handleVideoTap} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            pagingEnabled
            scrollEventThrottle={16}
            snapToInterval={screenHeight}
            decelerationRate="fast"
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              const index = Math.round(offsetY / screenHeight);
              setBgIndex(index);
            }}
          />
          {/* Vector background for player */}
          {playerVisible && (
            <Image
              source={{ uri: VECTOR_BACKGROUNDS[(selectedVideoIndex + 1) % VECTOR_BACKGROUNDS.length] }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.05,
                zIndex: 0,
              }}
              resizeMode="cover"
            />
          )}

          <VideoPlayerModal
            visible={playerVisible}
            videos={videos.map(v => ({
              id: v.id,
              url: v.url,
              title: v.title || v.name,
              creator: v.creator || 'Creator',
              likes: v.likes || 0,
              comments: v.comments || 0,
              shares: 0,
              liked: v.liked,
            } as VideoData))}
            initialIndex={selectedVideoIndex}
            onClose={() => setPlayerVisible(false)}
            onLike={handleLikeInPlayer}
            onComment={(videoId) => console.log('Comment on', videoId)}
            onShare={(videoId) => console.log('Share', videoId)}
          />
        </>
      )}
      </ScreenContainer>
    </>
  );
}
