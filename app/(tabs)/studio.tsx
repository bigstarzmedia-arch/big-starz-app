import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const ACTION_CARDS = [
  { id: '1', title: 'Photo to Video', subtitle: 'Transform photos into AI videos', emoji: '📸' },
  { id: '2', title: 'Go Live', subtitle: 'Stream to your audience', emoji: '🔴' },
  { id: '3', title: 'Concert Mode', subtitle: 'Create a full concert', emoji: '🎤' },
];

export default function StudioScreen() {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>BIG</Text>
          <Text style={{ color: '#FF0055' }}>STARZ</Text>
        </Text>
        <Text style={{ color: '#CCC', fontSize: 14, marginTop: 4 }}>Studio</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}>
        {/* Big Action Buttons */}
        {ACTION_CARDS.map((card) => (
          <Pressable
            key={card.id}
            onPress={handlePress}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 20,
              padding: 24,
              borderWidth: 2,
              borderColor: '#333',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>{card.emoji}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{card.title}</Text>
            <Text style={{ fontSize: 12, color: '#CCC', textAlign: 'center' }}>{card.subtitle}</Text>
          </Pressable>
        ))}

        {/* Cameo Scan Section */}
        <View style={{ marginTop: 16, backgroundColor: '#1A1A1A', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 16 }}>Cameo Scan</Text>
          
          <Pressable
            onPress={handlePress}
            style={{
              backgroundColor: '#FF0055',
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>📷</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>Upload Photo</Text>
          </Pressable>

          {/* Checklist */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20 }}>✓</Text>
              <Text style={{ color: '#CCC', fontSize: 14 }}>Face clearly visible</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20 }}>✓</Text>
              <Text style={{ color: '#CCC', fontSize: 14 }}>Good lighting</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 20 }}>✓</Text>
              <Text style={{ color: '#CCC', fontSize: 14 }}>Full body preferred</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
