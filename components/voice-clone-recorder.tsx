import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface VoiceCloneRecorderProps {
  visible: boolean;
  onClose: () => void;
  onRecordingComplete?: (audioUri: string) => void;
}

export function VoiceCloneRecorder({
  visible,
  onClose,
  onRecordingComplete,
}: VoiceCloneRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const MAX_RECORDING_TIME = 10; // 10 seconds

  // Countdown effect for recording
  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= MAX_RECORDING_TIME) {
          stopRecording();
          return MAX_RECORDING_TIME;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      // Mock recording start
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      // Mock recording URI
      setRecordedUri(`file:///mock/voice-clone-${Date.now()}.wav`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const playRecording = async () => {
    try {
      setIsPlaying(true);
      // Simulate playback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setTimeout(() => {
        setIsPlaying(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to play recording');
      setIsPlaying(false);
    }
  };

  const handleConfirm = () => {
    if (recordedUri) {
      onRecordingComplete?.(recordedUri);
      Alert.alert('Success', 'Voice Clone created! Ready to generate videos.');
      onClose();
    }
  };

  const handleRetry = () => {
    setRecordedUri(null);
    setRecordingTime(0);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-t-3xl p-6 max-h-[90%]">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <Text className="text-right text-muted text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            🎤 Voice Clone
          </Text>
          <Text className="text-muted mb-6">
            Record your voice (10 seconds max)
          </Text>

          {!recordedUri ? (
            <>
              {/* Recording Instructions */}
              <View className="bg-surface border-2 border-primary rounded-lg p-6 mb-6">
                <Text className="text-foreground font-bold text-lg mb-4">
                  Recording Tips
                </Text>

                <View className="gap-3">
                  <View className="flex-row gap-3">
                    <Text className="text-primary text-lg">🎙️</Text>
                    <Text className="text-muted text-sm flex-1">
                      Speak clearly and naturally
                    </Text>
                  </View>
                  <View className="flex-row gap-3">
                    <Text className="text-primary text-lg">🔇</Text>
                    <Text className="text-muted text-sm flex-1">
                      Minimize background noise
                    </Text>
                  </View>
                  <View className="flex-row gap-3">
                    <Text className="text-primary text-lg">⏱️</Text>
                    <Text className="text-muted text-sm flex-1">
                      Record 5-10 seconds of speech
                    </Text>
                  </View>
                </View>
              </View>

              {/* Recording Button */}
              {!isRecording ? (
                <TouchableOpacity
                  onPress={startRecording}
                  className="bg-primary rounded-full py-6 mb-6 items-center"
                >
                  <Text className="text-background font-bold text-xl">
                    🔴 Start Recording
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  {/* Recording Timer */}
                  <View className="bg-error/20 border-2 border-error rounded-lg p-6 mb-6 items-center">
                    <Text className="text-error text-sm mb-2">Recording...</Text>
                    <Text className="text-error text-5xl font-bold">
                      {recordingTime}s
                    </Text>
                    <Text className="text-error text-xs mt-2">
                      Max: {MAX_RECORDING_TIME}s
                    </Text>
                  </View>

                  {/* Stop Button */}
                  <TouchableOpacity
                    onPress={stopRecording}
                    className="bg-error rounded-full py-4 mb-6 items-center"
                  >
                    <Text className="text-background font-bold text-lg">
                      ⏹️ Stop Recording
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Progress Bar */}
              {isRecording && (
                <View className="bg-surface rounded-full h-1 mb-6 overflow-hidden">
                  <View
                    className="bg-primary h-full"
                    style={{
                      width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%`,
                    }}
                  />
                </View>
              )}
            </>
          ) : (
            <>
              {/* Playback Section */}
              <View className="bg-success/10 border-2 border-success rounded-lg p-6 mb-6">
                <View className="flex-row items-center gap-3 mb-4">
                  <Text className="text-3xl">✓</Text>
                  <Text className="text-success font-bold text-lg">
                    Recording Complete
                  </Text>
                </View>
                <Text className="text-success text-sm">
                  Duration: {recordingTime} seconds
                </Text>
              </View>

              {/* Play Button */}
              <TouchableOpacity
                onPress={playRecording}
                disabled={isPlaying}
                className="bg-primary rounded-full py-4 mb-4 items-center"
              >
                {isPlaying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-background font-bold text-lg">
                    ▶️ Play Recording
                  </Text>
                )}
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-success rounded-full py-4 mb-4 items-center"
              >
                <Text className="text-background font-bold text-lg">
                  ✓ Confirm Voice Clone
                </Text>
              </TouchableOpacity>

              {/* Retry Button */}
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-muted/20 rounded-full py-3 items-center"
              >
                <Text className="text-muted font-bold">
                  🔄 Record Again
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
