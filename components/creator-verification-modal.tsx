import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useCreatorVerification } from '@/hooks/use-creator-verification';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface CreatorVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

export function CreatorVerificationModal({
  visible,
  onClose,
  onVerificationComplete,
}: CreatorVerificationModalProps) {
  const {
    currentStep,
    verificationData,
    isLoading,
    error,
    verifyEmail,
    verifyIdentity,
    verifyBank,
    getVerificationProgress,
  } = useCreatorVerification();

  // Email verification state
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  // Identity verification state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [idType, setIdType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [idNumber, setIdNumber] = useState('');

  // Bank verification state
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const handleEmailVerify = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    await verifyEmail(email, emailOtp);
  };

  const handleIdentityVerify = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    await verifyIdentity(firstName, lastName, dateOfBirth, idType, idNumber, '');
  };

  const handleBankVerify = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    const success = await verifyBank(accountHolderName, accountNumber, routingNumber, bankName);
    if (success) {
      onVerificationComplete();
    }
  };

  const progress = getVerificationProgress();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 24, gap: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
              Creator Verification
            </Text>
            <Text style={{ fontSize: 14, color: '#999' }}>
              Complete verification to unlock the Affiliate Program
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={{ marginBottom: 24, gap: 8 }}>
            <View
              style={{
                height: 8,
                backgroundColor: '#1A1A1A',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: '#FF1493',
                }}
              />
            </View>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'right' }}>
              {progress}% Complete
            </Text>
          </View>

          {/* Email Verification Step */}
          {currentStep === 'email' && (
            <View style={{ gap: 16, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                📧 Step 1: Verify Email
              </Text>

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#666"
                value={emailOtp}
                onChangeText={setEmailOtp}
                keyboardType="number-pad"
                maxLength={6}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              {error && (
                <Text style={{ color: '#FF6B6B', fontSize: 12 }}>
                  ❌ {error}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleEmailVerify}
                disabled={isLoading || !email || !emailOtp}
                style={{
                  backgroundColor: isLoading ? '#FF1493' : '#FF1493',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: isLoading || !email || !emailOtp ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    Verify Email
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Identity Verification Step */}
          {currentStep === 'identity' && (
            <View style={{ gap: 16, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                🆔 Step 2: Verify Identity
              </Text>

              <TextInput
                placeholder="First Name"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Date of Birth (MM/DD/YYYY)"
                placeholderTextColor="#666"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="ID Number"
                placeholderTextColor="#666"
                value={idNumber}
                onChangeText={setIdNumber}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              {error && (
                <Text style={{ color: '#FF6B6B', fontSize: 12 }}>
                  ❌ {error}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleIdentityVerify}
                disabled={isLoading || !firstName || !lastName || !dateOfBirth || !idNumber}
                style={{
                  backgroundColor: '#FF1493',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: isLoading || !firstName || !lastName || !dateOfBirth || !idNumber ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    Verify Identity
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Bank Verification Step */}
          {currentStep === 'bank' && (
            <View style={{ gap: 16, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                🏦 Step 3: Verify Bank Account
              </Text>

              <TextInput
                placeholder="Account Holder Name"
                placeholderTextColor="#666"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Account Number"
                placeholderTextColor="#666"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Routing Number"
                placeholderTextColor="#666"
                value={routingNumber}
                onChangeText={setRoutingNumber}
                keyboardType="number-pad"
                maxLength={9}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="Bank Name"
                placeholderTextColor="#666"
                value={bankName}
                onChangeText={setBankName}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                }}
              />

              {error && (
                <Text style={{ color: '#FF6B6B', fontSize: 12 }}>
                  ❌ {error}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleBankVerify}
                disabled={isLoading || !accountHolderName || !accountNumber || !routingNumber || !bankName}
                style={{
                  backgroundColor: '#FFD700',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: isLoading || !accountHolderName || !accountNumber || !routingNumber || !bankName ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={{ color: '#000', fontWeight: '600' }}>
                    Complete Verification
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Completion Step */}
          {currentStep === 'complete' && (
            <View style={{ gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 48 }}>🎉</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                Verification Complete!
              </Text>
              <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
                You're now eligible for the Affiliate Program and can start earning!
              </Text>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: '#1A1A1A',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              {currentStep === 'complete' ? 'Close' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
