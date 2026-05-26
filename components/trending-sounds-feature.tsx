import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, FlatList } from 'react-native';
import { useTierAccess } from '@/hooks/use-tier-access';
import * as Haptics from 'expo-haptics';

interface TrendingSoundsProps {
  visible: boolean;
  onClose: () => void;
  onSelectSound?: (soundId: string, title: string) => void;
}

export function TrendingSoundsFeature({
  visible,
  onClose,
  onSelectSound,
}: TrendingSoundsProps) {
  const { hasFeature } = useTierAccess();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  const mockSounds = [
    {
      id: '1',
      title: 'Neon Nights',
      artist: 'Synthwave Master',
      genre: 'Electronic',
      bpm: 128,
      duration: '3:24',
      plays: 1200000,
    },
    {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Cyber Beats',
      genre: 'Electronic',
      bpm: 120,
      duration: '2:58',
      plays: 980000,
    },
    {
      id: '3',
      title: 'Hip Hop Flow',
      artist: 'Beat Maker',
      genre: 'Hip Hop',
      bpm: 95,
      duration: '3:15',
      plays: 750000,
    },
    {
      id: '4',
      title: 'Pop Vibes',
      artist: 'Pop Star',
      genre: 'Pop',
      bpm: 110,
      duration: '3:00',
      plays: 650000,
    },
    {
      id: '5',
      title: 'Lo-Fi Chill',
      artist: 'Chill Beats',
      genre: 'Lo-Fi',
      bpm: 85,
      duration: '2:45',
      plays: 540000,
    },
  ];

  const genres = ['Electronic', 'Hip Hop', 'Pop', 'Lo-Fi', 'R&B'];

  const filteredSounds = mockSounds.filter(sound => {
    const matchesSearch =
      sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || sound.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleSelectSound = (soundId: string, title: string) => {
    setSelectedSound(soundId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectSound?.(soundId, title);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-t-3xl p-6 max-h-[90%]">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <Text className="text-right text-muted text-xl">✕</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            🎵 Trending Sounds
          </Text>
          <Text className="text-muted mb-6">
            Royalty-free sounds for your videos
          </Text>

          {/* Search Bar */}
          <View className="bg-surface rounded-lg border border-border p-3 mb-4 flex-row items-center gap-2">
            <Text className="text-muted">🔍</Text>
            <TextInput
              placeholder="Search sounds..."
              placeholderTextColor="#687076"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
            />
          </View>

          {/* Genre Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            <View className="flex-row gap-2">
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  onPress={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                  className={`px-4 py-2 rounded-full border-2 ${
                    selectedGenre === genre
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={
                      selectedGenre === genre
                        ? 'text-background font-bold'
                        : 'text-foreground'
                    }
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Sounds List */}
          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            <View className="gap-3">
              {filteredSounds.map(sound => (
                <TouchableOpacity
                  key={sound.id}
                  onPress={() => handleSelectSound(sound.id, sound.title)}
                  className={`p-4 rounded-lg border-2 ${
                    selectedSound === sound.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg">
                        {sound.title}
                      </Text>
                      <Text className="text-muted text-sm">{sound.artist}</Text>
                    </View>
                    <Text className="text-primary font-bold">{sound.duration}</Text>
                  </View>

                  {/* Sound Details */}
                  <View className="flex-row gap-4 flex-wrap">
                    <View>
                      <Text className="text-muted text-xs">Genre</Text>
                      <Text className="text-foreground text-sm font-semibold">
                        {sound.genre}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted text-xs">BPM</Text>
                      <Text className="text-foreground text-sm font-semibold">
                        {sound.bpm}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted text-xs">Plays</Text>
                      <Text className="text-foreground text-sm font-semibold">
                        {(sound.plays / 1000000).toFixed(1)}M
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Select Button */}
          <TouchableOpacity
            onPress={() =>
              selectedSound && handleSelectSound(selectedSound, 'Selected Sound')
            }
            disabled={!selectedSound}
            className={`rounded-full py-4 ${
              selectedSound ? 'bg-primary' : 'bg-muted opacity-50'
            }`}
          >
            <Text className="text-center text-background font-bold text-lg">
              Use This Sound
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
