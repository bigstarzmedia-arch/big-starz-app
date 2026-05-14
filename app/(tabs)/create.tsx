import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function CreateScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'text-to-video' | 'face-clone' | 'music' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{ id: string; url: string; title: string } | null>(null);

  const handleOptionSelect = (option: 'text-to-video' | 'face-clone' | 'music') => {
    setSelectedOption(option);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      // TODO: Integrate Sora API for free tier
      // For now, simulate video generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGeneratedVideo({
        id: Date.now().toString(),
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop',
        title: prompt,
      });

      setPrompt('');
      setSelectedOption(null);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
            <Text>CREATE</Text>
            <Text style={{ color: '#FF0055' }}> AI</Text>
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, padding: 16, gap: 16 }}>
          {/* Text-to-Video Card */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('text-to-video')}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: selectedOption === 'text-to-video' ? '#FF0055' : '#333',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 40 }}>🎬</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Text to Video</Text>
            <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
              Describe a video and AI will create it (Free: 5/month)
            </Text>
          </TouchableOpacity>

          {/* Face Clone Card */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('face-clone')}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: selectedOption === 'face-clone' ? '#FF0055' : '#333',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 40 }}>👤</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Face Clone</Text>
            <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
              Upload your face and generate videos with your likeness
            </Text>
          </TouchableOpacity>

          {/* Music Studio Card */}
          <TouchableOpacity
            onPress={() => handleOptionSelect('music')}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: selectedOption === 'music' ? '#FF0055' : '#333',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 40 }}>🎵</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Music Studio</Text>
            <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
              Create lyrics, generate beats, and add vocals
            </Text>
          </TouchableOpacity>

          {/* Generated Video Preview */}
          {generatedVideo && (
            <View
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: '#FF0055',
              }}
            >
              <Image
                source={{ uri: generatedVideo.url }}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
              <View style={{ padding: 12, gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>{generatedVideo.title}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#FF0055',
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#333',
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Generation Modal */}
      <Modal visible={selectedOption !== null} transparent animationType="slide">
        <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
          <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
            {/* Header */}
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>
                  {selectedOption === 'text-to-video' && 'Create Video'}
                  {selectedOption === 'face-clone' && 'Upload Face'}
                  {selectedOption === 'music' && 'Create Music'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedOption(null);
                    setPrompt('');
                  }}
                >
                  <Text style={{ fontSize: 24, color: '#FF0055' }}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Input */}
              {selectedOption === 'text-to-video' && (
                <TextInput
                  placeholder="Describe the video you want to create..."
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
                    marginBottom: 16,
                  }}
                />
              )}

              {selectedOption === 'face-clone' && (
                <View style={{ gap: 12 }}>
                  <TouchableOpacity
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
                    style={{
                      backgroundColor: '#333',
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>🖼️ Choose from Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedOption === 'music' && (
                <TextInput
                  placeholder="Describe the music style and mood..."
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
                    marginBottom: 16,
                  }}
                />
              )}
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                backgroundColor: loading || !prompt.trim() ? '#666' : '#FF0055',
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
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
