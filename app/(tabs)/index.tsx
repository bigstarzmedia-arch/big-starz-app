import { View, Text, Pressable, FlatList, Image, Dimensions, Alert, Platform } from 'react-native';
import { useState, useEffect as useEffectHook, useRef } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { VideoPlayerModal, type VideoData } from '@/components/video-player-modal';
import { LanguageSelector } from '@/components/language-selector';
import { TopNavigation } from '@/components/top-navigation';
import { SocialShareModal } from '@/components/social-share-modal';
import { GenderProvider } from '@/lib/gender-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/lib/language-provider';

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
  creatorHandle?: string;
}

// Mock fallback videos while Google Drive videos load
const FALLBACK_VIDEOS: Video[] = [
  {
    id: '1',
    name: 'AI Music Video - Cyberpunk',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/uVFjRxyGEvVYafOu.mp4',
    creator: 'NeonVex',
    creatorHandle: '@NeonVex',
    title: 'AI Music Video - Cyberpunk',
    likes: 8400,
    comments: 342,
    liked: false,
  },
  {
    id: '2',
    name: 'Face Clone Collab',
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663582603941/ZIHqcEAjIsUDSuBR.mp4',
    creator: 'CosmicVibe',
    creatorHandle: '@CosmicVibe',
    title: 'Face Clone Collab',
    likes: 5200,
    comments: 218,
    liked: false,
  },
];

interface VideoItemProps {
  video: Video;
  index: number;
  isActive: boolean;
  onTap: (index: number) => void;
  onLike: (videoId: string, liked: boolean) => void;
  onComment: (video: Video) => void;
  onShare: (video: Video) => void;
}

function VideoItem({
  video,
  index,
  isActive,
  onTap,
  onLike,
  onComment,
  onShare,
}: VideoItemProps) {
  const [likes, setLikes] = useState(video.likes || 0);
  const [liked, setLiked] = useState(video.liked || false);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(video.url);

  // Auto-play when active
  useEffectHook(() => {
    if (isActive) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, [isActive, player]);

  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
    onLike(video.id, newLiked);
  };

  const handlePlayPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleComment = () => {
    onComment(video);
  };

  const handleShare = () => {
    onShare(video);
  };

  return (
    <Pressable onPress={() => onTap(index)} style={{ height: screenHeight, width: screenWidth }}>
      {/* Video Player */}
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={false}
      />

      {/* Gradient overlay at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', bottom: 0, width: '100%', height: '45%' }}
      />

      {/* Play/Pause button center */}
      {!isPlaying && (
        <Pressable
          onPress={handlePlayPause}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -30 }, { translateY: -30 }],
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(255,255,255,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Text style={{ fontSize: 32 }}>▶️</Text>
        </Pressable>
      )}

      {/* Creator info */}
      <View style={{ position: 'absolute', bottom: 90, left: 16, right: 70, zIndex: 5 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }} numberOfLines={2}>
          {video.title || video.name}
        </Text>
        <Text style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
          {video.creator || 'Big Starz Creator'}
        </Text>
      </View>

      {/* Action buttons on right */}
      <View style={{ position: 'absolute', right: 12, bottom: 100, gap: 16, zIndex: 5 }}>
        {/* Like Button */}
        <Pressable
          onPress={handleLike}
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: liked ? '#ff1493' : 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={{ color: '#fff', fontSize: 9, marginTop: 2, fontWeight: 'bold' }}>
            {likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}
          </Text>
        </Pressable>

        {/* Comment Button */}
        <Pressable
          onPress={handleComment}
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>💬</Text>
          <Text style={{ color: '#fff', fontSize: 9, marginTop: 2, fontWeight: 'bold' }}>
            {(video.comments || 0) > 999 ? `${((video.comments || 0) / 1000).toFixed(1)}K` : video.comments || 0}
          </Text>
        </Pressable>

        {/* Share Button */}
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>🔗</Text>
          <Text style={{ color: '#fff', fontSize: 9, marginTop: 2, fontWeight: 'bold' }}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function VibeScreen() {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedShareVideo, setSelectedShareVideo] = useState<Video | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleVideoTap = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handleLike = (videoId: string, liked: boolean) => {
    setVideos(videos.map(v =>
      v.id === videoId ? { ...v, liked } : v
    ));
  };

  const handleComment = (video: Video) => {
    Alert.alert(
      'Comments',
      `Comments for "${video.title}"`,
      [
        {
          text: 'View All',
          onPress: () => console.log('View all comments'),
        },
        {
          text: 'Add Comment',
          onPress: () => console.log('Add comment'),
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  const handleShare = (video: Video) => {
    setSelectedShareVideo(video);
    setShareModalVisible(true);
  };

  // Fetch videos from API
  useEffectHook(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, fallback to mock data
        const response = await fetch('/api/trpc/googleDrive.getSoraVideos');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const formattedVideos: Video[] = data.map((v: any, idx: number) => ({
              id: v.id,
              name: v.name,
              url: v.url,
              creator: `Creator${idx + 1}`,
              creatorHandle: `@creator${idx + 1}`,
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
      <GenderProvider>
        <SocialShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          videoUrl={selectedShareVideo?.url}
          videoTitle={selectedShareVideo?.title}
          creatorName={selectedShareVideo?.creator}
          creatorHandle={selectedShareVideo?.creatorHandle}
        />
      </GenderProvider>

      <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-black" containerClassName="bg-black">
        {/* Background vector image */}
        <Image
          source={{ uri: VECTOR_BACKGROUNDS[bgIndex % VECTOR_BACKGROUNDS.length] }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.08,
            zIndex: 0,
          }}
          resizeMode="cover"
        />

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>Loading videos...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={videos}
            renderItem={({ item, index }) => (
              <VideoItem
                video={item}
                index={index}
                isActive={index === selectedVideoIndex}
                onTap={handleVideoTap}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
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
              setSelectedVideoIndex(index);
            }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={videos.length > 0}
          />
        )}
      </ScreenContainer>
    </>
  );
}
