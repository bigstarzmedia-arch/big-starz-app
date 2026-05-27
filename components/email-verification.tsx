import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface EmailVerificationProps {
  visible: boolean;
  onClose: () => void;
  onVerified: (email: string) => void;
}

export function EmailVerification({
  visible,
  onClose,
  onVerified,
}: EmailVerificationProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.includes('@')) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onVerified(email);
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-background rounded-3xl overflow-hidden w-full max-w-sm">
          {/* Header */}
          <View className="bg-primary p-6 items-center">
            <Text className="text-4xl mb-2">✉️</Text>
            <Text className="text-2xl font-bold text-white">
              Verify Email
            </Text>
          </View>

          {/* Content */}
          <View className="p-6 gap-4">
            {step === 'email' ? (
              <>
                <Text className="text-foreground text-center">
                  Enter your email to unlock Pro features
                </Text>

                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground"
                />

                <TouchableOpacity
                  onPress={handleSendOTP}
                  disabled={isLoading || !email}
                  className={`py-4 rounded-full items-center ${
                    isLoading || !email ? 'bg-muted/30' : 'bg-primary'
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-background font-bold text-lg">
                      Send OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-foreground text-center">
                  Enter the 6-digit code sent to {email}
                </Text>

                <TextInput
                  placeholder="000000"
                  placeholderTextColor="#666"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  className="bg-surface border-2 border-border rounded-lg px-4 py-3 text-foreground text-center text-2xl tracking-widest"
                />

                <TouchableOpacity
                  onPress={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className={`py-4 rounded-full items-center ${
                    isLoading || otp.length !== 6 ? 'bg-muted/30' : 'bg-success'
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-background font-bold text-lg">
                      Verify Code
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setStep('email');
                    setOtp('');
                  }}
                  className="py-2 items-center"
                >
                  <Text className="text-muted text-sm">
                    Use different email
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="py-3 rounded-full items-center border-2 border-muted"
            >
              <Text className="text-muted font-bold">
                Skip for Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
