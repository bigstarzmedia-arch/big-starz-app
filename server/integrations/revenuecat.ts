import axios from "axios";

/**
 * RevenueCat Integration
 * Handles subscription management and entitlements
 */

interface RevenueCatCustomer {
  customerId: string;
  email?: string;
  subscriptions: Record<string, any>;
  entitlements: Record<string, any>;
}

interface RevenueCatSubscription {
  productId: string;
  expiresDate: string;
  purchaseDate: string;
  isActive: boolean;
}

const REVENUECAT_API_BASE = "https://api.revenuecat.com/v1";
const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;

/**
 * Get or create a RevenueCat customer
 */
export async function getOrCreateCustomer(
  customerId: string,
  email?: string
): Promise<RevenueCatCustomer> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const response = await axios.get(
      `${REVENUECAT_API_BASE}/subscribers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriber = response.data.subscriber;
    return {
      customerId: subscriber.original_app_user_id,
      email: subscriber.email,
      subscriptions: subscriber.subscriptions || {},
      entitlements: subscriber.entitlements || {},
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Customer doesn't exist, create one
      return {
        customerId,
        email,
        subscriptions: {},
        entitlements: {},
      };
    }
    console.error("RevenueCat customer retrieval error:", error);
    throw new Error(`Failed to get RevenueCat customer: ${error}`);
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(
  customerId: string,
  entitlementId: string = "premium_access"
): Promise<boolean> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const response = await axios.get(
      `${REVENUECAT_API_BASE}/subscribers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriber = response.data.subscriber;
    const entitlements = subscriber.entitlements || {};

    if (entitlements[entitlementId]) {
      const entitlement = entitlements[entitlementId];
      return entitlement.expires_date === null || new Date(entitlement.expires_date) > new Date();
    }

    return false;
  } catch (error) {
    console.error("RevenueCat subscription check error:", error);
    return false;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(
  customerId: string
): Promise<{ isActive: boolean; expiresDate: string | null; productId: string | null }> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const response = await axios.get(
      `${REVENUECAT_API_BASE}/subscribers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriber = response.data.subscriber;
    const subscriptions = subscriber.subscriptions || {};

    // Find active subscription
    for (const [productId, subscription] of Object.entries(subscriptions)) {
      const sub = subscription as any;
      if (sub.is_sandbox === false) {
        const expiresDate = sub.expires_date;
        const isActive = expiresDate === null || new Date(expiresDate) > new Date();

        return {
          isActive,
          expiresDate,
          productId,
        };
      }
    }

    return {
      isActive: false,
      expiresDate: null,
      productId: null,
    };
  } catch (error) {
    console.error("RevenueCat subscription details error:", error);
    throw new Error(`Failed to get subscription details: ${error}`);
  }
}

/**
 * Get all entitlements for a customer
 */
export async function getEntitlements(customerId: string): Promise<Record<string, any>> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const response = await axios.get(
      `${REVENUECAT_API_BASE}/subscribers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriber = response.data.subscriber;
    return subscriber.entitlements || {};
  } catch (error) {
    console.error("RevenueCat entitlements retrieval error:", error);
    throw new Error(`Failed to get entitlements: ${error}`);
  }
}

/**
 * Validate a purchase receipt
 */
export async function validatePurchaseReceipt(
  customerId: string,
  receipt: string,
  platform: "ios" | "android" = "ios"
): Promise<boolean> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const payload = platform === "ios" ? { app_user_id: customerId, fetch_token: receipt } : { app_user_id: customerId, google_play_token: receipt };

    const response = await axios.post(`${REVENUECAT_API_BASE}/receipts`, payload, {
      headers: {
        Authorization: `Bearer ${REVENUECAT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("RevenueCat receipt validation error:", error);
    return false;
  }
}

/**
 * Get customer's transaction history
 */
export async function getTransactionHistory(customerId: string) {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const response = await axios.get(
      `${REVENUECAT_API_BASE}/subscribers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${REVENUECAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriber = response.data.subscriber;
    return {
      firstSeen: subscriber.first_seen,
      lastSeen: subscriber.last_seen,
      originalPurchaseDate: subscriber.original_purchase_date,
      managementUrl: subscriber.management_url,
    };
  } catch (error) {
    console.error("RevenueCat transaction history error:", error);
    throw new Error(`Failed to get transaction history: ${error}`);
  }
}

/**
 * Restore purchases for a customer
 */
export async function restorePurchases(
  customerId: string,
  receipt: string,
  platform: "ios" | "android" = "ios"
): Promise<boolean> {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error("REVENUECAT_API_KEY not configured");
    }

    const payload = platform === "ios" ? { app_user_id: customerId, fetch_token: receipt } : { app_user_id: customerId, google_play_token: receipt };

    const response = await axios.post(`${REVENUECAT_API_BASE}/receipts`, payload, {
      headers: {
        Authorization: `Bearer ${REVENUECAT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("RevenueCat restore purchases error:", error);
    return false;
  }
}
