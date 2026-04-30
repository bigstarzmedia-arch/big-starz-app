/**
 * Big Starz Vibe Feed - TikTok/Sora Style
 * Full-screen swipeable video cards with glassmorphism overlays
 * Matte Black + Neon Pink + Big Starz Logo
 */

import { Text, View, Pressable, FlatList, Image, Dimensions, ViewToken } from "react-native";
import { useState, useCallback, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT - 180; // Account for header + tab bar

interface VideoItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  isLive: boolean;
  thumbnail: string;
  genre: string;
  beautifyFilter: string;
}

const VIDEO_FEED: VideoItem[] = [
  {
    id: "1",
    creatorName: "Luna Starz",
    creatorAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    title: "AI-Generated Music Video",
    description: "Created with Big Starz Cameo + Voice Clone",
    views: 124500,
    likes: 8420,
    comments: 342,
    shares: 1205,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop",
    genre: "Pop",
    beautifyFilter: "full-luxury",
  },
  {
    id: "2",
    creatorName: "Neon Dreams",
    creatorAvatar: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=100&fit=crop",
    title: "Voice Clone Demo - R&B",
    description: "Smooth vocals powered by AI synthesis",
    views: 89200,
    likes: 5670,
    comments: 189,
    shares: 834,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=900&fit=crop",
    genre: "R&B",
    beautifyFilter: "studio-lighting",
  },
  {
    id: "3",
    creatorName: "Cyber Vibe",
    creatorAvatar: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    title: "EDM Drop - Sora Generated",
    description: "Full video generated with AI from text prompt",
    views: 234100,
    likes: 15800,
    comments: 567,
    shares: 2340,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=900&fit=crop",
    genre: "EDM",
    beautifyFilter: "neon-glow",
  },
  {
    id: "4",
    creatorName: "Echo Sound",
    creatorAvatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
    title: "Country Roads - AI Remix",
    description: "Classic country with modern AI production",
    views: 67800,
    likes: 4230,
    comments: 156,
    shares: 678,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=900&fit=crop",
    genre: "Country",
    beautifyFilter: "cinematic",
  },
  {
    id: "5",
    creatorName: "Starz Queen",
    creatorAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    title: "Latin Heat - Reggaeton",
    description: "AI-generated reggaeton with custom vocals",
    views: 156000,
    likes: 11200,
    comments: 423,
    shares: 1890,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop",
    genre: "Latin",
    beautifyFilter: "tropical-glow",
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function VibeFeedScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderVideoCard = ({ item }: { item: VideoItem }) => {
    const isLiked = likedItems.has(item.id);

    return (
      <View style={{ width: SCREEN_WIDTH, height: CARD_HEIGHT, position: "relative" }}>
        {/* Full-screen thumbnail background */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          resizeMode="cover"
        />

        {/* Dark gradient overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />

        {/* Bottom gradient for text readability */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 300,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />

        {/* Live Badge */}
        {item.isLive && (
          <View
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "#FF007F",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF", marginRight: 5 }} />
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>LIVE</Text>
          </View>
        )}

        {/* Genre Badge */}
        <View
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255, 0, 127, 0.4)",
          }}
        >
          <Text style={{ color: "#FF007F", fontSize: 10, fontWeight: "600" }}>{item.genre}</Text>
        </View>

        {/* Play Button (center) */}
        <View style={{ position: "absolute", top: "40%", left: "50%", marginLeft: -30, marginTop: -30 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "rgba(255, 0, 127, 0.8)",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#FF007F",
              shadowOpacity: 0.6,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 24, marginLeft: 4 }}>{"\u25B6"}</Text>
          </View>
        </View>

        {/* Right side action buttons (TikTok-style) */}
        <View style={{ position: "absolute", right: 12, bottom: 160, alignItems: "center", gap: 20 }}>
          {/* Creator Avatar */}
          <Pressable style={{ alignItems: "center" }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: "#FF007F",
                overflow: "hidden",
              }}
            >
              <Image source={{ uri: item.creatorAvatar }} style={{ width: "100%", height: "100%" }} />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: -6,
                backgroundColor: "#FF007F",
                width: 18,
                height: 18,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>+</Text>
            </View>
          </Pressable>

          {/* Like */}
          <Pressable onPress={() => toggleLike(item.id)} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 28 }}>{isLiked ? "\u2764\uFE0F" : "\u{1F90D}"}</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600", marginTop: 2 }}>
              {formatNumber(item.likes + (isLiked ? 1 : 0))}
            </Text>
          </Pressable>

          {/* Comments */}
          <Pressable style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{"\u{1F4AC}"}</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600", marginTop: 2 }}>
              {formatNumber(item.comments)}
            </Text>
          </Pressable>

          {/* Share */}
          <Pressable style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{"\u{1F4E4}"}</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600", marginTop: 2 }}>
              {formatNumber(item.shares)}
            </Text>
          </Pressable>

          {/* Gift */}
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={{ fontSize: 26 }}>{"\u{1F381}"}</Text>
            <Text style={{ color: "#FFD700", fontSize: 11, fontWeight: "600", marginTop: 2 }}>Gift</Text>
          </Pressable>
        </View>

        {/* Bottom info overlay */}
        <View style={{ position: "absolute", bottom: 20, left: 16, right: 70 }}>
          {/* Creator name */}
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginBottom: 4 }}>
            @{item.creatorName.replace(" ", "")}
          </Text>
          {/* Title */}
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600", marginBottom: 4 }}>
            {item.title}
          </Text>
          {/* Description */}
          <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, marginBottom: 8 }} numberOfLines={2}>
            {item.description}
          </Text>
          {/* Views + Filter */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#888888", fontSize: 11 }}>
              {formatNumber(item.views)} views
            </Text>
            <View style={{ backgroundColor: "rgba(212, 175, 55, 0.8)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "600" }}>
                {item.beautifyFilter.replace("-", " ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Big Starz watermark */}
        <View style={{ position: "absolute", bottom: 24, right: 16, opacity: 0.5 }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 20, height: 20 }} resizeMode="contain" />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-black" edges={["left", "right"]}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Floating Header */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            paddingVertical: 12,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Image source={{ uri: LOGO_URL }} style={{ width: 32, height: 32, marginRight: 8 }} resizeMode="contain" />
          <Text style={{ fontSize: 18, fontWeight: "900", color: "#FFFFFF", letterSpacing: 2 }}>
            BIG STARZ
          </Text>
        </View>

        {/* TikTok-style vertical swipeable feed */}
        <FlatList
          ref={flatListRef}
          data={VIDEO_FEED}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={CARD_HEIGHT}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: CARD_HEIGHT,
            offset: CARD_HEIGHT * index,
            index,
          })}
          contentContainerStyle={{ paddingTop: 50 }}
        />

        {/* Page indicator dots */}
        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {VIDEO_FEED.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: idx === activeIndex ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: idx === activeIndex ? "#FF007F" : "rgba(255, 255, 255, 0.3)",
              }}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
