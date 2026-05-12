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
      {/* VIBE FEED - Star icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Vibe",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="star.fill" color={color} />,
        }}
      />

      {/* CAMEO STUDIO - Camera icon */}
      <Tabs.Screen
        name="cameo-studio"
        options={{
          title: "Cameo",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="camera.fill" color={color} />,
        }}
      />

      {/* MUSIC STUDIO - Music note icon */}
      <Tabs.Screen
        name="music-studio"
        options={{
          title: "Music",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="music.note" color={color} />,
        }}
      />

      {/* CAST / AFFILIATE HUB - People icon */}
      <Tabs.Screen
        name="affiliate-hub"
        options={{
          title: "Cast",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.2.fill" color={color} />,
        }}
      />

      {/* WALLET - Wallet icon */}
      <Tabs.Screen
        name="wallet-screen"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="creditcard.fill" color={color} />,
        }}
      />


    </Tabs>
  );
}
