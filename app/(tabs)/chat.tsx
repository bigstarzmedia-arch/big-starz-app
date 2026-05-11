import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { GlobalHeader } from '@/components/global-header';
import { MaterialIcons } from '@expo/vector-icons';

const ONLINE_NOW = [
  { id: '1', name: 'NeonVex', avatar: '👾', online: true },
  { id: '2', name: 'SkyLuxe', avatar: '☁️', online: true },
  { id: '3', name: 'GlitchQueen', avatar: '✨', online: true },
  { id: '4', name: 'CosmicVibe', avatar: '🌌', online: false },
];

const MESSAGES = [
  {
    id: '1',
    name: 'NeonVex',
    message: "Yo, let's collab on that track!",
    timestamp: '2m ago',
    avatar: '👾',
    unread: true,
  },
  {
    id: '2',
    name: 'SkyLuxe',
    message: 'The remix is fire 🔥',
    timestamp: '5m ago',
    avatar: '☁️',
    unread: false,
  },
  {
    id: '3',
    name: 'GlitchQueen',
    message: 'Check out my new AI twin 👀',
    timestamp: '12m ago',
    avatar: '✨',
    unread: true,
  },
  {
    id: '4',
    name: 'CosmicVibe',
    message: 'Want to go live together?',
    timestamp: '1h ago',
    avatar: '🌌',
    unread: false,
  },
];

export default function ChatScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <GlobalHeader />

      {/* Online Now Section */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
          Online Now
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {ONLINE_NOW.map((user) => (
            <Pressable
              key={user.id}
              style={({ pressed }) => ({
                alignItems: 'center',
                gap: 8,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ position: 'relative' }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: user.online ? colors.accent1 : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
                </View>
                {user.online && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#00FF00',
                      borderWidth: 2,
                      borderColor: colors.background,
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 11, color: colors.foreground, fontWeight: '600', maxWidth: 60, textAlign: 'center' }}>
                {user.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Global Chat List */}
      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: item.unread ? 'rgba(255, 0, 85, 0.05)' : colors.background,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {/* Avatar */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                borderWidth: item.unread ? 2 : 0,
                borderColor: colors.primary,
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
            </View>

            {/* Message Content */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: item.unread ? '700' : '600',
                    color: colors.foreground,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.muted,
                  }}
                >
                  {item.timestamp}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                }}
                numberOfLines={1}
              >
                {item.message}
              </Text>
            </View>

            {/* Unread Indicator */}
            {item.unread && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: colors.primary,
                  marginLeft: 12,
                }}
              />
            )}
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScreenContainer>
  );
}
