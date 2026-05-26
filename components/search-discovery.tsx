import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface SearchResult {
  id: string;
  type: 'creator' | 'video' | 'sound' | 'hashtag';
  title: string;
  subtitle: string;
  image: string;
  count?: number;
  icon: string;
}

interface SearchDiscoveryProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_TRENDING: SearchResult[] = [
  {
    id: '1',
    type: 'hashtag',
    title: '#AIMusic',
    subtitle: '2.5M videos',
    image: '',
    count: 2500000,
    icon: '#',
  },
  {
    id: '2',
    type: 'hashtag',
    title: '#SoraStyle',
    subtitle: '1.8M videos',
    image: '',
    count: 1800000,
    icon: '#',
  },
  {
    id: '3',
    type: 'hashtag',
    title: '#CreatorLife',
    subtitle: '3.2M videos',
    image: '',
    count: 3200000,
    icon: '#',
  },
  {
    id: '4',
    type: 'hashtag',
    title: '#TikTokTrend',
    subtitle: '4.1M videos',
    image: '',
    count: 4100000,
    icon: '#',
  },
];

const MOCK_CREATORS: SearchResult[] = [
  {
    id: '1',
    type: 'creator',
    title: 'Alex Rivera',
    subtitle: '245K followers',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    icon: '👤',
  },
  {
    id: '2',
    type: 'creator',
    title: 'Jordan Smith',
    subtitle: '189K followers',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-2.jpg',
    icon: '👤',
  },
  {
    id: '3',
    type: 'creator',
    title: 'Casey Lee',
    subtitle: '312K followers',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-3.jpg',
    icon: '👤',
  },
];

const MOCK_SOUNDS: SearchResult[] = [
  {
    id: '1',
    type: 'sound',
    title: 'Neon Nights',
    subtitle: 'Electronic • 128 BPM',
    image: '',
    count: 45000,
    icon: '🎵',
  },
  {
    id: '2',
    type: 'sound',
    title: 'Electric Dreams',
    subtitle: 'Synthwave • 120 BPM',
    image: '',
    count: 38000,
    icon: '🎵',
  },
  {
    id: '3',
    type: 'sound',
    title: 'Lo-Fi Beats',
    subtitle: 'Lo-Fi • 85 BPM',
    image: '',
    count: 52000,
    icon: '🎵',
  },
];

export function SearchDiscovery({ visible, onClose }: SearchDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'creators' | 'sounds'>('trending');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate search results
      const allResults = [...MOCK_TRENDING, ...MOCK_CREATORS, ...MOCK_SOUNDS];
      const filtered = allResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
        }
      }}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Avatar/Icon */}
      {item.type === 'creator' ? (
        <Image
          source={{ uri: item.image }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
          }}
        />
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#FF1493',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24 }}>{item.icon}</Text>
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.subtitle}
        </Text>
      </View>

      {/* Action */}
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
        }
        setSearchQuery(item.title);
        handleSearch(item.title);
      }}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#FF1493',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.subtitle}
        </Text>
      </View>

      {/* Trending Badge */}
      <View
        style={{
          backgroundColor: '#FFD700',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: '600', color: '#000' }}>
          TRENDING
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              🔍 Search
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
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search creators, videos, sounds..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={handleSearch}
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 12,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs (only show when not searching) */}
          {!isSearching && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setActiveTab('trending')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeTab === 'trending' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'trending' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeTab === 'trending' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Trending
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('creators')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeTab === 'creators' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'creators' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeTab === 'creators' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Creators
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('sounds')}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: activeTab === 'sounds' ? '#FF1493' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: activeTab === 'sounds' ? '#FF1493' : '#333',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activeTab === 'sounds' ? '#fff' : '#999',
                    fontSize: 11,
                  }}
                >
                  Sounds
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          {isSearching ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderSearchResult}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <Text style={{ fontSize: 14, color: '#999' }}>
                    No results found
                  </Text>
                </View>
              }
            />
          ) : (
            <>
              {activeTab === 'trending' && (
                <FlatList
                  data={MOCK_TRENDING}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTrendingItem}
                  scrollEnabled={false}
                />
              )}

              {activeTab === 'creators' && (
                <FlatList
                  data={MOCK_CREATORS}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSearchResult}
                  scrollEnabled={false}
                />
              )}

              {activeTab === 'sounds' && (
                <FlatList
                  data={MOCK_SOUNDS}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTrendingItem}
                  scrollEnabled={false}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
