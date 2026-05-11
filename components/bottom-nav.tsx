import { View, Pressable, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomNavProps {
  activeTab: 'vibe' | 'studio' | 'cast' | 'chat' | 'wallet';
  onTabPress: (tab: 'vibe' | 'studio' | 'cast' | 'chat' | 'wallet') => void;
}

const TAB_CONFIG = [
  { id: 'vibe', label: 'Vibe', icon: 'play-circle' },
  { id: 'studio', label: 'Studio', icon: 'camera' },
  { id: 'cast', label: 'Cast', icon: 'people' },
  { id: 'chat', label: 'Chat', icon: 'chat-bubble' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet' },
] as const;

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      {TAB_CONFIG.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id as any)}
            style={({ pressed }) => ({
              alignItems: 'center',
              gap: 4,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <MaterialIcons
              name={tab.icon as any}
              size={24}
              color={isActive ? colors.primary : colors.muted}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? colors.primary : colors.muted,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
