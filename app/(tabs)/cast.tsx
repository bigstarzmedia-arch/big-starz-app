import { View, Text, FlatList, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { GlobalHeader } from '@/components/global-header';
import { MaterialIcons } from '@expo/vector-icons';

const TALENT_DATA = [
  {
    id: '1',
    name: 'Quicy',
    genre: 'Rap/Management',
    tags: ['Executive', 'Urban'],
    price: 150,
    rating: 5.0,
    avatar: '👑',
  },
  {
    id: '2',
    name: 'Boom',
    genre: 'Music Production',
    tags: ['Beats', 'Studio'],
    price: 100,
    rating: 4.9,
    avatar: '🎛️',
  },
  {
    id: '3',
    name: 'Blaze',
    genre: 'Street • Rap',
    tags: ['Aggressive'],
    price: 50,
    rating: 4.8,
    avatar: '🔥',
  },
  {
    id: '4',
    name: 'Luna',
    genre: 'Ethereal • R&B',
    tags: ['Dreamy'],
    price: 75,
    rating: 4.9,
    avatar: '🌙',
  },
];

export default function CastScreen() {
  const colors = useColors();

  const renderTalentCard = ({ item }: { item: typeof TALENT_DATA[0] }) => (
    <Pressable
      style={({ pressed }) => ({
        flex: 0.5,
        marginHorizontal: 8,
        marginVertical: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 12,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {/* Avatar */}
      <View
        style={{
          width: '100%',
          height: 120,
          backgroundColor: colors.background,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 48 }}>{item.avatar}</Text>
      </View>

      {/* Name & Genre */}
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
        {item.genre}
      </Text>

      {/* Tags */}
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
        {item.tags.map((tag, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: colors.background,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ fontSize: 9, color: colors.primary, fontWeight: '600' }}>
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
          borderTopColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
          ${item.price}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialIcons name="star" size={14} color={colors.accent2} />
          <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '600' }}>
            {item.rating}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <GlobalHeader />

      <FlatList
        data={TALENT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderTalentCard}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
