import { useCallback, useMemo } from 'react';
import { useAuth } from './use-auth';

export type TierType = 'free' | 'budget' | 'pro' | 'elite';

export interface TierFeatures {
  viewVideos: boolean;
  likeComment: boolean;
  followCreators: boolean;
  textToVideo: boolean;
  aiAvatarVideo: boolean;
  voiceCloning: boolean;
  lyricsGenerator: boolean;
  duetsStitches: boolean;
  livestream: boolean;
  castingFees: boolean;
  affiliateProgram: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
}

const TIER_FEATURES: Record<TierType, TierFeatures> = {
  free: {
    viewVideos: true,
    likeComment: true,
    followCreators: true,
    textToVideo: false,
    aiAvatarVideo: false,
    voiceCloning: false,
    lyricsGenerator: false,
    duetsStitches: false,
    livestream: false,
    castingFees: false,
    affiliateProgram: false,
    prioritySupport: false,
    advancedAnalytics: false,
  },
  budget: {
    viewVideos: true,
    likeComment: true,
    followCreators: true,
    textToVideo: true,
    aiAvatarVideo: false,
    voiceCloning: false,
    lyricsGenerator: false,
    duetsStitches: false,
    livestream: false,
    castingFees: false,
    affiliateProgram: false,
    prioritySupport: false,
    advancedAnalytics: false,
  },
  pro: {
    viewVideos: true,
    likeComment: true,
    followCreators: true,
    textToVideo: true,
    aiAvatarVideo: true,
    voiceCloning: true,
    lyricsGenerator: true,
    duetsStitches: true,
    livestream: true,
    castingFees: true,
    affiliateProgram: false,
    prioritySupport: false,
    advancedAnalytics: true,
  },
  elite: {
    viewVideos: true,
    likeComment: true,
    followCreators: true,
    textToVideo: true,
    aiAvatarVideo: true,
    voiceCloning: true,
    lyricsGenerator: true,
    duetsStitches: true,
    livestream: true,
    castingFees: true,
    affiliateProgram: true,
    prioritySupport: true,
    advancedAnalytics: true,
  },
};

/**
 * Hook to check tier-based feature access
 */
export function useTierAccess() {
  const { user } = useAuth();

  const userTier = useMemo(() => {
    return ((user as any)?.tier as TierType) || 'free';
  }, [user]);

  const features = useMemo(() => {
    return TIER_FEATURES[userTier] || TIER_FEATURES.free;
  }, [userTier]);

  const hasFeature = useCallback(
    (feature: keyof TierFeatures): boolean => {
      return features[feature] ?? false;
    },
    [features]
  );

  const requireFeature = useCallback(
    (feature: keyof TierFeatures, onUpgrade?: () => void): boolean => {
      if (!hasFeature(feature)) {
        onUpgrade?.();
        return false;
      }
      return true;
    },
    [hasFeature]
  );

  const getUpgradeMessage = useCallback((feature: keyof TierFeatures): string => {
    const featureNames: Record<keyof TierFeatures, string> = {
      viewVideos: 'View videos',
      likeComment: 'Like and comment',
      followCreators: 'Follow creators',
      textToVideo: 'Text-to-video generation',
      aiAvatarVideo: 'AI avatar videos',
      voiceCloning: 'Voice cloning',
      lyricsGenerator: 'Lyrics generator',
      duetsStitches: 'Duets & stitches',
      livestream: 'Livestreaming',
      castingFees: 'Casting fees',
      affiliateProgram: 'Affiliate program',
      prioritySupport: 'Priority support',
      advancedAnalytics: 'Advanced analytics',
    };

    const requiredTiers: Record<keyof TierFeatures, TierType> = {
      viewVideos: 'free',
      likeComment: 'free',
      followCreators: 'free',
      textToVideo: 'budget',
      aiAvatarVideo: 'pro',
      voiceCloning: 'pro',
      lyricsGenerator: 'pro',
      duetsStitches: 'pro',
      livestream: 'pro',
      castingFees: 'pro',
      affiliateProgram: 'elite',
      prioritySupport: 'elite',
      advancedAnalytics: 'pro',
    };

    const requiredTier = requiredTiers[feature];
    const featureName = featureNames[feature];

    return `${featureName} is available on ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} tier and above. Upgrade now!`;
  }, []);

  return {
    userTier,
    features,
    hasFeature,
    requireFeature,
    getUpgradeMessage,
  };
}
