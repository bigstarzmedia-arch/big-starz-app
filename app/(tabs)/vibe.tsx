import { View, Text, ScrollView, FlatList, Pressable, Image } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { GlobalHeader } from '@/components/global-header';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const FEATURED_ARTISTS = [
  { id: '1', name: 'NeonVex', avatar: '👾' },
  { id: '2', name: 'CosmicVibe', avatar: '🌌' },
  { id: '3', name: 'GlitchQueen', avatar: '✨' },
];

const FILTER_PILLS = ['All', 'Rap', 'R&B', 'Trending', 'New'];

const FEED_VIDEOS = [
  {
    id: '1',
    creator: '@NeonVex',
    title: 'AI-Generated Music Video',
    views: '124.5K',
    likes: '8.4K',
    comments: '342',
    saves: '1.2K',
  },
  {
    id: '2',
    creator: '@CosmicVibe',
    title: 'Cameo + Voice Clone Collab',
    views: '89.2K',
    likes: '6.1K',
    comments: '218',
    saves: '892',
  },
  {
    id: '3',
    creator: '@GlitchQueen',
    title: 'Luxury Fashion AI Remix',
    views: '156.8K',
    likes: '12.3K',
    comments: '567',
    saves: '2.1K',
  },
];

export default function VibeScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState('All');
  const [feedTab, setFeedTab] = useState<'following' | 'foryou'>('foryou');

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <GlobalHeader />

      {/* Feed Tab Toggle */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          gap: 24,
        }}
      >
        <Pressable onPress={() => setFeedTab('following')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: feedTab === 'following' ? '700' : '400',
              color: feedTab === 'following' ? colors.foreground : colors.muted,
            }}
          >
            Following
          </Text>
        </Pressable>
        <Pressable onPress={() => setFeedTab('foryou')}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: feedTab === 'foryou' ? '700' : '400',
              color: feedTab === 'foryou' ? colors.foreground : colors.muted,
            }}
          >
            For You
          </Text>
        </Pressable>
      </View>

      {/* Featured Artists Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
        contentContainerStyle={{ gap: 12 }}
      >
        {FEATURED_ARTISTS.map((artist) => (
          <Pressable
            key={artist.id}
            style={{
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 2,
                borderColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.surface,
              }}
            >
              <Text style={{ fontSize: 28 }}>{artist.avatar}</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '600' }}>
              {artist.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {FILTER_PILLS.map((pill) => (
          <Pressable
            key={pill}
            onPress={() => setActiveFilter(pill)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: activeFilter === pill ? colors.primary : colors.surface,
              borderWidth: activeFilter === pill ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: activeFilter === pill ? colors.background : colors.foreground,
              }}
            >
              {pill}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Video Feed */}
      <FlatList
        data={FEED_VIDEOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              height: 600,
              backgroundColor: colors.surface,
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 12,
              overflow: 'hidden',
              justifyContent: 'flex-end',
            }}
          >
            {/* Video Placeholder */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons name="play-circle" size={64} color={colors.primary} />
            </View>

            {/* Video Info Overlay */}
            <View
              style={{
                padding: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground, fontWeight: '600' }}>
                {item.creator}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
                {item.views} views
              </Text>
            </View>

            {/* Right Action Bar */}
            <View
              style={{
                position: 'absolute',
                right: 12,
                bottom: 80,
                gap: 16,
              }}
            >
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  alignItems: 'center',
                  gap: 4,
                })}
              >
                <MaterialIcons name="favorite" size={28} color={colors.primary} />
                <Text style={{ fontSize: 11, color: colors.foreground }}>{item.likes}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  alignItems: 'center',
                  gap: 4,
                })}
              >
                <MaterialIcons name="chat-bubble" size={28} color={colors.foreground} />
                <Text style={{ fontSize: 11, color: colors.foreground }}>{item.comments}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  alignItems: 'center',
                  gap: 4,
                })}
              >
                <MaterialIcons name="bookmark" size={28} color={colors.foreground} />
                <Text style={{ fontSize: 11, color: colors.foreground }}>{item.saves}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  alignItems: 'center',
                  gap: 4,
                })}
              >
                <MaterialIcons name="card-giftcard" size={28} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScreenContainer>
  );
}
