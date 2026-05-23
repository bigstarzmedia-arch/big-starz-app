import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useColors } from '@/hooks/use-colors';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerSuccessResult } from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function ProfileScreen() {
  const colors = useColors();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cameos, setCameos] = useState([
    { id: 1, name: 'Original Me', thumbnail: '🎬', status: 'completed' },
  ]);
  const [showCreateClone, setShowCreateClone] = useState(false);

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const createNewClone = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCameos([
      ...cameos,
      {
        id: cameos.length + 1,
        name: `Character ${cameos.length}`,
        thumbnail: '🎭',
        status: 'processing',
      },
    ]);
    setShowCreateClone(false);
  };

  return (
    <BigStarzBackground>
      <ScreenContainer className="flex-1 bg-black/80">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="gap-6 p-6">
            {/* Profile Header */}
            <View className="items-center gap-4">
              {/* Profile Picture */}
              <TouchableOpacity
                onPress={pickProfileImage}
                className="relative"
                activeOpacity={0.7}
              >
                <View className="w-32 h-32 rounded-full bg-surface border-4 border-primary items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Text className="text-6xl">📸</Text>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                  <Text className="text-xl">+</Text>
                </View>
              </TouchableOpacity>

              {/* Profile Info */}
              <View className="items-center gap-1">
                <Text className="text-2xl font-bold text-foreground">Nova Star</Text>
                <Text className="text-sm text-muted">@novastar • Music Creator</Text>
              </View>

              {/* Stats */}
              <View className="flex-row gap-8 w-full justify-center">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary">24.8K</Text>
                  <Text className="text-xs text-muted">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary">342</Text>
                  <Text className="text-xs text-muted">Following</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary">67</Text>
                  <Text className="text-xs text-muted">Videos</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons - Spread Out */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-primary rounded-full py-3 px-6 items-center active:opacity-80"
              >
                <Text className="text-background font-bold text-lg">Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-surface border border-border rounded-full py-3 px-6 items-center active:opacity-80"
              >
                <Text className="text-foreground font-bold text-lg">Share Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Cameo Section */}
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">My Cameos</Text>
                <TouchableOpacity
                  onPress={() => setShowCreateClone(!showCreateClone)}
                  className="bg-primary rounded-full px-4 py-2 active:opacity-80"
                >
                  <Text className="text-background font-semibold">+ New</Text>
                </TouchableOpacity>
              </View>

              {/* Create Clone Options */}
              {showCreateClone && (
                <View className="bg-surface border border-border rounded-xl p-4 gap-3">
                  <Text className="text-sm font-semibold text-foreground">Create New Character</Text>
                  
                  <TouchableOpacity
                    onPress={createNewClone}
                    className="bg-primary/20 border border-primary rounded-lg py-3 px-4 items-center active:opacity-80"
                  >
                    <Text className="text-primary font-semibold">🤖 AI Clone (Like Sora)</Text>
                    <Text className="text-xs text-muted mt-1">Generate from your profile picture</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={createNewClone}
                    className="bg-primary/20 border border-primary rounded-lg py-3 px-4 items-center active:opacity-80"
                  >
                    <Text className="text-primary font-semibold">🎭 Character Avatar</Text>
                    <Text className="text-xs text-muted mt-1">Design a custom character</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={createNewClone}
                    className="bg-primary/20 border border-primary rounded-lg py-3 px-4 items-center active:opacity-80"
                  >
                    <Text className="text-primary font-semibold">🎬 Upload Cameo Video</Text>
                    <Text className="text-xs text-muted mt-1">Upload your own cameo</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Cameo Grid */}
              <View className="gap-3">
                {cameos.map(cameo => (
                  <View
                    key={cameo.id}
                    className="bg-surface border border-border rounded-xl p-4 flex-row items-center justify-between active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4 flex-1">
                      <View className="w-16 h-16 rounded-lg bg-primary/20 items-center justify-center">
                        <Text className="text-3xl">{cameo.thumbnail}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {cameo.name}
                        </Text>
                        <Text className="text-xs text-muted capitalize">
                          {cameo.status === 'processing' ? '⏳ Processing...' : '✅ Ready'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        className="bg-primary/20 rounded-lg p-2 active:opacity-70"
                      >
                        <Text className="text-lg">✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        className="bg-primary rounded-lg p-2 active:opacity-70"
                      >
                        <Text className="text-lg">▶️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Earnings Section */}
            <View className="bg-primary/10 border border-primary rounded-xl p-4 gap-2">
              <Text className="text-base font-semibold text-primary">💰 Total Earnings</Text>
              <Text className="text-3xl font-bold text-foreground">$2,450.50</Text>
              <Text className="text-xs text-muted">This month: +$580</Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </BigStarzBackground>
  );
}
