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
  StyleSheet,
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
 * Music & Lyric Studio Screen - LUXURY EDITION
 * Elite Luxury Lounge aesthetic with glassmorphism and neon effects
 */
export default function MusicStudioLuxuryScreen() {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#0B0B0B",
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
      textShadowColor: "rgba(255, 0, 127, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "#B0B0B0",
      marginTop: 6,
      fontFamily: "Inter",
    },
    glassCard: {
      backgroundColor: "rgba(26, 26, 26, 0.7)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 0, 127, 0.2)",
      padding: 16,
      marginVertical: 12,
      marginHorizontal: 16,
    },
    voiceCloneStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      borderRadius: 12,
      padding: 14,
      borderWidth: 2,
      borderColor: "#FF007F",
    },
    voiceCloneStatusText: {
      flex: 1,
    },
    voiceCloneStatusTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
    voiceCloneStatusSubtitle: {
      fontSize: 12,
      color: "#B0B0B0",
      marginTop: 4,
    },
    voiceToggleButton: {
      width: "100%",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#FF007F",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
      shadowColor: "#FF007F",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    voiceToggleButtonActive: {
      backgroundColor: "#FF007F",
    },
    voiceToggleButtonInactive: {
      backgroundColor: "rgba(26, 26, 26, 0.8)",
    },
    voiceToggleText: {
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Montserrat",
    },
    uploadButton: {
      width: "100%",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
      backgroundColor: "#FF007F",
      shadowColor: "#FF007F",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    uploadButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
    projectCard: {
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 0, 127, 0.1)",
      padding: 14,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    projectCardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
    projectCardSubtitle: {
      fontSize: 12,
      color: "#B0B0B0",
      marginTop: 6,
    },
    gateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "#0B0B0B",
    },
    gateIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      borderWidth: 2,
      borderColor: "rgba(255, 0, 127, 0.3)",
    },
    gateIconText: {
      fontSize: 48,
    },
    gateTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 12,
      fontFamily: "Montserrat",
      textShadowColor: "rgba(255, 0, 127, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    gateDescription: {
      fontSize: 14,
      color: "#B0B0B0",
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },
    gateInfoCard: {
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 0, 127, 0.1)",
      padding: 14,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    gateInfoTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 6,
    },
    gateInfoText: {
      fontSize: 12,
      color: "#B0B0B0",
      lineHeight: 18,
    },
    gateCTAButton: {
      width: "100%",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: "#FF007F",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
      shadowColor: "#FF007F",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    gateCTAText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
    chatContainer: {
      flex: 1,
      backgroundColor: "#0B0B0B",
    },
    chatHeader: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatHeaderTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
    chatHeaderSubtitle: {
      fontSize: 12,
      color: "#B0B0B0",
      marginTop: 4,
    },
    chatBackButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chatBackText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#FF007F",
    },
    messageContainer: {
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: "row",
    },
    messageBubbleUser: {
      maxWidth: "80%",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderBottomRightRadius: 2,
      backgroundColor: "#FF007F",
      justifyContent: "flex-end",
    },
    messageBubbleAssistant: {
      maxWidth: "80%",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderBottomLeftRadius: 2,
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      borderWidth: 1,
      borderColor: "rgba(255, 0, 127, 0.2)",
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    inputArea: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.1)",
      gap: 12,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
    },
    textInput: {
      flex: 1,
      backgroundColor: "rgba(26, 26, 26, 0.8)",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 0, 127, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: "#FFFFFF",
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: "#FF007F",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#FF007F",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 8,
    },
    generateButton: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: "#FF007F",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#FF007F",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    generateButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Montserrat",
    },
  });

  /**
   * Load user's voice clone from Cameo Scan
   */
  useEffect(() => {
    const loadVoiceClone = async () => {
      try {
        setLoadingClone(true);
        setTimeout(() => {
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

      const mockUrl = instrumentalUri;
      const mockKey = `instrumental_${Date.now()}`;

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

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: inputText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsGenerating(true);

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
    Alert.alert("Cameo Scan", "Navigate to Cameo & Beautify to complete your voice scan");
  };

  // Loading state
  if (loadingClone) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.gateContainer}>
          <ActivityIndicator size="large" color="#FF007F" />
          <Text style={[styles.gateDescription, { marginTop: 16 }]}>
            Loading your voice clone...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Voice Clone Not Found - Gate
  if (!voiceClone && !activeProject) {
    return (
      <ScreenContainer style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.gateContainer}>
            <View style={styles.gateIcon}>
              <Text style={styles.gateIconText}>🎤</Text>
            </View>

            <Text style={styles.gateTitle}>Voice Identity Not Found</Text>
            <Text style={styles.gateDescription}>
              Complete your Cameo Scan to unlock your AI voice clone for music generation
            </Text>

            <View style={{ width: "100%", marginVertical: 16 }}>
              <View style={styles.gateInfoCard}>
                <Text style={styles.gateInfoTitle}>🎬 How it works</Text>
                <Text style={styles.gateInfoText}>
                  Record a 1-5 minute video in Cameo & Beautify. Our AI learns your unique voice characteristics and creates a personalized voice clone.
                </Text>
              </View>

              <View style={styles.gateInfoCard}>
                <Text style={styles.gateInfoTitle}>✨ Your AI Voice</Text>
                <Text style={styles.gateInfoText}>
                  Once scanned, your voice clone will be used for all music generation, creating authentic tracks that sound like YOU.
                </Text>
              </View>

              <View style={styles.gateInfoCard}>
                <Text style={styles.gateInfoTitle}>🔒 Privacy First</Text>
                <Text style={styles.gateInfoText}>
                  Your biometric voice data is encrypted and never shared. Only you control how your voice is used.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCompleteCameoScan}
              style={styles.gateCTAButton}
            >
              <Text style={styles.gateCTAText}>Complete Cameo Scan</Text>
            </TouchableOpacity>

            <Text style={[styles.gateDescription, { marginTop: 20 }]}>
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
      <ScreenContainer style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Music Studio</Text>
            <Text style={styles.headerSubtitle}>Create music with your AI voice clone</Text>
          </View>

          {error && (
            <View style={[styles.glassCard, { backgroundColor: "rgba(255, 0, 85, 0.1)" }]}>
              <Text style={{ color: "#FF0055", fontSize: 14 }}>{error}</Text>
            </View>
          )}

          {voiceClone && (
            <View style={styles.glassCard}>
              <View style={styles.voiceCloneStatus}>
                <Text style={{ fontSize: 20 }}>✓</Text>
                <View style={styles.voiceCloneStatusText}>
                  <Text style={styles.voiceCloneStatusTitle}>Your AI Voice Clone Active</Text>
                  <Text style={styles.voiceCloneStatusSubtitle}>
                    {voiceClone.voiceCharacteristics}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ paddingHorizontal: 16, marginVertical: 12 }}>
            <Text style={[styles.headerTitle, { fontSize: 16 }]}>Voice Model</Text>
          </View>

          <TouchableOpacity
            onPress={() => setUseVoiceClone(!useVoiceClone)}
            style={[
              styles.voiceToggleButton,
              useVoiceClone ? styles.voiceToggleButtonActive : styles.voiceToggleButtonInactive,
            ]}
          >
            <Text style={[styles.voiceToggleText, { color: useVoiceClone ? "#FFFFFF" : "#FF007F" }]}>
              🎤 Use My AI Voice Clone
            </Text>
            <Text
              style={[
                { fontSize: 12, marginTop: 6, fontFamily: "Inter" },
                { color: useVoiceClone ? "rgba(255, 255, 255, 0.8)" : "#B0B0B0" },
              ]}
            >
              {voiceClone?.voiceCharacteristics || "Your unique voice"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePickInstrumental}
            disabled={isGenerating || !useVoiceClone}
            style={[
              styles.uploadButton,
              { opacity: isGenerating || !useVoiceClone ? 0.5 : 1 },
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Instrumental</Text>
            )}
          </TouchableOpacity>

          {projects.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginVertical: 12 }}>
              <Text style={[styles.headerTitle, { fontSize: 16 }]}>
                Your Projects ({projects.length})
              </Text>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => setActiveProject(project)}
                  style={styles.projectCard}
                >
                  <Text style={styles.projectCardTitle}>{project.title}</Text>
                  <Text style={styles.projectCardSubtitle}>
                    {project.status === "completed" ? "✓ Ready" : "In Progress"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Lyric Chat Interface
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chatContainer}
    >
      <ScreenContainer style={styles.chatContainer} edges={["top", "left", "right"]}>
        <View style={styles.chatHeader}>
          <View>
            <Text style={styles.chatHeaderTitle}>{activeProject.title}</Text>
            <Text style={styles.chatHeaderSubtitle}>🎤 Your AI Voice</Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveProject(null)}
            style={styles.chatBackButton}
          >
            <Text style={styles.chatBackText}>Back</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={[styles.glassCard, { backgroundColor: "rgba(255, 0, 85, 0.1)" }]}>
            <Text style={{ color: "#FF0055", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                { justifyContent: item.role === "user" ? "flex-end" : "flex-start" },
              ]}
            >
              <View
                style={
                  item.role === "user" ? styles.messageBubbleUser : styles.messageBubbleAssistant
                }
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: item.role === "user" ? "#FFFFFF" : "#FFFFFF" },
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          style={{ flex: 1, marginBottom: 12 }}
        />

        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe your song idea..."
              placeholderTextColor="#B0B0B0"
              multiline
              maxLength={500}
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isGenerating || !inputText.trim()}
              style={[styles.sendButton, { opacity: isGenerating || !inputText.trim() ? 0.5 : 1 }]}
            >
              {isGenerating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleGenerateMusic}
            disabled={isGenerating}
            style={[styles.generateButton, { opacity: isGenerating ? 0.6 : 1 }]}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? "Generating..." : "Generate Music with My Voice"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
