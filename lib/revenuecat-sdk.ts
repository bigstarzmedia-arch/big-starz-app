/**
 * RevenueCat SDK Integration
 * 
 * Handles real subscription management with RevenueCat and Stripe payment processing.
 * This replaces the mock paywall with actual API calls.
 */

import { Platform } from 'react-native';

interface RevenueCatCustomer {
  id: string;
  email?: string;
  subscriptions: Record<string, any>;
  entitlements: Record<string, any>;
}

interface Offering {
  identifier: string;
  packages: Package[];
}

interface Package {
  identifier: string;
  product: Product;
}

interface Product {
  identifier: string;
  title: string;
  description: string;
  price: number;
  priceString: string;
  currencyCode: string;
}

interface Entitlement {
  identifier: string;
  isActive: boolean;
  expirationDate?: string;
}

const API_KEY = process.env.REVENUECAT_API_KEY;
const BASE_URL = 'https://api.revenuecat.com/v1';

/**
 * Get or create a RevenueCat customer
 */
export async function getOrCreateCustomer(userId: string, email?: string): Promise<RevenueCatCustomer> {
  if (!API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    const response = await fetch(`${BASE_URL}/customers/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json() as any;
      return data.customer;
    }

    if (response.status === 404) {
      // Create new customer
      const createResponse = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
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

    throw new Error(`Failed to get/create customer: ${response.statusText}`);
  } catch (error) {
    console.error('RevenueCat customer error:', error);
    throw error;
  }
}

/**
 * Get available offerings (products and packages)
 */
export async function getOfferings(): Promise<Offering[]> {
  if (!API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    const response = await fetch(`${BASE_URL}/offerings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get offerings: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.offerings || [];
  } catch (error) {
    console.error('Error getting offerings:', error);
    throw error;
  }
}

/**
 * Get user's active entitlements (subscriptions)
 */
export async function getEntitlements(userId: string): Promise<Record<string, Entitlement>> {
  try {
    const customer = await getOrCreateCustomer(userId);
    return customer.entitlements || {};
  } catch (error) {
    console.error('Error getting entitlements:', error);
    return {};
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string, entitlementId: string = 'pro'): Promise<boolean> {
  try {
    const entitlements = await getEntitlements(userId);
    const entitlement = entitlements[entitlementId];
    return entitlement?.isActive ?? false;
  } catch {
    return false;
  }
}

/**
 * Create payment link for subscription
 */
export async function createPaymentLink(
  userId: string,
  packageId: string
): Promise<{ url: string; sessionId: string }> {
  if (!API_KEY) {
    throw new Error('REVENUECAT_API_KEY not configured');
  }

  try {
    const response = await fetch(`${BASE_URL}/customers/${userId}/payment_link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
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
 * Get subscription status for user
 */
export async function getSubscriptionStatus(userId: string): Promise<{
  tier: 'free' | 'pro' | 'elite';
  isActive: boolean;
  expirationDate?: string;
}> {
  try {
    const entitlements = await getEntitlements(userId);

    // Check for elite entitlement
    if (entitlements['elite']?.isActive) {
      return {
        tier: 'elite',
        isActive: true,
        expirationDate: entitlements['elite'].expirationDate,
      };
    }

    // Check for pro entitlement
    if (entitlements['pro']?.isActive) {
      return {
        tier: 'pro',
        isActive: true,
        expirationDate: entitlements['pro'].expirationDate,
      };
    }

    // Default to free
    return {
      tier: 'free',
      isActive: true,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      tier: 'free',
      isActive: true,
    };
  }
}

/**
 * Validate RevenueCat connection
 */
export async function validateConnection(): Promise<boolean> {
  if (!API_KEY) {
    console.error('REVENUECAT_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/offerings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('RevenueCat connection validation failed:', error);
    return false;
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}
