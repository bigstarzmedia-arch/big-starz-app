import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import { useTierAccess } from '@/hooks/use-tier-access';
import * as Haptics from 'expo-haptics';

interface LivestreamStudioProps {
  visible: boolean;
  onClose: () => void;
  onStartLive?: () => void;
}

export function LivestreamStudioFeature({
  visible,
  onClose,
  onStartLive,
}: LivestreamStudioProps) {
  const { hasFeature } = useTierAccess();
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [donations, setDonations] = useState(0);

  const isFeatureAvailable = hasFeature('livestream');

  const mockViewers = [
    { id: '1', name: '@FanOne', donation: 5 },
    { id: '2', name: '@FanTwo', donation: 10 },
    { id: '3', name: '@FanThree', donation: 0 },
  ];

  const handleStartLive = () => {
    if (!isFeatureAvailable) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setIsLive(true);
    setViewerCount(42);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onStartLive?.();
  };

  const handleEndLive = () => {
    setIsLive(false);
    setViewerCount(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-t-3xl p-6 max-h-[90%]">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <Text className="text-right text-muted text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            🔴 Livestream Studio
          </Text>
          <Text className="text-muted mb-6">
            Stream live with your audience and earn donations
          </Text>

          {!isFeatureAvailable && (
            <View className="bg-error/10 border border-error rounded-lg p-4 mb-6">
              <Text className="text-error font-semibold">
                🔒 Pro tier required
              </Text>
              <Text className="text-error text-sm mt-1">
                Upgrade to Pro to access Livestream Studio
              </Text>
            </View>
          )}

          {isLive ? (
            <>
              {/* Live Status */}
              <View className="bg-error/20 border-2 border-error rounded-lg p-4 mb-6">
                <View className="flex-row items-center gap-2 mb-4">
                  <View className="w-3 h-3 bg-error rounded-full animate-pulse" />
                  <Text className="text-error font-bold text-lg">LIVE NOW</Text>
                </View>

                {/* Stats */}
                <View className="flex-row gap-4 mb-4">
                  <View className="flex-1">
                    <Text className="text-muted text-sm">Viewers</Text>
                    <Text className="text-foreground text-2xl font-bold">
                      {viewerCount}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-muted text-sm">Donations</Text>
                    <Text className="text-primary text-2xl font-bold">
                      ${donations}
                    </Text>
                  </View>
                </View>

                {/* Viewers List */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row gap-2">
                    {mockViewers.map(viewer => (
                      <View
                        key={viewer.id}
                        className="bg-surface rounded-lg p-3 items-center"
                      >
                        <Text className="text-2xl mb-1">👤</Text>
                        <Text className="text-foreground text-xs font-semibold">
                          {viewer.name}
                        </Text>
                        {viewer.donation > 0 && (
                          <Text className="text-primary text-xs mt-1">
                            💰 ${viewer.donation}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* End Live Button */}
                <TouchableOpacity
                  onPress={handleEndLive}
                  className="bg-error rounded-full py-3"
                >
                  <Text className="text-center text-white font-bold">
                    End Livestream
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Start Live Options */}
              <View className="gap-3 mb-6">
                <TouchableOpacity
                  onPress={handleStartLive}
                  disabled={!isFeatureAvailable}
                  className={`rounded-lg p-4 border-2 ${
                    isFeatureAvailable
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/10 border-muted opacity-50'
                  }`}
                >
                  <Text className="text-foreground font-bold text-lg mb-2">
                    🎥 Start Livestream
                  </Text>
                  <Text className="text-muted text-sm">
                    Go live with your audience in real-time
                  </Text>
                </TouchableOpacity>

                <View className="bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-foreground font-bold mb-3">
                    💰 Earn Donations
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-muted">$5 Tip</Text>
                      <Text className="text-primary font-bold">You get $4.50</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-muted">$10 Tip</Text>
                      <Text className="text-primary font-bold">You get $9</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-muted">$50 Tip</Text>
                      <Text className="text-primary font-bold">You get $45</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Start Button */}
              <TouchableOpacity
                onPress={handleStartLive}
                disabled={!isFeatureAvailable}
                className={`rounded-full py-4 ${
                  isFeatureAvailable ? 'bg-primary' : 'bg-muted opacity-50'
                }`}
              >
                <Text className="text-center text-background font-bold text-lg">
                  Start Livestream
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
