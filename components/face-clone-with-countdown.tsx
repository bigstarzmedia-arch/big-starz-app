import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

interface FaceCloneCountdownProps {
  visible: boolean;
  onClose: () => void;
  onVoiceCloneUnlocked?: () => void;
}

export function FaceCloneWithCountdown({
  visible,
  onClose,
  onVoiceCloneUnlocked,
}: FaceCloneCountdownProps) {
  const [faceCloneComplete, setFaceCloneComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [voiceCloneUnlocked, setVoiceCloneUnlocked] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (!faceCloneComplete) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setVoiceCloneUnlocked(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onVoiceCloneUnlocked?.();
          return 0;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [faceCloneComplete, onVoiceCloneUnlocked]);

  const handleCompleteFaceClone = () => {
    setFaceCloneComplete(true);
    setCountdown(5);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Face Clone Created', 'Unlocking Voice Clone in 5 seconds...');
  };

  const handleReset = () => {
    setFaceCloneComplete(false);
    setCountdown(5);
    setVoiceCloneUnlocked(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-t-3xl p-6 max-h-[90%]">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <Text className="text-right text-muted text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            👤 Face Clone
          </Text>
          <Text className="text-muted mb-6">
            Create your AI avatar for videos
          </Text>

          {!faceCloneComplete ? (
            <>
              {/* Step 1: Face Clone */}
              <View className="bg-surface border-2 border-primary rounded-lg p-6 mb-6">
                <Text className="text-foreground font-bold text-lg mb-4">
                  Step 1: Create Face Clone
                </Text>

                <View className="bg-primary/10 rounded-lg p-4 mb-6">
                  <Text className="text-primary text-sm leading-relaxed">
                    📸 Upload a clear photo of your face. Our AI will create a digital avatar that can perform in videos.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleCompleteFaceClone}
                  className="bg-primary rounded-full py-4 mb-4"
                >
                  <Text className="text-center text-background font-bold text-lg">
                    Upload Face Photo
                  </Text>
                </TouchableOpacity>

                <View className="bg-warning/10 border border-warning rounded-lg p-3">
                  <Text className="text-warning text-xs font-semibold mb-1">
                    ⚠️ Requirements:
                  </Text>
                  <Text className="text-warning text-xs">
                    • Good lighting{'\n'}
                    • Clear face visible{'\n'}
                    • Neutral background{'\n'}
                    • Face fills 50-70% of frame
                  </Text>
                </View>
              </View>

              {/* Step 2: Voice Clone (Locked) */}
              <View className="bg-surface/50 border-2 border-muted rounded-lg p-6 opacity-50">
                <Text className="text-muted font-bold text-lg mb-4">
                  Step 2: Voice Clone (Locked)
                </Text>
                <Text className="text-muted text-sm">
                  Complete Face Clone first to unlock Voice Clone
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Face Clone Complete */}
              <View className="bg-success/10 border-2 border-success rounded-lg p-6 mb-6">
                <View className="flex-row items-center gap-3 mb-4">
                  <Text className="text-3xl">✓</Text>
                  <Text className="text-success font-bold text-lg flex-1">
                    Face Clone Created!
                  </Text>
                </View>
                <Text className="text-success text-sm">
                  Your AI avatar is ready. Unlocking Voice Clone in {countdown} seconds...
                </Text>
              </View>

              {/* Countdown Timer */}
              <View className="bg-primary/20 rounded-lg p-6 mb-6 items-center">
                <Text className="text-muted text-sm mb-2">Unlocking in</Text>
                <Text className="text-primary text-6xl font-bold">{countdown}</Text>
              </View>

              {/* Voice Clone Status */}
              {voiceCloneUnlocked ? (
                <View className="bg-success/10 border-2 border-success rounded-lg p-6 mb-6">
                  <View className="flex-row items-center gap-3 mb-3">
                    <Text className="text-3xl">🎤</Text>
                    <Text className="text-success font-bold text-lg">
                      Voice Clone Unlocked!
                    </Text>
                  </View>
                  <Text className="text-success text-sm mb-4">
                    Record your voice to create a personalized AI voice for your avatar.
                  </Text>

                  <TouchableOpacity className="bg-success rounded-full py-3">
                    <Text className="text-center text-background font-bold">
                      Record Voice Sample
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="bg-surface/50 border-2 border-muted rounded-lg p-6 opacity-50">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">🔒</Text>
                    <Text className="text-muted font-bold">
                      Voice Clone (Unlocking...)
                    </Text>
                  </View>
                </View>
              )}

              {/* Reset Button */}
              <TouchableOpacity
                onPress={handleReset}
                className="bg-muted/20 rounded-full py-3 mt-6"
              >
                <Text className="text-center text-muted font-bold">
                  Start Over
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
