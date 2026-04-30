/**
 * Vibe Live Screen
 * Real-time live streaming with comments and luxury gifting
 */

import { ScrollView, View, Text, Pressable, TextInput, FlatList, Image, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

interface LiveStream {
  id: number;
  title: string;
  creatorName: string;
  viewerCount: number;
  isLive: boolean;
  thumbnailUrl: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface Gift {
  id: number;
  name: string;
  icon: string;
  value: number;
  displayName: string;
}

const MOCK_GIFTS: Gift[] = [
  { id: 1, name: "platinum_record", icon: "🎵", value: 5.99, displayName: "Platinum Record" },
  { id: 2, name: "neon_star", icon: "⭐", value: 9.99, displayName: "Neon Star" },
  { id: 3, name: "diamond_heart", icon: "💎", value: 19.99, displayName: "Diamond Heart" },
  { id: 4, name: "gold_crown", icon: "👑", value: 49.99, displayName: "Gold Crown" },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 1, author: "Creator_Fan", text: "Amazing performance! 🔥", timestamp: "2m ago" },
  { id: 2, author: "Music_Lover", text: "This beat is insane", timestamp: "1m ago" },
  { id: 3, author: "BigStarz_Member", text: "Love the energy!", timestamp: "30s ago" },
];

export default function VibeLiveScreen() {
  const colors = useColors();
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [showGiftTray, setShowGiftTray] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: "You",
        text: newComment,
        timestamp: "now",
      };
      setComments([...comments, comment]);
      setNewComment("");
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGiftSelect = (gift: Gift) => {
    setSelectedGift(gift);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Live Video Container */}
        <View
          className="w-full aspect-video bg-black relative"
          style={{ backgroundColor: colors.background }}
        >
          {/* Placeholder Video */}
          <View className="flex-1 items-center justify-center bg-gray-900">
            <Text className="text-white text-lg font-semibold">Live Stream</Text>
          </View>

          {/* Live Badge */}
          <View
            className="absolute top-4 left-4 px-3 py-1 rounded-full flex-row items-center gap-2"
            style={{ backgroundColor: "#EF4444" }}
          >
            <View className="w-2 h-2 rounded-full bg-white" />
            <Text className="text-white text-xs font-bold">LIVE</Text>
          </View>

          {/* Viewer Count */}
          <View
            className="absolute top-4 right-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <Text className="text-white text-xs">👥 2.4K watching</Text>
          </View>

          {/* Gift Button */}
          <Pressable
            onPress={() => setShowGiftTray(!showGiftTray)}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.95 : 1 }],
                backgroundColor: colors.primary,
              },
            ]}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full items-center justify-center"
          >
            <Text className="text-2xl">🎁</Text>
          </Pressable>
        </View>

        {/* Creator Info */}
        <View className="px-4 py-3 border-b" style={{ borderColor: colors.border }}>
          <Text className="text-lg font-bold text-foreground">Creator Name</Text>
          <Text className="text-sm text-muted">@creator_handle • 1.2K subscribers</Text>
        </View>

        {/* Comments Section */}
        <View className="flex-1 px-4 py-3">
          <Text className="text-sm font-semibold text-foreground mb-3">Live Comments</Text>

          {/* Comment List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-3 pb-3 border-b" style={{ borderColor: colors.border }}>
                <View className="flex-row justify-between items-start">
                  <Text className="font-semibold text-foreground text-sm">{item.author}</Text>
                  <Text className="text-xs text-muted">{item.timestamp}</Text>
                </View>
                <Text className="text-sm text-foreground mt-1">{item.text}</Text>
              </View>
            )}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />

          {/* Comment Input */}
          <View className="flex-row gap-2 mt-4">
            <TextInput
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              placeholderTextColor={colors.muted}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-foreground"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            />
            <Pressable
              onPress={handleSendComment}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  backgroundColor: colors.primary,
                },
              ]}
              className="px-4 py-2 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">Send</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Gift Tray Modal */}
      {showGiftTray && (
        <View
          className="absolute bottom-0 left-0 right-0 px-4 py-4 rounded-t-3xl border-t"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            maxHeight: "40%",
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Send a Gift</Text>
            <Pressable onPress={() => setShowGiftTray(false)}>
              <Text className="text-2xl">✕</Text>
            </Pressable>
          </View>

          {/* Gift Grid */}
          <FlatList
            data={MOCK_GIFTS}
            numColumns={4}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleGiftSelect(item)}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.9 : 1 }],
                  },
                ]}
                className="flex-1 items-center justify-center py-3"
              >
                <View
                  className={cn(
                    "w-16 h-16 rounded-lg items-center justify-center border-2",
                    selectedGift?.id === item.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  )}
                >
                  <Text className="text-3xl">{item.icon}</Text>
                </View>
                <Text className="text-xs font-semibold text-foreground mt-2 text-center">
                  ${item.value}
                </Text>
              </Pressable>
            )}
            scrollEnabled={false}
          />

          {/* Send Gift Button */}
          {selectedGift && (
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowGiftTray(false);
                setSelectedGift(null);
              }}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  backgroundColor: colors.primary,
                },
              ]}
              className="w-full py-3 rounded-lg items-center justify-center mt-4"
            >
              <Text className="text-white font-bold">Send {selectedGift.displayName}</Text>
            </Pressable>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}
