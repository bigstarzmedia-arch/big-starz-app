import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Sound {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  duration: number;
  plays: number;
  thumbnail: string;
  isSelected?: boolean;
}

interface TrendingSoundsLibraryProps {
  visible: boolean;
  onClose: () => void;
  onSelectSound?: (sound: Sound) => void;
}

const TRENDING_SOUNDS: Sound[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synth Wave',
    bpm: 128,
    genre: 'Electronic',
    duration: 180,
    plays: 45200,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Future Bass',
    bpm: 140,
    genre: 'Electronic',
    duration: 210,
    plays: 38900,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    title: 'Beat Studio',
    artist: 'Hip Hop Beats',
    bpm: 95,
    genre: 'Hip Hop',
    duration: 240,
    plays: 32100,
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    title: 'Cyberpunk Vibes',
    artist: 'Synthpop',
    bpm: 130,
    genre: 'Electronic',
    duration: 195,
    plays: 28500,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
  },
  {
    id: '5',
    title: 'Summer Groove',
    artist: 'Pop',
    bpm: 120,
    genre: 'Pop',
    duration: 180,
    plays: 25300,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
  },
  {
    id: '6',
    title: 'Ambient Chill',
    artist: 'Lo-Fi',
    bpm: 80,
    genre: 'Lo-Fi',
    duration: 300,
    plays: 22800,
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=100&h=100&fit=crop',
  },
];

export function TrendingSoundsLibrary({
  visible,
  onClose,
  onSelectSound,
}: TrendingSoundsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [filteredSounds, setFilteredSounds] = useState(TRENDING_SOUNDS);

  const genres = ['Electronic', 'Hip Hop', 'Pop', 'Lo-Fi', 'Ambient'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterSounds(query, selectedGenre);
  };

  const handleGenreFilter = (genre: string) => {
    const newGenre = selectedGenre === genre ? null : genre;
    setSelectedGenre(newGenre);
    filterSounds(searchQuery, newGenre);
  };

  const filterSounds = (query: string, genre: string | null) => {
    let filtered = TRENDING_SOUNDS;

    if (query.trim() !== '') {
      filtered = filtered.filter(
        (sound) =>
          sound.title.toLowerCase().includes(query.toLowerCase()) ||
          sound.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter((sound) => sound.genre === genre);
    }

    setFilteredSounds(filtered);
  };

  const handleSelectSound = (sound: Sound) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setSelectedSound(sound);
    onSelectSound?.(sound);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSoundItem = ({ item }: { item: Sound }) => (
    <TouchableOpacity
      onPress={() => handleSelectSound(item)}
      style={{
        backgroundColor: selectedSound?.id === item.id ? '#FF1493' : '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: selectedSound?.id === item.id ? '#FF1493' : '#333',
      }}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
        }}
      />

      {/* Sound Info */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: selectedSound?.id === item.id ? '#fff' : '#FF1493',
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: selectedSound?.id === item.id ? 'rgba(255,255,255,0.7)' : '#999',
          }}
        >
          {item.artist} • {item.bpm} BPM
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text
            style={{
              fontSize: 10,
              color: selectedSound?.id === item.id ? 'rgba(255,255,255,0.6)' : '#666',
            }}
          >
            ⏱️ {formatDuration(item.duration)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: selectedSound?.id === item.id ? 'rgba(255,255,255,0.6)' : '#666',
            }}
          >
            👂 {(item.plays / 1000).toFixed(1)}K
          </Text>
        </View>
      </View>

      {/* Checkmark */}
      {selectedSound?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              🎵 Trending Sounds
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#333',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              marginBottom: 16,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={18} color="#999" />
            <TextInput
              placeholder="Search sounds..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleSearch}
              style={{
                flex: 1,
                paddingVertical: 10,
                color: '#fff',
                fontSize: 14,
              }}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Genre Filter */}
          <View style={{ marginBottom: 20, gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
              Filter by Genre
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  onPress={() => handleGenreFilter(genre)}
                  style={{
                    backgroundColor: selectedGenre === genre ? '#FF1493' : '#1A1A1A',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selectedGenre === genre ? '#FF1493' : '#333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: selectedGenre === genre ? '#fff' : '#999',
                    }}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sounds List */}
          <FlatList
            data={filteredSounds}
            keyExtractor={(item) => item.id}
            renderItem={renderSoundItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 16, color: '#999' }}>
                  No sounds found
                </Text>
              </View>
            }
          />

          {/* Selected Sound Info */}
          {selectedSound && (
            <View
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                padding: 16,
                marginTop: 24,
                borderWidth: 2,
                borderColor: '#FF1493',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF1493' }}>
                ✓ Selected Sound
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                {selectedSound.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#999' }}>
                {selectedSound.artist} • {selectedSound.genre}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: '#FF1493',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Use This Sound
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
