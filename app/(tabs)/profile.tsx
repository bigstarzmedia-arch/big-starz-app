import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  views: number;
  likes: number;
}

const PROFILE = {
  name: '@YourCreator',
  avatar: '👤',
  bio: 'AI video creator | Music producer | Face clone enthusiast',
  followers: 2450,
  following: 342,
  totalViews: 125400,
  totalLikes: 8900,
  tier: 'Pro',
};

const VIDEOS: Video[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop',
    title: 'AI Music Video #1',
    views: 5200,
    likes: 420,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    title: 'Face Clone Test',
    views: 3100,
    likes: 280,
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=600&fit=crop',
    title: 'Beat Studio Creation',
    views: 8900,
    likes: 620,
  },
];

export default function ProfileScreen() {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center', gap: 12 }}>
          {/* Avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#1A1A1A',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#FF0055',
            }}
          >
            <Text style={{ fontSize: 40 }}>{PROFILE.avatar}</Text>
          </View>

          {/* Name & Bio */}
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>{PROFILE.name}</Text>
            <Text style={{ fontSize: 12, color: '#AAA', textAlign: 'center' }}>{PROFILE.bio}</Text>
          </View>

          {/* Tier Badge */}
          <View
            style={{
              backgroundColor: '#FF0055',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>{PROFILE.tier} Tier</Text>
          </View>

          {/* Follow Button */}
          <TouchableOpacity
            onPress={handleFollowToggle}
            style={{
              width: '100%',
              backgroundColor: isFollowing ? '#333' : '#FF0055',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#333',
          }}
        >
          <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>
              {(PROFILE.followers / 1000).toFixed(1)}K
            </Text>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Followers</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>
              {(PROFILE.totalViews / 1000).toFixed(0)}K
            </Text>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Views</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>
              {(PROFILE.totalLikes / 1000).toFixed(1)}K
            </Text>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Likes</Text>
          </View>
        </View>

        {/* Earnings Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12, borderBottomWidth: 1, borderColor: '#333' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Earnings</Text>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ fontSize: 12, color: '#AAA' }}>Total Earnings</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF0055', marginTop: 4 }}>$245.50</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF0055',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Portfolio</Text>
          <FlatList
            data={VIDEOS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#333',
                }}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width: '100%', height: 150 }}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, gap: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={{ fontSize: 10, color: '#AAA' }}>👁️ {(item.views / 1000).toFixed(1)}K</Text>
                    <Text style={{ fontSize: 10, color: '#AAA' }}>❤️ {(item.likes / 100).toFixed(0)}K</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
