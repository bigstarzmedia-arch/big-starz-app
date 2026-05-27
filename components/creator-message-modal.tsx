import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CreatorMessageModalProps {
  visible: boolean;
  creatorName: string;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onFollow: () => void;
  onCast: () => void;
  isFollowing?: boolean;
}

export function CreatorMessageModal({
  visible,
  creatorName,
  onClose,
  onSendMessage,
  onFollow,
  onCast,
  isFollowing = false,
}: CreatorMessageModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'creator' }>>([
    { id: '1', text: 'Hi! Love your content!', sender: 'user' },
    { id: '2', text: 'Thanks! Check out my latest video 🎬', sender: 'creator' },
  ]);

  const handleSend = () => {
    if (!message.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'user' }]);
    onSendMessage(message);
    setMessage('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary p-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              {creatorName}
            </Text>
            <Text className="text-white/70 text-sm">
              Online
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-white text-2xl">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 p-4 gap-3">
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <View
                className={`max-w-xs rounded-2xl p-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary'
                    : 'bg-surface border border-border'
                }`}
              >
                <Text
                  className={
                    msg.sender === 'user'
                      ? 'text-white'
                      : 'text-foreground'
                  }
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 gap-2 border-t border-border">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                onFollow();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              className={`flex-1 py-3 rounded-full items-center ${
                isFollowing ? 'bg-muted/30' : 'bg-primary'
              }`}
            >
              <Text className={isFollowing ? 'text-muted font-bold' : 'text-background font-bold'}>
                {isFollowing ? '✓ Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCast();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              className="flex-1 py-3 rounded-full items-center bg-success"
            >
              <Text className="text-background font-bold">
                Cast Them
              </Text>
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View className="flex-row gap-2 items-end">
            <TextInput
              placeholder="Send a message..."
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              className="flex-1 bg-surface border-2 border-border rounded-full px-4 py-3 text-foreground"
            />
            <TouchableOpacity
              onPress={handleSend}
              className="bg-primary p-3 rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg">
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
