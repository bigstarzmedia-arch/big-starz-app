import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface SettingsPreferencesProps {
  visible: boolean;
  onClose: () => void;
}

interface SettingItem {
  id: string;
  category: 'privacy' | 'notifications' | 'content' | 'account';
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'button';
  value?: boolean;
  icon: string;
}

export function SettingsPreferences({ visible, onClose }: SettingsPreferencesProps) {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: '1',
      category: 'privacy',
      title: 'Private Account',
      description: 'Only followers can see your videos',
      type: 'toggle',
      value: false,
      icon: '🔒',
    },
    {
      id: '2',
      category: 'privacy',
      title: 'Allow Comments',
      description: 'Let others comment on your videos',
      type: 'toggle',
      value: true,
      icon: '💬',
    },
    {
      id: '3',
      category: 'privacy',
      title: 'Allow Duets',
      description: 'Let others create duets with your videos',
      type: 'toggle',
      value: true,
      icon: '🎬',
    },
    {
      id: '4',
      category: 'notifications',
      title: 'Push Notifications',
      description: 'Receive push notifications',
      type: 'toggle',
      value: true,
      icon: '🔔',
    },
    {
      id: '5',
      category: 'notifications',
      title: 'Email Notifications',
      description: 'Receive email updates',
      type: 'toggle',
      value: false,
      icon: '📧',
    },
    {
      id: '6',
      category: 'notifications',
      title: 'Comment Notifications',
      description: 'Notify on new comments',
      type: 'toggle',
      value: true,
      icon: '💭',
    },
    {
      id: '7',
      category: 'content',
      title: 'Mature Content',
      description: 'Show mature content in feed',
      type: 'toggle',
      value: false,
      icon: '⚠️',
    },
    {
      id: '8',
      category: 'content',
      title: 'Explicit Language Filter',
      description: 'Filter explicit language',
      type: 'toggle',
      value: true,
      icon: '🚫',
    },
    {
      id: '9',
      category: 'account',
      title: 'Two-Factor Authentication',
      description: 'Secure your account with 2FA',
      type: 'button',
      icon: '🔐',
    },
    {
      id: '10',
      category: 'account',
      title: 'Download Data',
      description: 'Export your account data',
      type: 'button',
      icon: '📥',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<'privacy' | 'notifications' | 'content' | 'account'>('privacy');

  const handleToggleSetting = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const handleButtonPress = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    // Handle button actions
    console.log(`Button pressed: ${id}`);
  };

  const filteredSettings = settings.filter((s) => s.category === activeCategory);

  const renderSettingItem = (item: SettingItem) => (
    <View
      key={item.id}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Icon */}
      <Text style={{ fontSize: 24 }}>{item.icon}</Text>

      {/* Content */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.description}
        </Text>
      </View>

      {/* Control */}
      {item.type === 'toggle' && (
        <Switch
          value={item.value || false}
          onValueChange={() => handleToggleSetting(item.id)}
          trackColor={{ false: '#333', true: '#FF1493' }}
          thumbColor={item.value ? '#fff' : '#999'}
        />
      )}

      {item.type === 'button' && (
        <TouchableOpacity
          onPress={() => handleButtonPress(item.id)}
          style={{
            backgroundColor: '#FF1493',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#fff' }}>
            Set Up
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              ⚙️ Settings
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Category Tabs */}
          <View style={{ gap: 8, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setActiveCategory('privacy')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeCategory === 'privacy' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeCategory === 'privacy' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeCategory === 'privacy' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Privacy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveCategory('notifications')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeCategory === 'notifications' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeCategory === 'notifications' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeCategory === 'notifications' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Notifications
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setActiveCategory('content')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeCategory === 'content' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeCategory === 'content' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeCategory === 'content' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Content
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveCategory('account')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeCategory === 'account' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeCategory === 'account' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeCategory === 'account' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings List */}
          <View>
            {filteredSettings.map((setting) => renderSettingItem(setting))}
          </View>

          {/* Danger Zone */}
          <View
            style={{
              backgroundColor: 'rgba(255,107,107,0.1)',
              borderRadius: 12,
              padding: 12,
              marginTop: 20,
              borderLeftWidth: 3,
              borderLeftColor: '#FF6B6B',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF6B6B', marginBottom: 8 }}>
              ⚠️ Danger Zone
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6B6B',
                paddingVertical: 10,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
