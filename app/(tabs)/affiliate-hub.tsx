import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

interface Casting {
  id: number;
  brandName: string;
  productCategory: string;
  briefDescription: string;
  compensation: string;
  applicationDeadline: Date;
  status: "open" | "closed";
}

interface TrendRecommendation {
  brand: string;
  trend: string;
  relevanceScore: number;
  musicGenres: string[];
}

/**
 * Affiliate Modeling Hub Screen
 * Browse luxury brands, streetwear, and jewelry castings
 * Apply for modeling opportunities
 */
export default function AffiliateHubScreen() {
  const { user } = useAuth();
  const [castings, setCastings] = useState<Casting[]>([]);
  const [trends, setTrends] = useState<TrendRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "luxury" | "streetwear" | "jewelry"
  >("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCastings();
    loadTrends();
  }, []);

  const loadCastings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Fetch castings from API
      // const response = await fetch("/api/trpc/castings.list");
      // const { result } = await response.json();
      // setCastings(result.data);

      // For now, use mock data
      setCastings([
        {
          id: 1,
          brandName: "SSENSE",
          productCategory: "Luxury Fashion",
          briefDescription: "High-end multi-brand luxury retailer",
          compensation: "$500-$2000",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "open",
        },
        {
          id: 2,
          brandName: "Fashion Nova",
          productCategory: "Streetwear & Casual",
          briefDescription: "Trendy streetwear and casual fashion",
          compensation: "$300-$1200",
          applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          status: "open",
        },
        {
          id: 3,
          brandName: "Jaxxon",
          productCategory: "Fashion Jewelry",
          briefDescription: "Trendy fashion jewelry and accessories",
          compensation: "$250-$1000",
          applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: "open",
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
      // TODO: Fetch trends from API
      // const response = await fetch("/api/trpc/trends.getRecommendations");
      // const { result } = await response.json();
      // setTrends(result.data);

      // For now, use mock data
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
      ]);
    } catch (err) {
      console.error("Failed to load trends:", err);
    }
  };

  const filteredCastings = castings.filter((casting) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "luxury")
      return casting.productCategory.includes("Luxury");
    if (selectedCategory === "streetwear")
      return casting.productCategory.includes("Streetwear");
    if (selectedCategory === "jewelry")
      return casting.productCategory.includes("Jewelry");
    return true;
  });

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Affiliate Hub
            </Text>
            <Text className="text-sm text-muted mt-1">
              Browse and apply for modeling opportunities
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Trending Opportunities */}
          {trends.length > 0 && (
            <View className="gap-3">
              <Text className="font-semibold text-foreground">
                🔥 Trending Now
              </Text>
              <FlatList
                data={trends}
                keyExtractor={(item, idx) => `${item.brand}-${idx}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="bg-primary/10 border border-primary rounded-lg p-4 mb-2">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-primary">
                        {item.brand}
                      </Text>
                      <Text className="text-xs bg-primary text-background px-2 py-1 rounded">
                        {(item.relevanceScore * 100).toFixed(0)}% match
                      </Text>
                    </View>
                    <Text className="text-sm text-foreground mb-2">
                      {item.trend}
                    </Text>
                    <Text className="text-xs text-muted">
                      Genres: {item.musicGenres.join(", ")}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Category Filter */}
          <View className="gap-3">
            <Text className="font-semibold text-foreground">Category</Text>
            <View className="flex-row gap-2 flex-wrap">
              {[
                { id: "all", label: "All" },
                { id: "luxury", label: "Luxury" },
                { id: "streetwear", label: "Streetwear" },
                { id: "jewelry", label: "Jewelry" },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() =>
                    setSelectedCategory(cat.id as any)
                  }
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedCategory === cat.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Castings Grid */}
          <View className="gap-3">
            <Text className="font-semibold text-foreground">
              Open Castings ({filteredCastings.length})
            </Text>
            <FlatList
              data={filteredCastings}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <CastingCard casting={item} />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Casting Card Component
 */
function CastingCard({ casting }: { casting: Casting }) {
  const daysUntilDeadline = Math.ceil(
    (casting.applicationDeadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  return (
    <View className="bg-surface border border-border rounded-lg p-4 mb-3">
      <View className="gap-3">
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 gap-1">
            <Text className="font-bold text-lg text-foreground">
              {casting.brandName}
            </Text>
            <Text className="text-xs text-muted">
              {casting.productCategory}
            </Text>
          </View>
          <View className="bg-success/10 px-2 py-1 rounded">
            <Text className="text-xs font-semibold text-success">OPEN</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-sm text-foreground">
          {casting.briefDescription}
        </Text>

        {/* Details */}
        <View className="flex-row gap-4">
          <View className="gap-1">
            <Text className="text-xs text-muted">Compensation</Text>
            <Text className="text-sm font-semibold text-primary">
              {casting.compensation}
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-xs text-muted">Deadline</Text>
            <Text className="text-sm font-semibold text-foreground">
              {daysUntilDeadline} days
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="flex-row gap-2 mt-2">
          <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3 active:scale-95">
            <Text className="text-center text-background font-bold text-sm">
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-surface border border-border rounded-lg py-3 active:opacity-80">
            <Text className="text-center text-foreground font-bold text-sm">
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
