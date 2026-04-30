/**
 * Big Starz Header Component
 * Displays "BIG STARZ" branding with search icon and notification bell
 */

import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";

export function BigStarzHeader() {
  const colors = useColors();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 16,
      }}
    >
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* BIG STARZ Logo */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
            BIG
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.primary,
              marginLeft: 4,
            }}
          >
            STARZ
          </Text>
        </View>

        {/* Search & Notification Icons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Search Icon */}
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
                padding: 8,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>🔍</Text>
          </Pressable>

          {/* Notification Bell */}
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
                padding: 8,
                position: "relative",
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            {/* Notification Badge */}
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
          </Pressable>
        </View>
      </View>

      {/* Search Bar (Conditional) */}
      {showSearch && (
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
          <TextInput
            placeholder="Search creators, songs, casts..."
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              color: colors.foreground,
              fontSize: 14,
            }}
          />
        </View>
      )}
    </View>
  );
}
