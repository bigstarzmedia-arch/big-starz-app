import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface VideoUploadProps {
  onVideoSelected: (uri: string) => void;
  loading?: boolean;
}

export function VideoUpload({ onVideoSelected, loading = false }: VideoUploadProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        setSelectedVideo(videoUri);
        onVideoSelected(videoUri);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleRecordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoMaxDuration: 60, // 60 second max
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        setSelectedVideo(videoUri);
        onVideoSelected(videoUri);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  if (loading || uploading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#ff1493" />
        <Text className="text-white mt-4">Uploading video...</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {selectedVideo ? (
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-foreground font-semibold mb-2">✅ Video Selected</Text>
          <Text className="text-muted text-sm">{selectedVideo.split('/').pop()}</Text>
          <Pressable
            onPress={() => setSelectedVideo(null)}
            className="mt-3 bg-error/20 rounded-lg py-2 px-3"
          >
            <Text className="text-error text-center font-semibold">Clear Selection</Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          <Pressable
            onPress={handlePickVideo}
            className="bg-cyan-500/20 border border-cyan-500 rounded-lg py-4 px-4 items-center"
          >
            <Text className="text-cyan-400 text-2xl mb-2">📱</Text>
            <Text className="text-foreground font-semibold">Choose from Gallery</Text>
            <Text className="text-muted text-xs mt-1">Select a video from your device</Text>
          </Pressable>

          <Pressable
            onPress={handleRecordVideo}
            className="bg-pink-500/20 border border-pink-500 rounded-lg py-4 px-4 items-center"
          >
            <Text className="text-pink-400 text-2xl mb-2">🎥</Text>
            <Text className="text-foreground font-semibold">Record Video</Text>
            <Text className="text-muted text-xs mt-1">Record a new video (max 60 seconds)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
