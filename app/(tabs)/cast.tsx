import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

const TALENT_DATA = [
  { id: '1', name: 'Quicy', genre: 'Rap/Management', tags: ['Executive', 'Urban'], price: 150, rating: 5.0, avatar: '👑' },
  { id: '2', name: 'Boom', genre: 'Music Production', tags: ['Beats', 'Studio'], price: 100, rating: 4.9, avatar: '🎛️' },
  { id: '3', name: 'Blaze', genre: 'Street Rap', tags: ['Aggressive'], price: 50, rating: 4.8, avatar: '🔥' },
  { id: '4', name: 'Luna', genre: 'Ethereal R&B', tags: ['Dreamy'], price: 75, rating: 4.9, avatar: '🌙' },
];

export default function CastScreen() {
  const renderTalentCard = ({ item }: { item: typeof TALENT_DATA[0] }) => (
    <TouchableOpacity
      style={{
        flex: 0.5,
        margin: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: '100%',
          height: 120,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        }}
      >
        <Text style={{ fontSize: 48 }}>{item.avatar}</Text>
      </View>

      {/* Info */}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 11, color: '#CCC', marginTop: 4 }}>
          {item.genre}
        </Text>

        {/* Tags */}
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {item.tags.map((tag, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: '#FF0055',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 9, color: '#FFF', fontWeight: 'bold' }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Price & Rating */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#333',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FF0055' }}>
            ${item.price}
          </Text>
          <Text style={{ fontSize: 12, color: '#FFD700', fontWeight: 'bold' }}>
            ⭐ {item.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>
          <Text>BIG</Text>
          <Text style={{ color: '#FF0055' }}>STARZ</Text>
        </Text>
        <Text style={{ color: '#CCC', fontSize: 14, marginTop: 4 }}>Talent</Text>
      </View>

      <FlatList
        data={TALENT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderTalentCard}
        numColumns={2}
        contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
