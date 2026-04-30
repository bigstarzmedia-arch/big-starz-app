/**
 * STUDIO Screen - Cameo Scan & Photo to Video
 * Upload portal, generate button, API routing to Kling/HeyGen (FREE-TIER: Pollinations/Stable Diffusion)
 */

import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { trpc } from "@/lib/trpc";

interface ProcessingVideo {
  id: number;
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  beautifiedUrl?: string;
  error?: string;
}

export default function StudioScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("studio");
  const [selectedMode, setSelectedMode] = useState<"cameo" | "photo">("cameo");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<"pollinations" | "stable-diffusion" | "text-to-video">("pollinations");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingVideos, setProcessingVideos] = useState<ProcessingVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // tRPC mutations
  const createVideoMutation = trpc.videos.create.useMutation();

  const styleOptions = [
    { id: "cinematic", label: "Cinematic", icon: "🎬" },
    { id: "fashion", label: "Fashion", icon: "👗" },
    { id: "performance", label: "Performance", icon: "🎤" },
    { id: "luxury", label: "Luxury", icon: "✨" },
  ];

  const modelOptions = [
    { id: "pollinations", label: "Pollinations AI", icon: "🎨" },
    { id: "stable-diffusion", label: "Stable Diffusion", icon: "🖼️" },
    { id: "text-to-video", label: "Text-to-Video", icon: "🎥" },
  ];

  /**
   * Pick video/photo from device library
   */
  const handlePickMedia = async () => {
    try {
      setError(null);
      const mediaType = selectedMode === "cameo" ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: false,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadAndBeautifyMedia(asset.uri, asset.fileName || `media_${Date.now()}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to pick media";
      setError(errorMsg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  /**
   * Upload media and submit to beautification API
   */
  const uploadAndBeautifyMedia = async (mediaUri: string, fileName: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Upload to S3 first
      // For now, use local URI as mock
      const mockUrl = mediaUri;
      const mockKey = `media_${Date.now()}`;

      // Call tRPC mutation
      const videoId = await createVideoMutation.mutateAsync({
        aiModel: selectedModel,
        stylePreset: selectedStyle,
        resolution: "1080p",
        title: fileName,
        originalVideoUrl: mockUrl,
        originalVideoKey: mockKey,
      });

      // Add to processing videos list
      const newVideo: ProcessingVideo = {
        id: videoId,
        title: fileName,
        status: "processing",
        progress: 0,
      };

      setProcessingVideos((prev) => [newVideo, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Start polling for completion
      pollVideoStatus(videoId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      setError(errorMsg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
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
        // Use tRPC query to get video status
        const response = await fetch(`/api/trpc/videos.get?input=${JSON.stringify({ id: videoId })}`);
        const data = await response.json();
        const video = data.result?.data;

        if (!video) {
          throw new Error("Video not found");
        }

        // Update processing video with status
        setProcessingVideos((prev) =>
          prev.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  status: video.processingStatus,
                  progress: video.processingProgress || 0,
                  beautifiedUrl: video.beautifiedVideoUrl,
                  error: video.processingStatus === "failed" ? video.processingError : undefined,
                }
              : v
          )
        );

        // If completed or failed, stop polling
        if (video.processingStatus === "completed" || video.processingStatus === "failed") {
          if (video.processingStatus === "completed") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          return;
        }

        // Continue polling
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        } else {
          setProcessingVideos((prev) =>
            prev.map((v) =>
              v.id === videoId ? { ...v, status: "failed", error: "Processing timeout" } : v
            )
          );
        }
      } catch (err) {
        console.error("Poll error:", err);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        }
      }
    };

    poll();
  };

  /**
   * Handle generate button press
   */
  const handleGenerate = async () => {
    if (!videoPrompt.trim()) {
      setError("Please enter a video description");
      return;
    }

    await handlePickMedia();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Error Banner */}
        {error && (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 12,
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

        {/* Mode Selector */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 16, gap: 8 }}>
          <Pressable
            onPress={() => setSelectedMode("cameo")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: selectedMode === "cameo" ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: selectedMode === "cameo" ? colors.primary : colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: selectedMode === "cameo" ? colors.background : colors.foreground }}>
              📹 CAMEO SCAN
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedMode("photo")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: selectedMode === "photo" ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: selectedMode === "photo" ? colors.primary : colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: selectedMode === "photo" ? colors.background : colors.foreground }}>
              🖼️ PHOTO TO VIDEO
            </Text>
          </Pressable>
        </View>

        {/* Upload Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          {/* Massive Upload Button */}
          <Pressable
            onPress={handlePickMedia}
            disabled={isGenerating}
            style={{
              width: "100%",
              height: 160,
              backgroundColor: isGenerating ? `${colors.primary}80` : colors.primary,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              shadowColor: colors.primary,
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {isGenerating ? (
              <ActivityIndicator size="large" color={colors.background} />
            ) : (
              <>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>📤</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.background }}>
                  Upload {selectedMode === "cameo" ? "Video" : "Photo"}
                </Text>
                <Text style={{ fontSize: 12, color: colors.background, marginTop: 4, opacity: 0.8 }}>
                  Tap to select from device
                </Text>
              </>
            )}
          </Pressable>

          {/* Upload Rules Checklist */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
              ✓ Upload Rules
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>
              • {selectedMode === "cameo" ? "Video must be 1-5 minutes" : "Image must be 1080x1080 or higher"}
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>
              • Clear lighting and professional quality
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>
              • No watermarks or logos
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>
              • You must own all rights to the content
            </Text>
          </View>

          {/* AI Model Selection */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
              🤖 AI Model
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {modelOptions.map((model) => (
                <Pressable
                  key={model.id}
                  onPress={() => setSelectedModel(model.id as any)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor: selectedModel === model.id ? colors.accent1 : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedModel === model.id ? colors.accent1 : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: selectedModel === model.id ? colors.background : colors.foreground }}>
                    {model.icon} {model.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Style Preset Selection */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
              🎨 Style Preset
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {styleOptions.map((style) => (
                <Pressable
                  key={style.id}
                  onPress={() => setSelectedStyle(style.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    backgroundColor: selectedStyle === style.id ? colors.accent2 : colors.surface,
                    borderWidth: 1,
                    borderColor: selectedStyle === style.id ? colors.accent2 : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "600", color: selectedStyle === style.id ? colors.background : colors.foreground }}>
                    {style.icon} {style.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Video Prompt Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>
              What should you be doing in the video?
            </Text>
            <TextInput
              placeholder="E.g., 'Dancing in a luxury studio with neon lights'"
              placeholderTextColor={colors.muted}
              value={videoPrompt}
              onChangeText={setVideoPrompt}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                color: colors.foreground,
                fontSize: 12,
              }}
            />
          </View>

          {/* Generate Button */}
          <Pressable
            onPress={handleGenerate}
            disabled={isGenerating || !videoPrompt}
            style={{
              width: "100%",
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: isGenerating || !videoPrompt ? `${colors.accent1}80` : colors.accent1,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.accent1,
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.background }}>
              {isGenerating ? "⏳ Uploading..." : "✨ GENERATE VIDEO"}
            </Text>
          </Pressable>

          {/* API Info */}
          <View
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.muted, textAlign: "center" }}>
              🔗 Powered by {selectedModel === "pollinations" ? "Pollinations AI" : selectedModel === "stable-diffusion" ? "Stable Diffusion" : "Text-to-Video"}
            </Text>
          </View>

          {/* Processing Videos List */}
          {processingVideos.length > 0 && (
            <View style={{ marginTop: 24, marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
                📊 Processing Queue
              </Text>
              <FlatList
                data={processingVideos}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, flex: 1 }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                          backgroundColor:
                            item.status === "completed"
                              ? colors.success
                              : item.status === "failed"
                              ? colors.error
                              : colors.accent3,
                          color: colors.background,
                        }}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    {item.status === "processing" && (
                      <View style={{ marginBottom: 8 }}>
                        <View
                          style={{
                            height: 4,
                            backgroundColor: colors.border,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              height: "100%",
                              width: `${item.progress}%`,
                              backgroundColor: colors.accent1,
                            }}
                          />
                        </View>
                        <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
                          {item.progress}% complete
                        </Text>
                      </View>
                    )}

                    {/* Error Message */}
                    {item.error && (
                      <Text style={{ fontSize: 10, color: colors.error, marginTop: 4 }}>
                        ⚠️ {item.error}
                      </Text>
                    )}

                    {/* Download Button */}
                    {item.status === "completed" && item.beautifiedUrl && (
                      <Pressable
                        style={{
                          marginTop: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 6,
                          backgroundColor: colors.accent2,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.background }}>
                          ⬇️ Download Video
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
