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
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

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
  voiceModel: string;
  generatedMusicUrl?: string;
  status: "draft" | "generating" | "completed";
}

/**
 * Music & Lyric Studio Screen
 * Upload instrumentals and generate lyrics with OpenAI
 */
export default function MusicStudioScreen() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [activeProject, setActiveProject] = useState<MusicProject | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("voice_1");

  const voiceOptions = [
    { id: "voice_1", label: "Deep Male", icon: "🎤" },
    { id: "voice_2", label: "Clear Female", icon: "🎙️" },
    { id: "voice_3", label: "Energetic", icon: "⚡" },
    { id: "voice_4", label: "Smooth", icon: "✨" },
  ];

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

      // TODO: Upload instrumental to S3
      const mockUrl = instrumentalUri;
      const mockKey = `instrumental_${Date.now()}`;

      // Create project via API
      const response = await fetch("/api/trpc/music.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyricModel: "openai",
          voiceModel: selectedVoice,
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
        voiceModel: selectedVoice,
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

      // TODO: Call OpenAI API via backend
      // const response = await fetch("/api/trpc/music.generateLyrics", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     musicId: activeProject.id,
      //     prompt: inputText,
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
   * Save lyrics to project
   */
  const handleSaveLyrics = async () => {
    if (!activeProject) return;

    try {
      setError(null);

      // Extract lyrics from messages
      const lyricsContent = messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.content)
        .join("\n\n");

      // TODO: Save via API
      // await fetch(`/api/trpc/music.update`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     musicId: activeProject.id,
      //     lyrics: lyricsContent,
      //   }),
      // });

      setActiveProject({
        ...activeProject,
        lyrics: lyricsContent,
        status: "completed",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lyrics");
    }
  };

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
                Upload instrumentals and write lyrics with AI
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error/10 border border-error rounded-lg p-4">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            )}

            {/* Voice Selection */}
            <View className="gap-3">
              <Text className="font-semibold text-foreground">Voice Model</Text>
              <View className="flex-row flex-wrap gap-2">
                {voiceOptions.map((voice) => (
                  <TouchableOpacity
                    key={voice.id}
                    onPress={() => setSelectedVoice(voice.id)}
                    className={`flex-1 min-w-[45%] py-3 px-3 rounded-lg border-2 ${
                      selectedVoice === voice.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Text className="text-center text-lg">{voice.icon}</Text>
                    <Text
                      className={`text-center text-xs font-semibold mt-1 ${
                        selectedVoice === voice.id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {voice.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Upload Button */}
            <TouchableOpacity
              onPress={handlePickInstrumental}
              disabled={isGenerating}
              className="w-full bg-primary rounded-lg py-4 px-6 active:scale-95"
            >
              {isGenerating ? (
                <ActivityIndicator color="#F5F5F5" />
              ) : (
                <Text className="text-center text-background font-bold text-base">
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
                      className="bg-surface border border-border rounded-lg p-4 gap-2"
                    >
                      <Text className="font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-muted">
                        {item.voiceModel} • {item.status}
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
        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-border">
          <View>
            <Text className="text-lg font-bold text-foreground">
              {activeProject.title}
            </Text>
            <Text className="text-xs text-muted">{activeProject.voiceModel}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveProject(null)}>
            <Text className="text-primary font-semibold">Back</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
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
                    ? "bg-primary rounded-br-none"
                    : "bg-surface border border-border rounded-bl-none"
                }`}
              >
                <Text
                  className={`text-sm ${
                    item.role === "user" ? "text-background" : "text-foreground"
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
        <View className="gap-3 border-t border-border pt-4">
          <View className="flex-row gap-2 items-end">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe your song idea..."
              placeholderTextColor="#A0A0A0"
              multiline
              maxLength={500}
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isGenerating || !inputText.trim()}
              className="bg-primary rounded-lg p-3 active:scale-95"
            >
              {isGenerating ? (
                <ActivityIndicator color="#F5F5F5" size="small" />
              ) : (
                <Text className="text-background text-lg">→</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Save Lyrics Button */}
          {activeProject.lyrics && (
            <TouchableOpacity
              onPress={handleSaveLyrics}
              className="w-full bg-success rounded-lg py-3 px-4 active:scale-95"
            >
              <Text className="text-center text-background font-bold">
                Save Lyrics
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
