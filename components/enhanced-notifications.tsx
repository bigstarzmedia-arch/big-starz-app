import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ScreenContainer } from './screen-container';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'casting' | 'livestream' | 'message';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

export function EnhancedNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'follow',
      title: '@CreatorPro followed you',
      description: 'A popular creator just followed your account',
      timestamp: '2 minutes ago',
      read: false,
      icon: '👤',
    },
    {
      id: '2',
      type: 'like',
      title: '1,234 people liked your video',
      description: 'Your latest video is trending!',
      timestamp: '15 minutes ago',
      read: false,
      icon: '❤️',
    },
    {
      id: '3',
      type: 'comment',
      title: '@FanOne commented on your video',
      description: '"This is amazing! 🔥"',
      timestamp: '1 hour ago',
      read: true,
      icon: '💬',
    },
    {
      id: '4',
      type: 'casting',
      title: 'New casting opportunity!',
      description: 'Music Video - Hip Hop - $500 budget',
      timestamp: '3 hours ago',
      read: true,
      icon: '🎬',
    },
    {
      id: '5',
      type: 'livestream',
      title: '@LiveStreamer is live now',
      description: 'A creator you follow is streaming',
      timestamp: '5 hours ago',
      read: true,
      icon: '🔴',
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    follows: true,
    likes: true,
    comments: true,
    casting: true,
    livestream: false,
    messages: true,
    batchNotifications: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-foreground">🔔 Notifications</Text>
            {unreadCount > 0 && (
              <Text className="text-primary text-sm mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="bg-primary/10 rounded-lg px-3 py-2"
            >
              <Text className="text-primary text-xs font-bold">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <View className="gap-3 mb-8">
          {notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              className={`p-4 rounded-lg border-2 flex-row gap-3 ${
                notification.read
                  ? 'bg-surface border-border'
                  : 'bg-primary/5 border-primary'
              }`}
            >
              <Text className="text-2xl">{notification.icon}</Text>
              <View className="flex-1">
                <Text
                  className={`font-bold ${
                    notification.read ? 'text-foreground' : 'text-primary'
                  }`}
                >
                  {notification.title}
                </Text>
                <Text className="text-muted text-sm mt-1">
                  {notification.description}
                </Text>
                <Text className="text-muted text-xs mt-2">{notification.timestamp}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteNotification(notification.id)}
                className="justify-center"
              >
                <Text className="text-muted text-lg">✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View className="bg-surface border border-border rounded-lg p-4 mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">⚙️ Preferences</Text>

          <View className="gap-4">
            {[
              { key: 'follows', label: 'Follow notifications', icon: '👤' },
              { key: 'likes', label: 'Like notifications', icon: '❤️' },
              { key: 'comments', label: 'Comment notifications', icon: '💬' },
              { key: 'casting', label: 'Casting opportunities', icon: '🎬' },
              { key: 'livestream', label: 'Livestream alerts', icon: '🔴' },
              { key: 'messages', label: 'Direct messages', icon: '✉️' },
            ].map(setting => (
              <View
                key={setting.key}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-2 flex-1">
                  <Text className="text-xl">{setting.icon}</Text>
                  <Text className="text-foreground">{setting.label}</Text>
                </View>
                <Switch
                  value={
                    notificationSettings[
                      setting.key as keyof typeof notificationSettings
                    ]
                  }
                  onValueChange={value =>
                    setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: value,
                    })
                  }
                  trackColor={{ false: '#687076', true: '#FF1493' }}
                  thumbColor={
                    notificationSettings[
                      setting.key as keyof typeof notificationSettings
                    ]
                      ? '#FFD700'
                      : '#f4f3f4'
                  }
                />
              </View>
            ))}
          </View>

          {/* Batch Notifications */}
          <View className="border-t border-border mt-4 pt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-xl">📦</Text>
                <View>
                  <Text className="text-foreground font-semibold">
                    Batch notifications
                  </Text>
                  <Text className="text-muted text-xs">
                    Group similar notifications together
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationSettings.batchNotifications}
                onValueChange={value =>
                  setNotificationSettings({
                    ...notificationSettings,
                    batchNotifications: value,
                  })
                }
                trackColor={{ false: '#687076', true: '#FF1493' }}
                thumbColor={
                  notificationSettings.batchNotifications ? '#FFD700' : '#f4f3f4'
                }
              />
            </View>
          </View>
        </View>

        {/* Notification Schedule */}
        <View className="bg-surface border border-border rounded-lg p-4">
          <Text className="text-foreground font-bold text-lg mb-4">⏰ Quiet Hours</Text>
          <Text className="text-muted text-sm mb-4">
            Pause notifications during these hours
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-primary/10 border border-primary rounded-lg py-3">
              <Text className="text-center text-primary font-bold">10:00 PM</Text>
            </TouchableOpacity>
            <Text className="text-foreground text-2xl">→</Text>
            <TouchableOpacity className="flex-1 bg-primary/10 border border-primary rounded-lg py-3">
              <Text className="text-center text-primary font-bold">8:00 AM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
