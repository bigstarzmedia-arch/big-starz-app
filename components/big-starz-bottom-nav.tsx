/**
 * Big Starz 5-Tab Bottom Navigation Bar
 * VIBE, STUDIO, CAST, CHAT, WALLET with icons and active states
 */

import { View, Pressable, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface BottomNavProps {
  activeTab: "vibe" | "studio" | "cast" | "chat" | "wallet";
  onTabChange: (tab: "vibe" | "studio" | "cast" | "chat" | "wallet") => void;
}

const TABS = [
  { id: "vibe", label: "VIBE", icon: "▶️", activeIcon: "🎵" },
  { id: "studio", label: "STUDIO", icon: "📹", activeIcon: "🎬" },
  { id: "cast", label: "CAST", icon: "👥", activeIcon: "⭐" },
  { id: "chat", label: "CHAT", icon: "💬", activeIcon: "💭" },
  { id: "wallet", label: "WALLET", icon: "💰", activeIcon: "💳" },
];

export function BigStarzBottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const colors = useColors();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 8,
        paddingTop: 8,
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id as any)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 4,
              backgroundColor: isActive ? `${colors.primary}20` : "transparent",
              borderWidth: isActive ? 1 : 0,
              borderColor: isActive ? colors.primary : "transparent",
            }}
          >
            {/* Icon */}
            <Text style={{ fontSize: 24, marginBottom: 4 }}>
              {isActive ? tab.activeIcon : tab.icon}
            </Text>

            {/* Label */}
            <Text
              style={{
                fontSize: 10,
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? colors.primary : colors.muted,
              }}
            >
              {tab.label}
            </Text>

            {/* Badge for CHAT */}
            {tab.id === "chat" && isActive && (
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.error,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
