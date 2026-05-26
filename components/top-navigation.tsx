import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface TopNavigationProps {
  currentPage?: 'discover' | 'messages' | 'profile' | 'notifications' | 'rewards' | 'moderation';
  onNotificationsPress?: () => void;
  onRewardsPress?: () => void;
  onModerationPress?: () => void;
  unreadCount?: number;
}

export function TopNavigation({
  currentPage = 'discover',
  onNotificationsPress,
  onRewardsPress,
  onModerationPress,
  unreadCount = 0,
}: TopNavigationProps) {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }

    switch (page) {
      case 'discover':
        router.push('/');
        break;
      case 'messages':
        router.push('/chat');
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'notifications':
        onNotificationsPress?.();
        break;
      case 'rewards':
        onRewardsPress?.();
        break;
      case 'moderation':
        onModerationPress?.();
        break;
    }
  };

  const renderButton = (
    icon: string,
    label: string,
    page: string,
    isActive: boolean,
    badge?: number
  ) => (
    <TouchableOpacity
      onPress={() => handleNavigate(page)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
        position: 'relative',
      }}
    >
      <View style={{ position: 'relative' }}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={isActive ? '#FF1493' : '#999'}
        />
        {badge && badge > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: '#FF1493',
              borderRadius: 8,
              width: 16,
              height: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}>
              {badge > 9 ? '9+' : badge}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: isActive ? '#FF1493' : '#999',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingHorizontal: 8,
        paddingTop: 12,
      }}
    >
      {renderButton('compass', 'Discover', 'discover', currentPage === 'discover')}
      {renderButton('chatbubble', 'Messages', 'messages', currentPage === 'messages')}
      {renderButton('person', 'Profile', 'profile', currentPage === 'profile')}
      {renderButton('notifications', 'Alerts', 'notifications', currentPage === 'notifications', unreadCount)}
      {renderButton('gift', 'Rewards', 'rewards', currentPage === 'rewards')}
      {renderButton('shield-checkmark', 'Moderate', 'moderation', currentPage === 'moderation')}
    </View>
  );
}
