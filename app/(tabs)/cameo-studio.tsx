import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

interface Video {
  id: number;
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  originalUrl?: string;
  beautifiedUrl?: string;
  aiModel: "kling" | "heygen";
  stylePreset: string;
}

/**
 * Cameo & Beautify Studio Screen
 * Upload videos and beautify them using Kling or HeyGen AI
 */
export default function CameoStudioScreen() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState<"kling" | "heygen">(
    "kling"
  );
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [error, setError] = useState<string | null>(null);

  const styleOptions = [
    { id: "cinematic", label: "Cinematic", icon: "🎬" },
    { id: "fashion", label: "Fashion", icon: "👗" },
    { id: "performance", label: "Performance", icon: "🎤" },
    { id: "luxury", label: "Luxury", icon: "✨" },
  ];

  /**
   * Pick video from device library or camera
   */
  const handlePickVideo = async () => {
    try {
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadAndBeautifyVideo(asset.uri, asset.fileName || "video.mp4");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pick video");
    }
  };

  /**
   * Upload video and submit to Kling/HeyGen for beautification
   */
  const uploadAndBeautifyVideo = async (videoUri: string, fileName: string) => {
    try {
      setIsUploading(true);
      setError(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", {
        uri: videoUri,
        name: fileName,
        type: "video/mp4",
      } as any);

      // TODO: Upload to S3 first, then submit to API
      // const uploadResponse = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const { url, key } = await uploadResponse.json();

      // For now, use local URI
      const mockUrl = videoUri;
      const mockKey = `video_${Date.now()}`;

      // Submit to beautification API
      const response = await fetch("/api/trpc/videos.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiModel: selectedAiModel,
          stylePreset: selectedStyle,
          resolution: "1080p",
          title: fileName,
          originalVideoUrl: mockUrl,
          originalVideoKey: mockKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit video for beautification");
      }

      const { result } = await response.json();
      const videoId = result.data;

      // Add to videos list with processing status
      const newVideo: Video = {
        id: videoId,
        title: fileName,
        status: "processing",
        progress: 0,
        originalUrl: mockUrl,
        aiModel: selectedAiModel,
        stylePreset: selectedStyle,
      };

      setVideos((prev) => [newVideo, ...prev]);

      // Poll for completion
      pollVideoStatus(videoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Poll for video beautification completion
   */
  const pollVideoStatus = async (videoId: number) => {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/trpc/videos.get?id=${videoId}`);
        const { result } = await response.json();
        const video = result.data;

        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  status: video.processingStatus,
                  progress: video.processingProgress,
                  beautifiedUrl: video.beautifiedVideoUrl,
                }
              : v
          )
        );

        if (
          video.processingStatus === "completed" ||
          video.processingStatus === "failed"
        ) {
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    };

    poll();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Cameo Studio
            </Text>
            <Text className="text-sm text-muted mt-1">
              Upload your video and beautify it with AI
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* AI Model Selection */}
          <View className="gap-3">
            <Text className="font-semibold text-foreground">AI Model</Text>
            <View className="flex-row gap-3">
              {[
                { id: "kling", label: "Kling AI" },
                { id: "heygen", label: "HeyGen" },
              ].map((model) => (
                <TouchableOpacity
                  key={model.id}
                  onPress={() => setSelectedAiModel(model.id as any)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                    selectedAiModel === model.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedAiModel === model.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {model.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Style Preset Selection */}
          <View className="gap-3">
            <Text className="font-semibold text-foreground">Style Preset</Text>
            <View className="flex-row flex-wrap gap-2">
              {styleOptions.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  onPress={() => setSelectedStyle(style.id)}
                  className={`flex-1 min-w-[45%] py-3 px-3 rounded-lg border-2 ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <Text className="text-center text-lg">{style.icon}</Text>
                  <Text
                    className={`text-center text-xs font-semibold mt-1 ${
                      selectedStyle === style.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {style.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            onPress={handlePickVideo}
            disabled={isUploading}
            className="w-full bg-primary rounded-lg py-4 px-6 active:scale-95"
          >
            {isUploading ? (
              <ActivityIndicator color="#F5F5F5" />
            ) : (
              <Text className="text-center text-background font-bold text-base">
                Upload Video
              </Text>
            )}
          </TouchableOpacity>

          {/* Videos List */}
          {videos.length > 0 && (
            <View className="gap-3">
              <Text className="font-semibold text-foreground">
                Your Videos ({videos.length})
              </Text>
              <FlatList
                data={videos}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <VideoCard video={item} />
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Video card component
 */
function VideoCard({ video }: { video: Video }) {
  const statusColors = {
    pending: "bg-warning/10 text-warning",
    processing: "bg-info/10 text-info",
    completed: "bg-success/10 text-success",
    failed: "bg-error/10 text-error",
  };

  return (
    <View className="bg-surface border border-border rounded-lg p-4 gap-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 gap-1">
          <Text className="font-semibold text-foreground">{video.title}</Text>
          <Text className="text-xs text-muted">
            {video.aiModel.toUpperCase()} • {video.stylePreset}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded ${statusColors[video.status]}`}>
          <Text className="text-xs font-semibold capitalize">
            {video.status}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {video.status === "processing" && (
        <View className="gap-2">
          <View className="w-full h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${video.progress}%` }}
            />
          </View>
          <Text className="text-xs text-muted text-center">
            {video.progress}% complete
          </Text>
        </View>
      )}

      {/* Beautified Video Link */}
      {video.beautifiedUrl && (
        <TouchableOpacity className="py-2 px-3 bg-primary/10 rounded">
          <Text className="text-center text-primary text-sm font-semibold">
            View Beautified Video
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
