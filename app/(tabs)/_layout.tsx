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
      {/* FEED - Home icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
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

      {/* LIVE - Video icon */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Live",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="film.fill" color={color} />,
        }}
      />

      {/* EARN - Wallet icon */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Earn",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="creditcard.fill" color={color} />,
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
    </Tabs>
  );
}
