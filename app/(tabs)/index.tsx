/**
 * Big Starz Vibe Feed - TikTok/Sora Style (Polished)
 * Full-screen swipeable video cards with:
 * - For You / Following toggle
 * - Pull-to-refresh
 * - Native share sheet
 * - Gift selection modal
 * - Like animations
 * - Big Starz watermark
 */

import { Text, View, Pressable, FlatList, Image, Dimensions, ViewToken, Modal, RefreshControl, Share, Platform } from "react-native";
import { useState, useCallback, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT - 180;

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
  tokens: number;
}

const VIDEO_FEED: VideoItem[] = [
  {
    id: "1",
    creatorName: "Luna Starz",
    creatorAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    title: "AI-Generated Music Video",
    description: "Created with Big Starz Cameo + Voice Clone \u{1F3A4}\u2728",
    views: 124500,
    likes: 8420,
    comments: 342,
    shares: 1205,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop",
    genre: "Pop",
    beautifyFilter: "full-luxury",
    tokens: 3,
  },
  {
    id: "2",
    creatorName: "Neon Dreams",
    creatorAvatar: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=100&fit=crop",
    title: "Voice Clone Demo - R&B Vibes",
    description: "Smooth vocals powered by AI synthesis \u{1F3B5}",
    views: 89200,
    likes: 5670,
    comments: 189,
    shares: 834,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=900&fit=crop",
    genre: "R&B",
    beautifyFilter: "studio-lighting",
    tokens: 2,
  },
  {
    id: "3",
    creatorName: "Cyber Vibe",
    creatorAvatar: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    title: "EDM Drop - Sora Generated",
    description: "Full video generated with AI from text prompt \u{1F680}",
    views: 234100,
    likes: 15800,
    comments: 567,
    shares: 2340,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=900&fit=crop",
    genre: "EDM",
    beautifyFilter: "neon-glow",
    tokens: 5,
  },
  {
    id: "4",
    creatorName: "Echo Sound",
    creatorAvatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
    title: "Country Roads - AI Remix",
    description: "Classic country with modern AI production \u{1F3B8}",
    views: 67800,
    likes: 4230,
    comments: 156,
    shares: 678,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=900&fit=crop",
    genre: "Country",
    beautifyFilter: "cinematic",
    tokens: 2,
  },
  {
    id: "5",
    creatorName: "Starz Queen",
    creatorAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    title: "Latin Heat - Reggaeton",
    description: "AI-generated reggaeton with custom vocals \u{1F525}",
    views: 156000,
    likes: 11200,
    comments: 423,
    shares: 1890,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop",
    genre: "Latin",
    beautifyFilter: "tropical-glow",
    tokens: 4,
  },
];

interface GiftOption {
  id: string;
  name: string;
  icon: string;
  tokens: number;
  color: string;
}

const GIFTS: GiftOption[] = [
  { id: "1", name: "Star", icon: "\u2B50", tokens: 5, color: "#FFD700" },
  { id: "2", name: "Fire", icon: "\u{1F525}", tokens: 10, color: "#FF4500" },
  { id: "3", name: "Diamond", icon: "\u{1F48E}", tokens: 50, color: "#00BFFF" },
  { id: "4", name: "Crown", icon: "\u{1F451}", tokens: 100, color: "#FFD700" },
  { id: "5", name: "Rocket", icon: "\u{1F680}", tokens: 200, color: "#9D00FF" },
  { id: "6", name: "Platinum Record", icon: "\u{1F4BF}", tokens: 500, color: "#C0C0C0" },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function VibeFeedScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [feedTab, setFeedTab] = useState<"foryou" | "following">("foryou");
  const [refreshing, setRefreshing] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giftTarget, setGiftTarget] = useState<VideoItem | null>(null);
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleShare = async (item: VideoItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await Share.share({
        message: `Check out "${item.title}" by @${item.creatorName.replace(" ", "")} on Big Starz! \u{1F31F}\n\nhttps://bigstarz.app/v/${item.id}`,
        title: item.title,
      });
    } catch (_) {}
  };

  const openGiftModal = (item: VideoItem) => {
    setGiftTarget(item);
    setGiftModalVisible(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const sendGift = (gift: GiftOption) => {
    setGiftModalVisible(false);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderVideoCard = ({ item }: { item: VideoItem }) => {
    const isLiked = likedItems.has(item.id);

    return (
      <View style={{ width: SCREEN_WIDTH, height: CARD_HEIGHT, position: "relative" }}>
        {/* Full-screen thumbnail */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          resizeMode="cover"
        />

        {/* Gradient overlays */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, backgroundColor: "rgba(0,0,0,0.5)" }} />
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 280, backgroundColor: "rgba(0,0,0,0.7)" }} />

        {/* LIVE badge */}
        {item.isLive && (
          <View style={{ position: "absolute", top: 60, left: 16, backgroundColor: "#FF007F", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFF", marginRight: 4 }} />
            <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "700" }}>LIVE</Text>
          </View>
        )}

        {/* Genre badge */}
        <View style={{ position: "absolute", top: 60, right: 16, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,0,127,0.4)" }}>
          <Text style={{ color: "#FF007F", fontSize: 10, fontWeight: "600" }}>{item.genre}</Text>
        </View>

        {/* Play button */}
        <View style={{ position: "absolute", top: "40%", left: "50%", marginLeft: -28, marginTop: -28 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(255,0,127,0.85)", alignItems: "center", justifyContent: "center", shadowColor: "#FF007F", shadowOpacity: 0.7, shadowRadius: 16, elevation: 8 }}>
            <Text style={{ color: "#FFF", fontSize: 22, marginLeft: 3 }}>{"\u25B6"}</Text>
          </View>
        </View>

        {/* Right action bar (TikTok-style) */}
        <View style={{ position: "absolute", right: 12, bottom: 140, alignItems: "center", gap: 18 }}>
          {/* Avatar */}
          <Pressable style={{ alignItems: "center" }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: "#FF007F", overflow: "hidden" }}>
              <Image source={{ uri: item.creatorAvatar }} style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={{ position: "absolute", bottom: -5, backgroundColor: "#FF007F", width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800" }}>+</Text>
            </View>
          </Pressable>

          {/* Like */}
          <Pressable onPress={() => toggleLike(item.id)} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{isLiked ? "\u2764\uFE0F" : "\u{1F90D}"}</Text>
            <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "600", marginTop: 2 }}>
              {formatNumber(item.likes + (isLiked ? 1 : 0))}
            </Text>
          </Pressable>

          {/* Comments */}
          <Pressable style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>{"\u{1F4AC}"}</Text>
            <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "600", marginTop: 2 }}>{formatNumber(item.comments)}</Text>
          </Pressable>

          {/* Share */}
          <Pressable onPress={() => handleShare(item)} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>{"\u{1F4E4}"}</Text>
            <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "600", marginTop: 2 }}>{formatNumber(item.shares)}</Text>
          </Pressable>

          {/* Gift */}
          <Pressable onPress={() => openGiftModal(item)} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>{"\u{1F381}"}</Text>
            <Text style={{ color: "#FFD700", fontSize: 10, fontWeight: "600", marginTop: 2 }}>Gift</Text>
          </Pressable>
        </View>

        {/* Bottom info */}
        <View style={{ position: "absolute", bottom: 16, left: 16, right: 68 }}>
          <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "800", marginBottom: 3 }}>
            @{item.creatorName.replace(" ", "")}
          </Text>
          <Text style={{ color: "#FFF", fontSize: 13, fontWeight: "600", marginBottom: 3 }}>{item.title}</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 6 }} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#888", fontSize: 11 }}>{formatNumber(item.views)} views</Text>
            <View style={{ backgroundColor: "rgba(212,175,55,0.8)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
              <Text style={{ color: "#FFF", fontSize: 9, fontWeight: "600" }}>{item.beautifyFilter.replace("-", " ")}</Text>
            </View>
            <View style={{ backgroundColor: "rgba(0,255,0,0.15)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: "#00FF00", fontSize: 9, fontWeight: "600" }}>{item.tokens} tokens</Text>
            </View>
          </View>
        </View>

        {/* Watermark */}
        <View style={{ position: "absolute", bottom: 20, right: 14, opacity: 0.4 }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 18, height: 18 }} resizeMode="contain" />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="bg-black" edges={["left", "right"]}>
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Floating Header with For You / Following */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 8, paddingBottom: 10, paddingHorizontal: 16, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Image source={{ uri: LOGO_URL }} style={{ width: 28, height: 28, marginRight: 8 }} resizeMode="contain" />
            <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFF", letterSpacing: 2 }}>BIG STARZ</Text>
          </View>
          {/* For You / Following tabs */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8, gap: 24 }}>
            <Pressable onPress={() => setFeedTab("following")}>
              <Text style={{ color: feedTab === "following" ? "#FFF" : "#888", fontSize: 14, fontWeight: feedTab === "following" ? "700" : "400" }}>Following</Text>
              {feedTab === "following" && <View style={{ height: 2, backgroundColor: "#FF007F", borderRadius: 1, marginTop: 4 }} />}
            </Pressable>
            <Pressable onPress={() => setFeedTab("foryou")}>
              <Text style={{ color: feedTab === "foryou" ? "#FFF" : "#888", fontSize: 14, fontWeight: feedTab === "foryou" ? "700" : "400" }}>For You</Text>
              {feedTab === "foryou" && <View style={{ height: 2, backgroundColor: "#FF007F", borderRadius: 1, marginTop: 4 }} />}
            </Pressable>
          </View>
        </View>

        {/* TikTok-style vertical feed */}
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
          getItemLayout={(_, index) => ({ length: CARD_HEIGHT, offset: CARD_HEIGHT * index, index })}
          contentContainerStyle={{ paddingTop: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF007F" colors={["#FF007F"]} />
          }
        />

        {/* Page dots */}
        <View style={{ position: "absolute", bottom: 6, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 4 }}>
          {VIDEO_FEED.map((_, idx) => (
            <View key={idx} style={{ width: idx === activeIndex ? 14 : 5, height: 5, borderRadius: 2.5, backgroundColor: idx === activeIndex ? "#FF007F" : "rgba(255,255,255,0.3)" }} />
          ))}
        </View>

        {/* Gift Modal */}
        <Modal visible={giftModalVisible} transparent animationType="slide" onRequestClose={() => setGiftModalVisible(false)}>
          <Pressable style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" }} onPress={() => setGiftModalVisible(false)}>
            <View style={{ backgroundColor: "#1A1A1A", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 }}>
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#333" }} />
              </View>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 4 }}>
                Send Gift to @{giftTarget?.creatorName.replace(" ", "")}
              </Text>
              <Text style={{ color: "#888", fontSize: 12, textAlign: "center", marginBottom: 20 }}>
                Show your support with Starz Tokens
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                {GIFTS.map((gift) => (
                  <Pressable
                    key={gift.id}
                    onPress={() => sendGift(gift)}
                    style={({ pressed }) => ({
                      width: 90,
                      alignItems: "center",
                      backgroundColor: "rgba(26,26,26,0.8)",
                      borderRadius: 16,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: `${gift.color}40`,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 28 }}>{gift.icon}</Text>
                    <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "600", marginTop: 4 }}>{gift.name}</Text>
                    <Text style={{ color: gift.color, fontSize: 10, marginTop: 2 }}>{gift.tokens} tokens</Text>
                  </Pressable>
                ))}
              </View>

              <View style={{ marginTop: 16, alignItems: "center" }}>
                <Text style={{ color: "#555", fontSize: 11 }}>Your balance: 47 Starz Tokens</Text>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
