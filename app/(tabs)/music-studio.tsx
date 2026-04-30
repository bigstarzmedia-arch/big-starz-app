/**
 * Music Studio - Genre Selection & Lyric Generation
 * Supports: Pop, Country, EDM, Latin, Rock (+ Hip-Hop, R&B)
 * Big Starz dark theme with neon accents
 */

import { View, Text, Pressable, ScrollView, TextInput, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSubscription } from "@/lib/subscription-context";
import { TokenBalance } from "@/components/token-balance";
import { SocialExportModal } from "@/components/social-export";
import { DownloadButton } from "@/components/content-download";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663582603941/kdagQAS7AgDbyomZNfYzdv/big-starz-logo-MNPkwqFDvjz997BmgkJDyA.webp";

interface Genre {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const GENRES: Genre[] = [
  { id: "pop", label: "Pop", icon: "\u{1F3B5}", color: "#FF007F", description: "Catchy hooks & melodies" },
  { id: "country", label: "Country", icon: "\u{1F3B8}", color: "#D4AF37", description: "Storytelling & twang" },
  { id: "edm", label: "EDM", icon: "\u{1F3B6}", color: "#00FFFF", description: "Electronic drops & beats" },
  { id: "latin", label: "Latin", icon: "\u{1F525}", color: "#FF6B00", description: "Reggaeton & tropical" },
  { id: "rock", label: "Rock", icon: "\u{1F918}", color: "#9D00FF", description: "Power chords & energy" },
  { id: "hiphop", label: "Hip-Hop", icon: "\u{1F399}\uFE0F", color: "#FFFF00", description: "Bars & flow" },
  { id: "rnb", label: "R&B", icon: "\u{1F49C}", color: "#FF69B4", description: "Smooth vocals & soul" },
];

type StudioPhase = "genre" | "prompt" | "generating" | "result";

export default function MusicStudioScreen() {
  const { canAccessPremium, canGenerate, consumeToken, showPaywall } = useSubscription();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [phase, setPhase] = useState<StudioPhase>("genre");
  const [lyricPrompt, setLyricPrompt] = useState("");
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleContinue = () => {
    if (selectedGenre) {
      setPhase("prompt");
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleGenerate = async () => {
    if (!lyricPrompt.trim()) return;
    if (!canAccessPremium || !canGenerate) {
      showPaywall();
      return;
    }
    const tokenUsed = await consumeToken();
    if (!tokenUsed) {
      showPaywall();
      return;
    }
    setPhase("generating");
    setIsGenerating(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      // Call Pollinations free AI text API for real lyric generation
      const genreLabel = selectedGenre?.label || "Pop";
      const prompt = `Write original ${genreLabel} song lyrics based on this description: ${lyricPrompt}. Include verse and chorus labels. Style: ${selectedGenre?.description || "catchy hooks"}. Output ONLY the lyrics, no explanations.`;
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
      );

      if (response.ok) {
        const lyrics = await response.text();
        setGeneratedLyrics(lyrics.trim());
      } else {
        // Fallback to sample lyrics if API fails
        setGeneratedLyrics(getSampleLyrics(selectedGenre?.id || "pop"));
      }
    } catch (err) {
      console.error("Lyric generation error:", err);
      // Fallback to sample lyrics
      setGeneratedLyrics(getSampleLyrics(selectedGenre?.id || "pop"));
    } finally {
      setIsGenerating(false);
      setPhase("result");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleReset = () => {
    setPhase("genre");
    setSelectedGenre(null);
    setLyricPrompt("");
    setGeneratedLyrics("");
  };

  return (
    <ScreenContainer className="bg-black">
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Header */}
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255, 0, 127, 0.2)",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: 2,
              }}
            >
              MUSIC STUDIO
            </Text>
            <Text style={{ fontSize: 11, color: "#FF007F", marginTop: 2, letterSpacing: 1 }}>
              AI LYRIC & BEAT ENGINE
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <TokenBalance />
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* PHASE: Genre Selection */}
          {phase === "genre" && (
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 4 }}>
                Choose Your Genre
              </Text>
              <Text style={{ color: "#888888", fontSize: 13, marginBottom: 24 }}>
                Select a genre to start creating your track
              </Text>

              {/* Genre Grid */}
              <View style={{ gap: 12 }}>
                {GENRES.map((genre) => (
                  <Pressable
                    key={genre.id}
                    onPress={() => handleGenreSelect(genre)}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor:
                        selectedGenre?.id === genre.id
                          ? "rgba(255, 0, 127, 0.15)"
                          : "rgba(26, 26, 26, 0.8)",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 2,
                      borderColor:
                        selectedGenre?.id === genre.id
                          ? genre.color
                          : "rgba(51, 51, 51, 0.5)",
                      shadowColor: selectedGenre?.id === genre.id ? genre.color : "transparent",
                      shadowOpacity: selectedGenre?.id === genre.id ? 0.4 : 0,
                      shadowRadius: selectedGenre?.id === genre.id ? 12 : 0,
                      elevation: selectedGenre?.id === genre.id ? 6 : 0,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    {/* Genre Icon */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${genre.color}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{genre.icon}</Text>
                    </View>

                    {/* Genre Info */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: selectedGenre?.id === genre.id ? genre.color : "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "700",
                        }}
                      >
                        {genre.label}
                      </Text>
                      <Text style={{ color: "#888888", fontSize: 12, marginTop: 2 }}>
                        {genre.description}
                      </Text>
                    </View>

                    {/* Selected Indicator */}
                    {selectedGenre?.id === genre.id && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: genre.color,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "800" }}>
                          {"\u2713"}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Continue Button */}
              {selectedGenre && (
                <Pressable
                  onPress={handleContinue}
                  style={({ pressed }) => ({
                    backgroundColor: "#FF007F",
                    paddingVertical: 16,
                    borderRadius: 30,
                    alignItems: "center",
                    marginTop: 24,
                    shadowColor: "#FF007F",
                    shadowOpacity: 0.6,
                    shadowRadius: 14,
                    elevation: 8,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
                    CONTINUE WITH {selectedGenre.label.toUpperCase()}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* PHASE: Lyric Prompt */}
          {phase === "prompt" && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <Pressable onPress={handleReset} style={{ marginRight: 12 }}>
                  <Text style={{ color: "#FF007F", fontSize: 14, fontWeight: "600" }}>
                    {"\u2190"} Back
                  </Text>
                </Pressable>
                <View
                  style={{
                    backgroundColor: `${selectedGenre?.color}20`,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedGenre?.color || "#FF007F",
                  }}
                >
                  <Text style={{ color: selectedGenre?.color, fontSize: 12, fontWeight: "600" }}>
                    {selectedGenre?.icon} {selectedGenre?.label}
                  </Text>
                </View>
              </View>

              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                Describe Your Song
              </Text>
              <Text style={{ color: "#888888", fontSize: 13, marginBottom: 20 }}>
                Tell the AI what your song is about. Include mood, theme, or specific lyrics you want.
              </Text>

              <TextInput
                value={lyricPrompt}
                onChangeText={setLyricPrompt}
                placeholder="e.g., A summer anthem about driving down the coast with the windows down..."
                placeholderTextColor="#555555"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{
                  backgroundColor: "rgba(26, 26, 26, 0.8)",
                  borderRadius: 16,
                  padding: 16,
                  color: "#FFFFFF",
                  fontSize: 14,
                  minHeight: 140,
                  borderWidth: 1,
                  borderColor: "rgba(255, 0, 127, 0.3)",
                }}
              />

              <Pressable
                onPress={handleGenerate}
                style={({ pressed }) => ({
                  backgroundColor: lyricPrompt.trim() ? "#FF007F" : "rgba(255, 0, 127, 0.3)",
                  paddingVertical: 16,
                  borderRadius: 30,
                  alignItems: "center",
                  marginTop: 24,
                  shadowColor: "#FF007F",
                  shadowOpacity: lyricPrompt.trim() ? 0.6 : 0,
                  shadowRadius: 14,
                  elevation: lyricPrompt.trim() ? 8 : 0,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 }}>
                  GENERATE LYRICS
                </Text>
              </Pressable>
            </View>
          )}

          {/* PHASE: Generating */}
          {phase === "generating" && (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Image
                source={{ uri: LOGO_URL }}
                style={{ width: 80, height: 80, marginBottom: 24, opacity: 0.8 }}
                resizeMode="contain"
              />
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                Generating Lyrics...
              </Text>
              <Text style={{ color: "#888888", fontSize: 13, textAlign: "center" }}>
                AI is crafting {selectedGenre?.label} lyrics based on your prompt
              </Text>

              {/* Animated dots */}
              <View style={{ flexDirection: "row", gap: 8, marginTop: 24 }}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#FF007F",
                      opacity: 0.5 + (i * 0.2),
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {/* PHASE: Result */}
          {phase === "result" && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: `${selectedGenre?.color}20`,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedGenre?.color || "#FF007F",
                  }}
                >
                  <Text style={{ color: selectedGenre?.color, fontSize: 12, fontWeight: "600" }}>
                    {selectedGenre?.icon} {selectedGenre?.label}
                  </Text>
                </View>
                <Text style={{ color: "#00FF00", fontSize: 12, fontWeight: "600", marginLeft: 8 }}>
                  {"\u2713"} Generated
                </Text>
              </View>

              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
                Your Lyrics
              </Text>

              {/* Lyrics Display */}
              <View
                style={{
                  backgroundColor: "rgba(26, 26, 26, 0.8)",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255, 0, 127, 0.3)",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 22 }}>
                  {generatedLyrics}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                <Pressable
                  onPress={handleReset}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: "rgba(26, 26, 26, 0.8)",
                    paddingVertical: 14,
                    borderRadius: 24,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#333333",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>NEW SONG</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    // In production: triggers ElevenLabs/Hume voice synthesis on the generated lyrics
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: "#FF007F",
                    paddingVertical: 14,
                    borderRadius: 24,
                    alignItems: "center",
                    shadowColor: "#FF007F",
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 6,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>
                    ADD VOCALS
                  </Text>
                </Pressable>
              </View>

              {/* Download & Share Buttons */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                <View style={{ flex: 1 }}>
                  <DownloadButton
                    title={`${selectedGenre?.label || ""} Song Lyrics`}
                    type="lyrics"
                    content={generatedLyrics}
                    size="4 KB"
                  />
                </View>
                <Pressable
                  onPress={() => setShowExport(true)}
                  style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 242, 234, 0.12)",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "rgba(0, 242, 234, 0.3)",
                    gap: 8,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Text style={{ fontSize: 14 }}>{"\u{1F680}"}</Text>
                  <Text style={{ color: "#00F2EA", fontSize: 13, fontWeight: "700" }}>SHARE</Text>
                </Pressable>
              </View>

              <SocialExportModal
                visible={showExport}
                onClose={() => setShowExport(false)}
                contentTitle={`${selectedGenre?.label || ""} Song`}
                contentType="lyrics"
              />
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function getSampleLyrics(genre: string): string {
  const lyrics: Record<string, string> = {
    pop: "[Verse 1]\nDriving down the boulevard, neon in my eyes\nEvery beat is calling me beneath the city lights\nWe were born to shine tonight, no looking back\n\n[Chorus]\nWe're the stars, we're the fire\nBurning brighter, taking higher\nNothing stops us when we ride\nBig Starz energy tonight",
    country: "[Verse 1]\nDust road winding past the old oak tree\nSunset painting gold on everything I see\nPicked up my guitar and let the story flow\n\n[Chorus]\nThis is where the heart calls home\nWhere the river meets the stone\nEvery song I write is true\nCountry roads leading back to you",
    edm: "[Build]\nFeel the bass drop coming, lights are flashing bright\nHands up in the air, we own the night\nSynths are rising higher, pulse is getting strong\n\n[Drop]\nBoom - we explode into the sound\nEvery heartbeat shaking ground\nBig Starz on the decks tonight\nElectronic paradise",
    latin: "[Verso 1]\nRitmo caliente, fuego en la pista\nTodo el mundo siente esta vibra\nMovimiento suave, noche de fiesta\n\n[Coro]\nBaila, baila, siente el calor\nBig Starz bringing that Latin flavor\nReggaeton flow, tropical heat\nEvery night we own the street",
    rock: "[Verse 1]\nCranked the amp to eleven, let the power chords ring\nEvery note is thunder, every word I sing\nStage is set on fire, crowd is screaming loud\n\n[Chorus]\nWe are the revolution, we are the sound\nShaking every building, burning to the ground\nBig Starz rock and roll tonight\nNothing gonna stop this fight",
    hiphop: "[Verse 1]\nStepping to the mic, flow is automatic\nEvery bar I spit is cinematic\nBig Starz on the rise, no cap\nBuilding empires, stacking racks\n\n[Hook]\nWe the ones they talk about\nFrom the bottom, now we out\nEvery verse a masterpiece\nBig Starz never gonna cease",
    rnb: "[Verse 1]\nSmooth like velvet, voice like honey\nEvery word I sing for you, baby\nCandles lit, the mood is right\nLet me serenade you tonight\n\n[Chorus]\nYou and me, that's all I need\nSoul connection, hearts aligned\nBig Starz love, so divine\nForever yours, forever mine",
  };
  return lyrics[genre] || lyrics.pop;
}
