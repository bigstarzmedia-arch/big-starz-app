import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AVPlaybackStatus, Video } from 'expo-av';
import { ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface VideoPlayerProps {
  videoUrl: string;
  creatorName: string;
  creatorAvatar?: string;
  likes: number;
  comments: number;
  shares: number;
  onShare?: () => void;
  onGift?: () => void;
  onComment?: () => void;
}

export function VideoPlayer({
  videoUrl,
  creatorName,
  creatorAvatar,
  likes,
  comments,
  shares,
  onShare,
  onGift,
  onComment,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handlePlayPause = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare?.();
  };

  const handleGift = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onGift?.();
  };

  const handleComment = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onComment?.();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
      {/* Video */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
        style={{ flex: 1 }}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping
          onLoad={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              setDuration(status.durationMillis || 0);
              setIsLoading(false);
            }
          }}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              setCurrentTime(status.positionMillis || 0);
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </TouchableOpacity>

      {/* Loading Indicator */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ActivityIndicator size="large" color="#FF1493" />
        </View>
      )}

      {/* Play/Pause Button (Center) */}
      {showControls && !isLoading && (
        <TouchableOpacity
          onPress={handlePlayPause}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -40,
            marginTop: -40,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255, 20, 147, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      {/* Progress Bar */}
      {showControls && (
        <View
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: '#FF1493',
            }}
          />
        </View>
      )}

      {/* Time Display */}
      {showControls && (
        <View
          style={{
            position: 'absolute',
            bottom: 60,
            left: 12,
            right: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>
            {formatTime(currentTime)}
          </Text>
          <Text style={{ color: '#fff', fontSize: 12 }}>
            {formatTime(duration)}
          </Text>
        </View>
      )}

      {/* Right Side Action Buttons */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 80,
          gap: 20,
          alignItems: 'center',
        }}
      >
        {/* Like/Gift Button */}
        <TouchableOpacity
          onPress={handleGift}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255, 20, 147, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="heart" size={24} color="#FFD700" />
          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
            {likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          onPress={handleComment}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(100, 150, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="chatbubble" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>
            {comments > 999 ? `${(comments / 1000).toFixed(1)}K` : comments}
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(0, 255, 200, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="share-social" size={24} color="#000" />
          <Text style={{ color: '#000', fontSize: 10, marginTop: 2 }}>
            {shares > 999 ? `${(shares / 1000).toFixed(1)}K` : shares}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Creator Info (Bottom Left) */}
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          left: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {creatorAvatar && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FF1493',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {creatorName.charAt(0)}
            </Text>
          </View>
        )}
        <View>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
            {creatorName}
          </Text>
          <Text style={{ color: '#aaa', fontSize: 12 }}>Creator</Text>
        </View>
      </View>
    </View>
  );
}
