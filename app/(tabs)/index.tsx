/**
 * Big Starz Vibe Feed - Main Entry Point
 * Matte Black background, Neon Pink/Purple accents, glassmorphism, Big Starz logo
 */

import { ScrollView, Text, View, Pressable, FlatList, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

interface FeaturedArtist {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
}

interface VideoCard {
  id: string;
  creatorName: string;
  title: string;
  views: number;
  isLive: boolean;
  thumbnail: string;
  beautifyFilter: string;
}

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

const FILTER_OPTIONS = ["All", "Rap", "R&B", "Pop", "EDM", "Country"];

const VIDEO_FEED: VideoCard[] = [
  {
    id: "1",
    creatorName: "Luna Starz",
    title: "New AI-Generated Music Video",
    views: 12034,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop",
    beautifyFilter: "full-luxury",
  },
  {
    id: "2",
    creatorName: "Neon Dreams",
    title: "Cameo Beautify - Voice Clone Ready",
    views: 28471,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    beautifyFilter: "studio-lighting",
  },
  {
    id: "3",
    creatorName: "Cyber Vibe",
    title: "Latin Vibes - EDM Remix",
    views: 54321,
    isLive: false,
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=600&fit=crop",
    beautifyFilter: "neon-glow",
  },
  {
    id: "4",
    creatorName: "Echo Sound",
    title: "Electronic Dreams",
    views: 18765,
    isLive: true,
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop",
    beautifyFilter: "cinematic",
  },
];

export default function VibeFeedScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGoLive = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header with Centered Big Starz Logo */}
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 20,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 0, 127, 0.2)",
          }}
        >
          <Image
            source={{ uri: LOGO_URL }}
            style={{ width: 80, height: 80, borderRadius: 8 }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            BIG STARZ
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#FF007F",
              letterSpacing: 2,
              marginTop: 2,
              fontWeight: "600",
            }}
          >
            ELITE LUXURY LOUNGE
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Featured Artists Section */}
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#FFFFFF",
                paddingHorizontal: 20,
                marginBottom: 14,
                letterSpacing: 1,
              }}
            >
              FEATURED ARTISTS
            </Text>

            <FlatList
              horizontal
              data={FEATURED_ARTISTS}
              renderItem={({ item }) => (
                <Pressable
                  style={{ marginHorizontal: 12, alignItems: "center" }}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                >
                  <View
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      borderWidth: 3,
                      borderColor: "#FF007F",
                      overflow: "hidden",
                      shadowColor: "#FF007F",
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      elevation: 8,
                    }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={{ width: "100%", height: "100%", borderRadius: 34 }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: "#FFFFFF",
                      textAlign: "center",
                      marginTop: 6,
                      maxWidth: 76,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#888888", marginTop: 2 }}>
                    {item.subscribers.toLocaleString()} subs
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              scrollEnabled={true}
            />
          </View>

          {/* Filter Pills */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <FlatList
              horizontal
              data={FILTER_OPTIONS}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleFilterPress(item)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: activeFilter === item ? "#FF007F" : "rgba(26, 26, 26, 0.8)",
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor:
                      activeFilter === item ? "#FF007F" : "rgba(255, 0, 127, 0.3)",
                    shadowColor: activeFilter === item ? "#FF007F" : "transparent",
                    shadowOpacity: activeFilter === item ? 0.6 : 0,
                    shadowRadius: activeFilter === item ? 8 : 0,
                    elevation: activeFilter === item ? 4 : 0,
                  }}
                >
                  <Text
                    style={{
                      color: activeFilter === item ? "#FFFFFF" : "#AAAAAA",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          </View>

          {/* GO LIVE Button */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Pressable
              onPress={handleGoLive}
              style={({ pressed }) => ({
                backgroundColor: "#FF007F",
                paddingHorizontal: 40,
                paddingVertical: 14,
                borderRadius: 30,
                shadowColor: "#FF007F",
                shadowOpacity: 0.8,
                shadowRadius: 16,
                elevation: 10,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
                GO LIVE
              </Text>
            </Pressable>
          </View>

          {/* Video Feed with Glassmorphism Cards */}
          {VIDEO_FEED.map((item) => (
            <View key={item.id} style={{ marginBottom: 20, paddingHorizontal: 16 }}>
              <View
                style={{
                  backgroundColor: "rgba(26, 26, 26, 0.7)",
                  borderRadius: 20,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: item.isLive
                    ? "rgba(255, 0, 127, 0.5)"
                    : "rgba(157, 0, 255, 0.3)",
                  // Glassmorphism effect
                  shadowColor: item.isLive ? "#FF007F" : "#9D00FF",
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                {/* Thumbnail */}
                <View style={{ height: 220, position: "relative" }}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={{ width: "100%", height: "100%", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                    resizeMode="cover"
                  />
                  {/* Dark overlay for glassmorphism */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                  />

                  {/* Live Badge */}
                  {item.isLive && (
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#FF007F",
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 16,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#FFFFFF",
                          marginRight: 5,
                        }}
                      />
                      <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>LIVE</Text>
                    </View>
                  )}

                  {/* Beautify Filter Badge */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      backgroundColor: "rgba(212, 175, 55, 0.85)",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "600" }}>
                      {item.beautifyFilter.replace("-", " ")}
                    </Text>
                  </View>

                  {/* Big Starz Watermark */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      opacity: 0.6,
                    }}
                  >
                    <Image
                      source={{ uri: LOGO_URL }}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* Card Info */}
                <View style={{ padding: 16 }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700", marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: "#888888", fontSize: 12, marginBottom: 12 }}>
                    by {item.creatorName} · {item.views.toLocaleString()} views
                  </Text>

                  {/* Action Row */}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: "#FF007F",
                        paddingVertical: 10,
                        borderRadius: 12,
                        alignItems: "center",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>DISTRIBUTE</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => ({
                        flex: 1,
                        backgroundColor: "rgba(212, 175, 55, 0.9)",
                        paddingVertical: 10,
                        borderRadius: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#D4AF37",
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>GIFT</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
