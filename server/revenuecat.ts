// Use native Node.js fetch (available in Node 18+)

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;
const REVENUECAT_BASE_URL = 'https://api.revenuecat.com/v1';

interface RevenueCatCustomer {
  id: string;
  email?: string;
  created_at: string;
  subscriptions: Record<string, any>;
  entitlements: Record<string, any>;
}

interface RevenueCatSubscription {
  id: string;
  is_active: boolean;
  is_trial_period: boolean;
  product_identifier: string;
  original_purchase_date: string;
  expires_date?: string;
}

interface SubscriptionTier {
  tier: 'free' | 'pro' | 'elite';
  dailyQuota: number;
  monthlyPrice: number;
  features: string[];
}

// Subscription tier configuration
const TIER_CONFIG: Record<string, SubscriptionTier> = {
  free: {
    tier: 'free',
    dailyQuota: 300,
    monthlyPrice: 0,
    features: ['300 daily credits', 'Basic video generation', 'Community support'],
  },
  pro: {
    tier: 'pro',
    dailyQuota: 1000,
    monthlyPrice: 30,
    features: ['1000 daily credits', 'Priority processing', 'Email support', 'HD quality'],
  },
  elite: {
    tier: 'elite',
    dailyQuota: 999999, // Unlimited
    monthlyPrice: 99,
    features: ['Unlimited credits', 'Instant processing', '24/7 support', '8K quality', 'Elite badge'],
  },
};

/**
 * Get or create a RevenueCat customer
 */
export async function getOrCreateCustomer(userId: string, email?: string): Promise<RevenueCatCustomer> {
  if (!REVENUECAT_API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    // Try to get existing customer
    const response = await fetch(`${REVENUECAT_BASE_URL}/customers/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json() as any;
      return data.customer;
    }

    // Create new customer if not found
    if (response.status === 404) {
      const createResponse = await fetch(`${REVENUECAT_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_user_id: userId,
          email: email,
        }),
      });

      if (createResponse.ok) {
        const data = await createResponse.json() as any;
        return data.customer;
      }
    }

    throw new Error(`Failed to get/create RevenueCat customer: ${response.statusText}`);
  } catch (error) {
    console.error('RevenueCat customer error:', error);
    throw error;
  }
}

/**
 * Get user's active subscription tier
 */
export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  try {
    const customer = await getOrCreateCustomer(userId);

    // Check for active subscriptions
    const subscriptions = customer.subscriptions || {};
    
    for (const [productId, subscription] of Object.entries(subscriptions)) {
      const sub = subscription as RevenueCatSubscription;
      
      if (sub.is_active) {
        // Map product ID to tier
        if (productId.includes('elite')) {
          return TIER_CONFIG.elite;
        } else if (productId.includes('pro')) {
          return TIER_CONFIG.pro;
        }
      }
    }

    // Default to free tier
    return TIER_CONFIG.free;
  } catch (error) {
    console.error('Error getting subscription tier:', error);
    return TIER_CONFIG.free; // Fallback to free tier
  }
}

/**
 * Get available subscription offerings
 */
export async function getOfferings() {
  if (!REVENUECAT_API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    const response = await fetch(`${REVENUECAT_BASE_URL}/offerings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get offerings: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting offerings:', error);
    throw error;
  }
}

/**
 * Get subscription tiers configuration
 */
export function getSubscriptionTiers(): Record<string, SubscriptionTier> {
  return TIER_CONFIG;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const tier = await getUserSubscriptionTier(userId);
    return tier.tier !== 'free';
  } catch {
    return false;
  }
}

/**
 * Get daily quota for user based on subscription tier
 */
export async function getDailyQuota(userId: string): Promise<number> {
  try {
    const tier = await getUserSubscriptionTier(userId);
    return tier.dailyQuota;
  } catch {
    return TIER_CONFIG.free.dailyQuota; // Default to free tier quota
  }
}

/**
 * Create a payment link for subscription upgrade
 */
export async function createPaymentLink(
  userId: string,
  tier: 'pro' | 'elite'
): Promise<{ url: string; sessionId: string }> {
  if (!REVENUECAT_API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    const response = await fetch(`${REVENUECAT_BASE_URL}/customers/${userId}/payment_link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: tier === 'pro' ? 'big_starz_pro' : 'big_starz_elite',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment link: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      url: data.url,
      sessionId: data.session_id,
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}

/**
 * Validate RevenueCat API connection
 */
export async function validateConnection(): Promise<boolean> {
  if (!REVENUECAT_API_KEY) {
    console.error('REVENUECAT_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch(`${REVENUECAT_BASE_URL}/offerings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('RevenueCat connection validation failed:', error);
    return false;
  }
}
