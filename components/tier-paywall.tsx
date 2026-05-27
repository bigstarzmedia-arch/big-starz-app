import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TierPaywallProps {
  visible: boolean;
  feature: string;
  requiredTier: 'budget' | 'pro' | 'elite';
  onClose: () => void;
  onUpgrade: () => void;
}

export function TierPaywall({
  visible,
  feature,
  requiredTier,
  onClose,
  onUpgrade,
}: TierPaywallProps) {
  const tierPricing = {
    budget: { price: '$2.40', name: 'Budget' },
    pro: { price: '$24', name: 'Pro' },
    elite: { price: '$98.40', name: 'Elite' },
  };

  const handleUpgrade = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onUpgrade();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-background rounded-3xl overflow-hidden w-full max-w-sm">
          {/* Header */}
          <View className="bg-gradient-to-r from-primary to-primary/50 p-6 items-center">
            <Text className="text-4xl mb-2">🔒</Text>
            <Text className="text-2xl font-bold text-white">
              {feature} Locked
            </Text>
          </View>

          {/* Content */}
          <View className="p-6 gap-4">
            <Text className="text-foreground text-center text-lg font-semibold">
              Upgrade to {tierPricing[requiredTier].name} to unlock
            </Text>

            <View className="bg-surface rounded-lg p-4 gap-2">
              <Text className="text-muted text-sm">
                ✨ Current Tier: Free
              </Text>
              <Text className="text-muted text-sm">
                📦 Required: {tierPricing[requiredTier].name}
              </Text>
              <Text className="text-primary font-bold text-lg">
                {tierPricing[requiredTier].price}/month
              </Text>
            </View>

            {/* Benefits */}
            <View className="gap-2">
              <Text className="text-foreground font-bold text-sm">
                What you'll get:
              </Text>
              <Text className="text-muted text-sm">✓ {feature} access</Text>
              <Text className="text-muted text-sm">✓ Priority support</Text>
              <Text className="text-muted text-sm">✓ Advanced analytics</Text>
            </View>

            {/* Buttons */}
            <View className="gap-3 mt-4">
              <TouchableOpacity
                onPress={handleUpgrade}
                className="bg-primary py-4 rounded-full items-center"
              >
                <Text className="text-background font-bold text-lg">
                  Upgrade Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="py-3 rounded-full items-center border-2 border-muted"
              >
                <Text className="text-muted font-bold">
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
