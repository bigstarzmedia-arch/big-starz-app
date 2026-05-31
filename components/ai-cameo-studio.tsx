import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

interface CameoCharacter {
  id: string;
  name: string;
  description: string;
  outfit: string;
  pose: string;
  emotion: 'happy' | 'serious' | 'energetic' | 'calm' | 'playful';
  background: string;
}

interface CameoGenerationRequest {
  character: CameoCharacter;
  script: string;
  duration: number; // seconds
  style: 'professional' | 'casual' | 'cinematic' | 'artistic';
  music?: string;
}

export interface AICameoStudioProps {
  visible: boolean;
  onClose: () => void;
  onGenerate?: (request: CameoGenerationRequest) => void;
}

const PRESET_CHARACTERS: CameoCharacter[] = [
  {
    id: 'char_1',
    name: 'Luxe Avatar',
    description: 'Premium fashion model with designer aesthetic',
    outfit: 'Gucci black suit with gold accents',
    pose: 'standing_confident',
    emotion: 'serious',
    background: 'luxury_studio',
  },
  {
    id: 'char_2',
    name: 'Energy Star',
    description: 'High-energy performer with vibrant style',
    outfit: 'Versace colorful ensemble',
    pose: 'dancing',
    emotion: 'energetic',
    background: 'stage_lights',
  },
  {
    id: 'char_3',
    name: 'Chill Vibes',
    description: 'Relaxed creative with artistic flair',
    outfit: 'YSL casual streetwear',
    pose: 'sitting_relaxed',
    emotion: 'calm',
    background: 'urban_studio',
  },
];

const POSES = [
  { id: 'standing_confident', label: 'Standing Confident', emoji: '🧍' },
  { id: 'dancing', label: 'Dancing', emoji: '💃' },
  { id: 'sitting_relaxed', label: 'Sitting Relaxed', emoji: '🪑' },
  { id: 'pointing', label: 'Pointing', emoji: '👉' },
  { id: 'waving', label: 'Waving', emoji: '👋' },
  { id: 'jumping', label: 'Jumping', emoji: '🤸' },
];

const EMOTIONS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'serious', label: 'Serious', emoji: '😐' },
  { id: 'energetic', label: 'Energetic', emoji: '🔥' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'playful', label: 'Playful', emoji: '😄' },
];

const STYLES = [
  { id: 'professional', label: 'Professional', description: 'Cinematic quality' },
  { id: 'casual', label: 'Casual', description: 'Social media style' },
  { id: 'cinematic', label: 'Cinematic', description: 'Movie-like production' },
  { id: 'artistic', label: 'Artistic', description: 'Creative & unique' },
];

/**
 * AI Cameo Studio Component
 * Sora-style video generation with character customization
 */
export function AICameoStudio({ visible, onClose, onGenerate }: AICameoStudioProps) {
  const [step, setStep] = useState<'character' | 'script' | 'settings' | 'preview'>('character');
  const [selectedCharacter, setSelectedCharacter] = useState<CameoCharacter | null>(PRESET_CHARACTERS[0]);
  const [selectedPose, setSelectedPose] = useState('standing_confident');
  const [selectedEmotion, setSelectedEmotion] = useState<'happy' | 'serious' | 'energetic' | 'calm' | 'playful'>('happy');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState('15');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCameo = async () => {
    if (!selectedCharacter || !script.trim()) {
      Alert.alert('Missing Info', 'Please select a character and enter a script');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsGenerating(true);

    const request: CameoGenerationRequest = {
      character: {
        ...selectedCharacter,
        pose: selectedPose,
        emotion: selectedEmotion,
      },
      script: script.trim(),
      duration: parseInt(duration) || 15,
      style: selectedStyle as any,
    };

    try {
      if (onGenerate) {
        await onGenerate(request);
      }
      // Simulate generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Cameo video generated! Check your videos.');
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to generate cameo video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep('character');
    setScript('');
    setDuration('15');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border bg-surface">
          <Text className="text-lg font-bold text-foreground">AI Cameo Studio</Text>
          <Pressable onPress={handleClose}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Step Indicator */}
        <View className="flex-row justify-between px-4 py-3 bg-surface">
          {['character', 'script', 'settings', 'preview'].map((s) => (
            <View
              key={s}
              className={cn(
                'flex-1 h-1 mx-1 rounded',
                step === s ? 'bg-primary' : 'bg-border'
              )}
            />
          ))}
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Character Selection Step */}
          {step === 'character' && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Select Character</Text>
              {PRESET_CHARACTERS.map((char) => (
                <Pressable
                  key={char.id}
                  onPress={() => {
                    setSelectedCharacter(char);
                    setStep('script');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={cn(
                    'p-4 rounded-lg border-2',
                    selectedCharacter?.id === char.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface'
                  )}
                >
                  <Text className="font-bold text-foreground">{char.name}</Text>
                  <Text className="text-sm text-muted mt-1">{char.description}</Text>
                  <Text className="text-xs text-muted mt-2">👕 {char.outfit}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Script Input Step */}
          {step === 'script' && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Write Your Script</Text>
              <TextInput
                placeholder="What should your cameo say or do?"
                placeholderTextColor="#999"
                value={script}
                onChangeText={setScript}
                multiline
                numberOfLines={6}
                className="p-3 bg-surface border border-border rounded-lg text-foreground"
                style={{ textAlignVertical: 'top' }}
              />
              <Text className="text-xs text-muted">{script.length} characters</Text>
            </View>
          )}

          {/* Settings Step */}
          {step === 'settings' && (
            <View className="gap-4">
              <View>
                <Text className="text-lg font-bold text-foreground mb-3">Pose</Text>
                <View className="flex-row flex-wrap gap-2">
                  {POSES.map((pose) => (
                    <Pressable
                      key={pose.id}
                      onPress={() => {
                        setSelectedPose(pose.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className={cn(
                        'px-3 py-2 rounded-full border',
                        selectedPose === pose.id
                          ? 'border-primary bg-primary/20'
                          : 'border-border bg-surface'
                      )}
                    >
                      <Text className="text-sm font-semibold text-foreground">
                        {pose.emoji} {pose.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-lg font-bold text-foreground mb-3">Emotion</Text>
                <View className="flex-row flex-wrap gap-2">
                  {EMOTIONS.map((emotion) => (
                    <Pressable
                      key={emotion.id}
                      onPress={() => {
                        setSelectedEmotion(emotion.id as any);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      className={cn(
                        'px-3 py-2 rounded-full border',
                        selectedEmotion === emotion.id
                          ? 'border-primary bg-primary/20'
                          : 'border-border bg-surface'
                      )}
                    >
                      <Text className="text-sm font-semibold text-foreground">
                        {emotion.emoji} {emotion.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-lg font-bold text-foreground mb-3">Style</Text>
                {STYLES.map((style) => (
                  <Pressable
                    key={style.id}
                    onPress={() => {
                      setSelectedStyle(style.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    className={cn(
                      'p-3 rounded-lg border mb-2',
                      selectedStyle === style.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-surface'
                    )}
                  >
                    <Text className="font-semibold text-foreground">{style.label}</Text>
                    <Text className="text-xs text-muted mt-1">{style.description}</Text>
                  </Pressable>
                ))}
              </View>

              <View>
                <Text className="text-lg font-bold text-foreground mb-2">Duration (seconds)</Text>
                <TextInput
                  placeholder="15"
                  placeholderTextColor="#999"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  className="p-3 bg-surface border border-border rounded-lg text-foreground"
                />
              </View>
            </View>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Preview</Text>
              <View className="p-4 bg-surface rounded-lg border border-border">
                <Text className="font-bold text-foreground mb-2">Character: {selectedCharacter?.name}</Text>
                <Text className="text-sm text-muted mb-3">Script: {script}</Text>
                <Text className="text-sm text-muted">
                  Duration: {duration}s | Style: {selectedStyle} | Pose: {selectedPose}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 p-4 border-t border-border bg-surface">
          {step !== 'character' && (
            <Pressable
              onPress={() => {
                const steps = ['character', 'script', 'settings', 'preview'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1] as any);
                }
              }}
              className="flex-1 py-3 px-4 rounded-lg border border-border bg-background"
            >
              <Text className="text-center font-semibold text-foreground">Back</Text>
            </Pressable>
          )}

          {step !== 'preview' && (
            <Pressable
              onPress={() => {
                const steps = ['character', 'script', 'settings', 'preview'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) {
                  setStep(steps[currentIndex + 1] as any);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              className="flex-1 py-3 px-4 rounded-lg bg-primary"
            >
              <Text className="text-center font-semibold text-background">Next</Text>
            </Pressable>
          )}

          {step === 'preview' && (
            <Pressable
              onPress={handleGenerateCameo}
              disabled={isGenerating}
              className="flex-1 py-3 px-4 rounded-lg bg-primary disabled:opacity-50"
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-background">Generate Cameo</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
