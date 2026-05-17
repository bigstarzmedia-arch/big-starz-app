import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface BookingCalendarProps {
  visible: boolean;
  onClose: () => void;
  creatorName: string;
  hourlyRate: number;
  onConfirmBooking: (date: Date, duration: number, totalCost: number) => Promise<void>;
  userSubscribers?: number;
}

const DURATIONS = [
  { label: '1 hour', value: 1 },
  { label: '2 hours', value: 2 },
  { label: '4 hours', value: 4 },
  { label: '8 hours', value: 8 },
];

export function BookingCalendar({
  visible,
  onClose,
  creatorName,
  hourlyRate,
  onConfirmBooking,
  userSubscribers = 0,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canBook = userSubscribers >= 1000;
  const totalCost = hourlyRate * selectedDuration;

  const handleConfirm = async () => {
    if (!canBook) {
      Alert.alert(
        'Booking Locked',
        `You need 1,000 subscribers to book creators. You currently have ${userSubscribers} subscribers.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const bookingDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);

      await onConfirmBooking(bookingDate, selectedDuration, totalCost);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm booking';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'space-between' }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: 32, color: '#FF0055', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
              Book {creatorName}
            </Text>
            <Text style={{ fontSize: 14, color: '#AAA' }}>
              ${hourlyRate}/hour • 1k subscriber gate required
            </Text>
          </View>

          {/* Subscriber Gate Warning */}
          {!canBook && (
            <View
              style={{
                backgroundColor: '#FF0055',
                padding: 12,
                borderRadius: 8,
                marginVertical: 12,
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>
                ⚠️ You need 1,000 subscribers to book creators. Current: {userSubscribers}
              </Text>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View
              style={{
                backgroundColor: '#FF0055',
                padding: 12,
                borderRadius: 8,
                marginVertical: 12,
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>{error}</Text>
            </View>
          )}

          {/* Date Selection */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {generateDateOptions().map((date) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    onPress={() => setSelectedDate(date)}
                    disabled={!canBook}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#FF0055' : '#1A1A1A',
                      borderWidth: 1,
                      borderColor: isSelected ? '#FF0055' : '#333',
                      opacity: canBook ? 1 : 0.5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 'bold' : '500',
                        color: isSelected ? '#FFF' : '#AAA',
                      }}
                    >
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Selection */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Select Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {generateTimeSlots().map((time) => {
                const isSelected = time === selectedTime;
                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    disabled={!canBook}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#FF0055' : '#1A1A1A',
                      borderWidth: 1,
                      borderColor: isSelected ? '#FF0055' : '#333',
                      opacity: canBook ? 1 : 0.5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 'bold' : '500',
                        color: isSelected ? '#FFF' : '#AAA',
                      }}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Duration Selection */}
          <View style={{ gap: 8, marginVertical: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>Duration</Text>
            <View style={{ gap: 8 }}>
              {DURATIONS.map((duration) => {
                const isSelected = duration.value === selectedDuration;
                return (
                  <TouchableOpacity
                    key={duration.value}
                    onPress={() => setSelectedDuration(duration.value)}
                    disabled={!canBook}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#1A1A1A' : '#0A0A0A',
                      borderWidth: 2,
                      borderColor: isSelected ? '#FF0055' : '#333',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: canBook ? 1 : 0.5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: isSelected ? 'bold' : '500',
                        color: '#FFF',
                      }}
                    >
                      {duration.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#FF0055',
                      }}
                    >
                      ${hourlyRate * duration.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Total Cost */}
          <View
            style={{
              backgroundColor: '#1A1A1A',
              padding: 16,
              borderRadius: 8,
              gap: 8,
              marginVertical: 16,
              borderWidth: 1,
              borderColor: '#333',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#AAA' }}>Subtotal:</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                ${totalCost.toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#AAA' }}>Platform fee (10%):</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
                ${(totalCost * 0.1).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#333',
                paddingVertical: 8,
                marginTop: 8,
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Total:</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF0055' }}>
                ${(totalCost * 1.1).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading || !canBook}
            style={{
              backgroundColor: canBook ? '#FF0055' : '#666',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 20,
              opacity: canBook ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={{ fontSize: 10, color: '#666', textAlign: 'center' }}>
            By booking, you agree to Big Starz Terms of Service. Bookings are non-refundable.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
