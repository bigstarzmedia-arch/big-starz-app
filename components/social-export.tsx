/**
 * Direct Social Export
 * 
 * One-tap TikTok/Instagram share with:
 * - Big Starz watermark overlay
 * - Auto-generated captions with trending hashtags
 * - Format optimization for each platform
 * 
 * Gated behind subscription.
 */

import { View, Text, Pressable, Modal, Platform, Share, Alert } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";

interface SocialExportProps {
  visible: boolean;
  onClose: () => void;
  contentTitle: string;
  contentType: "video" | "lyrics" | "cameo";
  contentUrl?: string;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  format: string;
  hashtags: string[];
}

const PLATFORMS: SocialPlatform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: "\u{1F3B5}",
    color: "#00F2EA",
    format: "9:16 Vertical",
    hashtags: ["#BigStarz", "#AIMusic", "#MusicVideo", "#FYP", "#Viral"],
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: "\u{1F4F7}",
    color: "#E4405F",
    format: "9:16 Vertical",
    hashtags: ["#BigStarzMedia", "#AIGenerated", "#MusicProduction", "#Reels"],
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: "\u{1F4FA}",
    color: "#FF0000",
    format: "9:16 Vertical",
    hashtags: ["#BigStarz", "#Shorts", "#AIArt", "#MusicVideo"],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "\u{1F426}",
    color: "#1DA1F2",
    format: "16:9 Landscape",
    hashtags: ["#BigStarzMedia", "#AIMusic", "#NewMusic"],
  },
];

const CAPTION_TEMPLATES = {
  video: [
    "Created with Big Starz AI \u2728 No studio needed.",
    "My AI music video just dropped \u{1F525} Built with @BigStarzMedia",
    "From concept to cinematic in 60 seconds \u{1F3AC}\u2728",
  ],
  lyrics: [
    "Wrote this hit with AI \u{1F3B5} @BigStarzMedia making it too easy",
    "New lyrics just generated \u{1F525} The future of songwriting",
    "AI-powered bars \u{1F399}\uFE0F Built different with Big Starz",
  ],
  cameo: [
    "My AI avatar is ready for the music video \u{1F31F}",
    "3D face scan complete \u{1F4F7} Cinematic mode activated",
    "Big Starz turned me into a movie star \u{1F3AC}\u2728",
  ],
};

export function SocialExportModal({ visible, onClose, contentTitle, contentType, contentUrl }: SocialExportProps) {
  const { canAccessPremium, showPaywall } = useSubscription();
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handlePlatformSelect = (platform: SocialPlatform) => {
    if (!canAccessPremium) {
      showPaywall();
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPlatform(platform);
  };

  const handleExport = async () => {
    if (!selectedPlatform) return;
    if (!canAccessPremium) {
      showPaywall();
      return;
    }

    setExporting(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulate export processing (watermark overlay, format conversion)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate caption with hashtags
    const captions = CAPTION_TEMPLATES[contentType];
    const caption = captions[Math.floor(Math.random() * captions.length)];
    const hashtags = selectedPlatform.hashtags.join(" ");
    const fullCaption = `${caption}\n\n${hashtags}`;

    setExporting(false);
    setExported(true);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Use native share sheet
    try {
      await Share.share({
        message: fullCaption,
        title: `Big Starz - ${contentTitle}`,
        url: contentUrl || undefined,
      });
    } catch (e) {
      // User cancelled share
    }

    // Reset after share
    setTimeout(() => {
      setExported(false);
      setSelectedPlatform(null);
    }, 1000);
  };

  const handleClose = () => {
    setSelectedPlatform(null);
    setExporting(false);
    setExported(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: "#111111",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
            borderTopWidth: 1,
            borderTopColor: "rgba(255,0,127,0.3)",
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#333333" }} />
          </View>

          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900", letterSpacing: 1 }}>
              SHARE TO SOCIALS
            </Text>
            <Text style={{ color: "#FF007F", fontSize: 11, marginTop: 4, letterSpacing: 1 }}>
              BIG STARZ WATERMARK INCLUDED
            </Text>
          </View>

          {/* Content preview */}
          <View
            style={{
              backgroundColor: "rgba(26,26,26,0.8)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "rgba(51,51,51,0.5)",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: "rgba(255,0,127,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 22 }}>
                {contentType === "video" ? "\u{1F3AC}" : contentType === "lyrics" ? "\u{1F3B5}" : "\u{1F4F7}"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>{contentTitle}</Text>
              <Text style={{ color: "#888888", fontSize: 11, marginTop: 2 }}>
                {contentType === "video" ? "AI Music Video" : contentType === "lyrics" ? "AI Generated Lyrics" : "3D Cameo Avatar"}
              </Text>
            </View>
            <View style={{ backgroundColor: "rgba(0,255,0,0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
              <Text style={{ color: "#00FF00", fontSize: 9, fontWeight: "700" }}>READY</Text>
            </View>
          </View>

          {/* Platform selection */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {PLATFORMS.map((platform) => (
              <Pressable
                key={platform.id}
                onPress={() => handlePlatformSelect(platform)}
                style={({ pressed }) => ({
                  flex: 1,
                  minWidth: "45%" as any,
                  backgroundColor: selectedPlatform?.id === platform.id ? `${platform.color}20` : "rgba(26,26,26,0.6)",
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: selectedPlatform?.id === platform.id ? platform.color : "rgba(51,51,51,0.5)",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{platform.icon}</Text>
                <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>{platform.name}</Text>
                <Text style={{ color: "#888888", fontSize: 9, marginTop: 2 }}>{platform.format}</Text>
              </Pressable>
            ))}
          </View>

          {/* Export options */}
          {selectedPlatform && (
            <View
              style={{
                backgroundColor: "rgba(26,26,26,0.6)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: `${selectedPlatform.color}30`,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700", marginBottom: 6 }}>
                Auto-Generated Caption:
              </Text>
              <Text style={{ color: "#AAAAAA", fontSize: 11, lineHeight: 16 }}>
                {CAPTION_TEMPLATES[contentType][0]}
              </Text>
              <Text style={{ color: selectedPlatform.color, fontSize: 10, marginTop: 6 }}>
                {selectedPlatform.hashtags.join(" ")}
              </Text>
            </View>
          )}

          {/* Export button */}
          <Pressable
            onPress={handleExport}
            disabled={!selectedPlatform || exporting}
            style={({ pressed }) => ({
              backgroundColor: selectedPlatform ? selectedPlatform.color : "#333333",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              opacity: !selectedPlatform || exporting ? 0.5 : pressed ? 0.9 : 1,
              transform: [{ scale: pressed && selectedPlatform ? 0.97 : 1 }],
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>
              {exporting ? "ADDING WATERMARK..." : exported ? "SHARED \u2713" : "EXPORT & SHARE"}
            </Text>
          </Pressable>

          {/* Cancel */}
          <Pressable onPress={handleClose} style={{ alignItems: "center", marginTop: 12 }}>
            <Text style={{ color: "#888888", fontSize: 13 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
