import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT - 100;

const VIDEOS = [
  {
    id: '1',
    creator: '@NeonVex',
    title: 'AI Music Video',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=900&fit=crop',
    likes: 8400,
    genre: 'Rap',
  },
  {
    id: '2',
    creator: '@CosmicVibe',
    title: 'Beat Studio',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=900&fit=crop',
    likes: 5200,
    genre: 'R&B',
  },
  {
    id: '3',
    creator: '@GlitchQueen',
    title: 'Live Concert',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=900&fit=crop',
    likes: 12100,
    genre: 'Pop',
  },
];

export default function VibeScreen() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderCard = ({ item }: { item: typeof VIDEOS[0] }) => {
    const isLiked = likedIds.has(item.id);

    return (
      <View style={{ width: SCREEN_WIDTH, height: CARD_HEIGHT, position: 'relative' }}>
        {/* Background Image */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />

        {/* Dark Overlay */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

        {/* Big Play Button (Center) */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -40,
            marginTop: -40,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FF0055',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#FF0055',
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 40, color: '#FFF', marginLeft: 4 }}>▶</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Info (Creator + Genre) */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{item.creator}</Text>
          <Text style={{ color: '#CCC', fontSize: 14, marginTop: 4 }}>{item.title}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            <View style={{ backgroundColor: '#FF0055', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{item.genre}</Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 12 }}>❤️ {(item.likes / 1000).toFixed(1)}K</Text>
          </View>
        </View>

        {/* Right Action Bar (Minimal) */}
        <View style={{ position: 'absolute', right: 12, bottom: 100, gap: 20, alignItems: 'center' }}>
          {/* Like Button */}
          <TouchableOpacity onPress={() => toggleLike(item.id)} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={{ color: '#FFF', fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>Like</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>💬</Text>
            <Text style={{ color: '#FFF', fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>Chat</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>📤</Text>
            <Text style={{ color: '#FFF', fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Simple Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>BIG</Text>
          <Text style={{ color: '#FF0055' }}>STARZ</Text>
        </Text>
      </View>

      {/* Video Feed */}
      <FlatList
        ref={flatListRef}
        data={VIDEOS}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        snapToInterval={CARD_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
