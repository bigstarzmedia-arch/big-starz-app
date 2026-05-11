import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

export function GlobalHeader() {
  const colors = useColors();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* Logo: BIG + STARZ */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.foreground }}>BIG</Text>
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>STARZ</Text>
      </View>

      {/* Search + Notification */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <MaterialIcons name="search" size={24} color={colors.foreground} />
        </Pressable>

        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            position: 'relative',
          })}
        >
          <MaterialIcons name="notifications" size={24} color={colors.foreground} />
          {/* Notification Badge */}
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: colors.primary,
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.background }}>6</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
