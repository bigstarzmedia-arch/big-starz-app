/**
 * VIBE Screen - Home Feed (High-Fidelity UI Polish)
 * Featured Artists with Unsplash images, refined Go Live button, TikTok-style video cards
 */

import { ScrollView, View, Text, Pressable, FlatList, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface VideoCard {
  id: string;
  creatorName: string;
  title: string;
  views: number;
  thumbnail: string;
}

interface FeaturedArtist {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
}

// High-quality Unsplash URLs for featured artists
const FEATURED_ARTISTS: FeaturedArtist[] = [
  {
    id: "1",
    name: "Luna Starz",
    avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    subscribers: 2400,
  },
  {
    id: "2",
    name: "Neon Dreams",
    avatar: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=200&fit=crop",
    subscribers: 1800,
  },
  {
    id: "3",
    name: "Cyber Vibe",
    avatar: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    subscribers: 3200,
  },
  {
    id: "4",
    name: "Echo Sound",
    avatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop",
    subscribers: 1500,
  },
];

const FILTER_OPTIONS = ["All", "Rap", "R&B", "Trending", "Pop"];

// High-quality Unsplash URLs for video thumbnails
const VIDEO_FEED: VideoCard[] = [
  {
    id: "1",
    creatorName: "Luna Starz",
    title: "New AI-Generated Music Video",
    views: 12034,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop",
  },
  {
    id: "2",
    creatorName: "Neon Dreams",
    title: "Cameo Beautify Test",
    views: 28471,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
  },
  {
    id: "3",
    creatorName: "Cyber Vibe",
    title: "Latin Vibes",
    views: 54321,
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=600&fit=crop",
  },
  {
    id: "4",
    creatorName: "Echo Sound",
    title: "Electronic Dreams",
    views: 18765,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop",
  },
];

export default function VibeScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("vibe");

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGoLive = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("Go Live pressed");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Featured Artists Section */}
        <View style={{ paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.foreground,
              paddingHorizontal: 20,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}
          >
            FEATURED ARTISTS
          </Text>

          <FlatList
            horizontal
            data={FEATURED_ARTISTS}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  marginHorizontal: 12,
                  alignItems: "center",
                  paddingBottom: 8,
                }}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                {/* Circular Profile with Pink Glow */}
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: colors.surface,
                    borderWidth: 3,
                    borderColor: "#FF007F",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    shadowColor: "#FF007F",
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                    elevation: 8,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={{ width: "100%", height: "100%", borderRadius: 36 }}
                  />
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center", maxWidth: 80 }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 10, color: colors.muted, marginTop: 2 }}>
                  {item.subscribers.toLocaleString()} subs
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          />
        </View>

        {/* Filter Pills */}
        <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
          <FlatList
            horizontal
            data={FILTER_OPTIONS}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleFilterPress(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: activeFilter === item ? "#FF007F" : colors.surface,
                  marginRight: 10,
                  borderWidth: activeFilter === item ? 0 : 1,
                  borderColor: colors.border,
                  shadowColor: activeFilter === item ? "#FF007F" : "transparent",
                  shadowOpacity: activeFilter === item ? 0.6 : 0,
                  shadowRadius: activeFilter === item ? 8 : 0,
                  elevation: activeFilter === item ? 4 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: activeFilter === item ? "#000000" : colors.foreground,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Go Live Button - Pill-Shaped, Centered */}
        <View style={{ alignItems: "center", marginVertical: 20, paddingHorizontal: 20 }}>
          <Pressable
            onPress={handleGoLive}
            style={({ pressed }) => ({
              backgroundColor: "#FF0055",
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 28,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#FF0055",
              shadowOpacity: 0.8,
              shadowRadius: 12,
              elevation: 6,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#FFFFFF",
                marginRight: 8,
                letterSpacing: 0.5,
              }}
            >
              🔴 GO LIVE
            </Text>
          </Pressable>
        </View>

        {/* Video Feed - TikTok/Reels Style */}
        <View style={{ paddingHorizontal: 12, gap: 16 }}>
          {VIDEO_FEED.map((video, index) => (
            <Pressable
              key={video.id}
              style={({ pressed }) => ({
                borderRadius: 20,
                overflow: "hidden",
                height: 500,
                backgroundColor: colors.surface,
                shadowColor: "#000000",
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              {/* Video Thumbnail with Dark Gradient Overlay */}
              <Image
                source={{ uri: video.thumbnail }}
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />

              {/* Dark Gradient Overlay */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "60%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                }}
              />

              {/* Video Info - Bottom Section */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    marginBottom: 8,
                  }}
                >
                  {video.title}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#CCCCCC",
                    marginBottom: 12,
                  }}
                >
                  by {video.creatorName}
                </Text>

                {/* Stats Row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={{ fontSize: 12, color: "#FF007F", fontWeight: "600" }}>❤️</Text>
                    <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
                      {(video.views / 1000).toFixed(1)}K views
                    </Text>
                  </View>
                </View>

                {/* Distribute Button */}
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: "#FFFF00",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    alignItems: "center",
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#000000",
                    }}
                  >
                    📤 DISTRIBUTE
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
