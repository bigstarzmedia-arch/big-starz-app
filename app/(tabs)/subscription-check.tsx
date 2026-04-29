import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionPaywall } from "@/components/subscription-paywall";

/**
 * Subscription Check Screen
 * Hard gate: Users must have active subscription to proceed
 * If no subscription, show paywall
 */
export default function SubscriptionCheckScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    // Check subscription status
    checkSubscriptionStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      setIsCheckingSubscription(true);

      if (!user) {
        setHasSubscription(false);
        return;
      }

      // TODO: Check RevenueCat subscription status
      // const customerInfo = await Purchases.getCustomerInfo();
      // const hasAccess = customerInfo.entitlements.active["premium_access"] != null;
      // setHasSubscription(hasAccess);

      // For now, assume no subscription
      setHasSubscription(false);
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setHasSubscription(false);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const handleSubscriptionSuccess = () => {
    setHasSubscription(true);
    // Navigate to home after successful subscription
    router.replace("/(tabs)");
  };

  // Loading state
  if (loading || isCheckingSubscription) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  // If user has subscription, redirect to home
  if (hasSubscription) {
    router.replace("/(tabs)");
    return null;
  }

  // Show paywall (hard gate)
  return (
    <SubscriptionPaywall
      onSubscriptionSuccess={handleSubscriptionSuccess}
      isHardGate={true}
    />
  );
}
