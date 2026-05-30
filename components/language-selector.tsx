import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/lib/language-provider';
import type { Language } from '@/lib/i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

type Gender = 'boy' | 'girl';

const LANGUAGES: {
  code: Language;
  name: string;
  flag: string;
  region: string;
  boyImage: string;
  girlImage: string;
}[] = [
  {
    code: 'en',
    name: 'English (UK)',
    flag: '🇬🇧',
    region: 'United Kingdom',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-en-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-en-girl-flag.png',
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    region: 'Spain & Latin America',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-es-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-es-girl-flag.png',
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    region: 'France & Africa',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-fr-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-fr-girl-flag.png',
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    region: 'Brazil & Portugal',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-pt-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-pt-girl-flag.png',
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    region: 'India & South Asia',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-hi-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-hi-girl-flag.png',
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    region: 'Middle East & Gulf',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-ar-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-ar-girl-flag.png',
  },
  {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    region: 'Italy & Europe',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-it-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-it-girl-flag.png',
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    region: 'Germany & Europe',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-de-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-de-girl-flag.png',
  },
  {
    code: 'us',
    name: 'English (USA)',
    flag: '🇺🇸',
    region: 'United States',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-us-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-us-girl-flag.png',
  },
  {
    code: 'sw',
    name: 'Kiswahili',
    flag: '🇰🇪',
    region: 'Kenya & East Africa',
    boyImage: 'https://manus-assets.s3.amazonaws.com/char-ke-boy-flag.png',
    girlImage: 'https://manus-assets.s3.amazonaws.com/char-ke-girl-flag.png',
  },
];

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [selectedGender, setSelectedGender] = useState<Gender>('boy');

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const toggleGender = () => {
    setSelectedGender(selectedGender === 'boy' ? 'girl' : 'boy');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-background rounded-t-3xl mt-auto">
          {/* Header */}
          <View className="border-b border-border p-6 items-center">
            <Text className="text-2xl font-bold text-foreground">
              Choose Your Language
            </Text>
            <Text className="text-muted text-sm mt-2">
              Select language & character style
            </Text>

            {/* Gender Toggle */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={toggleGender}
                className={`px-6 py-2 rounded-full border-2 ${
                  selectedGender === 'boy'
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedGender === 'boy' ? 'text-background' : 'text-foreground'
                  }`}
                >
                  👦 Boy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleGender}
                className={`px-6 py-2 rounded-full border-2 ${
                  selectedGender === 'girl'
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedGender === 'girl' ? 'text-background' : 'text-foreground'
                  }`}
                >
                  👧 Girl
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Language List */}
          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              {LANGUAGES.map((lang) => {
                const characterImage =
                  selectedGender === 'boy' ? lang.boyImage : lang.girlImage;
                const isSelected = language === lang.code;

                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageSelect(lang.code)}
                    className={`flex-row items-center p-4 rounded-2xl border-2 overflow-hidden ${
                      isSelected
                        ? 'bg-primary/20 border-primary'
                        : 'bg-surface border-border'
                    }`}
                    activeOpacity={0.7}
                  >
                    {/* Character Image */}
                    <Image
                      source={{ uri: characterImage }}
                      className="w-20 h-24 rounded-lg mr-4"
                      resizeMode="contain"
                    />

                    {/* Language Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-2xl">{lang.flag}</Text>
                        <Text className="text-lg font-bold text-foreground">
                          {lang.name}
                        </Text>
                      </View>
                      <Text className="text-sm text-muted mt-1">{lang.region}</Text>
                      <Text className="text-xs text-muted/70 mt-1">
                        {selectedGender === 'boy' ? 'Boy Character' : 'Girl Character'}
                      </Text>
                    </View>

                    {/* Checkmark */}
                    {isSelected && (
                      <View className="bg-primary rounded-full w-8 h-8 items-center justify-center ml-2">
                        <Text className="text-background font-bold text-lg">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Spacing for scroll */}
            <View className="h-6" />
          </ScrollView>

          {/* Close Button */}
          <View className="p-6 border-t border-border">
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary py-4 rounded-full items-center active:opacity-80"
            >
              <Text className="text-background font-bold text-lg">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
