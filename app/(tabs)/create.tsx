import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { trpc } from '@/lib/trpc';

interface GeneratedVideo {
  id: number;
  prompt: string;
  outputVideoUrl?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export default function CreateScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'text-to-video' | 'face-clone' | 'music' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);

  // Fetch user's generated videos
  const { data: videos } = trpc.videoGeneration.list.useQuery();
  useEffect(() => {
    if (videos) {
      setGeneratedVideos(videos as GeneratedVideo[]);
    }
  }, [videos]);

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
    onSuccess: (videoGenId) => {
      // Simulate progress
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

      // Simulate completion after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setLoading(false);
        setPrompt('');
        setSelectedOption(null);
        
        // Refresh videos list
        if (videos) {
          setGeneratedVideos([...videos] as GeneratedVideo[]);
        }
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
      } else if (selectedOption === 'face-clone' && selectedImage) {
        // TODO: Implement face clone upload
        console.log('Face clone upload:', selectedImage);
        setLoading(false);
      } else if (selectedOption === 'music') {
        // TODO: Implement music generation
        console.log('Music generation:', prompt);
        setLoading(false);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setLoading(false);
      setProgress(0);
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

          {/* Generated Videos List */}
          {generatedVideos.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Your Videos</Text>
              <FlatList
                data={generatedVideos}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: '#333',
                      marginBottom: 8,
                    }}
                  >
                    {item.outputVideoUrl && (
                      <Image
                        source={{ uri: item.outputVideoUrl }}
                        style={{ width: '100%', height: 150 }}
                        resizeMode="cover"
                      />
                    )}
                    <View style={{ padding: 12, gap: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF', flex: 1 }} numberOfLines={2}>
                          {item.prompt}
                        </Text>
                        <View
                          style={{
                            backgroundColor:
                              item.processingStatus === 'completed'
                                ? '#00FF00'
                                : item.processingStatus === 'failed'
                                  ? '#FF0055'
                                  : '#FFA500',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                            marginLeft: 8,
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#000' }}>
                            {item.processingStatus === 'completed'
                              ? '✓'
                              : item.processingStatus === 'failed'
                                ? '✕'
                                : '⏳'}
                          </Text>
                        </View>
                      </View>
                      {item.processingStatus === 'completed' && (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              backgroundColor: '#FF0055',
                              paddingVertical: 8,
                              borderRadius: 6,
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Share</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              backgroundColor: '#333',
                              paddingVertical: 8,
                              borderRadius: 6,
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Download</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              />
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
                    setSelectedImage(null);
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
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ width: '100%', height: 200, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                  )}
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

              {/* Progress Bar */}
              {loading && (
                <View style={{ marginBottom: 16, gap: 8 }}>
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
                    {Math.round(progress)}% complete
                  </Text>
                </View>
              )}
            </View>

            {/* Generate Button */}
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
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
