import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreateScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'text-to-video' | 'face-clone' | 'music' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        // Handle image selection
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
        // Handle camera capture
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setProgress(10);

    // Simulate generation progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      if (currentProgress >= 95) {
        clearInterval(interval);
        setProgress(95);
      } else {
        setProgress(currentProgress);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setLoading(false);
      setPrompt('');
      setSelectedOption(null);
    }, 8000);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOption(null);
    setPrompt('');
    setProgress(0);
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'space-between' }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={closeModal}
              style={{ alignSelf: 'flex-end', marginBottom: 20 }}
            >
              <Text style={{ fontSize: 32, color: '#FF0055', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>

            {/* Options or Input */}
            {selectedOption === null ? (
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => handleOptionSelect('text-to-video')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>🎬</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Text to Video</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Generate videos from text prompts using Sora
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOptionSelect('face-clone')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>👤</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Face Clone</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Create videos with your face
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOptionSelect('music')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#333',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>🎵</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Music Studio</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Generate music and beats
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                {selectedOption === 'text-to-video' && (
                  <TextInput
                    placeholder="Describe the video you want to create..."
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    numberOfLines={5}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 14,
                      color: '#FFF',
                      borderWidth: 1,
                      borderColor: '#333',
                      fontSize: 14,
                    }}
                  />
                )}

                {selectedOption === 'face-clone' && (
                  <View style={{ gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleTakePhoto}
                      style={{
                        backgroundColor: '#FF0055',
                        paddingVertical: 14,
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
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>🖼️ From Gallery</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedOption === 'music' && (
                  <TextInput
                    placeholder="Describe the music style..."
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    numberOfLines={5}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 14,
                      color: '#FFF',
                      borderWidth: 1,
                      borderColor: '#333',
                      fontSize: 14,
                    }}
                  />
                )}

                {loading && (
                  <View style={{ gap: 8 }}>
                    <View style={{ height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' }}>
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: '#FF0055',
                          width: `${progress}%`,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                      {Math.round(progress)}% Complete
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Generate Button */}
            {selectedOption !== null && (
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={loading || !prompt.trim()}
                style={{
                  backgroundColor: loading || !prompt.trim() ? '#666' : '#FF0055',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 20,
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
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
