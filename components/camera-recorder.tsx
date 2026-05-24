import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';

interface CameraRecorderProps {
  visible: boolean;
  onClose: () => void;
  onRecordingComplete: (videoUri: string) => void;
  maxDuration?: number; // in seconds
}

const MAX_RECORDING_TIME = 15; // 15 seconds

export function CameraRecorder({
  visible,
  onClose,
  onRecordingComplete,
  maxDuration = MAX_RECORDING_TIME,
}: CameraRecorderProps) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const cameraRef = useRef<CameraView>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Countdown animation
  useEffect(() => {
    if (countdownVisible) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning as any
        );
      }

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        countdownIntervalRef.current = timer as any;
      } else {
        setCountdownVisible(false);
        startRecording();
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearTimeout(countdownIntervalRef.current as any);
      }
    };
  }, [countdown, countdownVisible]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      recordingIntervalRef.current = interval as any;
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current as any);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current as any);
      }
    };
  }, [isRecording, maxDuration]);

  const startCountdown = () => {
    setCountdown(3);
    setCountdownVisible(true);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingTime(0);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Medium as any
          );
        }
        // Note: Actual recording implementation depends on expo-camera version
        // For now, this is a placeholder for the recording logic
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        setIsRecording(false);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success as any
          );
        }
        // Placeholder: In real implementation, get video URI from camera
        onRecordingComplete('video-uri-placeholder');
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setRecordingTime(0);
    setCountdownVisible(false);
    setCountdown(3);
    onClose();
  };

  if (!permission?.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 16, marginBottom: 16 }}>
            Camera permission required
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="front"
        />

        {/* Countdown Overlay */}
        {countdownVisible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <Animated.Text
              style={{
                fontSize: 120,
                fontWeight: 'bold',
                color: '#FF1493',
                transform: [{ scale: scaleAnim }],
              }}
            >
              {countdown}
            </Animated.Text>
          </View>
        )}

        {/* Recording Indicator & Timer */}
        {isRecording && (
          <View
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#FF1493',
              }}
            />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
              {String(recordingTime % 60).padStart(2, '0')}
            </Text>
          </View>
        )}

        {/* Progress Bar */}
        <View
          style={{
            position: 'absolute',
            bottom: 120,
            left: 16,
            right: 16,
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${(recordingTime / maxDuration) * 100}%`,
              backgroundColor: '#FF1493',
              borderRadius: 2,
            }}
          />
        </View>

        {/* Controls */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 32,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 28, color: '#fff' }}>✕</Text>
          </TouchableOpacity>

          {/* Record Button */}
          {!isRecording && !countdownVisible && (
            <TouchableOpacity
              onPress={startCountdown}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#FF1493',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#fff',
                }}
              />
            </TouchableOpacity>
          )}

          {/* Stop Button */}
          {isRecording && (
            <TouchableOpacity
              onPress={stopRecording}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#FF1493',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }}
              />
            </TouchableOpacity>
          )}

          {/* Spacer */}
          <View style={{ width: 56 }} />
        </View>

        {/* Time Limit Warning */}
        {recordingTime >= maxDuration - 3 && isRecording && (
          <View
            style={{
              position: 'absolute',
              bottom: 140,
              left: 16,
              right: 16,
              backgroundColor: 'rgba(255, 20, 147, 0.9)',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              Recording will stop in {maxDuration - recordingTime} seconds
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
