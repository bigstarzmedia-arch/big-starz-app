import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export interface CollaborationRequest {
  id: string;
  creatorName: string;
  creatorHandle: string;
  projectTitle: string;
  role: 'vocalist' | 'producer' | 'dancer' | 'editor' | 'other';
  description: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  avatar?: string;
}

interface CollaborationInvitesProps {
  invites: CollaborationRequest[];
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
  onSendInvite: (creatorHandle: string, role: string, description: string) => void;
}

export function CollaborationInvites({
  invites,
  onAccept,
  onDecline,
  onSendInvite,
}: CollaborationInvitesProps) {
  const colors = useColors();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('vocalist');
  const [description, setDescription] = useState('');

  const roles = [
    { id: 'vocalist', name: '🎤 Vocalist', icon: '🎤' },
    { id: 'producer', name: '🎛️ Producer', icon: '🎛️' },
    { id: 'dancer', name: '💃 Dancer', icon: '💃' },
    { id: 'editor', name: '✂️ Editor', icon: '✂️' },
    { id: 'other', name: '⭐ Other', icon: '⭐' },
  ];

  const handleAccept = async (inviteId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onAccept(inviteId);
  };

  const handleDecline = async (inviteId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    onDecline(inviteId);
  };

  const handleSendInvite = async () => {
    if (!selectedCreator.trim()) {
      Alert.alert('Error', 'Please enter a creator handle');
      return;
    }

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSendInvite(selectedCreator, selectedRole, description);
    setSelectedCreator('');
    setSelectedRole('vocalist');
    setDescription('');
    setSendModalVisible(false);
    Alert.alert('Success', 'Collaboration invite sent!');
  };

  const pendingInvites = invites.filter((i) => i.status === 'pending');
  const acceptedInvites = invites.filter((i) => i.status === 'accepted');

  return (
    <View className="flex-1">
      {/* Send Invite Button */}
      <Pressable
        onPress={() => setSendModalVisible(true)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 16,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text className="text-center font-bold text-background">+ Send Collaboration Invite</Text>
      </Pressable>

      {/* Send Invite Modal */}
      <Modal visible={sendModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">Send Collaboration Invite</Text>

            {/* Creator Handle Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Creator Handle</Text>
              <TextInput
                placeholder="@creatorhandle"
                value={selectedCreator}
                onChangeText={setSelectedCreator}
                className="bg-background border border-border rounded-lg p-3 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Role Selection */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Role</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {roles.map((role) => (
                  <Pressable
                    key={role.id}
                    onPress={() => setSelectedRole(role.id)}
                    style={({pressed}) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          selectedRole === role.id ? colors.primary : colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedRole === role.id ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {role.icon} {role.name.split(' ')[1]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Description Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Message (Optional)</Text>
              <TextInput
                placeholder="Tell them about your project..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="bg-background border border-border rounded-lg p-3 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setSendModalVisible(false)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSendInvite}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-center font-semibold text-background">Send Invite</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Pending Invites ({pendingInvites.length})</Text>
          <ScrollView showsVerticalScrollIndicator={false} className="gap-3">
            {pendingInvites.map((invite) => (
              <View
                key={invite.id}
                className="bg-background border border-border rounded-lg p-4 gap-3"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-foreground">{invite.creatorName}</Text>
                    <Text className="text-xs text-muted">{invite.creatorHandle}</Text>
                    <Text className="text-sm text-foreground mt-2">{invite.projectTitle}</Text>
                    <Text className="text-xs text-muted mt-1">Role: {invite.role}</Text>
                  </View>
                  <Text className="text-2xl">{roles.find((r) => r.id === invite.role)?.icon}</Text>
                </View>

                {invite.description && (
                  <Text className="text-sm text-muted italic">"{invite.description}"</Text>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleAccept(invite.id)}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: '#22c55e',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-center font-semibold text-white">✓ Accept</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDecline(invite.id)}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: '#ef4444',
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-center font-semibold text-white">✕ Decline</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Accepted Collaborations */}
      {acceptedInvites.length > 0 && (
        <View>
          <Text className="text-lg font-bold text-foreground mb-3">Active Collaborations ({acceptedInvites.length})</Text>
          <ScrollView showsVerticalScrollIndicator={false} className="gap-3">
            {acceptedInvites.map((invite) => (
              <View
                key={invite.id}
                className="bg-primary/10 border border-primary rounded-lg p-4 gap-2"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-bold text-foreground">{invite.creatorName}</Text>
                    <Text className="text-xs text-muted">{invite.creatorHandle}</Text>
                    <Text className="text-sm text-foreground mt-2">{invite.projectTitle}</Text>
                  </View>
                  <Text className="text-2xl">✓</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Empty State */}
      {invites.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-4xl mb-4">🤝</Text>
          <Text className="text-lg font-bold text-foreground">No Collaborations Yet</Text>
          <Text className="text-sm text-muted text-center mt-2">
            Send invites to creators to start collaborating on projects
          </Text>
        </View>
      )}
    </View>
  );
}
