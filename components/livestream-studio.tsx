import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface LivestreamStudioProps {
  visible: boolean;
  onClose: () => void;
  creatorName: string;
  creatorAvatar: string;
}

interface Viewer {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

const MOCK_VIEWERS: Viewer[] = [
  { id: '1', name: 'Alex Rivera', avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg', isFollowing: true },
  { id: '2', name: 'Jordan Smith', avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-2.jpg', isFollowing: false },
  { id: '3', name: 'Casey Lee', avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-3.jpg', isFollowing: true },
];

export function LivestreamStudio({ visible, onClose, creatorName, creatorAvatar }: LivestreamStudioProps) {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewers, setViewers] = useState(MOCK_VIEWERS);
  const [donations, setDonations] = useState(0);
  const [pollQuestion, setPollQuestion] = useState('');
  const [showPoll, setShowPoll] = useState(false);

  const handleStartLivestream = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium as any);
    }
    setIsLive(true);
  };

  const handleEndLivestream = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    setIsLive(false);
    setTitle('');
    setDescription('');
    setDonations(0);
  };

  const handleDonate = (amount: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setDonations((prev) => prev + amount);
  };

  const renderViewerItem = ({ item }: { item: Viewer }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 8,
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
      />
      <Text style={{ flex: 1, fontSize: 12, color: '#fff', fontWeight: '500' }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 10, color: item.isFollowing ? '#FF1493' : '#999' }}>
        {item.isFollowing ? '✓ Following' : 'Follow'}
      </Text>
    </View>
  );

  if (!isLive) {
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
                🔴 Go Live
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                aspectRatio: 9 / 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
                borderWidth: 1,
                borderColor: '#333',
              }}
            >
              <View style={{ alignItems: 'center', gap: 12 }}>
                <Ionicons name="camera" size={48} color="#666" />
                <Text style={{ color: '#999', fontSize: 12 }}>
                  Camera preview
                </Text>
              </View>
            </View>

            {/* Stream Title */}
            <View style={{ marginBottom: 16, gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                Stream Title
              </Text>
              <TextInput
                placeholder="What's your stream about?"
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
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
            </View>

            {/* Description */}
            <View style={{ marginBottom: 24, gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                Description
              </Text>
              <TextInput
                placeholder="Add details about your stream..."
                placeholderTextColor="#666"
                value={description}
                onChangeText={setDescription}
                maxLength={500}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#fff',
                  fontSize: 14,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* Start Button */}
            <TouchableOpacity
              onPress={handleStartLivestream}
              disabled={!title.trim()}
              style={{
                backgroundColor: !title.trim() ? '#666' : '#FF1493',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                Start Livestream
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: '#1A1A1A',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#333',
              }}
            >
              <Text style={{ color: '#999', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  // Live Stream UI
  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Live Video Area */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#1A1A1A',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Live Badge */}
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: '#FF1493',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#fff',
              }}
            />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>
              LIVE
            </Text>
          </View>

          {/* Viewer Count */}
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              zIndex: 10,
            }}
          >
            <Ionicons name="eye" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>
              {viewers.length}
            </Text>
          </View>

          {/* Camera Placeholder */}
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Ionicons name="camera" size={64} color="#666" />
            <Text style={{ color: '#999', fontSize: 14 }}>
              {title}
            </Text>
          </View>

          {/* Bottom Controls */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 16,
              gap: 12,
            }}
          >
            {/* Donation Buttons */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {[1, 5, 10].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => handleDonate(amount)}
                  style={{
                    flex: 1,
                    backgroundColor: '#FF1493',
                    paddingVertical: 8,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>
                    💰 ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Total Donations */}
            {donations > 0 && (
              <Text style={{ color: '#FFD700', fontWeight: '600', textAlign: 'center' }}>
                Total Donations: ${donations}
              </Text>
            )}

            {/* End Livestream */}
            <TouchableOpacity
              onPress={handleEndLivestream}
              style={{
                backgroundColor: '#FF6B6B',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                End Livestream
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Viewers Sidebar */}
        <View
          style={{
            width: 280,
            backgroundColor: '#1A1A1A',
            borderLeftWidth: 1,
            borderLeftColor: '#333',
            paddingHorizontal: 12,
            paddingVertical: 16,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 12 }}>
            Viewers ({viewers.length})
          </Text>
          <FlatList
            data={viewers}
            keyExtractor={(item) => item.id}
            renderItem={renderViewerItem}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}
