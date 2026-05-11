import { View, Text, ScrollView, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { GlobalHeader } from '@/components/global-header';
import { MaterialIcons } from '@expo/vector-icons';

const ACTION_CARDS = [
  { id: '1', title: 'Photo to Video', subtitle: 'Powered by Sora AI', icon: 'image' },
  { id: '2', title: 'Go Live', subtitle: 'Stream to audience', icon: 'videocam' },
  { id: '3', title: 'Beat Studio', subtitle: 'Create music', icon: 'music-note' },
];

export default function StudioScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <GlobalHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Action Cards */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>
            Create
          </Text>

          {ACTION_CARDS.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.primary,
                }}
              >
                <MaterialIcons name={card.icon as any} size={28} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>
                  {card.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                  {card.subtitle}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* Cameo Scan Section */}
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 20,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>
            Cameo Scan
          </Text>

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <MaterialIcons name="cloud-upload" size={28} color={colors.background} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.background,
                marginTop: 8,
              }}
            >
              Upload Photo
            </Text>
          </Pressable>

          {/* Checkmarks */}
          <View style={{ gap: 12 }}>
            {[
              'Face clearly visible',
              'Good lighting',
              'Full body preferred',
            ].map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: colors.background,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons name="check" size={16} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 14, color: colors.foreground }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
