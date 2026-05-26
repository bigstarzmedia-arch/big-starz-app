import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface VideoPreviewLoopProps {
  videoUri: string;
  title: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  attemptsRemaining?: number;
}

export function VideoPreviewLoop({
  videoUri,
  title,
  onRegenerate,
  isRegenerating = false,
  attemptsRemaining = 3,
}: VideoPreviewLoopProps) {
  const [isLooping, setIsLooping] = useState(true);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (isLooping) {
      const interval = setInterval(() => {
        setPlayCount((prev) => prev + 1);
      }, 3000); // Loop every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isLooping]);

  const handleRegenerate = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    onRegenerate();
  };

  const handleToggleLoop = () => {
    setIsLooping(!isLooping);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Video Preview Container */}
      <View
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: '#FF1493',
          aspectRatio: 9 / 16,
          position: 'relative',
        }}
      >
        {/* Video Thumbnail */}
        <Image
          source={{ uri: videoUri }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />

        {/* Loop Indicator */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#FF1493', fontSize: 11, fontWeight: '600' }}>
            🔄 Loop {playCount}
          </Text>
        </View>

        {/* Play Indicator */}
        {isLooping && (
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: '#FF1493',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="play" size={20} color="white" />
          </View>
        )}

        {/* Paused Indicator */}
        {!isLooping && (
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="pause" size={20} color="white" />
          </View>
        )}
      </View>

      {/* Video Title */}
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
        {title}
      </Text>

      {/* Controls */}
      <View style={{ gap: 8 }}>
        {/* Loop Toggle */}
        <TouchableOpacity
          onPress={handleToggleLoop}
          style={{
            backgroundColor: isLooping ? '#FF1493' : '#1A1A1A',
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isLooping ? '#FF1493' : '#333',
          }}
        >
          <Text
            style={{
              color: isLooping ? '#fff' : '#999',
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {isLooping ? '⏸ Pause Loop' : '▶ Play Loop'}
          </Text>
        </TouchableOpacity>

        {/* Regenerate Button */}
        <TouchableOpacity
          onPress={handleRegenerate}
          disabled={isRegenerating || attemptsRemaining === 0}
          style={{
            backgroundColor:
              attemptsRemaining === 0
                ? '#333'
                : isRegenerating
                  ? '#FF1493'
                  : '#FFD700',
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            opacity: isRegenerating || attemptsRemaining === 0 ? 0.6 : 1,
          }}
        >
          {isRegenerating ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={{
                color: attemptsRemaining === 0 ? '#666' : '#000',
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {attemptsRemaining === 0
                ? '❌ No Attempts Left'
                : `🔄 Regenerate (${attemptsRemaining} left)`}
            </Text>
          )}
        </TouchableOpacity>

        {/* Attempts Info */}
        {attemptsRemaining > 0 && (
          <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
            {attemptsRemaining === 3
              ? '✨ Free tier: 3 regenerations per video'
              : `${attemptsRemaining} regeneration${attemptsRemaining === 1 ? '' : 's'} remaining`}
          </Text>
        )}
      </View>
    </View>
  );
}
