import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface AffiliateStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayout: number;
  totalClicks: number;
  conversionRate: number;
  eliteStatus: boolean;
  subscriberCount: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'sale' | 'payout' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  castMemberId?: string;
}

export function AffiliateDashboard() {
  const colors = useColors();
  const [stats, setStats] = useState<AffiliateStats>({
    totalEarnings: 12450.50,
    monthlyEarnings: 2850.25,
    pendingPayout: 1200.00,
    totalClicks: 45230,
    conversionRate: 8.5,
    eliteStatus: false,
    subscriberCount: 850,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_1',
      date: '2026-05-30',
      amount: 250.00,
      type: 'sale',
      status: 'completed',
      merchant: 'Saks Fifth Avenue',
      castMemberId: 'cast_123',
    },
    {
      id: 'txn_2',
      date: '2026-05-29',
      amount: 180.50,
      type: 'sale',
      status: 'completed',
      merchant: 'Gucci',
      castMemberId: 'cast_456',
    },
    {
      id: 'txn_3',
      date: '2026-05-28',
      amount: 500.00,
      type: 'payout',
      status: 'pending',
    },
  ]);

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (stats.pendingPayout < 100) {
      Alert.alert('Minimum Payout', 'Minimum payout amount is $100');
      return;
    }

    setIsWithdrawing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', `Withdrawal of $${stats.pendingPayout.toFixed(2)} initiated!`);
      setStats((prev) => ({
        ...prev,
        pendingPayout: 0,
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };



  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, gap: 16 }}>
        {/* Header */}
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
            Affiliate Dashboard
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            Track your earnings and commissions
          </Text>
        </View>

        {/* Elite Status Banner */}
        {stats.eliteStatus ? (
          <View
            style={{
              backgroundColor: '#FFD700',
              borderRadius: 12,
              padding: 12,
              borderWidth: 2,
              borderColor: '#FF1493',
            }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
              ⭐ Elite Creator Status
            </Text>
            <Text style={{ color: '#333', fontSize: 12 }}>
              You've unlocked elite benefits! Higher commission rates and priority support.
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 12, marginBottom: 4 }}>
              🎯 Reach Elite Status
            </Text>
            <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 8 }}>
              Earn $5,000 to unlock elite benefits
            </Text>
            <View style={{ backgroundColor: colors.border, height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${(stats.totalEarnings / 5000) * 100}%`,
                  backgroundColor: '#FF1493',
                }}
              />
            </View>
            <Text style={{ color: colors.muted, fontSize: 10, marginTop: 4 }}>
              ${stats.totalEarnings.toFixed(2)} / $5,000.00
            </Text>
          </View>
        )}

        {/* Earnings Summary Cards */}
        <View style={{ gap: 12 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 4 }}>Total Earnings</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FF1493' }}>
              ${stats.totalEarnings.toFixed(2)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>This Month</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.foreground }}>
                ${stats.monthlyEarnings.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Pending</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFD700' }}>
                ${stats.pendingPayout.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Withdrawal Button */}
        <TouchableOpacity
          onPress={handleWithdraw}
          disabled={isWithdrawing || stats.pendingPayout < 100}
          style={{
            backgroundColor: stats.pendingPayout >= 100 ? '#FF1493' : colors.border,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            opacity: isWithdrawing || stats.pendingPayout < 100 ? 0.6 : 1,
          }}
        >
          {isWithdrawing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
              💰 Withdraw ${stats.pendingPayout.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>

        {/* Performance Metrics */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
            Performance Metrics
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Total Clicks</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
                {stats.totalClicks.toLocaleString()}
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: colors.border }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Conversion Rate</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#22C55E' }}>
                {stats.conversionRate.toFixed(1)}%
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: colors.border }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Subscribers</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
                {stats.subscriberCount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
            Monthly Earnings Trend
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, idx) => (
              <View key={week}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{week}</Text>
                  <Text style={{ color: '#FF1493', fontWeight: 'bold', fontSize: 11 }}>${[500, 750, 1200, 850][idx]}</Text>
                </View>
                <View style={{ backgroundColor: colors.border, height: 6, borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${([500, 750, 1200, 850][idx] / 1200) * 100}%`,
                      backgroundColor: '#FF1493',
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
            Recent Transactions
          </Text>

          {transactions.map((txn) => (
            <View
              key={txn.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 12, marginBottom: 2 }}>
                  {txn.type === 'sale' ? '🛍️ Sale' : txn.type === 'payout' ? '💰 Payout' : '↩️ Refund'}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11 }}>
                  {txn.merchant || txn.date}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: txn.type === 'refund' ? '#EF4444' : '#22C55E',
                    marginBottom: 2,
                  }}
                >
                  {txn.type === 'refund' ? '-' : '+'}${txn.amount.toFixed(2)}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: txn.status === 'completed' ? '#22C55E' : txn.status === 'pending' ? '#F59E0B' : '#EF4444',
                  }}
                >
                  {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
