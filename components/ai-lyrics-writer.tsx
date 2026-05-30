import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface AILyricsWriterProps {
  onGenerateLyrics: (lyrics: string, genre: string, mood: string) => void;
  isLoading?: boolean;
}

const GENRES = ['Hip-Hop', 'R&B', 'Pop', 'Country', 'EDM', 'Latin', 'Rock', 'Reggae'];
const MOODS = ['Happy', 'Sad', 'Energetic', 'Chill', 'Aggressive', 'Romantic', 'Motivational'];

/**
 * AI Lyrics Writer Component
 * Users tap the happy face emoji to generate AI lyrics based on genre and mood
 */
export function AILyricsWriter({ onGenerateLyrics, isLoading = false }: AILyricsWriterProps) {
  const colors = useColors();
  const [selectedGenre, setSelectedGenre] = useState<string>('Hip-Hop');
  const [selectedMood, setSelectedMood] = useState<string>('Happy');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');

  const handleGenerateLyrics = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      if (!customPrompt.trim()) {
        Alert.alert('Error', 'Please enter a topic or theme for your lyrics');
        return;
      }

      // Simulate API call to generate lyrics
      // In production, this would call OpenRouter or similar LLM API
      const mockLyrics = `[Verse 1]
${customPrompt} is the way
Living life, every single day
Chasing dreams, making moves
Got the rhythm, got the groove

[Chorus]
Yeah, yeah, yeah, that's the vibe
Living large, feeling alive
${selectedMood} and free
This is who I'm meant to be

[Verse 2]
Moving forward, no looking back
On the path, staying on track
${selectedGenre} beats, so divine
Everything is falling in line`;

      setGeneratedLyrics(mockLyrics);
      onGenerateLyrics(mockLyrics, selectedGenre, selectedMood);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error generating lyrics:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to generate lyrics');
    }
  };

  return (
    <ScrollView className="flex-1 gap-4">
      {/* Happy Face Generator Button */}
      <Pressable
        onPress={handleGenerateLyrics}
        disabled={isLoading || !customPrompt.trim()}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <View className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 items-center gap-4">
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white font-bold text-lg">Generating Lyrics...</Text>
            </>
          ) : (
            <>
              <Text className="text-6xl">😊</Text>
              <Text className="text-white font-bold text-xl">Generate AI Lyrics</Text>
              <Text className="text-white/80 text-sm">Tap the happy face to create lyrics</Text>
            </>
          )}
        </View>
      </Pressable>

      {/* Genre Selection */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Genre</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          {GENRES.map((genre) => (
            <Pressable
              key={genre}
              onPress={() => {
                setSelectedGenre(genre);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedGenre === genre
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedGenre === genre ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {genre}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Mood Selection */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Mood</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          {MOODS.map((mood) => (
            <Pressable
              key={mood}
              onPress={() => {
                setSelectedMood(mood);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedMood === mood
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedMood === mood ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {mood}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Custom Prompt */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Topic or Theme</Text>
        <TextInput
          placeholder="e.g., Success, Love, Money, Dreams..."
          value={customPrompt}
          onChangeText={setCustomPrompt}
          className="bg-surface border border-border rounded-lg p-4 text-foreground"
          placeholderTextColor={colors.muted}
          editable={!isLoading}
        />
      </View>

      {/* Generated Lyrics Display */}
      {generatedLyrics && (
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="musical-notes" size={20} color={colors.primary} />
            <Text className="text-lg font-bold text-foreground">Generated Lyrics</Text>
          </View>
          <Text className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
            {generatedLyrics}
          </Text>
          <Pressable
            onPress={() => {
              setGeneratedLyrics('');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-primary font-semibold text-sm">Clear & Generate New</Text>
          </Pressable>
        </View>
      )}

      {/* Info */}
      <View className="bg-background/50 rounded-lg p-3 border border-border">
        <Text className="text-xs text-muted leading-relaxed">
          🎵 Our AI generates unique lyrics based on your genre, mood, and topic. Customize them however you like!
        </Text>
      </View>
    </ScrollView>
  );
}
