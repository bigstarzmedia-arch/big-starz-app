import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { BookingCalendar } from '@/components/booking-calendar';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rate: number;
  rating: number;
  reviews: number;
  subscribers: number;
  isElite: boolean;
  portfolio: string[];
  bio: string;
  available: boolean;
}

// Mock creator data (same as casting.tsx)
const MOCK_CREATORS: Record<string, Creator> = {
  '1': {
    id: '1',
    name: 'Luna Sky',
    avatar: 'https://i.pravatar.cc/150?img=1',
    category: 'Dancer',
    rate: 150,
    rating: 4.9,
    reviews: 342,
    subscribers: 5200,
    isElite: true,
    portfolio: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    bio: 'Professional dancer specializing in hip-hop and contemporary. Available for music videos, commercials, and live events.',
    available: true,
  },
  '2': {
    id: '2',
    name: 'Marcus Vibe',
    avatar: 'https://i.pravatar.cc/150?img=2',
    category: 'Singer',
    rate: 200,
    rating: 4.8,
    reviews: 218,
    subscribers: 8900,
    isElite: true,
    portfolio: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    bio: 'R&B and soul vocalist with studio experience. Perfect for feature vocals and music videos.',
    available: true,
  },
  '3': {
    id: '3',
    name: 'Zara Model',
    avatar: 'https://i.pravatar.cc/150?img=3',
    category: 'Model',
    rate: 120,
    rating: 4.7,
    reviews: 156,
    subscribers: 3400,
    isElite: false,
    portfolio: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    bio: 'Fashion and lifestyle model with experience in editorial and commercial work.',
    available: true,
  },
};

export default function CreatorDetailScreen() {
  const router = useRouter();
  const { creatorId } = useLocalSearchParams();
  const creator = MOCK_CREATORS[creatorId as string];
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const userSubscribers = 1250; // TODO: Get from user context

  if (!creator) {
    return (
      <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Creator not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#FF0055',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const totalCost = creator.rate * selectedDuration;

  const handleBooking = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowBookingCalendar(true);
  };

  const handleConfirmBooking = async (date: Date, duration: number, totalCost: number) => {
    try {
      // TODO: Call backend API to create booking
      // await api.castings.createBooking({ creatorId, date, duration, totalCost });
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        'Booking Confirmed',
        `You've booked ${creator.name} for ${duration} hour(s) at $${totalCost.toFixed(2)}. Payment will be processed.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowBookingCalendar(false);
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm booking');
    }
  };

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Back Button */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#1A1A1A',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: '#FFF' }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar & Header */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              width: '100%',
              height: 300,
              borderRadius: 12,
              backgroundColor: '#1A1A1A',
              marginBottom: 16,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              source={{ uri: creator.avatar }}
              style={{ width: '100%', height: '100%' }}
            />
            {creator.isElite && (
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#FFD700',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 14 }}>⭐</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>Elite</Text>
              </View>
            )}
          </View>

          {/* Name & Category */}
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
                {creator.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: '#FF0055',
                  color: '#FFF',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                {creator.category}
              </Text>
            </View>

            {/* Rating */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16, color: '#FFD700' }}>⭐ {creator.rating}</Text>
              <Text style={{ fontSize: 14, color: '#888' }}>
                ({creator.reviews} reviews)
              </Text>
              <Text style={{ fontSize: 14, color: '#888' }}>•</Text>
              <Text style={{ fontSize: 14, color: '#888' }}>
                {creator.subscribers.toLocaleString()} followers
              </Text>
            </View>
          </View>

          {/* Rate */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: '#888' }}>Hourly Rate</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF0055' }}>
              ${creator.rate}/hr
            </Text>
          </View>
        </View>

        {/* Bio */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 8 }}>
            About
          </Text>
          <Text style={{ fontSize: 13, color: '#AAA', lineHeight: 20 }}>
            {creator.bio}
          </Text>
        </View>

        {/* Portfolio */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            Portfolio
          </Text>
          <View style={{ gap: 12 }}>
            {creator.portfolio.map((item, index) => (
              <View
                key={index}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 8,
                  backgroundColor: '#1A1A1A',
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Duration Selector */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
            Duration
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 4, 8].map((hours) => (
              <TouchableOpacity
                key={hours}
                onPress={() => {
                  setSelectedDuration(hours);
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor:
                    selectedDuration === hours ? '#FF0055' : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: selectedDuration === hours ? '#FF0055' : '#333',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: selectedDuration === hours ? '#FFF' : '#888',
                  }}
                >
                  {hours}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total Cost */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <Text style={{ fontSize: 14, color: '#888' }}>Total Cost</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF0055' }}>
              ${totalCost}
            </Text>
          </View>
        </View>

        {/* Book Button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setShowBookingModal(true)}
            disabled={!creator.available}
            style={{
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: creator.available ? '#FF0055' : '#666',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>
              {creator.available ? 'Book Now' : 'Not Available'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Booking Confirmation Modal (simplified) */}
        {showBookingModal && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#1A1A1A',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: '#333',
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 }}>
                Confirm Booking
              </Text>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#888' }}>Creator</Text>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{creator.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#888' }}>Duration</Text>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                    {selectedDuration} hour(s)
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#888' }}>Rate</Text>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                    ${creator.rate}/hr
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#333',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Total</Text>
                  <Text style={{ color: '#FF0055', fontWeight: 'bold', fontSize: 18 }}>
                    ${totalCost}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowBookingModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: '#333',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBooking}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: '#FF0055',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                  Confirm & Pay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Booking Calendar Modal */}
      <BookingCalendar
        visible={showBookingCalendar}
        onClose={() => setShowBookingCalendar(false)}
        creatorName={creator.name}
        hourlyRate={creator.rate}
        userSubscribers={userSubscribers}
        onConfirmBooking={handleConfirmBooking}
      />
    </ScreenContainer>
  );
}
