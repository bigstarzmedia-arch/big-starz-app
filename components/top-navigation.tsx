import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface TopNavigationProps {
  currentPage?: 'discover' | 'messages' | 'profile';
}

export function TopNavigation({ currentPage = 'discover' }: TopNavigationProps) {
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
    }
  };

  const renderButton = (
    icon: string,
    label: string,
    page: string,
    isActive: boolean
  ) => (
    <TouchableOpacity
      onPress={() => handleNavigate(page)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
      }}
    >
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={24}
        color={isActive ? '#FF1493' : '#999'}
      />
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
        paddingHorizontal: 16,
        paddingTop: 12,
      }}
    >
      {renderButton('compass', 'Discover', 'discover', currentPage === 'discover')}
      {renderButton('chatbubble', 'Messages', 'messages', currentPage === 'messages')}
      {renderButton('person', 'Profile', 'profile', currentPage === 'profile')}
    </View>
  );
}
