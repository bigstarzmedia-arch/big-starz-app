import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Hashtag {
  id: string;
  name: string;
  videoCount: number;
  engagementRate: number;
  trendingRank: number;
  icon?: string;
}

interface TrendingHashtagsProps {
  onHashtagPress?: (hashtag: string) => void;
}

const TRENDING_HASHTAGS: Hashtag[] = [
  { id: '1', name: '#AIMusic', videoCount: 45200, engagementRate: 8.2, trendingRank: 1, icon: '🎵' },
  { id: '2', name: '#FaceClone', videoCount: 38900, engagementRate: 7.6, trendingRank: 2, icon: '👤' },
  { id: '3', name: '#SoraStyle', videoCount: 32100, engagementRate: 7.1, trendingRank: 3, icon: '✨' },
  { id: '4', name: '#MusicProduction', videoCount: 28500, engagementRate: 6.8, trendingRank: 4, icon: '🎧' },
  { id: '5', name: '#AICreator', videoCount: 25300, engagementRate: 6.5, trendingRank: 5, icon: '🤖' },
  { id: '6', name: '#Cyberpunk', videoCount: 22800, engagementRate: 6.2, trendingRank: 6, icon: '🌆' },
  { id: '7', name: '#DanceChallenge', videoCount: 19600, engagementRate: 5.9, trendingRank: 7, icon: '💃' },
  { id: '8', name: '#BeatsSync', videoCount: 16400, engagementRate: 5.5, trendingRank: 8, icon: '🎼' },
];

export function TrendingHashtags({ onHashtagPress }: TrendingHashtagsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHashtags, setFilteredHashtags] = useState(TRENDING_HASHTAGS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredHashtags(TRENDING_HASHTAGS);
    } else {
      const filtered = TRENDING_HASHTAGS.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHashtags(filtered);
    }
  };

  const handleHashtagPress = (hashtag: Hashtag) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    onHashtagPress?.(hashtag.name);
  };

  const renderHashtagItem = ({ item }: { item: Hashtag }) => (
    <TouchableOpacity
      onPress={() => handleHashtagPress(item)}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Trending Badge */}
      <View
        style={{
          backgroundColor: '#FF1493',
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16 }}>{item.icon}</Text>
      </View>

      {/* Hashtag Info */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF1493' }}>
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Text style={{ fontSize: 12, color: '#999' }}>
            📹 {(item.videoCount / 1000).toFixed(1)}K videos
          </Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            🔥 {item.engagementRate.toFixed(1)}% engagement
          </Text>
        </View>
      </View>

      {/* Trending Rank */}
      <View
        style={{
          backgroundColor: '#FFD700',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#000' }}>
          #{item.trendingRank}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
      {/* Header */}
      <View style={{ marginBottom: 20, gap: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
          🔥 Trending Now
        </Text>
        <Text style={{ fontSize: 14, color: '#999' }}>
          Discover what creators are making
        </Text>
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
          marginBottom: 20,
          gap: 8,
        }}
      >
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search hashtags..."
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

      {/* Hashtags List */}
      <FlatList
        data={filteredHashtags}
        keyExtractor={(item) => item.id}
        renderItem={renderHashtagItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 16, color: '#999' }}>
              No hashtags found
            </Text>
          </View>
        }
      />
    </View>
  );
}
