import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  description: string;
  amount: number;
  timestamp: Date;
}

const WALLET = {
  balance: 245.50,
  monthlyEarnings: 125.75,
  totalEarnings: 1240.30,
  tier: 'Pro',
};

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    description: 'Video views - "AI Music Video #1"',
    amount: 45.20,
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    type: 'spend',
    description: 'Pro Tier Subscription',
    amount: -30.00,
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    type: 'earn',
    description: 'Creator collaboration bonus',
    amount: 25.00,
    timestamp: new Date(Date.now() - 259200000),
  },
  {
    id: '4',
    type: 'earn',
    description: 'Video likes - "Face Clone Test"',
    amount: 15.55,
    timestamp: new Date(Date.now() - 345600000),
  },
];

export default function WalletScreen() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleWithdraw = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowWithdrawModal(true);
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
            <Text>WALLET</Text>
          </Text>
        </View>

        {/* Balance Card */}
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 16,
            backgroundColor: '#1A1A1A',
            borderRadius: 16,
            padding: 20,
            gap: 12,
            borderWidth: 2,
            borderColor: '#FF0055',
          }}
        >
          <Text style={{ fontSize: 12, color: '#AAA', opacity: 0.8 }}>Available Balance</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FF0055' }}>
            ${WALLET.balance.toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleWithdraw}
              style={{
                flex: 1,
                backgroundColor: '#FF0055',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#333',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            gap: 12,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 12,
              gap: 8,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Text style={{ fontSize: 10, color: '#AAA' }}>This Month</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>
              ${WALLET.monthlyEarnings.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#1A1A1A',
              borderRadius: 12,
              padding: 12,
              gap: 8,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Text style={{ fontSize: 10, color: '#AAA' }}>Total Earned</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF0055' }}>
              ${WALLET.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Tier Info */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: '#333',
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#AAA' }}>Current Tier</Text>
            <View
              style={{
                backgroundColor: '#FF0055',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 10 }}>{WALLET.tier}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#AAA' }}>
            50 generations/month • Priority processing • Advanced analytics
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 8,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#FF0055',
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FF0055', fontWeight: 'bold', fontSize: 12 }}>Upgrade to Elite</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Recent Transactions</Text>
          <FlatList
            data={TRANSACTIONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#333',
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>
                    {item.description}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#AAA' }}>
                    {item.timestamp.toLocaleDateString()} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: item.type === 'earn' ? '#00FF00' : '#FF0055',
                  }}
                >
                  {item.type === 'earn' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
