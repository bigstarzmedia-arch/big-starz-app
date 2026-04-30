/**
 * Watermarked Video Card Component
 * Displays video with optional Big Starz watermark for free users
 */

import { View, Text, Pressable, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface WatermarkedVideoCardProps {
  videoId: number;
  title: string;
  creatorName: string;
  thumbnailUrl: string;
  viewCount: number;
  hasWatermark: boolean;
  isLive?: boolean;
  onPress?: () => void;
}

export function WatermarkedVideoCard({
  videoId,
  title,
  creatorName,
  thumbnailUrl,
  viewCount,
  hasWatermark,
  isLive = false,
  onPress,
}: WatermarkedVideoCardProps) {
  const colors = useColors();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      className="mb-4"
    >
      {/* Video Thumbnail Container */}
      <View className="w-full aspect-video rounded-lg overflow-hidden relative bg-gray-900">
        {/* Placeholder Thumbnail */}
        <View
          className="w-full h-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-4xl">🎬</Text>
        </View>

        {/* Live Badge */}
        {isLive && (
          <View
            className="absolute top-3 left-3 px-2 py-1 rounded-full flex-row items-center gap-1"
            style={{ backgroundColor: "#EF4444" }}
          >
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
            <Text className="text-white text-xs font-bold">LIVE</Text>
          </View>
        )}

        {/* View Count */}
        <View
          className="absolute bottom-3 left-3 px-2 py-1 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <Text className="text-white text-xs">👁️ {viewCount.toLocaleString()}</Text>
        </View>

        {/* Big Starz Watermark (for free users) */}
        {hasWatermark && (
          <View
            className="absolute bottom-3 right-3 px-2 py-1 rounded flex-row items-center gap-1"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              opacity: 0.8,
            }}
          >
            <Text className="text-lg">⭐</Text>
            <Text className="text-white text-xs font-bold">Big Starz</Text>
          </View>
        )}

        {/* Premium Badge (if no watermark) */}
        {!hasWatermark && (
          <View
            className="absolute top-3 right-3 px-2 py-1 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-xs font-bold">✓ Premium</Text>
          </View>
        )}
      </View>

      {/* Video Info */}
      <View className="mt-3">
        <Text
          className="text-sm font-semibold text-foreground mb-1 line-clamp-2"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-xs text-muted">{creatorName}</Text>
      </View>
    </Pressable>
  );
}

/**
 * Video Feed Grid Component
 * Displays multiple watermarked video cards
 */
interface VideoFeedGridProps {
  videos: WatermarkedVideoCardProps[];
  onVideoPress?: (videoId: number) => void;
}

export function VideoFeedGrid({ videos, onVideoPress }: VideoFeedGridProps) {
  const colors = useColors();

  return (
    <View className="px-4">
      {videos.map((video) => (
        <WatermarkedVideoCard
          key={video.videoId}
          {...video}
          onPress={() => onVideoPress?.(video.videoId)}
        />
      ))}
    </View>
  );
}
