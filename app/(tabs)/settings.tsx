import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useLanguage } from '@/lib/language-provider';
import { LANGUAGES, Language } from '@/lib/i18n';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const { language, setLanguage, isRTL } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF' }}>⚙️ Settings</Text>
        </View>

        {/* Language Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🌐 Language
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
            🔔 Notifications
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
            <Text style={{ fontSize: 14, color: '#FFF' }}>Enable Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              trackColor={{ false: '#666', true: '#FF0055' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Theme Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            🌙 Theme
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
              trackColor={{ false: '#666', true: '#FF0055' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            👤 Account
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 14, color: '#FFF' }}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 14, color: '#FFF' }}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: '#FFF' }}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: () => {
                    if (Platform.OS !== 'web') {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    }
                  },
                },
              ]);
            }}
            style={{
              backgroundColor: '#FF0055',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={{ paddingHorizontal: 16, alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>Big Starz v3.2.0</Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>© 2026 Big Starz Media</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
