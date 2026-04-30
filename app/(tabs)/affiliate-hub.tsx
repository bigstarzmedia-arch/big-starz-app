/**
 * Affiliate Modeling Hub Screen
 * Browse luxury brands, streetwear, and jewelry castings with advanced search and filtering
 */

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { trpc } from "@/lib/trpc";

interface Casting {
  id: number;
  brandName: string;
  productCategory: string;
  briefDescription: string;
  compensation: string;
  applicationDeadline: Date;
  status: "open" | "closed";
  genre?: string;
  aestheticTags?: string[];
  priceRange?: { min: number; max: number };
}

interface TrendRecommendation {
  brand: string;
  trend: string;
  relevanceScore: number;
  musicGenres: string[];
}

/**
 * Affiliate Modeling Hub Screen
 */
export default function AffiliateHubScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("cast");
  const [castings, setCastings] = useState<Casting[]>([]);
  const [trends, setTrends] = useState<TrendRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "luxury" | "streetwear" | "jewelry">("all");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tRPC query
  const castingsQuery = trpc.castings.getOpen.useQuery();

  useEffect(() => {
    loadCastings();
    loadTrends();
  }, []);

  const loadCastings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use tRPC query if available
      if (castingsQuery.data) {
        setCastings(castingsQuery.data as any);
        return;
      }

      // Mock data for development
      setCastings([
        {
          id: 1,
          brandName: "SSENSE",
          productCategory: "Luxury Fashion",
          briefDescription: "High-end multi-brand luxury retailer seeking models for campaign",
          compensation: "$500-$2000",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "open",
          genre: "Pop",
          aestheticTags: ["minimalist", "luxury", "editorial"],
          priceRange: { min: 500, max: 2000 },
        },
        {
          id: 2,
          brandName: "Fashion Nova",
          productCategory: "Streetwear & Casual",
          briefDescription: "Trendy streetwear and casual fashion brand collaboration",
          compensation: "$300-$1200",
          applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          status: "open",
          genre: "Hip-Hop",
          aestheticTags: ["streetwear", "urban", "trendy"],
          priceRange: { min: 300, max: 1200 },
        },
        {
          id: 3,
          brandName: "Jaxxon",
          productCategory: "Fashion Jewelry",
          briefDescription: "Trendy fashion jewelry and accessories brand",
          compensation: "$250-$1000",
          applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: "open",
          genre: "R&B",
          aestheticTags: ["jewelry", "luxury", "sparkle"],
          priceRange: { min: 250, max: 1000 },
        },
        {
          id: 4,
          brandName: "Nike",
          productCategory: "Sportswear",
          briefDescription: "Athletic and performance wear campaign",
          compensation: "$800-$3000",
          applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          status: "open",
          genre: "Hip-Hop",
          aestheticTags: ["athletic", "performance", "dynamic"],
          priceRange: { min: 800, max: 3000 },
        },
        {
          id: 5,
          brandName: "Gucci",
          productCategory: "Luxury Fashion",
          briefDescription: "Premium luxury fashion house editorial shoot",
          compensation: "$1500-$5000",
          applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          status: "open",
          genre: "Pop",
          aestheticTags: ["luxury", "editorial", "high-fashion"],
          priceRange: { min: 1500, max: 5000 },
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load castings");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      setTrends([
        {
          brand: "SSENSE",
          trend: "Luxury minimalism",
          relevanceScore: 0.95,
          musicGenres: ["Pop", "R&B"],
        },
        {
          brand: "Fashion Nova",
          trend: "Streetwear collaboration",
          relevanceScore: 0.88,
          musicGenres: ["Hip-Hop", "R&B"],
        },
        {
          brand: "Nike",
          trend: "Athletic performance",
          relevanceScore: 0.92,
          musicGenres: ["Hip-Hop", "EDM"],
        },
      ]);
    } catch (err) {
      console.error("Failed to load trends:", err);
    }
  };

  /**
   * Filter castings based on search, category, genre, and price range
   */
  const filteredCastings = castings.filter((casting) => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        casting.brandName.toLowerCase().includes(query) ||
        casting.briefDescription.toLowerCase().includes(query) ||
        casting.productCategory.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "luxury" && !casting.productCategory.includes("Luxury")) return false;
      if (selectedCategory === "streetwear" && !casting.productCategory.includes("Streetwear")) return false;
      if (selectedCategory === "jewelry" && !casting.productCategory.includes("Jewelry")) return false;
    }

    // Genre filter
    if (selectedGenre && casting.genre !== selectedGenre) return false;

    // Price range filter
    if (casting.priceRange) {
      if (casting.priceRange.min > priceRange.max || casting.priceRange.max < priceRange.min) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGenre(null);
    setPriceRange({ min: 0, max: 5000 });
    setShowFilters(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
            Affiliate Hub
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            Browse and apply for modeling opportunities
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: colors.error,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: colors.error,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
              ⚠️ {error}
            </Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.muted, marginRight: 8 }}>🔍</Text>
            <TextInput
              placeholder="Search brands, categories..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: 12,
                color: colors.foreground,
                fontSize: 12,
              }}
            />
          </View>
        </View>

        {/* Filter Toggle Button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Pressable
            onPress={() => {
              setShowFilters(!showFilters);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
              🎛️ {showFilters ? "Hide Filters" : "Show Filters"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {filteredCastings.length} results
            </Text>
          </Pressable>
        </View>

        {/* Advanced Filters */}
        {showFilters && (
          <View style={{ paddingHorizontal: 16, marginBottom: 16, gap: 12 }}>
            {/* Category Filter */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
                Category
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {[
                  { id: "all", label: "All" },
                  { id: "luxury", label: "Luxury" },
                  { id: "streetwear", label: "Streetwear" },
                  { id: "jewelry", label: "Jewelry" },
                ].map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      setSelectedCategory(cat.id as any);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      backgroundColor: selectedCategory === cat.id ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: selectedCategory === cat.id ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: selectedCategory === cat.id ? colors.background : colors.foreground,
                      }}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Genre Filter */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
                Music Genre
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {["Pop", "Hip-Hop", "R&B", "EDM", "Country"].map((genre) => (
                  <Pressable
                    key={genre}
                    onPress={() => {
                      setSelectedGenre(selectedGenre === genre ? null : genre);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      backgroundColor: selectedGenre === genre ? colors.accent2 : colors.surface,
                      borderWidth: 1,
                      borderColor: selectedGenre === genre ? colors.accent2 : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: selectedGenre === genre ? colors.background : colors.foreground,
                      }}
                    >
                      {genre}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
                💰 Price Range: ${priceRange.min} - ${priceRange.max}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Under $500", min: 0, max: 500 },
                  { label: "$500-$1K", min: 500, max: 1000 },
                  { label: "$1K-$2K", min: 1000, max: 2000 },
                  { label: "$2K+", min: 2000, max: 5000 },
                ].map((range) => (
                  <Pressable
                    key={range.label}
                    onPress={() => {
                      setPriceRange({ min: range.min, max: range.max });
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      backgroundColor:
                        priceRange.min === range.min && priceRange.max === range.max
                          ? colors.accent3
                          : colors.surface,
                      borderWidth: 1,
                      borderColor:
                        priceRange.min === range.min && priceRange.max === range.max
                          ? colors.accent3
                          : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color:
                          priceRange.min === range.min && priceRange.max === range.max
                            ? colors.background
                            : colors.foreground,
                      }}
                    >
                      {range.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reset Filters Button */}
            <Pressable
              onPress={handleResetFilters}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: colors.surface,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>
                ↺ Reset All Filters
              </Text>
            </Pressable>
          </View>
        )}

        {/* Trending Opportunities */}
        {trends.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
              🔥 Trending Now
            </Text>
            <FlatList
              data={trends}
              keyExtractor={(item, idx) => `${item.brand}-${idx}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: colors.accent1,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.accent1 }}>
                      {item.brand}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                        backgroundColor: colors.accent1,
                        color: colors.background,
                      }}
                    >
                      {(item.relevanceScore * 100).toFixed(0)}% match
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: colors.foreground, marginBottom: 4 }}>
                    {item.trend}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>
                    🎵 {item.musicGenres.join(", ")}
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Castings List */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            Open Castings ({filteredCastings.length})
          </Text>
          {filteredCastings.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 24 }}>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                No castings match your filters
              </Text>
              <Pressable
                onPress={handleResetFilters}
                style={{ marginTop: 12, paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredCastings}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => <CastingCard casting={item} colors={colors} />}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

/**
 * Casting Card Component
 */
function CastingCard({ casting, colors }: { casting: Casting; colors: any }) {
  const daysUntilDeadline = Math.ceil(
    (new Date(casting.applicationDeadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.foreground }}>
            {casting.brandName}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted }}>
            {casting.productCategory}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.success,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: "bold", color: colors.background }}>
            OPEN
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={{ fontSize: 11, color: colors.foreground, marginBottom: 8 }}>
        {casting.briefDescription}
      </Text>

      {/* Tags */}
      {casting.aestheticTags && casting.aestheticTags.length > 0 && (
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {casting.aestheticTags.map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.accent3,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: "600", color: colors.background }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Details */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 8 }}>
        <View>
          <Text style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>
            Compensation
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.primary }}>
            {casting.compensation}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>
            Deadline
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground }}>
            {daysUntilDeadline} days
          </Text>
        </View>
        {casting.genre && (
          <View>
            <Text style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>
              Genre
            </Text>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.accent2 }}>
              {casting.genre}
            </Text>
          </View>
        )}
      </View>

      {/* CTA Buttons */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 6,
            backgroundColor: colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.background }}>
            ✨ Apply Now
          </Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 6,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground }}>
            ℹ️ Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
