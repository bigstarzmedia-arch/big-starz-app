import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF0055",
        tabBarInactiveTintColor: "#888888",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#000000",
          borderTopColor: "#333333",
          borderTopWidth: 0.5,
        },
      }}
    >
      {/* VIBE FEED - Play icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Vibe",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="play.circle.fill" color={color} />,
        }}
      />

      {/* CREATE STUDIO - Plus icon (centered) */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="plus.circle.fill" color={color} />,
        }}
      />

      {/* CHAT - Message bubble icon */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="bubble.right.fill" color={color} />,
        }}
      />

      {/* PROFILE - Person icon */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
        }}
      />

      {/* WALLET - Wallet icon */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="creditcard.fill" color={color} />,
        }}
      />


    </Tabs>
  );
}
