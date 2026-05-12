import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

const ONLINE_NOW = [
  { id: '1', name: 'NeonVex', avatar: '👾', online: true },
  { id: '2', name: 'SkyLuxe', avatar: '☁️', online: true },
  { id: '3', name: 'GlitchQueen', avatar: '✨', online: true },
];

const MESSAGES = [
  { id: '1', name: 'NeonVex', message: "Yo, let's collab on that track!", timestamp: '2m ago', avatar: '👾', unread: true },
  { id: '2', name: 'SkyLuxe', message: 'The remix is fire 🔥', timestamp: '5m ago', avatar: '☁️', unread: false },
  { id: '3', name: 'GlitchQueen', message: 'Check out my new AI twin 👀', timestamp: '12m ago', avatar: '✨', unread: true },
];

export default function ChatScreen() {
  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>BIG</Text>
          <Text style={{ color: '#FF0055' }}>STARZ</Text>
        </Text>
        <Text style={{ color: '#CCC', fontSize: 14, marginTop: 4 }}>Global Chat</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Online Now */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#333' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>Online Now</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {ONLINE_NOW.map((user) => (
              <TouchableOpacity key={user.id} style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#1A1A1A',
                    borderWidth: 2,
                    borderColor: '#FF0055',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
                  {user.online && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: '#00FF00',
                        borderWidth: 2,
                        borderColor: '#000',
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontSize: 10, color: '#CCC', marginTop: 6, textAlign: 'center' }}>
                  {user.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message List */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>Messages</Text>
          {MESSAGES.map((msg) => (
            <TouchableOpacity
              key={msg.id}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#333',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FF0055' }}>@{msg.name}</Text>
                <Text style={{ fontSize: 10, color: '#CCC' }}>{msg.timestamp}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#CCC', marginTop: 8 }}>{msg.message}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
