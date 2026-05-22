import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  views: number;
  likes: number;
}

interface Cameo {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
}

const PROFILE = {
  name: '@YourCreator',
  bio: 'AI video creator | Music producer | Face clone enthusiast',
  followers: 2450,
  following: 342,
  totalViews: 125400,
  totalLikes: 8900,
  tier: 'Pro',
};

const VIDEOS: Video[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop',
    title: 'AI Music Video #1',
    views: 5200,
    likes: 420,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    title: 'Face Clone Test',
    views: 3100,
    likes: 280,
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=600&fit=crop',
    title: 'Beat Studio Creation',
    views: 8900,
    likes: 620,
  },
];

const CAMEOS: Cameo[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    title: 'Shout Out Video',
    price: 25,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    title: 'Personalized Message',
    price: 50,
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
    title: 'Feature in Music Video',
    price: 100,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingClone, setLoadingClone] = useState(false);

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const handleCreateAIClone = async () => {
    if (!profileImage) {
      Alert.alert('Error', 'Please upload a profile picture first');
      return;
    }

    setLoadingClone(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate AI clone creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Your AI clone has been created! You can now use it in videos.');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to create AI clone');
    } finally {
      setLoadingClone(false);
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMessage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: '/(tabs)/chat', params: { creatorId: '1' } });
  };

  return (
    <ScreenContainer className="flex-1 bg-black">
      <BigStarzBackground>
        <View />
      </BigStarzBackground>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 z-10"
      >
        {/* Profile Header */}
        <View className="px-6 pt-6 pb-4 items-center gap-3">
          {/* Profile Picture Upload */}
          <TouchableOpacity
            onPress={pickProfileImage}
            className="relative"
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 rounded-full border-4 border-pink-500"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 items-center justify-center">
                <Text className="text-3xl">📸</Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2">
              <Text className="text-white text-lg">+</Text>
            </View>
          </TouchableOpacity>

          {/* Name & Bio */}
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{PROFILE.name}</Text>
            <Text className="text-sm text-gray-400 mt-1">{PROFILE.bio}</Text>
          </View>

          {/* Tier Badge */}
          <View className="bg-pink-500 rounded-full px-4 py-1">
            <Text className="text-white font-bold text-sm">💎 {PROFILE.tier}</Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-6 mt-2">
            <View className="items-center">
              <Text className="text-white font-bold text-lg">{PROFILE.followers.toLocaleString()}</Text>
              <Text className="text-gray-400 text-xs">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-lg">{PROFILE.following}</Text>
              <Text className="text-gray-400 text-xs">Following</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-lg">{PROFILE.totalViews.toLocaleString()}</Text>
              <Text className="text-gray-400 text-xs">Views</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 w-full mt-4">
            <TouchableOpacity
              onPress={handleFollowToggle}
              className={`flex-1 py-3 rounded-full ${
                isFollowing ? 'bg-gray-800' : 'bg-pink-500'
              }`}
            >
              <Text className="text-center font-bold text-white">
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMessage}
              className="flex-1 py-3 rounded-full bg-blue-500"
            >
              <Text className="text-center font-bold text-white">💬 Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Clone Section */}
        <View className="px-6 mt-6">
          <Text className="text-white font-bold text-lg mb-3">🤖 AI Clone</Text>
          <TouchableOpacity
            onPress={handleCreateAIClone}
            disabled={loadingClone}
            className={`py-4 rounded-lg border-2 border-dashed ${
              loadingClone ? 'border-gray-600 bg-gray-900' : 'border-pink-500 bg-gray-900'
            }`}
          >
            {loadingClone ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="#ec4899" />
                <Text className="text-pink-500 font-bold">Creating Clone...</Text>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-2xl mb-2">✨</Text>
                <Text className="text-white font-bold">Create Your AI Clone</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Generate an AI version of yourself for videos
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Cameo Section */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-lg">🎬 Cameos</Text>
            <TouchableOpacity>
              <Text className="text-pink-500 font-bold text-sm">Edit</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-3"
          >
            {CAMEOS.map((cameo) => (
              <TouchableOpacity
                key={cameo.id}
                className="items-center gap-2"
              >
                <Image
                  source={{ uri: cameo.thumbnail }}
                  className="w-20 h-20 rounded-lg"
                />
                <Text className="text-white text-xs font-bold text-center w-20">
                  ${cameo.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Videos Section */}
        <View className="px-6 mt-6">
          <Text className="text-white font-bold text-lg mb-3">📹 My Videos</Text>
          <View className="gap-3">
            {VIDEOS.map((video) => (
              <TouchableOpacity
                key={video.id}
                className="flex-row gap-3 bg-gray-900 rounded-lg overflow-hidden"
              >
                <Image
                  source={{ uri: video.thumbnail }}
                  className="w-16 h-24 rounded-lg"
                />
                <View className="flex-1 justify-center py-2">
                  <Text className="text-white font-bold text-sm">{video.title}</Text>
                  <View className="flex-row gap-4 mt-2">
                    <Text className="text-gray-400 text-xs">👁️ {video.views.toLocaleString()}</Text>
                    <Text className="text-gray-400 text-xs">❤️ {video.likes.toLocaleString()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
