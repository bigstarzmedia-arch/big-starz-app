import { View, Text, TouchableOpacity, ScrollView, Switch, I18nManager } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useLanguage, useTranslation } from '@/lib/language-provider';
import { LANGUAGES, Language } from '@/lib/i18n';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const { language, setLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Set RTL mode for Arabic and Urdu
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <BigStarzBackground showHeader={true} headerTitle="Settings">
      <ScreenContainer containerClassName="bg-transparent" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF' }}>⚙️ {t('settings.title')}</Text>
        </View>

        {/* Language Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🌐 {t('settings.language')}
          </Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, overflow: 'hidden' }}>
            {(Object.keys(LANGUAGES) as Language[]).map((lang, index) => (
              <TouchableOpacity
                key={lang}
                onPress={() => handleLanguageChange(lang)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: index < Object.keys(LANGUAGES).length - 1 ? 1 : 0,
                  borderBottomColor: '#333',
                  backgroundColor: language === lang ? '#2A2A2A' : '#1A1A1A',
                }}
              >
                <Text style={{ fontSize: 14, color: language === lang ? '#FF0055' : '#FFF', fontWeight: language === lang ? 'bold' : '500' }}>
                  {LANGUAGES[lang]}
                </Text>
                {language === lang && (
                  <Text style={{ fontSize: 18, color: '#FF0055' }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🔔 {t('settings.notifications')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: '#FFF' }}>{t('settings.notifications')}</Text>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              trackColor={{ false: '#333', true: '#FF0055' }}
              thumbColor={notifications ? '#FFF' : '#999'}
            />
          </View>
        </View>

        {/* Theme Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🌙 {t('settings.theme')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: '#FFF' }}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={(value) => {
                setDarkMode(value);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              trackColor={{ false: '#333', true: '#FF0055' }}
              thumbColor={darkMode ? '#FFF' : '#999'}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            ℹ️ {t('settings.about')}
          </Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <Text style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>Big Starz Media</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Version 4.0.0</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              © 2026 Big Starz Media. All rights reserved.
            </Text>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🔒 {t('settings.privacy')}
          </Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, overflow: 'hidden' }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#333',
              }}
            >
              <Text style={{ fontSize: 14, color: '#FFF' }}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Text style={{ fontSize: 14, color: '#FFF' }}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </ScreenContainer>
    </BigStarzBackground>
  );
}