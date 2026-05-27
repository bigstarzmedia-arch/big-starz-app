import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

interface StripePaymentProps {
  visible: boolean;
  tier: 'budget' | 'pro' | 'elite';
  onClose: () => void;
  onPaymentComplete: (transactionId: string) => void;
}

const TIER_DETAILS = {
  budget: { price: 2.40, name: 'Budget', features: ['10 AI generations', 'Basic support'] },
  pro: { price: 24, name: 'Pro', features: ['50 AI generations', 'Face/Voice Clone', 'Livestream', 'Priority support'] },
  elite: { price: 98.40, name: 'Elite', features: ['Unlimited generations', 'All Pro features', 'Affiliate program', '24/7 support'] },
};

export function StripePayment({
  visible,
  tier,
  onClose,
  onPaymentComplete,
}: StripePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const tierInfo = TIER_DETAILS[tier];

  const handlePayment = async () => {
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsProcessing(false);
      const transactionId = `txn_${Date.now()}`;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPaymentComplete(transactionId);
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        <View className="bg-primary p-6 items-center">
          <Text className="text-2xl font-bold text-white">
            Upgrade to {tierInfo.name}
          </Text>
        </View>

        <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 16 }}>
          <View className="bg-surface rounded-lg p-6 items-center">
            <Text className="text-5xl font-bold text-primary mb-2">
              ${tierInfo.price.toFixed(2)}
            </Text>
            <Text className="text-muted text-lg">
              per month, cancel anytime
            </Text>
          </View>

          <View className="bg-surface rounded-lg p-6 gap-3">
            <Text className="text-foreground font-bold text-lg mb-2">
              What's included:
            </Text>
            {tierInfo.features.map((feature, i) => (
              <Text key={i} className="text-muted text-sm">
                ✓ {feature}
              </Text>
            ))}
          </View>

          <View className="bg-surface rounded-lg p-6 gap-4">
            <Text className="text-foreground font-bold">
              Payment Method
            </Text>
            <TouchableOpacity className="border-2 border-border rounded-lg p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">💳</Text>
                <View>
                  <Text className="text-foreground font-bold">
                    Credit Card
                  </Text>
                  <Text className="text-muted text-sm">
                    •••• •••• •••• 4242
                  </Text>
                </View>
              </View>
              <Text className="text-primary">✓</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-muted text-xs text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your subscription will auto-renew monthly.
          </Text>
        </ScrollView>

        <View className="p-6 gap-3 border-t border-border">
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessing}
            className={`py-4 rounded-full items-center ${
              isProcessing ? 'bg-muted/30' : 'bg-primary'
            }`}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-background font-bold text-lg">
                Pay ${tierInfo.price.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            disabled={isProcessing}
            className="py-3 rounded-full items-center border-2 border-muted"
          >
            <Text className="text-muted font-bold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
