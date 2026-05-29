import { View, Text, Pressable, Image } from 'react-native';
import { useGender, getCharacterImage } from '@/lib/gender-context';
import { useColors } from '@/hooks/use-colors';
import { useLanguage } from '@/lib/language-provider';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

/**
 * Gender Toggle Component
 * Allows users to switch between boy/girl character avatars
 * Used in profile settings and other screens
 */
export function GenderToggle() {
  const { gender, setGender, isLoading } = useGender();
  const { language } = useLanguage();
  const colors = useColors();
  const [isChanging, setIsChanging] = useState(false);

  const handleToggleGender = async () => {
    if (isLoading || isChanging) return;

    try {
      setIsChanging(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const newGender = gender === 'boy' ? 'girl' : 'boy';
      await setGender(newGender);

      // Success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to toggle gender:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsChanging(false);
    }
  };

  if (isLoading) {
    return (
      <View className="w-full p-4 bg-surface rounded-lg border border-border">
        <Text className="text-center text-muted">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      {/* Header */}
      <View className="px-1">
        <Text className="text-lg font-semibold text-foreground">
          Character Avatar
        </Text>
        <Text className="text-sm text-muted mt-1">
          Choose how your character appears throughout the app
        </Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row gap-3">
        {/* Boy Button */}
        <Pressable
          onPress={() => gender !== 'boy' && handleToggleGender()}
          disabled={isChanging}
          style={({ pressed }) => [
            {
              opacity: pressed && gender !== 'boy' ? 0.8 : 1,
              transform: [{ scale: pressed && gender !== 'boy' ? 0.98 : 1 }],
            },
          ]}
          className="flex-1"
        >
          <View
            className={`rounded-lg p-4 border-2 items-center gap-2 ${
              gender === 'boy'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface'
            }`}
          >
            <View className="h-20 w-16 rounded-lg overflow-hidden bg-background border border-border">
              <Image
                source={require('@/../webdev-static-assets/char-en-boy-flag.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text
              className={`text-sm font-semibold ${
                gender === 'boy' ? 'text-primary' : 'text-muted'
              }`}
            >
              Boy
            </Text>
            {gender === 'boy' && (
              <Text className="text-xs text-primary font-bold">✓ Active</Text>
            )}
          </View>
        </Pressable>

        {/* Girl Button */}
        <Pressable
          onPress={() => gender !== 'girl' && handleToggleGender()}
          disabled={isChanging}
          style={({ pressed }) => [
            {
              opacity: pressed && gender !== 'girl' ? 0.8 : 1,
              transform: [{ scale: pressed && gender !== 'girl' ? 0.98 : 1 }],
            },
          ]}
          className="flex-1"
        >
          <View
            className={`rounded-lg p-4 border-2 items-center gap-2 ${
              gender === 'girl'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface'
            }`}
          >
            <View className="h-20 w-16 rounded-lg overflow-hidden bg-background border border-border">
              <Image
                source={require('@/../webdev-static-assets/char-en-girl-flag.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text
              className={`text-sm font-semibold ${
                gender === 'girl' ? 'text-primary' : 'text-muted'
              }`}
            >
              Girl
            </Text>
            {gender === 'girl' && (
              <Text className="text-xs text-primary font-bold">✓ Active</Text>
            )}
          </View>
        </Pressable>
      </View>

      {/* Info */}
      <View className="p-3 bg-surface rounded-lg border border-border">
        <Text className="text-xs text-muted leading-relaxed">
          Your character avatar is displayed on your profile, in videos, and when
          sharing content. You can change it anytime.
        </Text>
      </View>
    </View>
  );
}
