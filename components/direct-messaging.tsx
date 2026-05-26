import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
  reactions?: string[];
}

interface DirectMessagingProps {
  conversationId: string;
  creatorName: string;
  creatorAvatar: string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'creator-1',
    senderName: 'Alex Rivera',
    senderAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    text: 'Hey! Love your latest video 🔥',
    timestamp: Date.now() - 300000,
    isOwn: false,
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/user.jpg',
    text: 'Thanks! Want to collaborate on something?',
    timestamp: Date.now() - 240000,
    isOwn: true,
  },
  {
    id: '3',
    senderId: 'creator-1',
    senderName: 'Alex Rivera',
    senderAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    text: 'Absolutely! I have an idea for an AI music video',
    timestamp: Date.now() - 180000,
    isOwn: false,
  },
  {
    id: '4',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/user.jpg',
    text: 'That sounds amazing! When are you free?',
    timestamp: Date.now() - 120000,
    isOwn: true,
  },
];

export function DirectMessaging({
  conversationId,
  creatorName,
  creatorAvatar,
  onSendMessage,
  isLoading = false,
}: DirectMessagingProps) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }

    // Add message to local state
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/user.jpg',
      text: inputText,
      timestamp: Date.now(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    onSendMessage?.(inputText);
    setInputText('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          if (reactions.includes(emoji)) {
            return { ...msg, reactions: reactions.filter((r) => r !== emoji) };
          } else {
            return { ...msg, reactions: [...reactions, emoji] };
          }
        }
        return msg;
      })
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp) / 60000);

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={{
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: item.isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.senderAvatar }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
      />

      {/* Message Bubble */}
      <TouchableOpacity
        onLongPress={() => setSelectedMessageId(item.id)}
        style={{
          backgroundColor: item.isOwn ? '#FF1493' : '#1A1A1A',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          maxWidth: '70%',
          borderWidth: 1,
          borderColor: item.isOwn ? '#FF1493' : '#333',
        }}
      >
        <Text style={{ color: item.isOwn ? '#fff' : '#fff', fontSize: 14 }}>
          {item.text}
        </Text>
        <Text
          style={{
            color: item.isOwn ? 'rgba(255,255,255,0.6)' : '#999',
            fontSize: 11,
            marginTop: 4,
          }}
        >
          {formatTime(item.timestamp)}
        </Text>

        {/* Reactions */}
        {item.reactions && item.reactions.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              marginTop: 6,
              paddingTop: 6,
              borderTopWidth: 1,
              borderTopColor: item.isOwn ? 'rgba(255,255,255,0.2)' : '#333',
            }}
          >
            {item.reactions.map((emoji, idx) => (
              <Text key={idx} style={{ fontSize: 14 }}>
                {emoji}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Reaction Picker (on long press) */}
      {selectedMessageId === item.id && (
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            backgroundColor: '#1A1A1A',
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: '#333',
          }}
        >
          {['❤️', '😂', '😮', '😢', '🔥'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => {
                handleReaction(item.id, emoji);
                setSelectedMessageId(null);
              }}
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 18 }}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Chat Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#333',
          gap: 12,
        }}
      >
        <Image
          source={{ uri: creatorAvatar }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
            {creatorName}
          </Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Active now</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="call" size={20} color="#FF1493" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={20} color="#FF1493" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image
              source={{ uri: creatorAvatar }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
              }}
            />
            <View
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flexDirection: 'row',
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#FF1493',
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#333',
          gap: 8,
        }}
      >
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          style={{
            flex: 1,
            backgroundColor: '#1A1A1A',
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: '#fff',
            fontSize: 14,
            maxHeight: 100,
          }}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={inputText.trim() === '' || isLoading}
          style={{
            backgroundColor: inputText.trim() === '' ? '#333' : '#FF1493',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
