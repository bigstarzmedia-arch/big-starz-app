import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { GlobalHeader } from '@/components/global-header';
import { MaterialIcons } from '@expo/vector-icons';

const TRANSACTIONS = [
  { id: '1', type: 'earning', description: 'Cameo Video Sale', amount: '+$150', timestamp: '2h ago' },
  { id: '2', type: 'earning', description: 'Music Collab Fee', amount: '+$75', timestamp: '5h ago' },
  { id: '3', type: 'earning', description: 'Casting Gig', amount: '+$200', timestamp: '1d ago' },
  { id: '4', type: 'payout', description: 'Stripe Payout', amount: '-$300', timestamp: '3d ago' },
];

export default function WalletScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <GlobalHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Balance Card */}
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            borderWidth: 2,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
            Available Balance
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: colors.primary, marginBottom: 16 }}>
            $1,425.00
          </Text>

          {/* Elite Status */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignSelf: 'flex-start',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.accent3,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.accent3, fontWeight: '700' }}>
              ⭐ ELITE STATUS
            </Text>
          </View>

          {/* Cash Out Button */}
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.background }}>
              Cash Out
            </Text>
          </Pressable>
        </View>

        {/* Earnings Breakdown */}
        <View style={{ paddingHorizontal: 16, marginVertical: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
            Earnings Breakdown
          </Text>

          <View style={{ gap: 8 }}>
            {[
              { label: 'Cameo Videos', amount: '$450', icon: 'videocam' },
              { label: 'Music Collabs', amount: '$525', icon: 'music-note' },
              { label: 'Casting Gigs', amount: '$350', icon: 'people' },
              { label: 'Gifts Received', amount: '$100', icon: 'card-giftcard' },
            ].map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '600' }}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
                  {item.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscriber Progress */}
        <View style={{ paddingHorizontal: 16, marginVertical: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
            Subscriber Milestone
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Progress to Elite
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                8,450 / 10,000
              </Text>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                height: 8,
                backgroundColor: colors.background,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: '84.5%',
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                }}
              />
            </View>

            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>
              1,550 subscribers until Elite unlock 🎯
            </Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={{ paddingHorizontal: 16, marginVertical: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
            Transaction History
          </Text>

          <FlatList
            data={TRANSACTIONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons
                    name={item.type === 'earning' ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={item.type === 'earning' ? '#00FF00' : colors.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '600' }}>
                    {item.description}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                    {item.timestamp}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: item.type === 'earning' ? '#00FF00' : colors.primary,
                  }}
                >
                  {item.amount}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
