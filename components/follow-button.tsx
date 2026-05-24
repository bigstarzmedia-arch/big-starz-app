import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useFollow } from '@/hooks/use-follow';
import { useColors } from '@/hooks/use-colors';

interface FollowButtonProps {
  userId: string;
  creatorName: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'solid' | 'outline';
}

export function FollowButton({
  userId,
  creatorName,
  size = 'medium',
  variant = 'solid',
}: FollowButtonProps) {
  const { isFollowing, toggleFollow } = useFollow();
  const colors = useColors();
  const following = isFollowing(userId);

  const sizeStyles = {
    small: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
    medium: { paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
    large: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16 },
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={() => toggleFollow(userId, creatorName)}
      style={{
        paddingHorizontal: currentSize.paddingHorizontal,
        paddingVertical: currentSize.paddingVertical,
        borderRadius: 8,
        backgroundColor: following
          ? variant === 'solid'
            ? colors.surface
            : 'transparent'
          : colors.primary,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: following ? colors.border : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      activeOpacity={0.7}
    >
      <Text
        style={{
          fontSize: currentSize.fontSize,
          fontWeight: '600',
          color: following
            ? variant === 'solid'
              ? colors.muted
              : colors.primary
            : '#fff',
        }}
      >
        {following ? '✓ Following' : '+ Follow'}
      </Text>
    </TouchableOpacity>
  );
}
