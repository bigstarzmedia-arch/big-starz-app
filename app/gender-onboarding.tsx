import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useGender, getCharacterImage } from '@/lib/gender-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

/**
 * Gender Selection Onboarding Screen
 * Allows users to choose their character avatar (Boy/Girl)
 */
export default function GenderOnboarding() {
  const router = useRouter();
  const { setGender } = useGender();
  const colors = useColors();
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(null);

  const handleSelectGender = async (gender: 'boy' | 'girl') => {
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setSelectedGender(gender);
      await setGender(gender);
      
      // Navigate to home after selection
      setTimeout(() => {
        router.push('/(tabs)');
      }, 500);
    } catch (error) {
      console.error('Failed to set gender:', error);
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 items-center justify-center gap-8 px-6 py-12">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">
              Choose Your Star
            </Text>
            <Text className="text-base text-muted text-center">
              Select your character avatar to get started
            </Text>
          </View>

          {/* Character Selection Cards */}
          <View className="w-full gap-6">
            {/* Boy Option */}
            <Pressable
              onPress={() => handleSelectGender('boy')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              className="w-full"
            >
              <View
                className={`w-full rounded-2xl p-6 border-2 ${
                  selectedGender === 'boy'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface'
                }`}
              >
                <View className="items-center gap-4">
                  {/* Character Image */}
                  <View className="h-48 w-40 rounded-xl overflow-hidden bg-background border border-border">
                    <Image
                      source={require('@/assets/images/char-en-boy-flag.png')}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>

                  {/* Label */}
                  <Text className="text-xl font-semibold text-foreground">
                    Boy Character
                  </Text>
                  <Text className="text-sm text-muted text-center">
                    Tap to select this avatar
                  </Text>

                  {/* Selected Indicator */}
                  {selectedGender === 'boy' && (
                    <View className="mt-2 px-4 py-2 bg-primary rounded-full">
                      <Text className="text-background font-semibold text-sm">
                        ✓ Selected
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>

            {/* Girl Option */}
            <Pressable
              onPress={() => handleSelectGender('girl')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              className="w-full"
            >
              <View
                className={`w-full rounded-2xl p-6 border-2 ${
                  selectedGender === 'girl'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface'
                }`}
              >
                <View className="items-center gap-4">
                  {/* Character Image */}
                  <View className="h-48 w-40 rounded-xl overflow-hidden bg-background border border-border">
                    <Image
                      source={require('@/assets/images/char-en-girl-flag.png')}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>

                  {/* Label */}
                  <Text className="text-xl font-semibold text-foreground">
                    Girl Character
                  </Text>
                  <Text className="text-sm text-muted text-center">
                    Tap to select this avatar
                  </Text>

                  {/* Selected Indicator */}
                  {selectedGender === 'girl' && (
                    <View className="mt-2 px-4 py-2 bg-primary rounded-full">
                      <Text className="text-background font-semibold text-sm">
                        ✓ Selected
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          </View>

          {/* Info Text */}
          <View className="mt-4 p-4 bg-surface rounded-lg border border-border">
            <Text className="text-xs text-muted text-center leading-relaxed">
              You can change your character avatar anytime in Profile Settings.
              Your choice will be displayed throughout the app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
