import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useColors } from '@/hooks/use-colors';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function ProfileScreen() {
  const colors = useColors();
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  return (
    <BigStarzBackground>
      <ScreenContainer className="flex-1 bg-black/80">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="gap-8 p-6">
            {/* Profile Header */}
            <View className="items-center gap-4">
              {/* Profile Picture */}
              <TouchableOpacity
                onPress={pickProfileImage}
                className="relative"
                activeOpacity={0.7}
              >
                <View className="w-40 h-40 rounded-full bg-surface border-4 border-primary items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Text className="text-8xl">📸</Text>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-primary rounded-full p-3 border-4 border-black">
                  <Text className="text-2xl">+</Text>
                </View>
              </TouchableOpacity>

              {/* Profile Info */}
              <View className="items-center gap-2">
                <Text className="text-3xl font-bold text-foreground">Nova Star</Text>
                <Text className="text-base text-muted">@novastar • Music Creator</Text>
              </View>

              {/* Stats */}
              <View className="flex-row gap-12 w-full justify-center">
                <View className="items-center">
                  <Text className="text-3xl font-bold text-primary">24.8K</Text>
                  <Text className="text-sm text-muted">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-primary">342</Text>
                  <Text className="text-sm text-muted">Following</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-primary">67</Text>
                  <Text className="text-sm text-muted">Videos</Text>
                </View>
              </View>
            </View>

            {/* 3 MAIN BUTTONS ONLY */}
            <View className="gap-4">
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
              >
                <Text className="text-background font-bold text-xl">🎬 My Cameos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
              >
                <Text className="text-background font-bold text-xl">🤖 Create AI Clone</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
              >
                <Text className="text-background font-bold text-xl">💰 Earnings</Text>
              </TouchableOpacity>
            </View>

            {/* Earnings Preview */}
            <View className="bg-primary/10 border-2 border-primary rounded-2xl p-6 gap-3">
              <Text className="text-lg font-semibold text-primary">Total Earnings</Text>
              <Text className="text-4xl font-bold text-foreground">$2,450.50</Text>
              <Text className="text-sm text-muted">This month: +$580</Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </BigStarzBackground>
  );
}
