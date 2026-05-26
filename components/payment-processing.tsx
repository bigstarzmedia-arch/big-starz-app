import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Transaction {
  id: string;
  type: 'payout' | 'subscription' | 'purchase' | 'refund';
  title: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface PaymentProcessingProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'payout',
    title: 'Creator Payout',
    description: 'Monthly earnings payout',
    amount: 1250.50,
    currency: 'USD',
    date: 'May 25, 2026',
    status: 'completed',
    icon: '💰',
  },
  {
    id: '2',
    type: 'subscription',
    title: 'Pro Subscription',
    description: 'Monthly subscription renewal',
    amount: 9.99,
    currency: 'USD',
    date: 'May 24, 2026',
    status: 'completed',
    icon: '📦',
  },
  {
    id: '3',
    type: 'purchase',
    title: 'Sound Library Pack',
    description: 'Premium sounds purchase',
    amount: 19.99,
    currency: 'USD',
    date: 'May 20, 2026',
    status: 'completed',
    icon: '🎵',
  },
  {
    id: '4',
    type: 'refund',
    title: 'Refund',
    description: 'Refund for cancelled subscription',
    amount: -9.99,
    currency: 'USD',
    date: 'May 15, 2026',
    status: 'completed',
    icon: '↩️',
  },
  {
    id: '5',
    type: 'payout',
    title: 'Creator Payout',
    description: 'Pending payout',
    amount: 850.00,
    currency: 'USD',
    date: 'May 30, 2026 (Estimated)',
    status: 'pending',
    icon: '⏳',
  },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'bank',
    name: 'Bank Account',
    last4: '6789',
    isDefault: false,
  },
];

export function PaymentProcessing({ visible, onClose }: PaymentProcessingProps) {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [activeTab, setActiveTab] = useState<'transactions' | 'methods' | 'upgrade'>('transactions');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'elite'>('pro');

  const handleSetDefaultPayment = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
    }
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleUpgradePlan = (plan: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success as any);
    }
    setSelectedPlan(plan as 'free' | 'pro' | 'elite');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4ADE80';
      case 'pending':
        return '#FFD700';
      case 'failed':
        return '#FF6B6B';
      default:
        return '#999';
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderLeftWidth: 3,
        borderLeftColor: getStatusColor(item.status),
      }}
    >
      {/* Icon */}
      <Text style={{ fontSize: 28 }}>{item.icon}</Text>

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.description}
        </Text>
        <Text style={{ fontSize: 9, color: '#666' }}>
          {item.date}
        </Text>
      </View>

      {/* Amount */}
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: item.amount < 0 ? '#FF6B6B' : '#4ADE80',
          }}
        >
          {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
        </Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            backgroundColor: getStatusColor(item.status),
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
  );

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      onPress={() => handleSetDefaultPayment(item.id)}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: item.isDefault ? '#FF1493' : '#333',
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
          borderRadius: 8,
          backgroundColor: '#FF1493',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name={item.type === 'card' ? 'card' : 'wallet'}
          size={20}
          color="#fff"
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
            {item.name} •••• {item.last4}
          </Text>
          {item.isDefault && (
            <View
              style={{
                backgroundColor: '#FF1493',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: '600', color: '#fff' }}>
                DEFAULT
              </Text>
            </View>
          )}
        </View>
        {item.expiryDate && (
          <Text style={{ fontSize: 10, color: '#999' }}>
            Expires {item.expiryDate}
          </Text>
        )}
      </View>

      {/* Checkmark */}
      {item.isDefault && (
        <Ionicons name="checkmark-circle" size={24} color="#FF1493" />
      )}
    </TouchableOpacity>
  );

  const renderPlanCard = (plan: 'free' | 'pro' | 'elite', price: number, features: string[]) => (
    <View
      style={{
        backgroundColor: selectedPlan === plan ? '#FF1493' : '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: selectedPlan === plan ? '#FF1493' : '#333',
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: selectedPlan === plan ? '#000' : '#fff',
          marginBottom: 8,
        }}
      >
        {plan.toUpperCase()}
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: selectedPlan === plan ? '#000' : '#FFD700',
          marginBottom: 12,
        }}
      >
        ${price}
        <Text style={{ fontSize: 12, color: selectedPlan === plan ? '#000' : '#999' }}>
          /month
        </Text>
      </Text>

      {/* Features */}
      <View style={{ gap: 8, marginBottom: 12 }}>
        {features.map((feature, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={selectedPlan === plan ? '#000' : '#FF1493'}
            />
            <Text
              style={{
                fontSize: 11,
                color: selectedPlan === plan ? '#000' : '#fff',
              }}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => handleUpgradePlan(plan)}
        style={{
          backgroundColor: selectedPlan === plan ? '#000' : '#FF1493',
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: selectedPlan === plan ? '#FF1493' : '#fff',
          }}
        >
          {selectedPlan === plan ? 'Current Plan' : 'Upgrade'}
        </Text>
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
              💳 Payments
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveTab('transactions')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'transactions' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'transactions' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'transactions' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('methods')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'methods' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'methods' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'methods' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Methods
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('upgrade')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: activeTab === 'upgrade' ? '#FF1493' : '#1A1A1A',
                borderWidth: 1,
                borderColor: activeTab === 'upgrade' ? '#FF1493' : '#333',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: activeTab === 'upgrade' ? '#fff' : '#999',
                  fontSize: 12,
                }}
              >
                Plans
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'transactions' && (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={renderTransactionItem}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'methods' && (
            <>
              <Text style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
                Select default payment method
              </Text>
              <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item.id}
                renderItem={renderPaymentMethod}
                scrollEnabled={false}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#333',
                  borderStyle: 'dashed',
                }}
              >
                <Ionicons name="add-circle" size={24} color="#FF1493" />
                <Text style={{ fontSize: 12, color: '#FF1493', fontWeight: '600', marginTop: 8 }}>
                  Add Payment Method
                </Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'upgrade' && (
            <>
              <Text style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
                Choose your subscription plan
              </Text>
              {renderPlanCard('free', 0, ['Limited uploads', '1 video per day', 'Basic analytics'])}
              {renderPlanCard('pro', 9.99, ['Unlimited uploads', 'AI Cameo feature', 'Advanced analytics', 'Priority support'])}
              {renderPlanCard('elite', 29.99, ['All Pro features', 'Affiliate program', 'Custom branding', 'Dedicated manager'])}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
