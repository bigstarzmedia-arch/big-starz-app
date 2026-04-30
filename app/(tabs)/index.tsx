/**
 * Big Starz Vibe Feed - Main Entry Point
 * Elite Luxury Lounge aesthetic with Matte Black background and neon effects
 */

import { ScrollView, Text, View, Pressable, FlatList, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

interface VideoFeed {
  id: string;
  creatorName: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  likes: number;
  beautifyFilter: string;
}

const MOCK_FEED: VideoFeed[] = [
  {
    id: "1",
    creatorName: "Luna Starz",
    title: "New AI-Generated Music Video",
    isLive: true,
    viewerCount: 2847,
    likes: 1203,
    beautifyFilter: "full-luxury",
  },
  {
    id: "2",
    creatorName: "Neon Dreams",
    title: "Cameo Scan Complete - Voice Clone Ready",
    isLive: false,
    viewerCount: 5234,
    likes: 2891,
    beautifyFilter: "studio-lighting",
  },
];

export default function VibeFeedScreen() {
  const [selectedVideo, setSelectedVideo] = useState<VideoFeed | null>(null);

  return (
    <ScreenContainer className="bg-black">
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="px-4 py-3 border-b border-gray-800 mb-4">
          <Text className="text-3xl font-bold text-white">
            Big Starz
          </Text>
          <Text className="text-xs text-gray-400 mt-1">Elite Luxury Lounge</Text>
        </View>

        {/* Vibe Feed */}
        <FlatList
          data={MOCK_FEED}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-6 px-4">
              <Pressable
                onPress={() => setSelectedVideo(item)}
                style={{
                  backgroundColor: "rgba(26, 26, 26, 0.7)",
                  borderWidth: 1,
                  borderColor: item.isLive ? "rgba(255, 0, 127, 0.4)" : "rgba(157, 0, 255, 0.2)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                className="mb-4"
              >
                {/* Video Thumbnail */}
                <View className="relative h-96 bg-gray-900">
                  <View className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900" />

                  {/* Live Badge */}
                  {item.isLive && (
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#FF007F",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                      }}
                    >
                      <Text className="text-white text-xs font-bold">● LIVE</Text>
                    </View>
                  )}

                  {/* Beautify Filter Badge */}
                  {item.beautifyFilter !== "none" && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        backgroundColor: "rgba(212, 175, 55, 0.8)",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#D4AF37",
                      }}
                    >
                      <Text className="text-xs font-semibold text-white">✨ {item.beautifyFilter.replace("-", " ")}</Text>
                    </View>
                  )}
                </View>

                {/* Video Info */}
                <View className="p-4">
                  <Text className="text-white font-bold text-base mb-3">{item.title}</Text>
                  <Text className="text-gray-400 text-sm mb-3">by {item.creatorName}</Text>

                  {/* Engagement Stats */}
                  <View className="flex-row justify-between mb-4">
                    <View className="items-center">
                      <Text className="text-pink-500 font-bold text-lg">♥</Text>
                      <Text className="text-gray-300 text-xs mt-1">{item.likes}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-purple-400 font-bold text-lg">👁</Text>
                      <Text className="text-gray-300 text-xs mt-1">{item.viewerCount}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-yellow-400 font-bold text-lg">🎁</Text>
                      <Text className="text-gray-300 text-xs mt-1">Gift</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-blue-400 font-bold text-lg">⭐</Text>
                      <Text className="text-gray-300 text-xs mt-1">Share</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: "#FF007F",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                      }}
                      className="active:opacity-80"
                    >
                      <Text className="text-white font-bold">🔴 GO LIVE</Text>
                    </Pressable>

                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(212, 175, 55, 0.9)",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#D4AF37",
                      }}
                      className="active:opacity-80"
                    >
                      <Text className="text-white font-bold">🎁 GIFT</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </ScreenContainer>
  );
}
