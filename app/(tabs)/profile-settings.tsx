/**
 * Profile/Settings Screen
 * Casting rates, Stripe account linking, fashion aesthetics tagging
 */

import { ScrollView, View, Text, Pressable, TextInput, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BigStarzHeader } from "@/components/big-starz-header";
import { useColors } from "@/hooks/use-colors";

const FASHION_AESTHETICS = [
  "Luxury Designer",
  "Streetwear",
  "High-Fashion",
  "Urban",
  "Jewelry",
  "Tech",
  "Futuristic",
  "Vintage",
  "Minimalist",
  "Bold & Edgy",
];

export default function ProfileSettings() {
  const colors = useColors();
  const [castingRate, setCastingRate] = useState("150");
  const [stripeConnected, setStripeConnected] = useState(false);
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>([
    "Luxury Designer",
    "High-Fashion",
  ]);

  const toggleAesthetic = (aesthetic: string) => {
    if (selectedAesthetics.includes(aesthetic)) {
      setSelectedAesthetics(selectedAesthetics.filter((a) => a !== aesthetic));
    } else {
      setSelectedAesthetics([...selectedAesthetics, aesthetic]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BigStarzHeader />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ fontSize: 48 }}>👩‍🎤</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.foreground }}>
            Luna Starz
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            @lunastarz • 847 subscribers
          </Text>
        </View>

        {/* Casting Rate Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            💰 CASTING RATE
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>
              Set your casting fee per appearance
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.accent2 }}>
                $
              </Text>
              <TextInput
                value={castingRate}
                onChangeText={setCastingRate}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              />
              <Text style={{ fontSize: 12, color: colors.muted }}>per cast</Text>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: colors.muted }}>
            💡 Tip: Creators with Elite status ($5k+ earnings) can charge premium rates
          </Text>
        </View>

        {/* Stripe Account Linking */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            🏦 STRIPE ACCOUNT
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View>
                <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.foreground }}>
                  {stripeConnected ? "✅ Connected" : "❌ Not Connected"}
                </Text>
                <Text style={{ fontSize: 10, color: colors.muted, marginTop: 2 }}>
                  {stripeConnected
                    ? "Your payouts are enabled"
                    : "Connect to receive payments"}
                </Text>
              </View>
              <Switch
                value={stripeConnected}
                onValueChange={setStripeConnected}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={stripeConnected ? colors.accent1 : colors.muted}
              />
            </View>

            {!stripeConnected && (
              <Pressable
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 6,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.background }}>
                  🔗 LINK STRIPE ACCOUNT
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Fashion Aesthetics */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            👗 FASHION AESTHETICS
          </Text>

          <Text style={{ fontSize: 10, color: colors.muted, marginBottom: 12 }}>
            Select the styles that best represent you
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {FASHION_AESTHETICS.map((aesthetic) => {
              const isSelected = selectedAesthetics.includes(aesthetic);
              return (
                <Pressable
                  key={aesthetic}
                  onPress={() => toggleAesthetic(aesthetic)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: isSelected ? colors.background : colors.foreground,
                    }}
                  >
                    {isSelected ? "✓ " : ""}{aesthetic}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Additional Settings */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground, marginBottom: 12 }}>
            ⚙️ SETTINGS
          </Text>

          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: colors.foreground }}>
              📱 Notifications
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>→</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: colors.foreground }}>
              🔒 Privacy & Security
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>→</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: colors.foreground }}>
              📋 Terms & Conditions
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>→</Text>
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Pressable
            style={{
              backgroundColor: colors.error,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.foreground }}>
              🚪 LOGOUT
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
