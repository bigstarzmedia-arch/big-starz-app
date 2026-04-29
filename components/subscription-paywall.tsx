import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

interface SubscriptionPaywallProps {
  onSubscriptionSuccess?: () => void;
  isHardGate?: boolean; // If true, users cannot bypass paywall
}

/**
 * RevenueCat Subscription Paywall Component
 * Displays $30/month subscription tier with hard gate enforcement
 * Users must subscribe to access premium features
 */
export function SubscriptionPaywall({
  onSubscriptionSuccess,
  isHardGate = true,
}: SubscriptionPaywallProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle subscription purchase
   * In production, this would integrate with RevenueCat SDK
   */
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Integrate RevenueCat SDK
      // const offerings = await Purchases.getOfferings();
      // const package = offerings?.current?.availablePackages[0];
      // if (package) {
      //   const purchaseResult = await Purchases.purchasePackage(package);
      //   if (purchaseResult.customerInfo.entitlements.active["premium_access"]) {
      //     onSubscriptionSuccess?.();
      //   }
      // }

      // For now, simulate successful subscription
      setTimeout(() => {
        onSubscriptionSuccess?.();
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed");
      setIsLoading(false);
    }
  };

  /**
   * Handle restore purchases
   */
  const handleRestorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Integrate RevenueCat SDK
      // const customerInfo = await Purchases.restorePurchases();
      // if (customerInfo.entitlements.active["premium_access"]) {
      //   onSubscriptionSuccess?.();
      // }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-between px-6 py-8">
        {/* Header */}
        <View className="gap-4">
          <View className="items-center gap-2">
            <Text className="text-5xl">✨</Text>
            <Text className="text-3xl font-bold text-foreground">
              Unlock Premium
            </Text>
            <Text className="text-base text-muted text-center">
              Access all generative tools and monetization features
            </Text>
          </View>

          {/* Feature List */}
          <View className="mt-8 gap-4">
            <FeatureItem
              icon="🎥"
              title="Unlimited Video Beautification"
              description="Kling & HeyGen AI models"
            />
            <FeatureItem
              icon="🎵"
              title="Music & Lyric Generation"
              description="OpenAI lyrics + ElevenLabs TTS"
            />
            <FeatureItem
              icon="💰"
              title="Monetization Tools"
              description="Casting fees, affiliate commissions"
            />
            <FeatureItem
              icon="🎬"
              title="Affiliate Modeling"
              description="Apply for luxury brand collaborations"
            />
          </View>
        </View>

        {/* Pricing & CTA */}
        <View className="gap-4">
          {/* Error Message */}
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Price Card */}
          <View className="bg-surface border-2 border-primary rounded-2xl p-6">
            <View className="items-center gap-2">
              <Text className="text-4xl font-bold text-primary">$30</Text>
              <Text className="text-base text-muted">/month</Text>
              <Text className="text-xs text-muted mt-2">
                First 7 days free, then $30/month
              </Text>
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-primary rounded-lg py-4 px-6 active:scale-95"
          >
            {isLoading ? (
              <ActivityIndicator color="#F5F5F5" />
            ) : (
              <Text className="text-center text-background font-bold text-base">
                Start Free Trial
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore Purchases */}
          <TouchableOpacity
            onPress={handleRestorePurchases}
            disabled={isLoading}
            className="w-full py-3"
          >
            <Text className="text-center text-primary text-sm font-semibold">
              Restore Purchases
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-center text-muted text-xs">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Subscription renews automatically.
          </Text>

          {/* Hard Gate Message */}
          {isHardGate && (
            <View className="bg-warning/10 border border-warning rounded-lg p-3 mt-4">
              <Text className="text-warning text-xs text-center">
                Premium subscription required to access generative tools
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Feature item component
 */
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row gap-4 items-start">
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted">{description}</Text>
      </View>
    </View>
  );
}
