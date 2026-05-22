import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-Out Menu Component
 * Provides access to Profile, Wallet, Music, Casting, Analytics, Settings
 */
export function SlideOutMenu({ isOpen, onClose }: SlideOutMenuProps) {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const [slideAnim] = useState(new Animated.Value(-screenWidth * 0.75));

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -screenWidth * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim, screenWidth]);

  const menuItems: MenuItem[] = [
    { label: 'Profile', icon: 'person.fill', route: '/profile' },
    { label: 'Wallet', icon: 'creditcard.fill', route: '/wallet' },
    { label: 'Music', icon: 'music.note', route: '/music' },
    { label: 'Casting', icon: 'film', route: '/casting' },
    { label: 'Analytics', icon: 'chart.bar.fill', route: '/analytics' },
    { label: 'Settings', icon: 'gearshape.fill', route: '/settings' },
  ];

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
          onPress={onClose}
        />
      )}

      {/* Slide-Out Menu */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: screenWidth * 0.75,
          backgroundColor: '#1a1a1a',
          zIndex: 50,
          transform: [{ translateX: slideAnim }],
          borderRightWidth: 1,
          borderRightColor: '#333333',
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: 60,
            paddingHorizontal: 16,
          }}
        >
          {/* Menu Header */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
              Big Starz
            </Text>
            <Text style={{ fontSize: 12, color: '#888888' }}>
              Casting & Music
            </Text>
          </View>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => handleMenuItemPress(item.route)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 12,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 0, 85, 0.05)',
              }}
            >
              <IconSymbol size={24} name={item.icon as any} color="#FF0055" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#fff',
                  marginLeft: 12,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333333',
              marginVertical: 16,
            }}
          />

          {/* Quick Links */}
          <View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#888888', marginBottom: 12 }}>
              QUICK LINKS
            </Text>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: '#FF0055', fontWeight: '600' }}>
                Help & Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: '#FF0055', fontWeight: '600' }}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ fontSize: 14, color: '#FF0055', fontWeight: '600' }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}
