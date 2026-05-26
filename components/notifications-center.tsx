import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'casting' | 'livestream';
  title: string;
  message: string;
  avatar: string;
  creatorName: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationsCenterProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'follow',
    title: 'New Follower',
    message: 'Alex Rivera started following you',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    creatorName: 'Alex Rivera',
    timestamp: 'now',
    isRead: false,
  },
  {
    id: '2',
    type: 'like',
    title: 'Video Liked',
    message: 'Jordan Smith liked your "AI Music Video - Cyberpunk" video',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-2.jpg',
    creatorName: 'Jordan Smith',
    timestamp: '5m ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'comment',
    title: 'New Comment',
    message: 'Casey Lee: "This is fire! 🔥"',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-3.jpg',
    creatorName: 'Casey Lee',
    timestamp: '12m ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'casting',
    title: 'Casting Opportunity',
    message: 'You matched with "Music Video - Pop Star" casting call',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/casting-1.jpg',
    creatorName: 'Casting Team',
    timestamp: '1h ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'livestream',
    title: 'Livestream Started',
    message: 'Alex Rivera is now live - Join the stream!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    creatorName: 'Alex Rivera',
    timestamp: '2h ago',
    isRead: true,
  },
];

export function NotificationsCenter({ visible, onClose }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium as any);
    }
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👤';
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'casting':
        return '🎬';
      case 'livestream':
        return '🔴';
      default:
        return '📢';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleMarkAsRead(item.id)}
      style={{
        backgroundColor: item.isRead ? '#1A1A1A' : '#1A1A1A',
        borderLeftWidth: 3,
        borderLeftColor: item.isRead ? '#333' : '#FF1493',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 14, color: '#FF1493', fontWeight: '600' }}>
            {getNotificationIcon(item.type)}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#fff',
              flex: 1,
            }}
          >
            {item.title}
          </Text>
          {!item.isRead && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#FF1493',
              }}
            />
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#999' }}>
          {item.message}
        </Text>
        <Text style={{ fontSize: 10, color: '#666' }}>
          {item.timestamp}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => handleDeleteNotification(item.id)}
        style={{
          padding: 8,
        }}
      >
        <Ionicons name="close" size={18} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                🔔 Notifications
              </Text>
              {unreadCount > 0 && (
                <Text style={{ fontSize: 12, color: '#FF1493' }}>
                  {unreadCount} unread
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setFilter('all')}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: filter === 'all' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: filter === 'all' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: filter === 'all' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                All ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('unread')}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: filter === 'unread' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: filter === 'unread' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: filter === 'unread' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={{
                paddingVertical: 10,
                marginBottom: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: '#FF1493', fontWeight: '600' }}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}

          {/* Notifications List */}
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 16, color: '#999' }}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </Text>
              </View>
            }
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
