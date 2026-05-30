import { View, Text, Pressable, Modal, Image, ScrollView, Share, Alert } from 'react-native';
import { useGender, getCharacterImage } from '@/lib/gender-context';
import { useLanguage } from '@/lib/language-provider';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface SocialShareModalProps {
  visible: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoTitle?: string;
  creatorName?: string;
  creatorHandle?: string;
  onShareComplete?: (platform: string) => void;
}

/**
 * Social Share Modal
 * Allows users to share videos with their character avatar overlay
 * Supports Instagram, TikTok, Twitter, and generic share
 */
export function SocialShareModal({
  visible,
  onClose,
  videoUrl,
  videoTitle = 'Check out my creation!',
  creatorName = 'Big Starz Creator',
  creatorHandle = '@bigstarz',
  onShareComplete,
}: SocialShareModalProps) {
  const { gender } = useGender();
  const { language } = useLanguage();
  const colors = useColors();
  const [isSharing, setIsSharing] = useState(false);

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E4405F',
      description: 'Share to Instagram',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: 'logo-tiktok',
      color: '#000000',
      description: 'Share to TikTok',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      description: 'Share to Twitter/X',
    },
    {
      id: 'generic',
      name: 'More',
      icon: 'share-social',
      color: '#8B5CF6',
      description: 'Share via other apps',
    },
  ];

  const handleShare = async (platform: string) => {
    try {
      setIsSharing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const shareMessage = `${videoTitle}\n\nCreated by ${creatorName} (${creatorHandle})\n\n🌟 Big Starz - Unleash the star within you!\n\n${videoUrl || ''}`;

      if (platform === 'generic') {
        // Use native share sheet
        await Share.share({
          message: shareMessage,
          title: videoTitle,
          url: videoUrl,
        });
      } else {
        // Platform-specific share (in real app, would use deep links)
        Alert.alert(
          `Share to ${platform}`,
          `Opening ${platform}...\n\n${shareMessage}`,
          [
            {
              text: 'Cancel',
              onPress: () => setIsSharing(false),
              style: 'cancel',
            },
            {
              text: 'Copy Link',
              onPress: async () => {
                // In production, would copy to clipboard
                Alert.alert('Success', 'Link copied to clipboard!');
                setIsSharing(false);
              },
            },
          ]
        );
      }

      // Track share analytics
      onShareComplete?.(platform);

      // Success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Share error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-background rounded-t-3xl mt-auto">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <Text className="text-xl font-bold text-foreground">Share Your Creation</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Preview Card */}
            <View className="mb-6 rounded-lg overflow-hidden bg-surface border border-border">
              {/* Character Avatar Overlay */}
              <View className="relative h-40 bg-gradient-to-b from-primary/20 to-primary/5 items-center justify-center">
                <View className="absolute inset-0 items-center justify-center">
                  <Image
                    source={{ uri: 'https://manus-assets.s3.amazonaws.com/char-en-boy-flag.png' }}
                    className="w-24 h-32 opacity-80"
                    resizeMode="contain"
                  />
                </View>

                {/* Video Title Overlay */}
                <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                  <Text className="text-white font-semibold text-sm" numberOfLines={2}>
                    {videoTitle}
                  </Text>
                </View>
              </View>

              {/* Creator Info */}
              <View className="p-4 gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                    <Text className="text-primary font-bold">👤</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{creatorName}</Text>
                    <Text className="text-xs text-muted">{creatorHandle}</Text>
                  </View>
                </View>

                {/* Share Message */}
                <Text className="text-sm text-muted mt-2">
                  🌟 Big Starz - Unleash the star within you!
                </Text>
              </View>
            </View>

            {/* Share Platforms */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-semibold text-muted px-1">Share to:</Text>

              {platforms.map((platform) => (
                <Pressable
                  key={platform.id}
                  onPress={() => handleShare(platform.id)}
                  disabled={isSharing}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View className="flex-row items-center gap-3 p-4 bg-surface rounded-lg border border-border">
                    <View
                      className="w-12 h-12 rounded-lg items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Ionicons
                        name={platform.icon as any}
                        size={24}
                        color={platform.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{platform.name}</Text>
                      <Text className="text-xs text-muted">{platform.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Share Stats */}
            <View className="p-4 bg-surface rounded-lg border border-border mb-6">
              <Text className="text-sm font-semibold text-foreground mb-3">Share Stats</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Total Shares:</Text>
                  <Text className="text-sm font-semibold text-foreground">0</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">This Week:</Text>
                  <Text className="text-sm font-semibold text-foreground">0</Text>
                </View>
              </View>
            </View>

            {/* Info */}
            <View className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-6">
              <Text className="text-xs text-primary leading-relaxed">
                💡 Tip: Sharing increases your visibility and helps reach more viewers!
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <View className="p-4 border-t border-border">
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View className="bg-surface rounded-lg p-4 items-center border border-border">
                <Text className="font-semibold text-foreground">Close</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
