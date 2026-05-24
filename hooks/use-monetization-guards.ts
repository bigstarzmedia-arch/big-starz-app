import { useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export type UserTier = 'free' | 'pro' | 'elite';

interface MonetizationGuard {
  feature: string;
  requiredTier: UserTier;
  message: string;
  upgradeUrl?: string;
}

const MONETIZATION_GUARDS: Record<string, MonetizationGuard> = {
  AI_CAMEO: {
    feature: 'AI Cameo',
    requiredTier: 'pro',
    message: 'AI Cameo is available for Pro users. Upgrade now to unlock unlimited AI clones!',
    upgradeUrl: '/upgrade?plan=pro',
  },
  AFFILIATE_PROGRAM: {
    feature: 'Affiliate Program',
    requiredTier: 'elite',
    message: 'Affiliate Program requires Elite status and creator verification. Apply now!',
    upgradeUrl: '/affiliate-apply',
  },
  CASTING_FEES: {
    feature: 'Casting Fees',
    requiredTier: 'pro',
    message: 'Set casting fees with Pro tier. Unlock monetization features today!',
    upgradeUrl: '/upgrade?plan=pro',
  },
  ADVANCED_ANALYTICS: {
    feature: 'Advanced Analytics',
    requiredTier: 'elite',
    message: 'Advanced Analytics is available for Elite users only.',
    upgradeUrl: '/upgrade?plan=elite',
  },
  CUSTOM_WATERMARK: {
    feature: 'Custom Watermark',
    requiredTier: 'pro',
    message: 'Custom watermarks are available for Pro users.',
    upgradeUrl: '/upgrade?plan=pro',
  },
};

/**
 * Hook for checking monetization tier restrictions
 * Prevents users from accessing premium features based on their tier
 */
export function useMonetizationGuards() {
  const canAccessFeature = useCallback(
    (feature: string, userTier: UserTier): boolean => {
      const guard = MONETIZATION_GUARDS[feature];
      if (!guard) return true; // Feature has no restrictions

      const tierHierarchy: Record<UserTier, number> = {
        free: 0,
        pro: 1,
        elite: 2,
      };

      return tierHierarchy[userTier] >= tierHierarchy[guard.requiredTier];
    },
    []
  );

  const checkFeatureAccess = useCallback(
    (feature: string, userTier: UserTier, onUpgrade?: () => void) => {
      const guard = MONETIZATION_GUARDS[feature];
      if (!guard) return true; // Feature has no restrictions

      const hasAccess = canAccessFeature(feature, userTier);

      if (!hasAccess) {
        // Haptic feedback for blocked action
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error as any
          );
        }

        // Show alert
        Alert.alert(
          `Unlock ${guard.feature}`,
          guard.message,
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Upgrade',
              onPress: onUpgrade || (() => {}),
              style: 'default',
            },
          ]
        );
      }

      return hasAccess;
    },
    [canAccessFeature]
  );

  const getFeatureRequirement = useCallback((feature: string) => {
    return MONETIZATION_GUARDS[feature] || null;
  }, []);

  const listRestrictedFeatures = useCallback(
    (userTier: UserTier): MonetizationGuard[] => {
      return Object.values(MONETIZATION_GUARDS).filter(
        (guard) => !canAccessFeature(guard.feature, userTier)
      );
    },
    [canAccessFeature]
  );

  return {
    canAccessFeature,
    checkFeatureAccess,
    getFeatureRequirement,
    listRestrictedFeatures,
    MONETIZATION_GUARDS,
  };
}
