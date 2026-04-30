/**
 * CAST Screen - Affiliate Hub Grid Marketplace
 * Stat counters, model cards with ratings and prices
 */

import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";

interface ModelCard {
  id: string;
  name: string;
  genre: string;
  tags: string[];
  rating: number;
  totalCasts: number;
  price: number;
  avatar: string;
}

const MODELS: ModelCard[] = [
  {
    id: "1",
    name: "Luna Starz",
    genre: "R&B",
    tags: ["Luxury", "High-Fashion"],
    rating: 4.9,
    totalCasts: 127,
    price: 150,
    avatar: "👩‍🎤",
  },
  {
    id: "2",
    name: "Neon Dreams",
    genre: "Rap",
    tags: ["Streetwear", "Urban"],
    rating: 4.8,
    totalCasts: 89,
    price: 120,
    avatar: "🎵",
  },
  {
    id: "3",
    name: "Cyber Vibe",
    genre: "EDM",
    tags: ["Tech", "Futuristic"],
    rating: 4.7,
    totalCasts: 156,
    price: 180,
    avatar: "🎸",
  },
  {
    id: "4",
    name: "Echo Sound",
    genre: "Latin",
    tags: ["Luxury", "Jewelry"],
    rating: 4.9,
    totalCasts: 203,
    price: 200,
    avatar: "🎤",
  },
];

export default function CastScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("cast");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Stat Counters */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.primary }}>
              {MODELS.length * 50}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>Actors</Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.accent1 }}>
              {MODELS.length * 15}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>Available</Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.accent2 }}>
              {MODELS.reduce((sum, m) => sum + m.totalCasts, 0)}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>Hired</Text>
          </View>
        </View>

        {/* Model Grid */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <FlatList
            scrollEnabled={false}
            data={MODELS}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: "100%",
                    height: 120,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 48 }}>{item.avatar}</Text>
                </View>

                {/* Info */}
                <View style={{ padding: 10 }}>
                  {/* Name & Genre */}
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>
                    {item.genre}
                  </Text>

                  {/* Tags */}
                  <View style={{ flexDirection: "row", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                    {item.tags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}
                      >
                        <Text style={{ fontSize: 8, color: colors.primary }}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Rating & Casts */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                      paddingBottom: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 10, color: colors.muted }}>
                        ⭐ {item.rating}
                      </Text>
                      <Text style={{ fontSize: 9, color: colors.muted }}>
                        {item.totalCasts} casts
                      </Text>
                    </View>
                  </View>

                  {/* Price Tag */}
                  <View
                    style={{
                      backgroundColor: colors.accent2,
                      borderRadius: 6,
                      paddingVertical: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: colors.background,
                      }}
                    >
                      ${item.price}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
