import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  creator: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    creator: '@NeonVex',
    avatar: '🎤',
    lastMessage: 'Hey, love your latest video!',
    timestamp: new Date(Date.now() - 3600000),
    unread: 2,
  },
  {
    id: '2',
    creator: '@CosmicVibe',
    avatar: '🎵',
    lastMessage: 'Want to collab on a track?',
    timestamp: new Date(Date.now() - 7200000),
    unread: 0,
  },
  {
    id: '3',
    creator: '@GlitchQueen',
    avatar: '✨',
    lastMessage: 'Check out my new face clone video!',
    timestamp: new Date(Date.now() - 86400000),
    unread: 0,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: '@NeonVex',
    content: 'Hey, love your latest video!',
    timestamp: new Date(Date.now() - 300000),
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Thanks! Wanna collab?',
    timestamp: new Date(Date.now() - 240000),
    isOwn: true,
  },
  {
    id: '3',
    sender: '@NeonVex',
    content: 'Definitely! What did you have in mind?',
    timestamp: new Date(Date.now() - 180000),
    isOwn: false,
  },
];

export default function ChatScreen() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: messageInput,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: '@NeonVex',
        content: 'That sounds great! Let me know when you\'re ready.',
        timestamp: new Date(),
        isOwn: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  if (selectedConversation) {
    return (
      <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
        {/* Header */}
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
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Text style={{ fontSize: 20, color: '#FF0055' }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>
              {MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation)?.creator}
            </Text>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Online</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: item.isOwn ? 'row-reverse' : 'row',
                paddingHorizontal: 16,
                paddingVertical: 8,
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: item.isOwn ? '#FF0055' : '#333',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.isOwn ? '👤' : '🎤'}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: item.isOwn ? '#FF0055' : '#1A1A1A',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  maxWidth: '80%',
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 14 }}>{item.content}</Text>
                <Text style={{ color: item.isOwn ? '#FFB6D9' : '#AAA', fontSize: 10, marginTop: 4 }}>
                  {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Message Input */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              flexDirection: 'row',
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
              value={messageInput}
              onChangeText={setMessageInput}
              style={{
                flex: 1,
                backgroundColor: '#1A1A1A',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                color: '#FFF',
                borderWidth: 1,
                borderColor: '#333',
              }}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FF0055',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>📤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>MESSAGES</Text>
        </Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedConversation(item.id)}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#1A1A1A',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#1A1A1A',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#00FF00',
                  borderWidth: 2,
                  borderColor: '#000',
                }}
              />
            </View>

            {/* Message Preview */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>{item.creator}</Text>
                <Text style={{ fontSize: 12, color: '#AAA' }}>
                  {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#AAA', marginTop: 4 }} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {/* Unread Badge */}
            {item.unread > 0 && (
              <View
                style={{
                  backgroundColor: '#FF0055',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}
