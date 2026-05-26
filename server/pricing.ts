/**
 * Big Starz Pricing Configuration
 * 4-Tier Model with Cost + 20% Profit Markup
 */

export type TierType = 'free' | 'budget' | 'pro' | 'elite';

export interface TierConfig {
  id: TierType;
  name: string;
  price: number; // USD per month
  cost: number; // Actual API cost
  profit: number; // Price - Cost
  generationsPerMonth: number;
  features: {
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
  };
  processingTime: string;
  description: string;
}

export const TIERS: Record<TierType, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    cost: 0,
    profit: 0,
    generationsPerMonth: 0,
    features: {
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
    processingTime: 'N/A',
    description: 'View and discover content. No generation features.',
  },

  budget: {
    id: 'budget',
    name: 'Budget',
    price: 2.4,
    cost: 2.0,
    profit: 0.4,
    generationsPerMonth: 10,
    features: {
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
    processingTime: '24-48 hours',
    description: 'Basic AI features. Perfect for getting started.',
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: 24.0,
    cost: 20.0,
    profit: 4.0,
    generationsPerMonth: 50,
    features: {
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
    processingTime: '2-4 hours',
    description: 'All AI features. Perfect for creators.',
  },

  elite: {
    id: 'elite',
    name: 'Elite',
    price: 98.4,
    cost: 82.0,
    profit: 16.4,
    generationsPerMonth: 999999, // Unlimited
    features: {
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
    processingTime: '<1 hour',
    description: 'Unlimited everything. For professional creators.',
  },
};

/**
 * Get tier configuration by ID
 */
export function getTierConfig(tierId: TierType): TierConfig {
  return TIERS[tierId];
}

/**
 * Check if user has access to feature
 */
export function hasFeatureAccess(userTier: TierType, feature: keyof TierConfig['features']): boolean {
  const tier = getTierConfig(userTier);
  return tier.features[feature] ?? false;
}

/**
 * Get remaining generations for user
 */
export function getRemainingGenerations(userTier: TierType, generationsUsed: number): number {
  const tier = getTierConfig(userTier);
  const remaining = tier.generationsPerMonth - generationsUsed;
  return Math.max(0, remaining);
}

/**
 * Check if user can generate
 */
export function canGenerate(userTier: TierType, generationsUsed: number): boolean {
  if (userTier === 'free') return false;
  if (userTier === 'elite') return true; // Unlimited
  
  const tier = getTierConfig(userTier);
  return generationsUsed < tier.generationsPerMonth;
}

/**
 * Calculate tier pricing summary
 */
export function getPricingSummary() {
  return Object.values(TIERS).map(tier => ({
    id: tier.id,
    name: tier.name,
    price: tier.price,
    cost: tier.cost,
    profit: tier.profit,
    profitMargin: tier.price > 0 ? ((tier.profit / tier.price) * 100).toFixed(1) + '%' : 'N/A',
    generationsPerMonth: tier.generationsPerMonth === 999999 ? 'Unlimited' : tier.generationsPerMonth,
    processingTime: tier.processingTime,
  }));
}
