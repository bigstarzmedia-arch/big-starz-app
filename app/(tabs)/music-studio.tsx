import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MusicProject {
  id: number;
  title: string;
  instrumentalUrl: string;
  lyrics: string;
  voiceCloneId?: string;
  generatedMusicUrl?: string;
  status: "draft" | "generating" | "completed";
}

interface VoiceClone {
  id: string;
  userId: number;
  voiceCloneId: string;
  voiceCharacteristics: string;
  biometricData: string;
  createdAt: Date;
}

/**
 * Music & Lyric Studio Screen
 * Upload instrumentals and generate lyrics with user's AI voice clone
 */
export default function MusicStudioScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [activeProject, setActiveProject] = useState<MusicProject | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceClone, setVoiceClone] = useState<VoiceClone | null>(null);
  const [useVoiceClone, setUseVoiceClone] = useState(false);
  const [loadingClone, setLoadingClone] = useState(true);

  /**
   * Load user's voice clone from Cameo Scan
   */
  useEffect(() => {
    const loadVoiceClone = async () => {
      try {
        setLoadingClone(true);
        // TODO: Fetch voice clone from backend via API
        // const response = await fetch("/api/trpc/voiceClone.get", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ userId: user?.id }),
        // });

        // Simulate voice clone loading
        setTimeout(() => {
          // In production, this would come from the backend
          // For now, we'll set it to null to show the gate
          setVoiceClone(null);
          setLoadingClone(false);
        }, 500);
      } catch (err) {
        console.error("Failed to load voice clone:", err);
        setLoadingClone(false);
      }
    };

    if (user) {
      loadVoiceClone();
    }
  }, [user]);

  /**
   * Pick instrumental audio file
   */
  const handlePickInstrumental = async () => {
    try {
      setError(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        createMusicProject(asset.uri, asset.name || "instrumental.mp3");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pick file");
    }
  };

  /**
   * Create new music project
   */
  const createMusicProject = async (instrumentalUri: string, fileName: string) => {
    try {
      setIsGenerating(true);
      setError(null);

      if (!voiceClone && !useVoiceClone) {
        setError("Voice clone not available. Complete your Cameo Scan first.");
        setIsGenerating(false);
        return;
      }

      // TODO: Upload instrumental to S3
      const mockUrl = instrumentalUri;
      const mockKey = `instrumental_${Date.now()}`;

      // Create project via API
      const response = await fetch("/api/trpc/music.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyricModel: "openai",
          voiceCloneId: voiceClone?.voiceCloneId || "default",
          lyricPrompt: "Let's create some lyrics",
          title: fileName.replace(/\.[^/.]+$/, ""),
          instrumentalUrl: mockUrl,
          instrumentalKey: mockKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create music project");
      }

      const { result } = await response.json();
      const projectId = result.data;

      const newProject: MusicProject = {
        id: projectId,
        title: fileName.replace(/\.[^/.]+$/, ""),
        instrumentalUrl: mockUrl,
        lyrics: "",
        voiceCloneId: voiceClone?.voiceCloneId,
        status: "draft",
      };

      setProjects((prev) => [newProject, ...prev]);
      setActiveProject(newProject);
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Hey! I'm your lyric writing assistant. Tell me about the vibe you want for this song. What's the mood, theme, or story?",
          timestamp: new Date(),
        },
      ]);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Send message to OpenAI for lyric generation
   */
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeProject) return;

    try {
      setError(null);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: inputText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsGenerating(true);

      // TODO: Call OpenAI API via backend with voice clone context
      // const response = await fetch("/api/trpc/music.generateLyrics", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     musicId: activeProject.id,
      //     prompt: inputText,
      //     voiceCloneId: voiceClone?.voiceCloneId,
      //     context: messages.map(m => `${m.role}: ${m.content}`).join("\n"),
      //   }),
      // });

      // Simulate OpenAI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Great idea! Here's a verse for you:\n\n"${inputText}"\n\nDoes this direction work? Want me to refine it or move to the chorus?`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsGenerating(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate lyrics");
      setIsGenerating(false);
    }
  };

  /**
   * Generate music with voice clone
   */
  const handleGenerateMusic = async () => {
    if (!activeProject || !voiceClone) {
      Alert.alert("Error", "Voice clone not available");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // TODO: Call backend to generate music with voice clone
      // const response = await fetch("/api/trpc/music.generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     musicId: activeProject.id,
      //     voiceCloneId: voiceClone.voiceCloneId,
      //     lyrics: messages
      //       .filter((m) => m.role === "assistant")
      //       .map((m) => m.content)
      //       .join("\n\n"),
      //   }),
      // });

      // Simulate generation
      setTimeout(() => {
        setActiveProject({
          ...activeProject,
          status: "completed",
          generatedMusicUrl: "mock_url",
        });
        setIsGenerating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate music");
      setIsGenerating(false);
    }
  };

  /**
   * Navigate to Cameo Scan
   */
  const handleCompleteCameoScan = () => {
    // TODO: Navigate to Cameo Scan screen
    Alert.alert("Cameo Scan", "Navigate to Cameo & Beautify to complete your voice scan");
  };

  // Loading state
  if (loadingClone) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">Loading your voice clone...</Text>
      </ScreenContainer>
    );
  }

  // Voice Clone Not Found - Gate
  if (!voiceClone && !activeProject) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center gap-6">
            {/* Icon */}
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-5xl">🎤</Text>
            </View>

            {/* Heading */}
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground text-center">
                Voice Identity Not Found
              </Text>
              <Text className="text-sm text-muted text-center">
                Complete your Cameo Scan to unlock your AI voice clone for music generation
              </Text>
            </View>

            {/* Info Cards */}
            <View className="w-full gap-3 my-4">
              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">🎬 How it works</Text>
                <Text className="text-xs text-muted">
                  Record a 1-5 minute video in Cameo & Beautify. Our AI learns your unique voice characteristics and creates a personalized voice clone.
                </Text>
              </View>

              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">✨ Your AI Voice</Text>
                <Text className="text-xs text-muted">
                  Once scanned, your voice clone will be used for all music generation, creating authentic tracks that sound like YOU.
                </Text>
              </View>

              <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <Text className="font-semibold text-foreground mb-1">🔒 Privacy First</Text>
                <Text className="text-xs text-muted">
                  Your biometric voice data is encrypted and never shared. Only you control how your voice is used.
                </Text>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              onPress={handleCompleteCameoScan}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-bold text-base">
                Complete Cameo Scan
              </Text>
            </TouchableOpacity>

            {/* Secondary Info */}
            <Text className="text-xs text-muted text-center">
              Your voice clone is permanent and can be updated anytime
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Main Studio View
  if (!activeProject) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 py-6 gap-6">
            {/* Header */}
            <View>
              <Text className="text-2xl font-bold text-foreground">
                Music Studio
              </Text>
              <Text className="text-sm text-muted mt-1">
                Create music with your AI voice clone
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error/10 border border-error rounded-lg p-4">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            )}

            {/* Voice Clone Status */}
            {voiceClone && (
              <View
                className="p-4 rounded-lg border-2"
                style={{ borderColor: colors.primary, backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">✓</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      Your AI Voice Clone Active
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {voiceClone.voiceCharacteristics}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Voice Clone Toggle */}
            <View className="gap-3">
              <Text className="font-semibold text-foreground">Voice Model</Text>
              <TouchableOpacity
                onPress={() => setUseVoiceClone(!useVoiceClone)}
                style={{
                  backgroundColor: useVoiceClone ? colors.primary : colors.surface,
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}
                className="w-full py-4 px-4 rounded-lg items-center justify-center"
              >
                <Text
                  className={`text-center font-bold ${
                    useVoiceClone ? "text-white" : "text-foreground"
                  }`}
                >
                  🎤 Use My AI Voice Clone
                </Text>
                <Text
                  className={`text-center text-xs mt-2 ${
                    useVoiceClone ? "text-white/80" : "text-muted"
                  }`}
                >
                  {voiceClone?.voiceCharacteristics || "Your unique voice"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Upload Button */}
            <TouchableOpacity
              onPress={handlePickInstrumental}
              disabled={isGenerating || !useVoiceClone}
              style={{
                backgroundColor: colors.primary,
                opacity: isGenerating || !useVoiceClone ? 0.5 : 1,
              }}
              className="w-full rounded-lg py-4 px-6 active:scale-95"
            >
              {isGenerating ? (
                <ActivityIndicator color="#F5F5F5" />
              ) : (
                <Text className="text-center text-white font-bold text-base">
                  Upload Instrumental
                </Text>
              )}
            </TouchableOpacity>

            {/* Projects List */}
            {projects.length > 0 && (
              <View className="gap-3">
                <Text className="font-semibold text-foreground">
                  Your Projects ({projects.length})
                </Text>
                <FlatList
                  data={projects}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setActiveProject(item)}
                      style={{ backgroundColor: colors.surface }}
                      className="border border-border rounded-lg p-4 gap-2"
                    >
                      <Text className="font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-muted">
                        {item.status === "completed" ? "✓ Ready" : "In Progress"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Lyric Chat Interface
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
          <View>
            <Text className="text-lg font-bold text-foreground">
              {activeProject.title}
            </Text>
            <Text className="text-xs text-muted">🎤 Your AI Voice</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveProject(null)}>
            <Text style={{ color: colors.primary }} className="font-semibold">
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
            <Text className="text-error text-sm">{error}</Text>
          </View>
        )}

        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`mb-4 flex-row ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  item.role === "user"
                    ? "rounded-br-none"
                    : "rounded-bl-none border"
                }`}
                style={{
                  backgroundColor: item.role === "user" ? colors.primary : colors.surface,
                  borderColor: item.role === "user" ? colors.primary : colors.border,
                }}
              >
                <Text
                  className={`text-sm ${
                    item.role === "user" ? "text-white" : "text-foreground"
                  }`}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          className="flex-1 mb-4"
        />

        {/* Input Area */}
        <View className="gap-3 border-t pt-4" style={{ borderColor: colors.border }}>
          <View className="flex-row gap-2 items-end">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe your song idea..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="flex-1 border rounded-lg px-4 py-3"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isGenerating || !inputText.trim()}
              style={{
                backgroundColor: colors.primary,
                opacity: isGenerating || !inputText.trim() ? 0.5 : 1,
              }}
              className="rounded-lg p-3 active:scale-95"
            >
              {isGenerating ? (
                <ActivityIndicator color="#F5F5F5" size="small" />
              ) : (
                <Text className="text-white text-lg">→</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Generate Music Button */}
          <TouchableOpacity
            onPress={handleGenerateMusic}
            disabled={isGenerating}
            style={{
              backgroundColor: colors.primary,
              opacity: isGenerating ? 0.6 : 1,
            }}
            className="w-full rounded-lg py-3 px-4 active:scale-95"
          >
            <Text className="text-center text-white font-bold">
              {isGenerating ? "Generating..." : "Generate Music with My Voice"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
