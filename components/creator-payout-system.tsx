import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CreatorPayoutSystemProps {
  visible: boolean;
  onClose: () => void;
  onAddBankAccount: (accountData: any) => void;
}

export function CreatorPayoutSystem({
  visible,
  onClose,
  onAddBankAccount,
}: CreatorPayoutSystemProps) {
  const [step, setStep] = useState<'overview' | 'bank' | 'verification'>('overview');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  const handleAddBank = () => {
    if (!bankName || !accountNumber || !routingNumber) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAddBankAccount({ bankName, accountNumber, routingNumber });
    setStep('verification');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary p-6 items-center">
          <Text className="text-2xl font-bold text-white">
            Creator Earnings
          </Text>
        </View>

        <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 16 }}>
          {step === 'overview' && (
            <>
              {/* Total Earnings */}
              <View className="bg-surface rounded-lg p-6 items-center">
                <Text className="text-muted text-sm mb-2">
                  Total Earnings
                </Text>
                <Text className="text-5xl font-bold text-success">
                  $2,450.50
                </Text>
                <Text className="text-muted text-sm mt-2">
                  This month: $450.50
                </Text>
              </View>

              {/* Earnings Breakdown */}
              <View className="bg-surface rounded-lg p-6 gap-4">
                <Text className="text-foreground font-bold text-lg mb-2">
                  Earnings Breakdown
                </Text>
                <View className="flex-row items-center justify-between pb-3 border-b border-border">
                  <Text className="text-muted">Video Views</Text>
                  <Text className="text-foreground font-bold">$1,200</Text>
                </View>
                <View className="flex-row items-center justify-between pb-3 border-b border-border">
                  <Text className="text-muted">Affiliate Commissions</Text>
                  <Text className="text-foreground font-bold">$850</Text>
                </View>
                <View className="flex-row items-center justify-between pb-3 border-b border-border">
                  <Text className="text-muted">Casting Offers</Text>
                  <Text className="text-foreground font-bold">$400</Text>
                </View>
              </View>

              {/* Payout Method */}
              <View className="bg-surface rounded-lg p-6 gap-4">
                <Text className="text-foreground font-bold text-lg mb-2">
                  Payout Method
                </Text>
                <TouchableOpacity
                  onPress={() => setStep('bank')}
                  className="border-2 border-border rounded-lg p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">🏦</Text>
                    <View>
                      <Text className="text-foreground font-bold">
                        Bank Account
                      </Text>
                      <Text className="text-muted text-sm">
                        •••• •••• •••• 5678
                      </Text>
                    </View>
                  </View>
                  <Text className="text-primary">✓</Text>
                </TouchableOpacity>
              </View>

              {/* Pending Payout */}
              <View className="bg-surface rounded-lg p-6 gap-3">
                <Text className="text-foreground font-bold text-lg mb-2">
                  Pending Payout
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-muted">Next Payout Date</Text>
                  <Text className="text-foreground font-bold">
                    June 1, 2026
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-muted">Amount</Text>
                  <Text className="text-success font-bold text-lg">
                    $450.50
                  </Text>
                </View>
              </View>
            </>
          )}

          {step === 'bank' && (
            <>
              <Text className="text-foreground text-center">
                Add your bank account for monthly payouts
              </Text>

              <TextInput
                placeholder="Bank Name"
                placeholderTextColor="#666"
                value={bankName}
                onChangeText={setBankName}
                className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
              />

              <TextInput
                placeholder="Routing Number"
                placeholderTextColor="#666"
                value={routingNumber}
                onChangeText={setRoutingNumber}
                keyboardType="number-pad"
                className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
              />

              <TextInput
                placeholder="Account Number"
                placeholderTextColor="#666"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
              />

              <TouchableOpacity
                onPress={handleAddBank}
                className="bg-primary py-4 rounded-full items-center"
              >
                <Text className="text-background font-bold text-lg">
                  Add Bank Account
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'verification' && (
            <>
              <View className="items-center gap-4">
                <Text className="text-4xl">✓</Text>
                <Text className="text-foreground font-bold text-lg text-center">
                  Bank Account Added
                </Text>
                <Text className="text-muted text-center">
                  Your account will be verified within 24 hours. You can start receiving payouts on the next payout date.
                </Text>
              </View>
            </>
          )}
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
