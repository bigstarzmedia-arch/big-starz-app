import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

interface CustomSongUploadProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (songData: any) => void;
}

export function CustomSongUpload({
  visible,
  onClose,
  onUpload,
}: CustomSongUploadProps) {
  const [step, setStep] = useState<'select' | 'details' | 'uploading' | 'complete'>('select');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setStep('details');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleUpload = () => {
    if (!songTitle || !artist) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsUploading(true);
    setStep('uploading');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsUploading(false);
      setStep('complete');
      onUpload({
        title: songTitle,
        artist,
        file: selectedFile,
        uploadedAt: new Date(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary p-6 items-center">
          <Text className="text-2xl font-bold text-white">
            Upload Custom Song
          </Text>
        </View>

        <View className="flex-1 p-6 justify-center gap-6">
          {step === 'select' && (
            <>
              <Text className="text-foreground text-center text-lg">
                Upload your own music to use in videos
              </Text>

              <TouchableOpacity
                onPress={handlePickFile}
                className="bg-primary/20 border-2 border-dashed border-primary rounded-lg p-8 items-center gap-4"
              >
                <Text className="text-4xl">🎵</Text>
                <Text className="text-foreground font-bold text-lg">
                  Tap to Select Audio File
                </Text>
                <Text className="text-muted text-sm">
                  MP3, WAV, or M4A (Max 50MB)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="py-3 rounded-full items-center border-2 border-muted"
              >
                <Text className="text-muted font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'details' && (
            <>
              <Text className="text-foreground text-center">
                Add song details
              </Text>

              <TextInput
                placeholder="Song Title"
                placeholderTextColor="#666"
                value={songTitle}
                onChangeText={setSongTitle}
                className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
              />

              <TextInput
                placeholder="Artist Name"
                placeholderTextColor="#666"
                value={artist}
                onChangeText={setArtist}
                className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
              />

              <View className="bg-surface rounded-lg p-4">
                <Text className="text-muted text-sm mb-2">
                  Selected File
                </Text>
                <Text className="text-foreground font-bold">
                  {selectedFile?.name || 'No file selected'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleUpload}
                className="bg-success py-4 rounded-full items-center"
              >
                <Text className="text-background font-bold text-lg">
                  Upload Song
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'uploading' && (
            <>
              <View className="items-center gap-4">
                <ActivityIndicator size="large" color="#FF1493" />
                <Text className="text-foreground font-bold">
                  Uploading your song...
                </Text>
              </View>
            </>
          )}

          {step === 'complete' && (
            <>
              <View className="items-center gap-4">
                <Text className="text-4xl">✓</Text>
                <Text className="text-foreground font-bold text-lg text-center">
                  Song Uploaded Successfully!
                </Text>
                <Text className="text-muted text-center">
                  "{songTitle}" by {artist} is now available in your library
                </Text>

                <TouchableOpacity
                  onPress={onClose}
                  className="bg-primary py-4 rounded-full items-center w-full mt-4"
                >
                  <Text className="text-background font-bold text-lg">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
