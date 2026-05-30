import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface CharacterCreatorProps {
  onCreateCharacter: (characterDescription: string, videoPrompt: string) => void;
  isLoading?: boolean;
}

const CHARACTER_STYLES = [
  { name: 'Dancer', emoji: '🕺' },
  { name: 'Singer', emoji: '🎤' },
  { name: 'Actor', emoji: '🎬' },
  { name: 'Athlete', emoji: '⛹️' },
  { name: 'Artist', emoji: '🎨' },
  { name: 'Influencer', emoji: '📸' },
];

const OUTFITS = [
  'Designer Suit',
  'Streetwear',
  'Luxury Dress',
  'Casual',
  'Athletic Wear',
  'Formal Wear',
];

/**
 * Character Creator Component
 * Sora-style video generation for creating custom character avatars
 */
export function CharacterCreator({ onCreateCharacter, isLoading = false }: CharacterCreatorProps) {
  const colors = useColors();
  const [selectedStyle, setSelectedStyle] = useState<string>('Dancer');
  const [selectedOutfit, setSelectedOutfit] = useState<string>('Designer Suit');
  const [characterName, setCharacterName] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [createdCharacter, setCreatedCharacter] = useState<{
    name: string;
    style: string;
    outfit: string;
  } | null>(null);

  const handleCreateCharacter = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      if (!characterName.trim()) {
        Alert.alert('Error', 'Please give your character a name');
        return;
      }

      if (!videoPrompt.trim()) {
        Alert.alert('Error', 'Please describe what your character should do');
        return;
      }

      // Simulate character creation
      const characterDescription = `${characterName} - ${selectedStyle} in ${selectedOutfit}`;
      setCreatedCharacter({
        name: characterName,
        style: selectedStyle,
        outfit: selectedOutfit,
      });

      onCreateCharacter(characterDescription, videoPrompt);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error creating character:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to create character');
    }
  };

  return (
    <ScrollView className="flex-1 gap-4">
      {/* Character Style Selection */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Character Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          {CHARACTER_STYLES.map((style) => (
            <Pressable
              key={style.name}
              onPress={() => {
                setSelectedStyle(style.name);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className={`px-4 py-3 rounded-2xl border-2 items-center gap-1 ${
                  selectedStyle === style.name
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text className="text-2xl">{style.emoji}</Text>
                <Text
                  className={`font-semibold text-xs ${
                    selectedStyle === style.name ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {style.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Outfit Selection */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Outfit</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          {OUTFITS.map((outfit) => (
            <Pressable
              key={outfit}
              onPress={() => {
                setSelectedOutfit(outfit);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedOutfit === outfit
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedOutfit === outfit ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {outfit}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Character Name */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">Character Name</Text>
        <TextInput
          placeholder="e.g., Alex, Luna, Marcus..."
          value={characterName}
          onChangeText={setCharacterName}
          className="bg-surface border border-border rounded-lg p-4 text-foreground"
          placeholderTextColor={colors.muted}
          editable={!isLoading}
        />
      </View>

      {/* Video Prompt */}
      <View className="gap-2">
        <Text className="text-foreground font-semibold">What Should They Do?</Text>
        <TextInput
          placeholder="e.g., Dancing to hip-hop music, singing on stage, performing tricks..."
          value={videoPrompt}
          onChangeText={setVideoPrompt}
          className="bg-surface border border-border rounded-lg p-4 text-foreground"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />
      </View>

      {/* Create Button */}
      <Pressable
        onPress={handleCreateCharacter}
        disabled={isLoading || !characterName.trim() || !videoPrompt.trim()}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View className="bg-primary rounded-2xl p-4 items-center gap-2">
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="white" />
              <Text className="text-background font-bold">Creating Character...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={24} color="white" />
              <Text className="text-background font-bold text-lg">Create Character Video</Text>
            </>
          )}
        </View>
      </Pressable>

      {/* Created Character Display */}
      {createdCharacter && (
        <View className="bg-surface rounded-lg p-4 border border-border gap-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text className="text-lg font-bold text-foreground">Character Created!</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-muted">Name:</Text>
              <Text className="text-foreground font-semibold">{createdCharacter.name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Type:</Text>
              <Text className="text-foreground font-semibold">{createdCharacter.style}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Outfit:</Text>
              <Text className="text-foreground font-semibold">{createdCharacter.outfit}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              setCreatedCharacter(null);
              setCharacterName('');
              setVideoPrompt('');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-primary font-semibold text-sm">Create Another</Text>
          </Pressable>
        </View>
      )}

      {/* Info */}
      <View className="bg-background/50 rounded-lg p-3 border border-border">
        <Text className="text-xs text-muted leading-relaxed">
          🎬 Create custom character avatars with AI-powered video generation (Sora-style). Your characters will perform exactly as you describe!
        </Text>
      </View>
    </ScrollView>
  );
}
