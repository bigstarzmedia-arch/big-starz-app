/**
 * CAST Screen - Affiliate Modeling Hub
 * Browse luxury brands, streetwear, and jewelry castings
 * Advanced search & filtering with Big Starz dark theme
 */

import { View, Text, Pressable, ScrollView, TextInput, Image, Platform } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

interface Casting {
  id: string;
  brandName: string;
  category: "luxury" | "streetwear" | "jewelry";
  description: string;
  compensation: string;
  compensationValue: number;
  deadline: string;
  genre: string;
  aestheticTags: string[];
  status: "open" | "closing-soon";
  applicants: number;
  image: string;
}

const CASTINGS: Casting[] = [
  {
    id: "1",
    brandName: "SSENSE",
    category: "luxury",
    description: "High-fashion editorial for Spring 2026 campaign. Looking for bold, confident creators.",
    compensation: "$2,500",
    compensationValue: 2500,
    deadline: "May 15",
    genre: "Pop",
    aestheticTags: ["minimalist", "editorial", "high-fashion"],
    status: "open",
    applicants: 34,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    brandName: "Fashion Nova",
    category: "streetwear",
    description: "Music video collab for summer streetwear drop. Need dancers and performers.",
    compensation: "$800",
    compensationValue: 800,
    deadline: "May 8",
    genre: "Hip-Hop",
    aestheticTags: ["streetwear", "urban", "bold"],
    status: "closing-soon",
    applicants: 67,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    brandName: "The GLD Shop",
    category: "jewelry",
    description: "Premium jewelry showcase for AI-generated music video. Cuban links and iced-out pieces.",
    compensation: "$1,200",
    compensationValue: 1200,
    deadline: "May 20",
    genre: "R&B",
    aestheticTags: ["luxury", "iced-out", "premium"],
    status: "open",
    applicants: 22,
    image: "https://images.unsplash.com/photo-1515562141589-67f0d8e7e636?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    brandName: "StockX",
    category: "streetwear",
    description: "Sneaker unboxing content for limited edition drop. Authentic hype culture vibes.",
    compensation: "$600",
    compensationValue: 600,
    deadline: "May 5",
    genre: "EDM",
    aestheticTags: ["hype", "sneakers", "authentic"],
    status: "closing-soon",
    applicants: 89,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    brandName: "Farfetch",
    category: "luxury",
    description: "Luxury lifestyle campaign featuring AI-generated cinematic visuals and high-end fashion.",
    compensation: "$3,000",
    compensationValue: 3000,
    deadline: "May 25",
    genre: "Pop",
    aestheticTags: ["cinematic", "luxury", "editorial"],
    status: "open",
    applicants: 15,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
  },
  {
    id: "6",
    brandName: "King Ice",
    category: "jewelry",
    description: "Hip-hop music video featuring custom chains and pendants. Need confident performers.",
    compensation: "$900",
    compensationValue: 900,
    deadline: "May 12",
    genre: "Hip-Hop",
    aestheticTags: ["hip-hop", "chains", "bold"],
    status: "open",
    applicants: 45,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop",
  },
  {
    id: "7",
    brandName: "True Religion",
    category: "streetwear",
    description: "Country-crossover campaign blending denim culture with modern Nashville sound.",
    compensation: "$1,500",
    compensationValue: 1500,
    deadline: "May 18",
    genre: "Country",
    aestheticTags: ["denim", "crossover", "Nashville"],
    status: "open",
    applicants: 28,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop",
  },
  {
    id: "8",
    brandName: "Cernucci",
    category: "jewelry",
    description: "Latin music video with premium jewelry styling. Reggaeton vibes and tropical energy.",
    compensation: "$1,100",
    compensationValue: 1100,
    deadline: "May 22",
    genre: "Latin",
    aestheticTags: ["tropical", "premium", "reggaeton"],
    status: "open",
    applicants: 31,
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=200&h=200&fit=crop",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", color: "#FF007F" },
  { id: "luxury", label: "Luxury", color: "#D4AF37" },
  { id: "streetwear", label: "Street", color: "#00FFFF" },
  { id: "jewelry", label: "Jewelry", color: "#9D00FF" },
];

const GENRES = ["All", "Pop", "Hip-Hop", "R&B", "EDM", "Country", "Latin", "Rock"];

const PRICE_RANGES = [
  { label: "Any", min: 0, max: 99999 },
  { label: "$0-$500", min: 0, max: 500 },
  { label: "$500-$1K", min: 500, max: 1000 },
  { label: "$1K-$2K", min: 1000, max: 2000 },
  { label: "$2K+", min: 2000, max: 99999 },
];

export default function AffiliateHubScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCastings = useMemo(() => {
    return CASTINGS.filter((casting) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          casting.brandName.toLowerCase().includes(q) ||
          casting.description.toLowerCase().includes(q) ||
          casting.category.toLowerCase().includes(q) ||
          casting.aestheticTags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Category
      if (selectedCategory !== "all" && casting.category !== selectedCategory) return false;
      // Genre
      if (selectedGenre !== "All" && casting.genre !== selectedGenre) return false;
      // Price
      if (casting.compensationValue < selectedPriceRange.min || casting.compensationValue > selectedPriceRange.max) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedGenre, selectedPriceRange]);

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header */}
        <View style={{ paddingVertical: 12, paddingHorizontal: 20, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255, 0, 127, 0.2)" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#FFFFFF", letterSpacing: 2 }}>CAST</Text>
          <Text style={{ fontSize: 11, color: "#FF007F", marginTop: 2, letterSpacing: 1 }}>AFFILIATE MODELING HUB</Text>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(26, 26, 26, 0.8)", borderRadius: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(255, 0, 127, 0.2)" }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>{"\u{1F50D}"}</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search brands, categories..."
              placeholderTextColor="#555"
              style={{ flex: 1, color: "#FFF", fontSize: 14, paddingVertical: 12 }}
              returnKeyType="search"
            />
            <Pressable
              onPress={() => {
                setShowFilters(!showFilters);
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 4 })}
            >
              <Text style={{ fontSize: 18, color: showFilters ? "#FF007F" : "#888" }}>{"\u2699\uFE0F"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Category Tabs */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === cat.id ? `${cat.color}30` : "rgba(26, 26, 26, 0.8)",
                  borderWidth: 1,
                  borderColor: selectedCategory === cat.id ? cat.color : "#333",
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Text style={{ color: selectedCategory === cat.id ? cat.color : "#888", fontSize: 12, fontWeight: "600" }}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Advanced Filters */}
        {showFilters && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 10 }}>
            {/* Genre Filter */}
            <View>
              <Text style={{ color: "#888", fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>GENRE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {GENRES.map((genre) => (
                  <Pressable
                    key={genre}
                    onPress={() => setSelectedGenre(genre)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 14,
                      backgroundColor: selectedGenre === genre ? "rgba(255, 0, 127, 0.2)" : "rgba(26, 26, 26, 0.6)",
                      borderWidth: 1,
                      borderColor: selectedGenre === genre ? "#FF007F" : "#333",
                    }}
                  >
                    <Text style={{ color: selectedGenre === genre ? "#FF007F" : "#888", fontSize: 11, fontWeight: "500" }}>{genre}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Price Range Filter */}
            <View>
              <Text style={{ color: "#888", fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>COMPENSATION</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {PRICE_RANGES.map((range) => (
                  <Pressable
                    key={range.label}
                    onPress={() => setSelectedPriceRange(range)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 14,
                      backgroundColor: selectedPriceRange.label === range.label ? "rgba(0, 255, 0, 0.15)" : "rgba(26, 26, 26, 0.6)",
                      borderWidth: 1,
                      borderColor: selectedPriceRange.label === range.label ? "#00FF00" : "#333",
                    }}
                  >
                    <Text style={{ color: selectedPriceRange.label === range.label ? "#00FF00" : "#888", fontSize: 11, fontWeight: "500" }}>{range.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Reset */}
            <Pressable
              onPress={() => {
                setSelectedCategory("all");
                setSelectedGenre("All");
                setSelectedPriceRange(PRICE_RANGES[0]);
                setSearchQuery("");
              }}
              style={{ alignSelf: "flex-end" }}
            >
              <Text style={{ color: "#FF007F", fontSize: 11, fontWeight: "600" }}>Reset Filters</Text>
            </Pressable>
          </View>
        )}

        {/* Results Count */}
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }}>
          <Text style={{ color: "#555", fontSize: 11 }}>
            {filteredCastings.length} casting{filteredCastings.length !== 1 ? "s" : ""} available
          </Text>
        </View>

        {/* Casting Cards */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
          {filteredCastings.length === 0 ? (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F50D}"}</Text>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600", marginBottom: 4 }}>No castings found</Text>
              <Text style={{ color: "#888", fontSize: 13, textAlign: "center" }}>Try adjusting your filters or search terms</Text>
            </View>
          ) : (
            filteredCastings.map((casting) => (
              <Pressable
                key={casting.id}
                style={({ pressed }) => ({
                  backgroundColor: "rgba(26, 26, 26, 0.8)",
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: casting.status === "closing-soon" ? "rgba(255, 215, 0, 0.4)" : "rgba(51, 51, 51, 0.5)",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View style={{ flexDirection: "row" }}>
                  {/* Brand Image */}
                  <Image
                    source={{ uri: casting.image }}
                    style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12 }}
                  />

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>{casting.brandName}</Text>
                      <Text style={{ color: "#00FF00", fontSize: 14, fontWeight: "800" }}>{casting.compensation}</Text>
                    </View>
                    <Text style={{ color: "#888", fontSize: 12, marginTop: 3 }} numberOfLines={2}>
                      {casting.description}
                    </Text>

                    {/* Tags */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {casting.aestheticTags.map((tag) => (
                        <View key={tag} style={{ backgroundColor: "rgba(157, 0, 255, 0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                          <Text style={{ color: "#9D00FF", fontSize: 9, fontWeight: "500" }}>{tag}</Text>
                        </View>
                      ))}
                      <View style={{ backgroundColor: "rgba(255, 0, 127, 0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                        <Text style={{ color: "#FF007F", fontSize: 9, fontWeight: "500" }}>{casting.genre}</Text>
                      </View>
                    </View>

                    {/* Footer */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <Text style={{ color: "#555", fontSize: 10 }}>
                        {casting.applicants} applicants {"\u2022"} Due {casting.deadline}
                      </Text>
                      {casting.status === "closing-soon" && (
                        <View style={{ backgroundColor: "rgba(255, 215, 0, 0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ color: "#FFD700", fontSize: 9, fontWeight: "600" }}>CLOSING SOON</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
