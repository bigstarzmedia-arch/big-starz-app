import { View, Text, TouchableOpacity, ScrollView, Image, FlatList, TextInput } from 'react-native';
import { useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { BigStarzBackground } from '@/components/big-starz-background';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rate: number; // per hour
  rating: number; // 1-5
  reviews: number;
  subscribers: number;
  isElite: boolean;
  portfolio: string[];
  bio: string;
  available: boolean;
}

// Mock creator data
const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Luna Sky',
    avatar: 'https://i.pravatar.cc/150?img=1',
    category: 'Dancer',
    rate: 150,
    rating: 4.9,
    reviews: 342,
    subscribers: 5200,
    isElite: true,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'Professional dancer specializing in hip-hop and contemporary',
    available: true,
  },
  {
    id: '2',
    name: 'Marcus Vibe',
    avatar: 'https://i.pravatar.cc/150?img=2',
    category: 'Singer',
    rate: 200,
    rating: 4.8,
    reviews: 218,
    subscribers: 8900,
    isElite: true,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'R&B and soul vocalist with studio experience',
    available: true,
  },
  {
    id: '3',
    name: 'Zara Model',
    avatar: 'https://i.pravatar.cc/150?img=3',
    category: 'Model',
    rate: 120,
    rating: 4.7,
    reviews: 156,
    subscribers: 3400,
    isElite: false,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'Fashion and lifestyle model',
    available: true,
  },
  {
    id: '4',
    name: 'Alex Actor',
    avatar: 'https://i.pravatar.cc/150?img=4',
    category: 'Actor',
    rate: 180,
    rating: 4.6,
    reviews: 89,
    subscribers: 2100,
    isElite: false,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'Film and commercial actor',
    available: false,
  },
  {
    id: '5',
    name: 'DJ Sonic',
    avatar: 'https://i.pravatar.cc/150?img=5',
    category: 'Producer',
    rate: 250,
    rating: 4.9,
    reviews: 267,
    subscribers: 12000,
    isElite: true,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'Electronic music producer and DJ',
    available: true,
  },
  {
    id: '6',
    name: 'Sophia Glow',
    avatar: 'https://i.pravatar.cc/150?img=6',
    category: 'Makeup Artist',
    rate: 100,
    rating: 4.8,
    reviews: 134,
    subscribers: 1800,
    isElite: false,
    portfolio: ['https://via.placeholder.com/200', 'https://via.placeholder.com/200'],
    bio: 'Professional makeup artist and beauty influencer',
    available: true,
  },
];

const CATEGORIES = ['All', 'Dancer', 'Singer', 'Model', 'Actor', 'Producer', 'Makeup Artist'];

export default function CastingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const filteredCreators = useMemo(() => {
    return MOCK_CREATORS.filter((creator) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
      const matchesPrice = creator.rate >= priceRange[0] && creator.rate <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  const handleCreatorPress = (creator: Creator) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: '/creator-detail',
      params: { creatorId: creator.id, creatorName: creator.name },
    });
  };

  return (
    <BigStarzBackground showHeader={true} headerTitle="Casting Collab">
      <ScreenContainer containerClassName="bg-transparent" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 4 }}>
            🎬 Casting
          </Text>
          <Text style={{ fontSize: 14, color: '#888' }}>
            Discover & book creators for your videos
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Text style={{ fontSize: 16, color: '#666', marginRight: 8 }}>🔍</Text>
            <TextInput
              placeholder="Search creators..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: 12,
                color: '#FFF',
                fontSize: 14,
              }}
            />
          </View>
        </View>

        {/* Category Filter */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === category ? '#FF0055' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: selectedCategory === category ? '#FF0055' : '#333',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: selectedCategory === category ? 'bold' : '500',
                    color: selectedCategory === category ? '#FFF' : '#888',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price Range Info */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Rate Range: ${priceRange[0]} - ${priceRange[1]}/hour
          </Text>
        </View>

        {/* Creators Grid */}
        <View style={{ paddingHorizontal: 16 }}>
          {filteredCreators.length > 0 ? (
            <View style={{ gap: 12 }}>
              {filteredCreators.map((creator) => (
                <TouchableOpacity
                  key={creator.id}
                  onPress={() => handleCreatorPress(creator)}
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#333',
                  }}
                >
                  <View style={{ flexDirection: 'row', padding: 12, gap: 12 }}>
                    {/* Avatar */}
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        backgroundColor: '#2A2A2A',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <Image
                        source={{ uri: creator.avatar }}
                        style={{ width: 80, height: 80, borderRadius: 8 }}
                      />
                      {creator.isElite && (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            backgroundColor: '#FFD700',
                            borderRadius: 50,
                            width: 28,
                            height: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#1A1A1A',
                          }}
                        >
                          <Text style={{ fontSize: 14 }}>⭐</Text>
                        </View>
                      )}
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                            {creator.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              backgroundColor: '#FF0055',
                              color: '#FFF',
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 4,
                            }}
                          >
                            {creator.category}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                          {creator.subscribers.toLocaleString()} subscribers
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ fontSize: 12, color: '#FFD700' }}>⭐ {creator.rating}</Text>
                          <Text style={{ fontSize: 12, color: '#666' }}>({creator.reviews})</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF0055' }}>
                          ${creator.rate}/hr
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                            backgroundColor: creator.available ? '#00FF00' : '#666',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: 'bold',
                              color: creator.available ? '#000' : '#FFF',
                            }}
                          >
                            {creator.available ? 'Available' : 'Booked'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
                No creators found
              </Text>
              <Text style={{ fontSize: 12, color: '#555' }}>
                Try adjusting your filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      </ScreenContainer>
    </BigStarzBackground>
  );
}