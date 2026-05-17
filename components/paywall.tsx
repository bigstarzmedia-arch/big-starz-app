import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (tier: 'free' | 'pro' | 'elite') => Promise<void>;
  currentTier?: 'free' | 'pro' | 'elite';
}

export function Paywall({ visible, onClose, onSubscribe, currentTier = 'free' }: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'elite'>('pro');

  const handleSubscribe = async (tier: 'free' | 'pro' | 'elite') => {
    if (tier === 'free') {
      onClose();
      return;
    }

    setLoading(true);
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await onSubscribe(tier);
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'space-between' }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 32, color: '#FF0055', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }}>
              Unlock Big Starz Premium
            </Text>
            <Text style={{ fontSize: 14, color: '#AAA', textAlign: 'center' }}>
              Choose your plan and start creating unlimited content
            </Text>
          </View>

          {/* Tier Cards */}
          <View style={{ gap: 16, marginVertical: 20 }}>
            {/* Free Tier */}
            <TouchableOpacity
              onPress={() => setSelectedTier('free')}
              style={{
                backgroundColor: selectedTier === 'free' ? '#1A1A1A' : '#0A0A0A',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: selectedTier === 'free' ? '#FF0055' : '#333',
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Free</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#AAA' }}>$0</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#AAA' }}>Perfect for getting started</Text>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ 3 videos per day</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Basic styles</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Standard quality</Text>
              </View>
              {currentTier === 'free' && (
                <View
                  style={{
                    backgroundColor: '#FF0055',
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Pro Tier */}
            <TouchableOpacity
              onPress={() => setSelectedTier('pro')}
              style={{
                backgroundColor: selectedTier === 'pro' ? '#1A1A1A' : '#0A0A0A',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: selectedTier === 'pro' ? '#FF0055' : '#333',
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>Pro</Text>
                  <Text style={{ fontSize: 10, color: '#AAA' }}>Most Popular</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF0055' }}>$30</Text>
                  <Text style={{ fontSize: 10, color: '#AAA' }}>/month</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: '#AAA' }}>For serious creators</Text>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ 50 videos per day</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ All styles & effects</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ 4K quality</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Priority processing</Text>
              </View>
              {currentTier === 'pro' && (
                <View
                  style={{
                    backgroundColor: '#FF0055',
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Elite Tier */}
            <TouchableOpacity
              onPress={() => setSelectedTier('elite')}
              style={{
                backgroundColor: selectedTier === 'elite' ? '#1A1A1A' : '#0A0A0A',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: selectedTier === 'elite' ? '#FFFF00' : '#333',
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFF00' }}>Elite</Text>
                  <Text style={{ fontSize: 10, color: '#AAA' }}>Premium Experience</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFF00' }}>$99</Text>
                  <Text style={{ fontSize: 10, color: '#AAA' }}>/month</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: '#AAA' }}>For professional studios</Text>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Unlimited videos</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ All premium features</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ 8K quality</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Instant processing</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>✓ Custom watermark</Text>
              </View>
              {currentTier === 'elite' && (
                <View
                  style={{
                    backgroundColor: '#FFFF00',
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            onPress={() => handleSubscribe(selectedTier)}
            disabled={loading || selectedTier === currentTier}
            style={{
              backgroundColor:
                selectedTier === 'elite'
                  ? '#FFFF00'
                  : selectedTier === 'pro'
                    ? '#FF0055'
                    : '#666',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 20,
            }}
          >
            {loading ? (
              <>
                <ActivityIndicator color={selectedTier === 'elite' ? '#000' : '#FFF'} />
                <Text
                  style={{
                    color: selectedTier === 'elite' ? '#000' : '#FFF',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  Processing...
                </Text>
              </>
            ) : selectedTier === currentTier ? (
              <Text
                style={{
                  color: selectedTier === 'elite' ? '#000' : '#FFF',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Current Plan
              </Text>
            ) : (
              <Text
                style={{
                  color: selectedTier === 'elite' ? '#000' : '#FFF',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {selectedTier === 'free' ? 'Continue' : 'Subscribe Now'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={{ fontSize: 10, color: '#666', textAlign: 'center' }}>
            By subscribing, you agree to our Terms of Service. Subscriptions auto-renew monthly.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
