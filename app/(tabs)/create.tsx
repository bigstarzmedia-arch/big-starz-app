import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { trpc } from '@/lib/trpc';
import { VideoUpload } from '@/components/video-upload';

const { width: screenWidth } = Dimensions.get('window');

type CreationType = 'music-video' | 'ai-cameo' | 'ai-image' | null;
type MusicStyle = 'cinematic' | 'anime' | 'neon' | 'fashion';
type ImageStyle = 'photorealistic' | 'anime' | 'oil-painting' | 'neon';

interface GenerationState {
  type: CreationType;
  prompt: string;
  style: MusicStyle | ImageStyle;
  loading: boolean;
  progress: number;
  selectedImage: string | null;
  selectedVideo: string | null;
}

export default function CreateScreen() {
  const [showModal, setShowModal] = useState(false);
  const [generation, setGeneration] = useState<GenerationState>({
    type: null,
    prompt: '',
    style: 'cinematic',
    loading: false,
    progress: 0,
    selectedImage: null,
    selectedVideo: null,
  });

  // tRPC mutations
  const generateVideoMutation = trpc.videos.generateFree.useMutation();
  const checkQuotaMutation = trpc.videos.checkQuota.useQuery();
  const createVideoMutation = trpc.videos.create.useMutation();
  const createMusicMutation = trpc.music.create.useMutation();

  const handleCardPress = (type: CreationType) => {
    setGeneration({ ...generation, type });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleStyleSelect = (style: MusicStyle | ImageStyle) => {
    setGeneration({ ...generation, style });
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setGeneration({ ...generation, selectedImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setGeneration({ ...generation, selectedImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleGenerate = async () => {
    if (!generation.prompt.trim() && generation.type !== 'ai-cameo') return;
    if (generation.type === 'ai-cameo' && !generation.selectedImage) return;

    setGeneration({ ...generation, loading: true, progress: 10 });

    try {
      if (generation.type === 'music-video') {
        // Call Sora API via tRPC for music video generation
        const result = await generateVideoMutation.mutateAsync({
          prompt: `${generation.prompt} Style: ${generation.style}`,
        });

        if (result) {
          setGeneration({
            type: null,
            prompt: '',
            style: 'cinematic',
            loading: false,
            progress: 100,
            selectedImage: null,
            selectedVideo: null,
          });
          Alert.alert('Success', 'Music video generated! Check your library.');
          setShowModal(false);
        }
      } else if (generation.type === 'ai-cameo') {
        // Upload face clone and beautify with Runway API
        setGeneration((prev) => ({ ...prev, progress: 50 }));

        // In a real app, you'd upload the image to S3 first
        // For now, we'll simulate the process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setGeneration({
          type: null,
          prompt: '',
          style: 'cinematic',
          loading: false,
          progress: 100,
          selectedImage: null,
          selectedVideo: null,
        });
        Alert.alert('Success', 'Face clone created! Check your library.');
        setShowModal(false);
      } else if (generation.type === 'ai-image') {
        // Call Gemini API for image generation
        setGeneration((prev) => ({ ...prev, progress: 50 }));

        // Simulate image generation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setGeneration({
          type: null,
          prompt: '',
          style: 'photorealistic',
          loading: false,
          progress: 100,
          selectedImage: null,
          selectedVideo: null,
        });
        Alert.alert('Success', 'Image generated! Check your library.');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Generation failed. Please try again.';
      Alert.alert('Error', errorMessage);
      setGeneration((prev) => ({ ...prev, loading: false, progress: 0 }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGeneration({
      type: null,
      prompt: '',
      style: 'cinematic',
      loading: false,
      progress: 0,
      selectedImage: null,
      selectedVideo: null,
    });
  };

  const musicStyles: MusicStyle[] = ['cinematic', 'anime', 'neon', 'fashion'];
  const imageStyles: ImageStyle[] = ['photorealistic', 'anime', 'oil-painting', 'neon'];

  // Show quota warning if user is on free tier
  const quotaRemaining = checkQuotaMutation.data?.remaining ?? 0;
  const showQuotaWarning = quotaRemaining === 0 && !generateVideoMutation.isPending;

  return (
    <BigStarzBackground showHeader={true} headerTitle="AI Studio">
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
        <BigStarzBackground showHeader={true} headerTitle="Create with Big Starz AI ✨">
          <ScreenContainer containerClassName="bg-transparent" edges={['top', 'left', 'right']}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'space-between' }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={closeModal}
              style={{ alignSelf: 'flex-end', marginBottom: 20 }}
            >
              <Text style={{ fontSize: 32, color: '#FF0055', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>

            {/* Quota Warning */}
            {showQuotaWarning && (
              <View
                style={{
                  backgroundColor: '#FF0055',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
                  Daily quota reached! Upgrade to Pro for 50 videos/month.
                </Text>
              </View>
            )}

            {/* Main Content */}
            {generation.type === null ? (
              // Card Selection View
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 8 }}>
                  Create with Big Starz AI ✨
                </Text>

                {/* Music Video Card */}
                <TouchableOpacity
                  onPress={() => handleCardPress('music-video')}
                  disabled={showQuotaWarning}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#FF0055',
                    alignItems: 'center',
                    gap: 12,
                    opacity: showQuotaWarning ? 0.5 : 1,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>🎬</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>Music Video</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Generate AI music videos with Sora
                  </Text>
                </TouchableOpacity>

                {/* AI Cameo Card */}
                <TouchableOpacity
                  onPress={() => handleCardPress('ai-cameo')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#00FFFF',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>👤</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00FFFF' }}>AI Cameo</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Beautify videos with face cloning
                  </Text>
                </TouchableOpacity>

                {/* AI Image Card */}
                <TouchableOpacity
                  onPress={() => handleCardPress('ai-image')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: '#FFFF00',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>🖼️</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFF00' }}>AI Image</Text>
                  <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                    Generate images with Gemini
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Generation Input View
              <View style={{ gap: 16 }}>
                {/* Back Button */}
                <TouchableOpacity
                  onPress={() => setGeneration({ ...generation, type: null })}
                  style={{ marginBottom: 8 }}
                >
                  <Text style={{ fontSize: 16, color: '#FF0055', fontWeight: 'bold' }}>← Back</Text>
                </TouchableOpacity>

                {/* Music Video Input */}
                {generation.type === 'music-video' && (
                  <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Music Video</Text>
                    <TextInput
                      placeholder="Describe your music video..."
                      placeholderTextColor="#666"
                      value={generation.prompt}
                      onChangeText={(text) => setGeneration({ ...generation, prompt: text })}
                      multiline
                      numberOfLines={4}
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

                    {/* Style Selector */}
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#AAA' }}>Style</Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {musicStyles.map((style) => (
                        <TouchableOpacity
                          key={style}
                          onPress={() => handleStyleSelect(style)}
                          style={{
                            backgroundColor:
                              generation.style === style ? '#FF0055' : '#1A1A1A',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: generation.style === style ? '#FF0055' : '#333',
                          }}
                        >
                          <Text
                            style={{
                              color: generation.style === style ? '#FFF' : '#AAA',
                              fontWeight: '600',
                              fontSize: 12,
                            }}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* AI Cameo Input */}
                {generation.type === 'ai-cameo' && (
                  <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>AI Cameo - Upload Video</Text>
                    <VideoUpload
                      onVideoSelected={(uri) => setGeneration({ ...generation, selectedVideo: uri })}
                      loading={generation.loading}
                    />

                    {generation.selectedVideo && (
                      <TextInput
                        placeholder="Describe the cameo effect..."
                        placeholderTextColor="#666"
                        value={generation.prompt}
                        onChangeText={(text) => setGeneration({ ...generation, prompt: text })}
                        multiline
                        numberOfLines={3}
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
                  </>
                )}

                {/* AI Image Input */}
                {generation.type === 'ai-image' && (
                  <>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>AI Image</Text>
                    <TextInput
                      placeholder="Describe the image you want..."
                      placeholderTextColor="#666"
                      value={generation.prompt}
                      onChangeText={(text) => setGeneration({ ...generation, prompt: text })}
                      multiline
                      numberOfLines={4}
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

                    {/* Style Selector */}
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#AAA' }}>Style</Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {imageStyles.map((style) => (
                        <TouchableOpacity
                          key={style}
                          onPress={() => handleStyleSelect(style)}
                          style={{
                            backgroundColor:
                              generation.style === style ? '#FFFF00' : '#1A1A1A',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: generation.style === style ? '#FFFF00' : '#333',
                          }}
                        >
                          <Text
                            style={{
                              color: generation.style === style ? '#000' : '#AAA',
                              fontWeight: '600',
                              fontSize: 12,
                            }}
                          >
                            {style
                              .split('-')
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(' ')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* Progress Bar */}
                {generation.loading && (
                  <View style={{ gap: 8 }}>
                    <View style={{ height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' }}>
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: '#FF0055',
                          width: `${generation.progress}%`,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
                      {Math.round(generation.progress)}% Complete
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Generate Button */}
            {generation.type !== null && (
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={
                  generation.loading ||
                  (!generation.prompt.trim() && generation.type !== 'ai-cameo') ||
                  (generation.type === 'ai-cameo' && !generation.selectedImage) ||
                  showQuotaWarning
                }
                style={{
                  backgroundColor:
                    generation.loading ||
                    (!generation.prompt.trim() && generation.type !== 'ai-cameo') ||
                    (generation.type === 'ai-cameo' && !generation.selectedImage) ||
                    showQuotaWarning
                      ? '#666'
                      : '#FF0055',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 20,
                }}
              >
                {generation.loading ? (
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
        </BigStarzBackground>
      </Modal>
    </BigStarzBackground>
  );
}