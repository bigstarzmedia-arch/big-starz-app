import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export interface VideoFilter {
  id: string;
  name: string;
  icon: string;
  color: string;
  cssFilter: string;
  description: string;
}

export const VIDEO_FILTERS: VideoFilter[] = [
  {
    id: 'none',
    name: 'Original',
    icon: '🎬',
    color: '#fff',
    cssFilter: 'none',
    description: 'No filter',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '📷',
    color: '#d4a574',
    cssFilter: 'sepia(0.5) saturate(0.8) brightness(1.1)',
    description: 'Classic vintage look',
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '⚡',
    color: '#ff00ff',
    cssFilter: 'saturate(2) brightness(1.2) contrast(1.3)',
    description: 'Vibrant neon effect',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    icon: '🎞️',
    color: '#1a1a2e',
    cssFilter: 'contrast(1.2) brightness(0.95) saturate(1.1)',
    description: 'Movie-like appearance',
  },
  {
    id: 'blur',
    name: 'Soft Focus',
    icon: '🌫️',
    color: '#b0c4de',
    cssFilter: 'blur(2px) brightness(1.05)',
    description: 'Dreamy soft focus',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    icon: '🟫',
    color: '#8b7355',
    cssFilter: 'sepia(1)',
    description: 'Classic sepia tone',
  },
  {
    id: 'grayscale',
    name: 'B&W',
    icon: '⚪',
    color: '#808080',
    cssFilter: 'grayscale(1)',
    description: 'Black and white',
  },
  {
    id: 'highcontrast',
    name: 'High Contrast',
    icon: '⬛',
    color: '#000',
    cssFilter: 'contrast(1.5) brightness(1.1)',
    description: 'Bold high contrast',
  },
  {
    id: 'cool',
    name: 'Cool',
    icon: '❄️',
    color: '#00bfff',
    cssFilter: 'hue-rotate(200deg) saturate(1.2)',
    description: 'Cool blue tones',
  },
  {
    id: 'warm',
    name: 'Warm',
    icon: '🔥',
    color: '#ff6347',
    cssFilter: 'hue-rotate(20deg) saturate(1.3) brightness(1.1)',
    description: 'Warm orange tones',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    icon: '🌈',
    color: '#ff1493',
    cssFilter: 'saturate(1.8) brightness(1.05) contrast(1.1)',
    description: 'Hyper-saturated colors',
  },
  {
    id: 'fade',
    name: 'Fade',
    icon: '🌅',
    color: '#ffd700',
    cssFilter: 'brightness(1.2) saturate(0.6) contrast(0.9)',
    description: 'Faded retro look',
  },
];

interface VideoFiltersProps {
  onFilterSelect: (filter: VideoFilter) => void;
  selectedFilterId?: string;
}

export function VideoFilters({ onFilterSelect, selectedFilterId = 'none' }: VideoFiltersProps) {
  const colors = useColors();

  const handleFilterPress = async (filter: VideoFilter) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFilterSelect(filter);
  };

  return (
    <View className="bg-surface rounded-t-3xl p-4 border-t border-border">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-foreground">Video Filters</Text>
        <Text className="text-xs text-muted mt-1">Choose a filter to enhance your video</Text>
      </View>

      {/* Filter Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
      >
        {VIDEO_FILTERS.map((filter) => (
          <Pressable
            key={filter.id}
            onPress={() => handleFilterPress(filter)}
            style={({ pressed }) => [
              {
                alignItems: 'center',
                gap: 6,
                padding: 8,
                borderRadius: 12,
                backgroundColor:
                  selectedFilterId === filter.id ? colors.primary + '20' : 'transparent',
                borderWidth: selectedFilterId === filter.id ? 2 : 1,
                borderColor: selectedFilterId === filter.id ? colors.primary : colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            {/* Filter Icon */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                backgroundColor: filter.color + '30',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: filter.color + '50',
              }}
            >
              <Text style={{ fontSize: 28 }}>{filter.icon}</Text>
            </View>

            {/* Filter Name */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: selectedFilterId === filter.id ? colors.primary : colors.foreground,
                textAlign: 'center',
              }}
            >
              {filter.name}
            </Text>

            {/* Selected Indicator */}
            {selectedFilterId === filter.id && (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.primary,
                }}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Description */}
      {selectedFilterId && (
        <View className="mt-4 p-3 bg-background rounded-lg border border-border">
          <Text className="text-xs text-muted">
            {VIDEO_FILTERS.find((f) => f.id === selectedFilterId)?.description}
          </Text>
        </View>
      )}
    </View>
  );
}
