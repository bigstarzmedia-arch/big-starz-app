import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { trpc } from '@/lib/trpc';

export default function CreateScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'text-to-video' | 'face-clone' | 'music' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOptionSelect = (option: 'text-to-video' | 'face-clone' | 'music') => {
    setSelectedOption(option);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const generateWithSora = trpc.videoGeneration.generateWithSora.useMutation({
    onSuccess: () => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 30;
        if (currentProgress >= 95) {
          clearInterval(interval);
          setProgress(95);
        } else {
          setProgress(currentProgress);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setLoading(false);
        setPrompt('');
        setSelectedOption(null);
      }, 10000);
    },
    onError: (error) => {
      console.error('Generation error:', error);
      setLoading(false);
      setProgress(0);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setProgress(10);

    try {
      if (selectedOption === 'text-to-video') {
        await generateWithSora.mutateAsync({ prompt });
      }
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Plus Button */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#FF0055',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#FF0055',
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 48, color: '#FFF', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
          <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setSelectedOption(null);
                setPrompt('');
                setSelectedImage(null);
              }}
              style={{ alignSelf: 'flex-end', marginBottom: 16 }}
            >
              <Text style={{ fontSize: 28, color: '#FF0055' }}>✕</Text>
            </TouchableOpacity>

            {/* Options or Input */}
            {selectedOption === null ? (
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={() => handleOptionSelect('text-to-video')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>🎬</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Text to Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOptionSelect('face-clone')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>👤</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Face Clone</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOptionSelect('music')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>🎵</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Music Studio</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {selectedOption === 'text-to-video' && (
                  <TextInput
                    placeholder="Describe the video..."
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      color: '#FFF',
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  />
                )}

                {selectedOption === 'face-clone' && (
                  <View style={{ gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleTakePhoto}
                      style={{
                        backgroundColor: '#FF0055',
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>📷 Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePickImage}
                      style={{
                        backgroundColor: '#333',
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>🖼️ Gallery</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedOption === 'music' && (
                  <TextInput
                    placeholder="Describe the music..."
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      color: '#FFF',
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  />
                )}

                {loading && (
                  <View style={{ gap: 8 }}>
                    <View style={{ height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' }}>
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: '#FF0055',
                          width: `${progress}%`,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                      {Math.round(progress)}%
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Generate Button */}
            {selectedOption !== null && (
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={loading || !prompt.trim() || (selectedOption === 'face-clone' && !selectedImage)}
                style={{
                  backgroundColor:
                    loading || !prompt.trim() || (selectedOption === 'face-clone' && !selectedImage)
                      ? '#666'
                      : '#FF0055',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Generating...</Text>
                  </>
                ) : (
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Generate</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
