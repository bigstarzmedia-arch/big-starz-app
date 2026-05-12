import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

const TRANSACTIONS = [
  { id: '1', type: 'earning', description: 'Cameo Video Sale', amount: '+$150', timestamp: '2h ago' },
  { id: '2', type: 'earning', description: 'Music Collab Fee', amount: '+$75', timestamp: '5h ago' },
  { id: '3', type: 'earning', description: 'Casting Gig', amount: '+$200', timestamp: '1d ago' },
  { id: '4', type: 'payout', description: 'Stripe Payout', amount: '-$300', timestamp: '3d ago' },
];

export default function WalletScreen() {
  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>BIG</Text>
          <Text style={{ color: '#FF0055' }}>STARZ</Text>
        </Text>
        <Text style={{ fontSize: 14, color: '#CCC', marginTop: 4 }}>Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 100 }}>
        {/* Balance Card */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ fontSize: 12, color: '#CCC', marginBottom: 8 }}>Total Balance</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#FF0055', marginBottom: 16 }}>$2,450</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF0055',
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>Cash Out</Text>
          </TouchableOpacity>
        </View>

        {/* Elite Status */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>Elite Status</Text>
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#CCC' }}>$2,450 / $5,000</Text>
              <Text style={{ fontSize: 12, color: '#FF0055', fontWeight: 'bold' }}>49%</Text>
            </View>
            <View style={{ height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ height: 8, backgroundColor: '#FF0055', width: '49%' }} />
            </View>
          </View>
          <Text style={{ fontSize: 11, color: '#CCC' }}>Reach $5,000 to unlock Elite Creator status</Text>
        </View>

        {/* Recent Transactions */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>Recent Earnings</Text>
          {[
            { type: 'Video View', amount: '+$45', time: '2h ago' },
            { type: 'Gift Received', amount: '+$120', time: '5h ago' },
            { type: 'Casting Offer', amount: '+$300', time: '1d ago' },
          ].map((tx, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: idx < 2 ? 1 : 0, borderBottomColor: '#333' }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>{tx.type}</Text>
                <Text style={{ fontSize: 10, color: '#CCC', marginTop: 4 }}>{tx.time}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#00FF00' }}>{tx.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
