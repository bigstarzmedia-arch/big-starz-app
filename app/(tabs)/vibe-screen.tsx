/**
 * VIBE Screen - Home Feed
 * Featured Artists, filter pills, Go Live button, video feed
 */

import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";

interface VideoCard {
  id: string;
  creatorName: string;
  title: string;
  views: number;
  thumbnail: string;
}

const FEATURED_ARTISTS = [
  { id: "1", name: "Luna Starz", avatar: "👩‍🎤" },
  { id: "2", name: "Neon Dreams", avatar: "🎵" },
  { id: "3", name: "Cyber Vibe", avatar: "🎸" },
  { id: "4", name: "Echo Sound", avatar: "🎤" },
];

const FILTER_OPTIONS = ["All", "Rap", "R&B", "Trending"];

const VIDEO_FEED: VideoCard[] = [
  { id: "1", creatorName: "Luna Starz", title: "New AI-Generated Music Video", views: 1203, thumbnail: "🎬" },
  { id: "2", creatorName: "Neon Dreams", title: "Cameo Beautify Test", views: 2847, thumbnail: "✨" },
  { id: "3", creatorName: "Cyber Vibe", title: "Latin Vibes", views: 5432, thumbnail: "🎵" },
];

export default function VibeScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("vibe");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Featured Artists Section */}
        <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: colors.foreground,
              paddingHorizontal: 16,
              marginBottom: 12,
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
                  marginHorizontal: 8,
                  alignItems: "center",
                }}
              >
                {/* Circular Profile with Pink Glow */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.surface,
                    borderWidth: 3,
                    borderColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    shadowColor: colors.primary,
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 32 }}>{item.avatar}</Text>
                </View>
                <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center" }}>
                  {item.name.split(" ")[0]}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          />
        </View>

        {/* Filter Pills & Go Live Button */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
            alignItems: "center",
          }}
        >
          {/* Filter Pills */}
          {FILTER_OPTIONS.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: activeFilter === filter ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: activeFilter === filter ? colors.primary : colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: activeFilter === filter ? colors.background : colors.foreground,
                }}
              >
                {filter}
              </Text>
            </Pressable>
          ))}

          {/* Go Live Button */}
          <Pressable
            style={{
              marginLeft: "auto",
              backgroundColor: colors.error,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 12 }}>🔴</Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground }}>
              GO LIVE
            </Text>
          </Pressable>
        </View>

        {/* Video Feed */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
          {VIDEO_FEED.map((video) => (
            <Pressable
              key={video.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {/* Thumbnail */}
              <View
                style={{
                  width: "100%",
                  height: 200,
                  backgroundColor: colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 64 }}>{video.thumbnail}</Text>
              </View>

              {/* Video Info */}
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.foreground, marginBottom: 4 }}>
                  {video.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                  by {video.creatorName}
                </Text>

                {/* Stats & Distribute Button */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Text style={{ fontSize: 12, color: colors.muted }}>👁️ {video.views.toLocaleString()}</Text>
                  </View>

                  {/* Distribute Button */}
                  <Pressable
                    style={{
                      backgroundColor: colors.accent2,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.background }}>
                      📤 DISTRIBUTE
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
