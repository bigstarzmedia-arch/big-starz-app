import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, FlatList } from 'react-native';
import { useTierAccess } from '@/hooks/use-tier-access';
import * as Haptics from 'expo-haptics';

interface DuetStitchesProps {
  visible: boolean;
  onClose: () => void;
  onDuetStart?: (videoId: string, type: 'duet' | 'stitch') => void;
}

export function DuetsStitchesFeature({ visible, onClose, onDuetStart }: DuetStitchesProps) {
  const { hasFeature } = useTierAccess();
  const [selectedType, setSelectedType] = useState<'duet' | 'stitch'>('duet');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const isFeatureAvailable = hasFeature('duetsStitches');

  const mockVideos = [
    { id: '1', title: 'Dance Challenge', creator: '@DanceQueen', thumbnail: '🎬' },
    { id: '2', title: 'Comedy Skit', creator: '@FunnyBone', thumbnail: '😂' },
    { id: '3', title: 'Lip Sync', creator: '@VocalStar', thumbnail: '🎤' },
    { id: '4', title: 'Trending Sound', creator: '@MusicLover', thumbnail: '🎵' },
  ];

  const handleDuetStart = (videoId: string) => {
    if (!isFeatureAvailable) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setSelectedVideo(videoId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDuetStart?.(videoId, selectedType);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-t-3xl p-6 max-h-[90%]">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <Text className="text-right text-muted text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            {selectedType === 'duet' ? '🎬 Duets' : '✂️ Stitches'}
          </Text>
          <Text className="text-muted mb-6">
            {selectedType === 'duet'
              ? 'Create side-by-side videos with other creators'
              : 'Clip and respond to parts of other videos'}
          </Text>

          {!isFeatureAvailable && (
            <View className="bg-error/10 border border-error rounded-lg p-4 mb-6">
              <Text className="text-error font-semibold">
                🔒 Pro tier required
              </Text>
              <Text className="text-error text-sm mt-1">
                Upgrade to Pro to access Duets & Stitches
              </Text>
            </View>
          )}

          {/* Type Selector */}
          <View className="flex-row gap-3 mb-6">
            {(['duet', 'stitch'] as const).map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  selectedType === type
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-center font-bold ${
                    selectedType === type ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {type === 'duet' ? '🎬 Duet' : '✂️ Stitch'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Video List */}
          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            <View className="gap-3">
              {mockVideos.map(video => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => handleDuetStart(video.id)}
                  disabled={!isFeatureAvailable}
                  className={`flex-row items-center gap-4 p-4 rounded-lg border-2 ${
                    selectedVideo === video.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  } ${!isFeatureAvailable ? 'opacity-50' : ''}`}
                >
                  <Text className="text-4xl">{video.thumbnail}</Text>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      {video.title}
                    </Text>
                    <Text className="text-muted text-sm">{video.creator}</Text>
                  </View>
                  <Text className="text-primary text-lg">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => selectedVideo && handleDuetStart(selectedVideo)}
            disabled={!selectedVideo || !isFeatureAvailable}
            className={`rounded-full py-4 ${
              selectedVideo && isFeatureAvailable
                ? 'bg-primary'
                : 'bg-muted opacity-50'
            }`}
          >
            <Text className="text-center text-background font-bold text-lg">
              Start {selectedType === 'duet' ? 'Duet' : 'Stitch'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
