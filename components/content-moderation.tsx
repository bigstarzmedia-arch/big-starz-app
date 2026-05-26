import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  status: 'approved' | 'flagged' | 'removed';
  reason?: string;
}

interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface ContentModerationProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Alex Rivera',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-1.jpg',
    content: 'This is fire! 🔥 Love the creativity!',
    timestamp: '2m ago',
    likes: 45,
    status: 'approved',
  },
  {
    id: '2',
    author: 'Jordan Smith',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-2.jpg',
    content: 'Check out my channel for similar content',
    timestamp: '5m ago',
    likes: 2,
    status: 'flagged',
    reason: 'Spam/Self-promotion',
  },
  {
    id: '3',
    author: 'Casey Lee',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/avatars/creator-3.jpg',
    content: 'Absolutely amazing work! 👏',
    timestamp: '8m ago',
    likes: 78,
    status: 'approved',
  },
  {
    id: '4',
    author: 'Anonymous User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'This is inappropriate content',
    timestamp: '12m ago',
    likes: 0,
    status: 'removed',
    reason: 'Offensive language',
  },
];

const MODERATION_RULES: ModerationRule[] = [
  {
    id: '1',
    name: 'Offensive Language',
    description: 'Automatically flag comments with profanity',
    enabled: true,
    severity: 'high',
  },
  {
    id: '2',
    name: 'Spam Detection',
    description: 'Flag repetitive or promotional content',
    enabled: true,
    severity: 'medium',
  },
  {
    id: '3',
    name: 'External Links',
    description: 'Flag comments with external URLs',
    enabled: true,
    severity: 'medium',
  },
  {
    id: '4',
    name: 'Harassment Detection',
    description: 'Flag potentially harassing comments',
    enabled: true,
    severity: 'high',
  },
];

export function ContentModeration({ visible, onClose }: ContentModerationProps) {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [rules, setRules] = useState(MODERATION_RULES);
  const [activeTab, setActiveTab] = useState<'comments' | 'rules'>('comments');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'removed'>('all');

  const handleApproveComment = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, status: 'approved', reason: undefined }
          : comment
      )
    );
  };

  const handleRemoveComment = (id: string, reason: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium as any);
    }
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, status: 'removed', reason }
          : comment
      )
    );
  };

  const handleToggleRule = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const filteredComments =
    filterStatus === 'all'
      ? comments
      : comments.filter((c) => c.status === filterStatus);

  const flaggedCount = comments.filter((c) => c.status === 'flagged').length;
  const removedCount = comments.filter((c) => c.status === 'removed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4ADE80';
      case 'flagged':
        return '#FFD700';
      case 'removed':
        return '#FF6B6B';
      default:
        return '#999';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD700';
      case 'low':
        return '#4ADE80';
      default:
        return '#999';
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: getStatusColor(item.status),
        gap: 8,
      }}
    >
      {/* Author Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
            {item.author}
          </Text>
          <Text style={{ fontSize: 10, color: '#666' }}>
            {item.timestamp}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: getStatusColor(item.status),
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: '600',
              color: item.status === 'flagged' ? '#000' : '#fff',
            }}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Comment Content */}
      <Text style={{ fontSize: 12, color: '#fff', lineHeight: 16 }}>
        {item.content}
      </Text>

      {/* Reason (if flagged/removed) */}
      {item.reason && (
        <View
          style={{
            backgroundColor: 'rgba(255,107,107,0.1)',
            borderRadius: 6,
            padding: 8,
            borderLeftWidth: 2,
            borderLeftColor: '#FF6B6B',
          }}
        >
          <Text style={{ fontSize: 10, color: '#FF6B6B', fontWeight: '600' }}>
            Reason: {item.reason}
          </Text>
        </View>
      )}

      {/* Actions */}
      {item.status === 'flagged' && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleApproveComment(item.id)}
            style={{
              flex: 1,
              backgroundColor: '#4ADE80',
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#000' }}>
              Approve
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveComment(item.id, 'Violates community guidelines')}
            style={{
              flex: 1,
              backgroundColor: '#FF6B6B',
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#fff' }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Likes */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="heart" size={14} color="#FF1493" />
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.likes} likes
        </Text>
      </View>
    </View>
  );

  const renderRuleItem = ({ item }: { item: ModerationRule }) => (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
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
          backgroundColor: getSeverityColor(item.severity),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="shield-checkmark"
          size={20}
          color={item.severity === 'medium' ? '#000' : '#fff'}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.description}
        </Text>
      </View>

      {/* Toggle */}
      <TouchableOpacity
        onPress={() => handleToggleRule(item.id)}
        style={{
          width: 50,
          height: 28,
          borderRadius: 14,
          backgroundColor: item.enabled ? '#FF1493' : '#333',
          justifyContent: 'center',
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#fff',
            marginLeft: item.enabled ? 24 : 2,
          }}
        />
      </TouchableOpacity>
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
              🛡️ Moderation
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveTab('comments')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'comments' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'comments' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'comments' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Comments
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
                  fontSize: 12,
                }}
              >
                Rules
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'comments' ? (
            <>
              {/* Filter Buttons */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setFilterStatus('all')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: filterStatus === 'all' ? '#FF1493' : '#1A1A1A',
                    borderWidth: 1,
                    borderColor: filterStatus === 'all' ? '#FF1493' : '#333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: filterStatus === 'all' ? '#fff' : '#999',
                    }}
                  >
                    All ({comments.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFilterStatus('flagged')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: filterStatus === 'flagged' ? '#FFD700' : '#1A1A1A',
                    borderWidth: 1,
                    borderColor: filterStatus === 'flagged' ? '#FFD700' : '#333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: filterStatus === 'flagged' ? '#000' : '#999',
                    }}
                  >
                    Flagged ({flaggedCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFilterStatus('removed')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: filterStatus === 'removed' ? '#FF6B6B' : '#1A1A1A',
                    borderWidth: 1,
                    borderColor: filterStatus === 'removed' ? '#FF6B6B' : '#333',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: filterStatus === 'removed' ? '#fff' : '#999',
                    }}
                  >
                    Removed ({removedCount})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              <FlatList
                data={filteredComments}
                keyExtractor={(item) => item.id}
                renderItem={renderCommentItem}
                scrollEnabled={false}
              />
            </>
          ) : (
            <FlatList
              data={rules}
              keyExtractor={(item) => item.id}
              renderItem={renderRuleItem}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
