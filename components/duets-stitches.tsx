import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface DuetStitchesModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  creatorName: string;
  creatorAvatar: string;
  videoTitle: string;
}

type DuetType = 'duet' | 'stitch';

export function DuetsStitchesModal({
  visible,
  onClose,
  videoId,
  creatorName,
  creatorAvatar,
  videoTitle,
}: DuetStitchesModalProps) {
  const [selectedType, setSelectedType] = useState<DuetType>('duet');
  const [isRecording, setIsRecording] = useState(false);

  const handleSelectType = (type: DuetType) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setSelectedType(type);
  };

  const handleStartRecording = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium as any);
    }
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    setIsRecording(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              {selectedType === 'duet' ? '🎬 Duet' : '✂️ Stitch'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Original Video Info */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 12,
              marginBottom: 24,
              flexDirection: 'row',
              gap: 12,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Image
              source={{ uri: creatorAvatar }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
              }}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: '#999' }}>
                Original by {creatorName}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                {videoTitle}
              </Text>
            </View>
          </View>

          {/* Type Selector */}
          <View style={{ marginBottom: 24, gap: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
              Choose Format
            </Text>

            {/* Duet Option */}
            <TouchableOpacity
              onPress={() => handleSelectType('duet')}
              style={{
                backgroundColor: selectedType === 'duet' ? '#FF1493' : '#1A1A1A',
                borderRadius: 12,
                padding: 16,
                borderWidth: 2,
                borderColor: selectedType === 'duet' ? '#FF1493' : '#333',
                gap: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>🎬</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedType === 'duet' ? '#fff' : '#FF1493',
                  }}
                >
                  Duet
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: selectedType === 'duet' ? 'rgba(255,255,255,0.8)' : '#999',
                }}
              >
                Record side-by-side with the original video
              </Text>
            </TouchableOpacity>

            {/* Stitch Option */}
            <TouchableOpacity
              onPress={() => handleSelectType('stitch')}
              style={{
                backgroundColor: selectedType === 'stitch' ? '#FF1493' : '#1A1A1A',
                borderRadius: 12,
                padding: 16,
                borderWidth: 2,
                borderColor: selectedType === 'stitch' ? '#FF1493' : '#333',
                gap: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>✂️</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedType === 'stitch' ? '#fff' : '#FF1493',
                  }}
                >
                  Stitch
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: selectedType === 'stitch' ? 'rgba(255,255,255,0.8)' : '#999',
                }}
              >
                Use a clip from the original in your response
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recording Area */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#333',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
              {selectedType === 'duet' ? '📹 Record Your Duet' : '📹 Record Your Response'}
            </Text>

            {/* Recording Preview */}
            <View
              style={{
                backgroundColor: '#000',
                borderRadius: 8,
                aspectRatio: 9 / 16,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: isRecording ? '#FF1493' : '#333',
              }}
            >
              {isRecording ? (
                <View style={{ alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: '#FF1493',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <Text style={{ color: '#FF1493', fontWeight: '600' }}>
                    Recording...
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Ionicons name="camera" size={48} color="#666" />
                  <Text style={{ color: '#999', fontSize: 12 }}>
                    Ready to record
                  </Text>
                </View>
              )}
            </View>

            {/* Recording Controls */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {!isRecording ? (
                <>
                  <TouchableOpacity
                    onPress={handleStartRecording}
                    style={{
                      flex: 1,
                      backgroundColor: '#FF1493',
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                      Start Recording
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      flex: 1,
                      backgroundColor: '#1A1A1A',
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text style={{ color: '#999', fontWeight: '600' }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleStopRecording}
                    style={{
                      flex: 1,
                      backgroundColor: '#FFD700',
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: '600' }}>
                      Stop Recording
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Tips */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#333',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF1493' }}>
              💡 Pro Tips
            </Text>
            <Text style={{ fontSize: 11, color: '#999', lineHeight: 16 }}>
              {selectedType === 'duet'
                ? '• Make eye contact with the original creator\n• React authentically to their content\n• Keep it fun and engaging!'
                : '• Use the best part of the original video\n• Add your unique perspective\n• Keep your response concise'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
