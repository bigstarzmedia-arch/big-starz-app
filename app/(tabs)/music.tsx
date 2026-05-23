import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Beat {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  duration: string;
  thumbnail: string;
  audioUrl: string;
  downloads: number;
  liked: boolean;
}

// Mock beats/music data with Sora video backgrounds
const BEATS: Beat[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Big Starz Beats',
    genre: 'Hip-Hop',
    bpm: 95,
    duration: '3:45',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    downloads: 2400,
    liked: false,
  },
  {
    id: '2',
    title: 'Cyber Dreams',
    artist: 'Big Starz Beats',
    genre: 'Synthwave',
    bpm: 120,
    duration: '4:12',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    downloads: 1800,
    liked: false,
  },
  {
    id: '3',
    title: 'Luxury Vibes',
    artist: 'Big Starz Beats',
    genre: 'R&B',
    bpm: 88,
    duration: '3:58',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    downloads: 3200,
    liked: false,
  },
  {
    id: '4',
    title: 'Urban Flow',
    artist: 'Big Starz Beats',
    genre: 'Trap',
    bpm: 140,
    duration: '3:22',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    downloads: 2900,
    liked: false,
  },
  {
    id: '5',
    title: 'Fashion Week',
    artist: 'Big Starz Beats',
    genre: 'Pop',
    bpm: 110,
    duration: '3:35',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    downloads: 2100,
    liked: false,
  },
  {
    id: '6',
    title: 'Gold Standard',
    artist: 'Big Starz Beats',
    genre: 'Afrobeats',
    bpm: 105,
    duration: '3:50',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    downloads: 1600,
    liked: false,
  },
  {
    id: '7',
    title: 'Midnight City',
    artist: 'Big Starz Beats',
    genre: 'Electronic',
    bpm: 128,
    duration: '4:05',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    downloads: 2700,
    liked: false,
  },
  {
    id: '8',
    title: 'Summer Glow',
    artist: 'Big Starz Beats',
    genre: 'Reggae',
    bpm: 92,
    duration: '3:42',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    downloads: 1400,
    liked: false,
  },
];

export default function MusicScreen() {
  const [beats, setBeats] = useState<Beat[]>(BEATS);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);

  const toggleLike = (id: string) => {
    setBeats((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, liked: !b.liked } : b
      )
    );
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSelectBeat = (beat: Beat) => {
    setSelectedBeat(beat);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const renderBeat = ({ item }: { item: Beat }) => (
    <TouchableOpacity
      onPress={() => handleSelectBeat(item)}
      style={{
        width: (screenWidth - 48) / 2,
        marginHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: selectedBeat?.id === item.id ? 2 : 1,
        borderColor: selectedBeat?.id === item.id ? '#FF0055' : '#333',
      }}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: '100%', height: 120 }}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={{ padding: 12, gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFF' }} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 11, color: '#AAA' }}>{item.genre}</Text>

        {/* BPM & Duration */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: '#AAA' }}>
            {item.bpm} BPM • {item.duration}
          </Text>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Text style={{ fontSize: 14 }}>{item.liked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Downloads */}
        <Text style={{ fontSize: 10, color: '#666' }}>📥 {(item.downloads / 1000).toFixed(1)}K</Text>

        {/* Use Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF0055',
            paddingVertical: 8,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Use Beat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, paddingHorizontal: 8, paddingTop: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 16, paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 4 }}>
            Music Library
          </Text>
          <Text style={{ fontSize: 12, color: '#AAA' }}>
            Choose from 300+ royalty-free beats
          </Text>
        </View>

        {/* Beats Grid */}
        <FlatList
          data={beats}
          keyExtractor={(item) => item.id}
          renderItem={renderBeat}
          numColumns={2}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* Selected Beat Info */}
      {selectedBeat && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1A1A1A',
            borderTopWidth: 1,
            borderTopColor: '#333',
            padding: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Image
              source={{ uri: selectedBeat.thumbnail }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                {selectedBeat.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#AAA' }}>{selectedBeat.artist}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#FF0055',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              Use This Beat in Create
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}
