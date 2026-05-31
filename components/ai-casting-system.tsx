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
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

interface CastingChallenge {
  id: string;
  title: string;
  description: string;
  musicGenre: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  reward: number;
}

interface DanceMove {
  id: string;
  name: string;
  description: string;
  category: 'hip-hop' | 'contemporary' | 'freestyle' | 'choreography' | 'trending';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AICastingSystemProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (submission: CastingSubmission) => void;
}

interface CastingSubmission {
  challengeId: string;
  moves: string[];
  musicUrl?: string;
  duration: number;
  notes?: string;
}

const CASTING_CHALLENGES: CastingChallenge[] = [
  {
    id: 'challenge_1',
    title: 'Hip-Hop Freestyle',
    description: 'Show your freestyle hip-hop moves',
    musicGenre: 'hip-hop',
    difficulty: 'medium',
    duration: 30,
    reward: 500,
  },
  {
    id: 'challenge_2',
    title: 'Contemporary Flow',
    description: 'Express yourself with contemporary dance',
    musicGenre: 'contemporary',
    difficulty: 'hard',
    duration: 45,
    reward: 1000,
  },
  {
    id: 'challenge_3',
    title: 'Trending Moves',
    description: 'Master the latest trending choreography',
    musicGenre: 'pop',
    difficulty: 'easy',
    duration: 20,
    reward: 300,
  },
];

const DANCE_MOVES: DanceMove[] = [
  {
    id: 'move_1',
    name: 'Body Roll',
    description: 'Smooth body wave motion',
    category: 'hip-hop',
    difficulty: 'easy',
  },
  {
    id: 'move_2',
    name: 'Moonwalk',
    description: 'Classic gliding motion',
    category: 'freestyle',
    difficulty: 'medium',
  },
  {
    id: 'move_3',
    name: 'Spin',
    description: '360-degree rotation',
    category: 'choreography',
    difficulty: 'medium',
  },
  {
    id: 'move_4',
    name: 'Popping',
    description: 'Rhythmic muscle contractions',
    category: 'hip-hop',
    difficulty: 'hard',
  },
  {
    id: 'move_5',
    name: 'Freestyle Flow',
    description: 'Improvised movement',
    category: 'freestyle',
    difficulty: 'easy',
  },
  {
    id: 'move_6',
    name: 'Trending TikTok',
    description: 'Latest viral choreography',
    category: 'trending',
    difficulty: 'easy',
  },
];

/**
 * AI Casting System Component
 * Seedance-style pose/dance generation for casting calls
 */
export function AICastingSystem({ visible, onClose, onSubmit }: AICastingSystemProps) {
  const [step, setStep] = useState<'challenges' | 'moves' | 'record' | 'submit'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<CastingChallenge | null>(null);
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectChallenge = (challenge: CastingChallenge) => {
    setSelectedChallenge(challenge);
    setSelectedMoves([]);
    setStep('moves');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleMove = (moveId: string) => {
    setSelectedMoves((prev) =>
      prev.includes(moveId) ? prev.filter((id) => id !== moveId) : [...prev, moveId]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmitCasting = async () => {
    if (!selectedChallenge || selectedMoves.length === 0) {
      Alert.alert('Missing Info', 'Please select a challenge and at least one move');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    const submission: CastingSubmission = {
      challengeId: selectedChallenge.id,
      moves: selectedMoves,
      duration: selectedChallenge.duration,
      notes: notes.trim(),
    };

    try {
      if (onSubmit) {
        await onSubmit(submission);
      }
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Success', `Casting submitted! You earned ${selectedChallenge.reward} Starz Coins!`);
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit casting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('challenges');
    setSelectedChallenge(null);
    setSelectedMoves([]);
    setNotes('');
    onClose();
  };

  const filteredMoves = selectedChallenge
    ? DANCE_MOVES.filter((move) => move.category === selectedChallenge.musicGenre || move.category === 'freestyle')
    : DANCE_MOVES;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border bg-surface">
          <Text className="text-lg font-bold text-foreground">AI Casting System</Text>
          <Pressable onPress={handleClose}>
            <Text className="text-2xl">✕</Text>
          </Pressable>
        </View>

        {/* Step Indicator */}
        <View className="flex-row justify-between px-4 py-3 bg-surface">
          {['challenges', 'moves', 'record', 'submit'].map((s) => (
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
          {/* Challenges Step */}
          {step === 'challenges' && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground mb-2">Select a Casting Challenge</Text>
              {CASTING_CHALLENGES.map((challenge) => (
                <Pressable
                  key={challenge.id}
                  onPress={() => handleSelectChallenge(challenge)}
                  className="p-4 rounded-lg border border-border bg-surface active:opacity-70"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="font-bold text-foreground text-base">{challenge.title}</Text>
                      <Text className="text-sm text-muted mt-1">{challenge.description}</Text>
                    </View>
                    <View className="bg-primary/20 px-2 py-1 rounded">
                      <Text className="text-xs font-bold text-primary">+{challenge.reward}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-2">
                    <View className="bg-border/50 px-2 py-1 rounded">
                      <Text className="text-xs text-muted">🎵 {challenge.musicGenre}</Text>
                    </View>
                    <View className="bg-border/50 px-2 py-1 rounded">
                      <Text className="text-xs text-muted">⏱️ {challenge.duration}s</Text>
                    </View>
                    <View className="bg-border/50 px-2 py-1 rounded">
                      <Text className="text-xs text-muted">📊 {challenge.difficulty}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Moves Selection Step */}
          {step === 'moves' && selectedChallenge && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground mb-2">
                Select Dance Moves for {selectedChallenge.title}
              </Text>
              {filteredMoves.map((move) => (
                <Pressable
                  key={move.id}
                  onPress={() => handleToggleMove(move.id)}
                  className={cn(
                    'p-3 rounded-lg border-2',
                    selectedMoves.includes(move.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-surface'
                  )}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-bold text-foreground">{move.name}</Text>
                      <Text className="text-sm text-muted mt-1">{move.description}</Text>
                    </View>
                    <Text className="text-lg">
                      {selectedMoves.includes(move.id) ? '✓' : '○'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Record Step */}
          {step === 'record' && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Record Your Performance</Text>
              <View className="p-8 bg-surface rounded-lg border border-border items-center justify-center">
                <Text className="text-4xl mb-4">🎥</Text>
                <Text className="text-center text-foreground font-semibold mb-2">
                  Ready to Record
                </Text>
                <Text className="text-center text-sm text-muted">
                  {selectedChallenge?.duration}s performance
                </Text>
              </View>
              <View className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <Text className="text-sm text-foreground font-semibold mb-2">💡 Tips:</Text>
                <Text className="text-xs text-muted">
                  • Make sure you have good lighting{'\n'}
                  • Wear comfortable clothes{'\n'}
                  • Clear space for movement{'\n'}
                  • Be confident and have fun!
                </Text>
              </View>
            </View>
          )}

          {/* Submit Step */}
          {step === 'submit' && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">Add Notes (Optional)</Text>
              <TextInput
                placeholder="Tell us about your performance..."
                placeholderTextColor="#999"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                className="p-3 bg-surface border border-border rounded-lg text-foreground"
                style={{ textAlignVertical: 'top' }}
              />
              <View className="p-4 bg-surface rounded-lg border border-border">
                <Text className="font-bold text-foreground mb-2">Summary:</Text>
                <Text className="text-sm text-muted">
                  Challenge: {selectedChallenge?.title}{'\n'}
                  Moves: {selectedMoves.length} selected{'\n'}
                  Reward: +{selectedChallenge?.reward} Starz Coins
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 p-4 border-t border-border bg-surface">
          {step !== 'challenges' && (
            <Pressable
              onPress={() => {
                const steps = ['challenges', 'moves', 'record', 'submit'];
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

          {step !== 'submit' && (
            <Pressable
              onPress={() => {
                const steps = ['challenges', 'moves', 'record', 'submit'];
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

          {step === 'submit' && (
            <Pressable
              onPress={handleSubmitCasting}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-lg bg-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-background">Submit Casting</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
