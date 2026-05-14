import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { trpc } from '@/lib/trpc';

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

interface Conversation {
  id: number;
  userId1: number;
  userId2: number;
  lastMessageAt?: Date;
  createdAt: Date;
}

export default function ChatScreen() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading: convLoading } = trpc.messages.list.useQuery();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData as Conversation[]);
    }
  }, [conversationsData]);

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = trpc.messages.getThread.useQuery(
    { userId: selectedConversation || 0 },
    { enabled: selectedConversation !== null }
  );

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData as Message[]);
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messagesData]);

  // Send message mutation
  const sendMessageMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessageInput('');
      // Refresh messages
      if (selectedConversation) {
        // In a real app, you'd refetch here
      }
    },
    onError: (error) => {
      console.error('Send message error:', error);
    },
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    await sendMessageMutation.mutateAsync({
      recipientId: selectedConversation,
      content: messageInput,
    });
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Creator #{selectedConversation}</Text>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Online</Text>
          </View>
        </View>

        {/* Messages */}
        {messagesLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FF0055" size="large" />
          </View>
        ) : messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 40 }}>👋</Text>
            <Text style={{ fontSize: 14, color: '#AAA' }}>Start a conversation</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isOwn = item.senderId !== selectedConversation;
              return (
                <View
                  style={{
                    flexDirection: isOwn ? 'row-reverse' : 'row',
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
                      backgroundColor: isOwn ? '#FF0055' : '#333',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{isOwn ? '👤' : '🎤'}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: isOwn ? '#FF0055' : '#1A1A1A',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      maxWidth: '80%',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 14 }}>{item.content}</Text>
                    <Text style={{ color: isOwn ? '#FFB6D9' : '#AAA', fontSize: 10, marginTop: 4 }}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ paddingVertical: 12 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

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
              multiline
              maxLength={500}
              style={{
                flex: 1,
                backgroundColor: '#1A1A1A',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                color: '#FFF',
                borderWidth: 1,
                borderColor: '#333',
                maxHeight: 100,
              }}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!messageInput.trim() || sendMessageMutation.isPending}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: messageInput.trim() ? '#FF0055' : '#666',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {sendMessageMutation.isPending ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={{ fontSize: 18 }}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>


      {/* Conversations List */}
      {convLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#FF0055" size="large" />
        </View>
      ) : conversations.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 40 }}>💬</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>No conversations yet</Text>
          <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>
            Start chatting with creators to build your network
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const otherUserId = item.userId1 === item.userId2 ? item.userId2 : item.userId1;
            return (
              <TouchableOpacity
                onPress={() => setSelectedConversation(otherUserId)}
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
                  <Text style={{ fontSize: 24 }}>🎤</Text>
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
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Creator #{otherUserId}</Text>
                    <Text style={{ fontSize: 12, color: '#AAA' }}>
                      {item.lastMessageAt
                        ? new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Now'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#AAA', marginTop: 4 }} numberOfLines={1}>
                    Last message
                  </Text>
                </View>

                {/* Unread Badge */}
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
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>3</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}
