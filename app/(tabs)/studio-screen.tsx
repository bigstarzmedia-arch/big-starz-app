/**
 * STUDIO Screen - Cameo Scan & Photo to Video
 * Upload portal, generate button, API routing to Kling/HeyGen
 */

import { ScrollView, View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { BigStarzBottomNav } from "@/components/big-starz-bottom-nav";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function StudioScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"vibe" | "studio" | "cast" | "chat" | "wallet">("studio");
  const [selectedMode, setSelectedMode] = useState<"cameo" | "photo">("cameo");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call to Kling/HeyGen
    setTimeout(() => {
      setIsGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
            style={{
              width: "100%",
              height: 160,
              backgroundColor: colors.primary,
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
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📤</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.background }}>
              Upload {selectedMode === "cameo" ? "Video" : "Photo"}
            </Text>
            <Text style={{ fontSize: 12, color: colors.background, marginTop: 4, opacity: 0.8 }}>
              Tap to select from device
            </Text>
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
              {isGenerating ? "⏳ Generating..." : "✨ GENERATE VIDEO"}
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
              🔗 Powered by Kling AI & HeyGen
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BigStarzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
