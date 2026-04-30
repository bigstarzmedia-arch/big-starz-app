/**
 * CHAT Screen - Global Chat & Collab DM Inbox
 * Online users with green indicators, unread message badges
 */

import { ScrollView, View, Text, Pressable, FlatList, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

const CHAT_USERS: ChatUser[] = [
  {
    id: "1",
    name: "Luna Starz",
    avatar: "👩‍🎤",
    isOnline: true,
    lastMessage: "Let's collab on a new track!",
    unreadCount: 2,
    timestamp: "2m ago",
  },
  {
    id: "2",
    name: "Neon Dreams",
    avatar: "🎵",
    isOnline: true,
    lastMessage: "I'm interested in your casting offer",
    unreadCount: 1,
    timestamp: "5m ago",
  },
  {
    id: "3",
    name: "Cyber Vibe",
    avatar: "🎸",
    isOnline: false,
    lastMessage: "Thanks for the opportunity!",
    unreadCount: 0,
    timestamp: "1h ago",
  },
  {
    id: "4",
    name: "Echo Sound",
    avatar: "🎤",
    isOnline: true,
    lastMessage: "Can we schedule a session?",
    unreadCount: 3,
    timestamp: "3m ago",
  },
];

export default function ChatScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("chat");
  const [chatMode, setChatMode] = useState<"global" | "dm">("dm");
  const [globalMessage, setGlobalMessage] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      {/* Chat Mode Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => setChatMode("global")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: chatMode === "global" ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: chatMode === "global" ? colors.primary : colors.border,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: chatMode === "global" ? colors.background : colors.foreground,
            }}
          >
            💬 GLOBAL CHAT
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setChatMode("dm")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: chatMode === "dm" ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: chatMode === "dm" ? colors.primary : colors.border,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: chatMode === "dm" ? colors.background : colors.foreground,
            }}
          >
            💭 DM INBOX
          </Text>
        </Pressable>
      </View>

      {chatMode === "global" ? (
        // Global Chat
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Sample Global Messages */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.primary }}>
                Luna Starz
              </Text>
              <Text style={{ fontSize: 11, color: colors.foreground, marginTop: 4 }}>
                Anyone want to collaborate on a Latin track? 🎵
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.accent1,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.accent1 }}>
                Neon Dreams
              </Text>
              <Text style={{ fontSize: 11, color: colors.foreground, marginTop: 4 }}>
                Just dropped a new beat! Check it out 🔥
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.accent2,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.accent2 }}>
                Cyber Vibe
              </Text>
              <Text style={{ fontSize: 11, color: colors.foreground, marginTop: 4 }}>
                Looking for models for my new music video project
              </Text>
            </View>
          </ScrollView>

          {/* Global Chat Input */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 8,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TextInput
              placeholder="Share with the community..."
              placeholderTextColor={colors.muted}
              value={globalMessage}
              onChangeText={setGlobalMessage}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                fontSize: 12,
              }}
            />
            <Pressable
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>📤</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        // DM Inbox
        <FlatList
          data={CHAT_USERS}
          renderItem={({ item }) => (
            <Pressable
              style={{
                flexDirection: "row",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                alignItems: "center",
              }}
            >
              {/* Avatar with Online Indicator */}
              <View style={{ position: "relative", marginRight: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
                </View>

                {/* Online Indicator */}
                {item.isOnline && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.success,
                      borderWidth: 2,
                      borderColor: colors.background,
                    }}
                  />
                )}
              </View>

              {/* Chat Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                  {item.lastMessage}
                </Text>
              </View>

              {/* Unread Badge & Timestamp */}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 4 }}>
                  {item.timestamp}
                </Text>
                {item.unreadCount > 0 && (
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.background }}>
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
