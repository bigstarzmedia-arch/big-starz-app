import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, FlatList, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface FlaggedContent {
  id: string;
  type: 'video' | 'comment' | 'user';
  title: string;
  creator: string;
  reason: string;
  reportCount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  icon: string;
}

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalVideos: number;
  flaggedContent: number;
  avgEngagementRate: number;
  platformHealth: number;
}

interface AdminDashboardProps {
  visible: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const MOCK_FLAGGED_CONTENT: FlaggedContent[] = [
  {
    id: '1',
    type: 'video',
    title: 'Inappropriate Content Video',
    creator: '@SuspiciousUser',
    reason: 'Explicit content',
    reportCount: 15,
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: '🚫',
  },
  {
    id: '2',
    type: 'comment',
    title: 'Hate speech in comments',
    creator: '@ToxicUser',
    reason: 'Hate speech',
    reportCount: 8,
    status: 'pending',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: '💬',
  },
  {
    id: '3',
    type: 'user',
    title: 'Spam Bot Account',
    creator: '@SpamBot123',
    reason: 'Spam activity',
    reportCount: 22,
    status: 'pending',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: '👤',
  },
  {
    id: '4',
    type: 'video',
    title: 'Copyright Violation',
    creator: '@CopyPaster',
    reason: 'Copyright infringement',
    reportCount: 5,
    status: 'approved',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: '⚖️',
  },
];

const MOCK_PLATFORM_STATS: PlatformStats = {
  totalUsers: 245000,
  activeUsers: 89000,
  totalVideos: 1200000,
  flaggedContent: 342,
  avgEngagementRate: 8.5,
  platformHealth: 94,
};

export function AdminDashboard({ visible, onClose, isAdmin = true }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'flagged' | 'rules'>('overview');
  const [flaggedContent, setFlaggedContent] = useState(MOCK_FLAGGED_CONTENT);
  const [autoModeration, setAutoModeration] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  const handleApproveContent = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    setFlaggedContent((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleRejectContent = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning as any);
    }
    setFlaggedContent((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  const renderFlaggedItem = ({ item }: { item: FlaggedContent }) => (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: item.status === 'pending' ? '#FFD700' : item.status === 'approved' ? '#FF1493' : '#666',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
        <Text style={{ fontSize: 24 }}>{item.icon}</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            by {item.creator} • {item.reason}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <View
              style={{
                backgroundColor: '#FF1493',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: '600', color: '#fff' }}>
                {item.reportCount} reports
              </Text>
            </View>
            <View
              style={{
                backgroundColor: item.status === 'pending' ? '#FFD700' : item.status === 'approved' ? '#4ADE80' : '#FF6B6B',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: '600',
                  color: item.status === 'pending' ? '#000' : '#fff',
                }}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleApproveContent(item.id)}
            style={{
              flex: 1,
              backgroundColor: '#4ADE80',
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#000' }}>
              ✓ Approve
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRejectContent(item.id)}
            style={{
              flex: 1,
              backgroundColor: '#FF6B6B',
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#fff' }}>
              ✕ Reject
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!isAdmin) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ gap: 16, alignItems: 'center' }}>
            <Ionicons name="lock-closed" size={48} color="#FF1493" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
              Admin Access Required
            </Text>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
              Only platform administrators can access the moderation dashboard.
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: '#FF1493',
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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
              🛡️ Admin Dashboard
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveTab('overview')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'overview' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'overview' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'overview' ? '#fff' : '#999',
                  fontSize: 11,
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('flagged')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'flagged' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'flagged' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'flagged' ? '#fff' : '#999',
                  fontSize: 11,
                }}
              >
                Flagged ({flaggedContent.filter((f) => f.status === 'pending').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('rules')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'rules' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'rules' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'rules' ? '#fff' : '#999',
                  fontSize: 11,
                }}
              >
                Rules
              </Text>
            </TouchableOpacity>
          </View>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <View style={{ gap: 12, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      gap: 4,
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#999' }}>Total Users</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF1493' }}>
                      {MOCK_PLATFORM_STATS.totalUsers.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      gap: 4,
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#999' }}>Active Today</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4ADE80' }}>
                      {MOCK_PLATFORM_STATS.activeUsers.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      gap: 4,
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#999' }}>Total Videos</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFD700' }}>
                      {(MOCK_PLATFORM_STATS.totalVideos / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#1A1A1A',
                      borderRadius: 12,
                      padding: 12,
                      gap: 4,
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#999' }}>Flagged</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF6B6B' }}>
                      {MOCK_PLATFORM_STATS.flaggedContent}
                    </Text>
                  </View>
                </View>

                {/* Platform Health */}
                <View
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 12,
                    gap: 8,
                    borderWidth: 1,
                    borderColor: '#333',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                      Platform Health
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: MOCK_PLATFORM_STATS.platformHealth > 80 ? '#4ADE80' : '#FFD700',
                      }}
                    >
                      {MOCK_PLATFORM_STATS.platformHealth}%
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${MOCK_PLATFORM_STATS.platformHealth}%`,
                        backgroundColor: MOCK_PLATFORM_STATS.platformHealth > 80 ? '#4ADE80' : '#FFD700',
                      }}
                    />
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Flagged Tab */}
          {activeTab === 'flagged' && (
            <FlatList
              data={flaggedContent}
              keyExtractor={(item) => item.id}
              renderItem={renderFlaggedItem}
              scrollEnabled={false}
            />
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <View style={{ gap: 12 }}>
              <View
                style={{
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  padding: 12,
                  gap: 8,
                  borderWidth: 1,
                  borderColor: '#333',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                    Auto-Moderation
                  </Text>
                  <Switch
                    value={autoModeration}
                    onValueChange={setAutoModeration}
                    trackColor={{ false: '#333', true: '#FF1493' }}
                    thumbColor={autoModeration ? '#fff' : '#999'}
                  />
                </View>
                <Text style={{ fontSize: 10, color: '#999' }}>
                  Automatically flag and remove violating content
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  padding: 12,
                  gap: 8,
                  borderWidth: 1,
                  borderColor: '#333',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                    Strict Mode
                  </Text>
                  <Switch
                    value={strictMode}
                    onValueChange={setStrictMode}
                    trackColor={{ false: '#333', true: '#FF1493' }}
                    thumbColor={strictMode ? '#fff' : '#999'}
                  />
                </View>
                <Text style={{ fontSize: 10, color: '#999' }}>
                  Apply stricter content guidelines
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: 'rgba(255,107,107,0.1)',
                  borderRadius: 12,
                  padding: 12,
                  gap: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: '#FF6B6B',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF6B6B' }}>
                  Community Guidelines
                </Text>
                <Text style={{ fontSize: 10, color: '#999' }}>
                  • No hate speech or discrimination{'\n'}
                  • No explicit sexual content{'\n'}
                  • No violence or dangerous behavior{'\n'}
                  • No spam or misleading information{'\n'}
                  • Respect copyright and intellectual property
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
