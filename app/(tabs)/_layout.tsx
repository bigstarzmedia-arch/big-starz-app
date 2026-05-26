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
      {/* VIBE FEED - Play icon (Bottom Left) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Vibe",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="play.circle.fill" color={color} />,
        }}
      />

      {/* CREATE STUDIO - Plus icon (Bottom Center) */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="plus.circle.fill" color={color} />,
        }}
      />

      {/* WALLET - Money icon (Bottom Right) */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="creditcard.fill" color={color} />,
        }}
      />

      {/* HIDDEN SCREENS - Accessible from top nav or modals */}
      {/* CHAT - Accessible from top nav */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
          title: "Chat",
        }}
      />

      {/* PROFILE - Accessible from top nav */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: "Profile",
        }}
      />

      {/* MUSIC - Accessible from Create tab */}
      <Tabs.Screen
        name="music"
        options={{
          href: null,
          title: "Music",
        }}
      />

      {/* CASTING - Accessible from Create tab */}
      <Tabs.Screen
        name="casting"
        options={{
          href: null,
          title: "Casting",
        }}
      />

      {/* ANALYTICS - Accessible from Profile */}
      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
          title: "Analytics",
        }}
      />

      {/* SETTINGS - Accessible from Profile */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
