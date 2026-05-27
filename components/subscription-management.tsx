import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';

interface SubscriptionManagementProps {
  visible: boolean;
  currentTier: 'free' | 'budget' | 'pro' | 'elite';
  onClose: () => void;
  onUpgrade: (tier: string) => void;
  onCancel: () => void;
}

const TIER_INFO = {
  free: { name: 'Free', price: '$0', color: '#999' },
  budget: { name: 'Budget', price: '$2.40', color: '#FFD700' },
  pro: { name: 'Pro', price: '$24', color: '#FF1493' },
  elite: { name: 'Elite', price: '$98.40', color: '#00FF88' },
};

export function SubscriptionManagement({
  visible,
  currentTier,
  onClose,
  onUpgrade,
  onCancel,
}: SubscriptionManagementProps) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tierInfo = TIER_INFO[currentTier];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary p-6 items-center">
          <Text className="text-2xl font-bold text-white">
            Subscription Settings
          </Text>
        </View>

        <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 16 }}>
          {/* Current Plan */}
          <View className="bg-surface rounded-lg p-6 gap-4">
            <Text className="text-foreground font-bold text-lg">
              Current Plan
            </Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-foreground">
                  {tierInfo.name}
                </Text>
                <Text className="text-muted text-sm">
                  {tierInfo.price}/month
                </Text>
              </View>
              <View
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: tierInfo.color + '20' }}
              >
                <Text style={{ color: tierInfo.color }} className="font-bold text-sm">
                  Active
                </Text>
              </View>
            </View>
          </View>

          {/* Auto-Renew Toggle */}
          <View className="bg-surface rounded-lg p-6 flex-row items-center justify-between">
            <View>
              <Text className="text-foreground font-bold">
                Auto-Renew
              </Text>
              <Text className="text-muted text-sm">
                Renews on May 27, 2026
              </Text>
            </View>
            <Switch
              value={autoRenew}
              onValueChange={(value) => {
                setAutoRenew(value);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>

          {/* Upgrade Options */}
          <View className="gap-3">
            <Text className="text-foreground font-bold text-lg">
              Upgrade Options
            </Text>

            {Object.entries(TIER_INFO).map(([tier, info]) => {
              if (tier === currentTier) return null;

              return (
                <TouchableOpacity
                  key={tier}
                  onPress={() => {
                    setSelectedTier(tier);
                    onUpgrade(tier);
                  }}
                  className="bg-surface rounded-lg p-4 border-2 border-border"
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-foreground font-bold">
                        {info.name}
                      </Text>
                      <Text className="text-muted text-sm">
                        {info.price}/month
                      </Text>
                    </View>
                    <Text className="text-primary font-bold">
                      →
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Billing History */}
          <View className="bg-surface rounded-lg p-6 gap-3">
            <Text className="text-foreground font-bold text-lg mb-2">
              Billing History
            </Text>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-muted text-sm">May 27, 2026</Text>
              <Text className="text-foreground font-bold">
                {tierInfo.price}
              </Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-muted text-sm">Apr 27, 2026</Text>
              <Text className="text-foreground font-bold">
                {tierInfo.price}
              </Text>
            </View>
            <TouchableOpacity className="mt-2">
              <Text className="text-primary font-bold text-sm">
                View All Transactions →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Subscription */}
          <TouchableOpacity
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onCancel();
            }}
            className="bg-error/10 rounded-lg p-4 items-center border-2 border-error"
          >
            <Text className="text-error font-bold">
              Cancel Subscription
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Footer */}
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
    </Modal>
  );
}
