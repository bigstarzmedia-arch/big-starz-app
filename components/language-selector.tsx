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
    name: 'English',
    flag: '🇬🇧',
    region: 'Global',
    boyImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-en-boy-dThZKQuESrVN73qweHxZui.webp',
    girlImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-en-girl-7wXPnX29a25wJMEdsEVj2Q.webp',
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    region: 'Middle East & Gulf',
    boyImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-ar-boy-4wx7t7o4a8WBKhzwrrjyNs.webp',
    girlImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-ar-girl-hnExoAoetnzMDVeGvwdNk4.webp',
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    region: 'India & South Asia',
    boyImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-hi-boy-cUmCxhbe5w6fghJYQeJQkL.webp',
    girlImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-hi-girl-TGgfBGihZF2u38pHYGKr8x.webp',
  },
  {
    code: 'ur',
    name: 'اردو',
    flag: '🇵🇰',
    region: 'Pakistan',
    boyImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-ar-boy-4wx7t7o4a8WBKhzwrrjyNs.webp',
    girlImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-ar-girl-hnExoAoetnzMDVeGvwdNk4.webp',
  },
  {
    code: 'sw',
    name: 'Kiswahili',
    flag: '🇰🇪',
    region: 'East Africa',
    boyImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-es-boy-KpFWwm8kgUKY7bSrpGi9y4.webp',
    girlImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/char-es-girl-Gheiqo7eML4tgBSD9U94rx.webp',
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
