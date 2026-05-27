import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/lib/language-context';
import { Language } from '@/lib/translations';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES: { code: Language; name: string; flag: string; character: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', character: '🧑‍💼' },
  { code: 'es', name: 'Español', flag: '🇪🇸', character: '🧑‍🎤' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', character: '🧑‍🎨' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', character: '🧑‍🎓' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', character: '🧑‍🏫' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', character: '🧑‍💻' },
];

export function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-background rounded-t-3xl mt-auto">
          {/* Header */}
          <View className="border-b border-border p-6 items-center">
            <Text className="text-2xl font-bold text-foreground">
              Select Language
            </Text>
            <Text className="text-muted text-sm mt-2">
              Choose your preferred language
            </Text>
          </View>

          {/* Language List */}
          <ScrollView className="flex-1 p-6">
            <View className="gap-3">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.code)}
                  className={`flex-row items-center p-4 rounded-2xl border-2 ${
                    language === lang.code
                      ? 'bg-primary/20 border-primary'
                      : 'bg-surface border-border'
                  }`}
                  activeOpacity={0.7}
                >
                  {/* Character Guide */}
                  <Text className="text-5xl mr-4">{lang.character}</Text>

                  {/* Language Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-2xl">{lang.flag}</Text>
                      <Text className="text-lg font-bold text-foreground">
                        {lang.name}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted mt-1">
                      {lang.code === 'en' && 'English - Global'}
                      {lang.code === 'es' && 'Spanish - Spain & Latin America'}
                      {lang.code === 'fr' && 'French - France & Africa'}
                      {lang.code === 'hi' && 'Hindi - India'}
                      {lang.code === 'ar' && 'Arabic - Middle East'}
                      {lang.code === 'pt' && 'Portuguese - Brazil & Portugal'}
                    </Text>
                  </View>

                  {/* Checkmark */}
                  {language === lang.code && (
                    <Text className="text-2xl text-primary">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Close Button */}
          <View className="p-6 border-t border-border">
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary py-4 rounded-full items-center"
            >
              <Text className="text-background font-bold text-lg">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
