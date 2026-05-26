import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Reward {
  id: string;
  type: 'daily' | 'referral' | 'milestone';
  title: string;
  description: string;
  points: number;
  icon: string;
  claimed: boolean;
  claimedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: string;
  isUnlocked: boolean;
}

interface RewardsSystemProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_REWARDS: Reward[] = [
  {
    id: '1',
    type: 'daily',
    title: 'Daily Login Bonus',
    description: 'Log in today to claim 10 points',
    points: 10,
    icon: '📅',
    claimed: false,
  },
  {
    id: '2',
    type: 'daily',
    title: 'Day 7 Streak',
    description: 'Log in 7 days in a row',
    points: 50,
    icon: '🔥',
    claimed: true,
    claimedDate: 'May 20',
    progress: 7,
    maxProgress: 7,
  },
  {
    id: '3',
    type: 'referral',
    title: 'Invite Friends',
    description: 'Earn 25 points per friend who joins',
    points: 25,
    icon: '👥',
    claimed: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: '4',
    type: 'milestone',
    title: '100 Followers',
    description: 'Reach 100 followers',
    points: 100,
    icon: '⭐',
    claimed: true,
    claimedDate: 'May 15',
  },
  {
    id: '5',
    type: 'milestone',
    title: '1K Video Views',
    description: 'Get 1,000 total views',
    points: 50,
    icon: '👁️',
    claimed: true,
    claimedDate: 'May 18',
  },
  {
    id: '6',
    type: 'milestone',
    title: '10K Video Views',
    description: 'Get 10,000 total views',
    points: 200,
    icon: '🎯',
    claimed: false,
    progress: 7500,
    maxProgress: 10000,
  },
];

const MOCK_BADGES: Badge[] = [
  {
    id: '1',
    name: 'Creator',
    description: 'Posted your first video',
    icon: '🎬',
    isUnlocked: true,
    unlockedDate: 'May 1',
  },
  {
    id: '2',
    name: 'Influencer',
    description: 'Reached 100 followers',
    icon: '⭐',
    isUnlocked: true,
    unlockedDate: 'May 15',
  },
  {
    id: '3',
    name: 'Viral',
    description: 'Got 1,000 likes on a video',
    icon: '🚀',
    isUnlocked: false,
  },
  {
    id: '4',
    name: 'Collaborator',
    description: 'Completed 5 duets',
    icon: '🤝',
    isUnlocked: false,
  },
];

export function RewardsSystem({ visible, onClose }: RewardsSystemProps) {
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [totalPoints, setTotalPoints] = useState(210);
  const [activeTab, setActiveTab] = useState<'rewards' | 'badges'>('rewards');

  const handleClaimReward = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === id
          ? {
              ...reward,
              claimed: true,
              claimedDate: 'Today',
            }
          : reward
      )
    );
    const reward = rewards.find((r) => r.id === id);
    if (reward) {
      setTotalPoints((prev) => prev + reward.points);
    }
  };

  const renderRewardItem = ({ item }: { item: Reward }) => (
    <View
      style={{
        backgroundColor: item.claimed ? '#1A1A1A' : '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: item.claimed ? '#333' : '#FF1493',
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        {/* Icon */}
        <Text style={{ fontSize: 32 }}>{item.icon}</Text>

        {/* Content */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 11, color: '#999' }}>
            {item.description}
          </Text>

          {/* Progress Bar */}
          {item.progress !== undefined && item.maxProgress !== undefined && (
            <View style={{ gap: 4, marginTop: 4 }}>
              <View
                style={{
                  height: 6,
                  backgroundColor: '#333',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${(item.progress / item.maxProgress) * 100}%`,
                    backgroundColor: '#FF1493',
                  }}
                />
              </View>
              <Text style={{ fontSize: 10, color: '#666' }}>
                {item.progress} / {item.maxProgress}
              </Text>
            </View>
          )}
        </View>

        {/* Points or Claim Button */}
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFD700' }}>
            +{item.points}
          </Text>
          {item.claimed ? (
            <Text style={{ fontSize: 10, color: '#666' }}>
              {item.claimedDate}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() => handleClaimReward(item.id)}
              style={{
                backgroundColor: '#FF1493',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
                Claim
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderBadgeItem = ({ item }: { item: Badge }) => (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 16,
        opacity: item.isUnlocked ? 1 : 0.5,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: item.isUnlocked ? '#FF1493' : '#333',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
          borderWidth: 2,
          borderColor: item.isUnlocked ? '#FFD700' : '#666',
        }}
      >
        <Text style={{ fontSize: 40 }}>{item.icon}</Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center' }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 }}>
        {item.description}
      </Text>
      {item.isUnlocked && (
        <Text style={{ fontSize: 9, color: '#FFD700', marginTop: 4 }}>
          Unlocked {item.unlockedDate}
        </Text>
      )}
    </View>
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
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              🎁 Rewards
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Points Card */}
          <View
            style={{
              backgroundColor: 'linear-gradient(135deg, #FF1493 0%, #FFD700 100%)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              Total Points
            </Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }}>
              {totalPoints}
            </Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              Redeem for exclusive perks
            </Text>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveTab('rewards')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'rewards' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'rewards' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'rewards' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Rewards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('badges')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'badges' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'badges' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'badges' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Badges
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'rewards' ? (
            <FlatList
              data={rewards}
              keyExtractor={(item) => item.id}
              renderItem={renderRewardItem}
              scrollEnabled={false}
            />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}
            >
              {MOCK_BADGES.map((badge) => (
                <View key={badge.id} style={{ width: '48%' }}>
                  {renderBadgeItem({ item: badge })}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
