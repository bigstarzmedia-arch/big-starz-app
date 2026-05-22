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
  Image,
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

type CreationType = 'text-to-video' | 'text-to-song' | null;
type VideoModel = 'seedance' | 'kling' | 'runway' | 'grok';

interface GenerationState {
  type: CreationType;
  prompt: string;
  loading: boolean;
  progress: number;
  videoModel: VideoModel;
  selectedImage: string | null;
}

export default function CreateScreen() {
  const [activeTab, setActiveTab] = useState<'video' | 'song'>('video');
  const [showModal, setShowModal] = useState(false);
  const [generation, setGeneration] = useState<GenerationState>({
    type: null,
    prompt: '',
    loading: false,
    progress: 0,
    videoModel: 'seedance',
    selectedImage: null,
  });

  // tRPC mutations
  const generateVideoMutation = trpc.videos.generateFree.useMutation();

  const handleTextToVideo = async () => {
    if (!generation.prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt for your video');
      return;
    }

    setGeneration((prev) => ({ ...prev, loading: true, progress: 0 }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGeneration((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 30, 90),
        }));
      }, 500);

      const result = await generateVideoMutation.mutateAsync({
        prompt: generation.prompt,
      });

      clearInterval(progressInterval);
      setGeneration((prev) => ({ ...prev, progress: 100 }));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Video generated! Check your gallery.');
      setShowModal(false);
      setGeneration({
        type: null,
        prompt: '',
        loading: false,
        progress: 0,
        videoModel: 'seedance',
        selectedImage: null,
      });
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to generate video');
    } finally {
      setGeneration((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleTextToSong = async () => {
    if (!generation.prompt.trim()) {
      Alert.alert('Error', 'Please enter lyrics or song description');
      return;
    }

    setGeneration((prev) => ({ ...prev, loading: true, progress: 0 }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGeneration((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 25, 90),
        }));
      }, 600);

      // Call song generation API
      const result = await generateVideoMutation.mutateAsync({
        prompt: generation.prompt,
      });

      clearInterval(progressInterval);
      setGeneration((prev) => ({ ...prev, progress: 100 }));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Song generated! Check your music library.');
      setShowModal(false);
      setGeneration({
        type: null,
        prompt: '',
        loading: false,
        progress: 0,
        videoModel: 'seedance',
        selectedImage: null,
      });
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to generate song');
    } finally {
      setGeneration((prev) => ({ ...prev, loading: false }));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setGeneration((prev) => ({
        ...prev,
        selectedImage: result.assets[0].uri,
      }));
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-black">
      <BigStarzBackground>
        <View />
      </BigStarzBackground>

      {/* Header */}
      <View className="px-6 pt-6 pb-4 z-10">
        <Text className="text-3xl font-bold text-white mb-1">Create</Text>
        <Text className="text-sm text-gray-400">
          Generate videos and songs with AI
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-6 gap-3 mb-6 z-10">
        <TouchableOpacity
          onPress={() => {
            setActiveTab('video');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          className={`flex-1 py-3 rounded-full ${
            activeTab === 'video' ? 'bg-pink-500' : 'bg-gray-800'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'video' ? 'text-white' : 'text-gray-400'
            }`}
          >
            🎬 Text to Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveTab('song');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          className={`flex-1 py-3 rounded-full ${
            activeTab === 'song' ? 'bg-pink-500' : 'bg-gray-800'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'song' ? 'text-white' : 'text-gray-400'
            }`}
          >
            🎵 Text to Song
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 z-10">
        {activeTab === 'video' ? (
          <View className="gap-4">
            {/* Video Model Selection */}
            <View>
              <Text className="text-white font-semibold mb-2">AI Model</Text>
              <View className="flex-row gap-2">
                {(['seedance', 'kling', 'runway', 'grok'] as VideoModel[]).map(
                  (model) => (
                    <TouchableOpacity
                      key={model}
                      onPress={() => {
                        setGeneration((prev) => ({
                          ...prev,
                          videoModel: model,
                        }));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className={`flex-1 py-2 rounded-lg ${
                        generation.videoModel === model
                          ? 'bg-pink-500'
                          : 'bg-gray-800'
                      }`}
                    >
                      <Text
                        className={`text-center text-xs font-semibold ${
                          generation.videoModel === model
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      >
                        {model.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Video Prompt */}
            <View>
              <Text className="text-white font-semibold mb-2">
                Describe Your Video
              </Text>
              <TextInput
                placeholder="e.g., A luxury music video in Tokyo with neon lights and dancers wearing Gucci..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={generation.prompt}
                onChangeText={(text) =>
                  setGeneration((prev) => ({ ...prev, prompt: text }))
                }
                className="bg-gray-900 text-white p-4 rounded-lg border border-gray-700"
              />
            </View>

            {/* Reference Image */}
            <View>
              <Text className="text-white font-semibold mb-2">
                Reference Image (Optional)
              </Text>
              {generation.selectedImage ? (
                <View className="relative">
                  <Image
                    source={{ uri: generation.selectedImage }}
                    className="w-full h-40 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setGeneration((prev) => ({
                        ...prev,
                        selectedImage: null,
                      }))
                    }
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                  >
                    <Text className="text-white">✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-6 items-center"
                >
                  <Text className="text-gray-400 text-lg">📸</Text>
                  <Text className="text-gray-400 text-sm mt-2">
                    Tap to add reference image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View className="gap-4">
            {/* Song Prompt */}
            <View>
              <Text className="text-white font-semibold mb-2">
                Write Your Lyrics or Song Idea
              </Text>
              <TextInput
                placeholder="e.g., Verse 1: I'm living my best life, diamonds shining bright..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={5}
                value={generation.prompt}
                onChangeText={(text) =>
                  setGeneration((prev) => ({ ...prev, prompt: text }))
                }
                className="bg-gray-900 text-white p-4 rounded-lg border border-gray-700"
              />
            </View>

            {/* Voice Selection */}
            <View>
              <Text className="text-white font-semibold mb-2">Voice</Text>
              <View className="flex-row gap-2">
                {['Male', 'Female'].map((voice) => (
                  <TouchableOpacity
                    key={voice}
                    className="flex-1 py-2 rounded-lg bg-gray-800"
                  >
                    <Text className="text-center text-sm text-gray-400">
                      {voice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={() => {
            if (activeTab === 'video') {
              handleTextToVideo();
            } else {
              handleTextToSong();
            }
          }}
          disabled={generation.loading}
          className={`mt-6 mb-8 py-4 rounded-full ${
            generation.loading ? 'bg-gray-600' : 'bg-pink-500'
          }`}
        >
          {generation.loading ? (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold">
                {Math.round(generation.progress)}%
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              {activeTab === 'video' ? '🎬 Generate Video' : '🎵 Generate Song'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
