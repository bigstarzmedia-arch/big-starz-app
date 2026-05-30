import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface InstrumentalUploaderProps {
  onUpload: (fileUri: string, fileName: string) => void;
  isLoading?: boolean;
}

/**
 * Instrumental Uploader Component
 * Allows users to upload custom beats/instrumentals (MP3, WAV, etc.)
 */
export function InstrumentalUploader({ onUpload, isLoading = false }: InstrumentalUploaderProps) {
  const colors = useColors();
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string } | null>(null);

  const handlePickFile = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/wav', 'audio/*'],
        copyToCacheDirectory: true,
      });

      if (result && !result.canceled) {
        const { uri, name, size } = result as any;

        // Validate file size (max 50MB)
        if (size && size > 50 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Maximum file size is 50MB');
          return;
        }

        setSelectedFile({ uri, name });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUpload(uri, name);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="gap-4">
      {/* Upload Button */}
      <Pressable
        onPress={handlePickFile}
        disabled={isLoading}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View className="bg-primary/20 border-2 border-dashed border-primary rounded-2xl p-6 items-center gap-3">
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-primary font-semibold">Uploading...</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={32} color={colors.primary} />
              <View className="items-center">
                <Text className="text-lg font-bold text-foreground">Upload Instrumental</Text>
                <Text className="text-sm text-muted mt-1">MP3, WAV, or other audio format</Text>
                <Text className="text-xs text-muted/70 mt-2">Max 50MB</Text>
              </View>
            </>
          )}
        </View>
      </Pressable>

      {/* Selected File Display */}
      {selectedFile && !isLoading && (
        <View className="bg-surface rounded-lg p-4 border border-border gap-2">
          <View className="flex-row items-center gap-3">
            <Ionicons name="musical-note" size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="font-semibold text-foreground text-sm">{selectedFile.name}</Text>
              <Text className="text-xs text-muted">Ready to use</Text>
            </View>
            <Pressable
              onPress={handleClear}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="close-circle" size={24} color={colors.error} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Info */}
      <View className="bg-background/50 rounded-lg p-3 border border-border">
        <Text className="text-xs text-muted leading-relaxed">
          💡 Upload your custom beat or instrumental. It will be synced with your lyrics and character video to create a complete music video.
        </Text>
      </View>
    </View>
  );
}
