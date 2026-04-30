/**
 * Subscription & Token Economy Context
 * 
 * Enforces the $30/month paywall before ANY generation features are accessible.
 * Manages the Starz Token economy (50 tokens/month, 1 generation = 1 token).
 * Uses AsyncStorage for persistence. In production, this would sync with RevenueCat.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SUBSCRIPTION_STATUS: "@bigstarz/subscription_status",
  TOKEN_BALANCE: "@bigstarz/token_balance",
  SUBSCRIPTION_DATE: "@bigstarz/subscription_date",
  TOTAL_GENERATIONS: "@bigstarz/total_generations",
};

export type SubscriptionTier = "free" | "starz_pro";

export interface SubscriptionState {
  tier: SubscriptionTier;
  isSubscribed: boolean;
  tokenBalance: number;
  maxTokens: number;
  subscriptionDate: string | null;
  renewalDate: string | null;
  totalGenerations: number;
}

export interface SubscriptionContextValue {
  state: SubscriptionState;
  /** Returns true if user has active subscription */
  canAccessPremium: boolean;
  /** Returns true if user has tokens remaining */
  canGenerate: boolean;
  /** Consume 1 token for a generation. Returns false if no tokens. */
  consumeToken: () => Promise<boolean>;
  /** Simulate subscription purchase (in production: RevenueCat) */
  subscribe: () => Promise<void>;
  /** Simulate token top-up purchase */
  purchaseTopUp: (amount: number) => Promise<void>;
  /** Cancel subscription */
  cancelSubscription: () => Promise<void>;
  /** Show paywall */
  showPaywall: () => void;
  /** Hide paywall */
  hidePaywall: () => void;
  /** Whether paywall modal is visible */
  paywallVisible: boolean;
}

const DEFAULT_STATE: SubscriptionState = {
  tier: "free",
  isSubscribed: false,
  tokenBalance: 0,
  maxTokens: 50,
  subscriptionDate: null,
  renewalDate: null,
  totalGenerations: 0,
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);
  const [paywallVisible, setPaywallVisible] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const [status, balance, date, generations] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_STATUS),
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN_BALANCE),
          AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_DATE),
          AsyncStorage.getItem(STORAGE_KEYS.TOTAL_GENERATIONS),
        ]);

        if (status === "starz_pro" && date) {
          const subDate = new Date(date);
          const renewDate = new Date(subDate);
          renewDate.setMonth(renewDate.getMonth() + 1);

          setState({
            tier: "starz_pro",
            isSubscribed: true,
            tokenBalance: balance ? parseInt(balance, 10) : 50,
            maxTokens: 50,
            subscriptionDate: date,
            renewalDate: renewDate.toISOString(),
            totalGenerations: generations ? parseInt(generations, 10) : 0,
          });
        }
      } catch (e) {
        // Silently fail, use defaults
      }
    })();
  }, []);

  const canAccessPremium = state.isSubscribed;
  const canGenerate = state.isSubscribed && state.tokenBalance > 0;

  const consumeToken = useCallback(async (): Promise<boolean> => {
    if (!state.isSubscribed || state.tokenBalance <= 0) return false;

    const newBalance = state.tokenBalance - 1;
    const newGenerations = state.totalGenerations + 1;

    setState((prev) => ({
      ...prev,
      tokenBalance: newBalance,
      totalGenerations: newGenerations,
    }));

    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, newBalance.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_GENERATIONS, newGenerations.toString());

    return true;
  }, [state.isSubscribed, state.tokenBalance, state.totalGenerations]);

  const subscribe = useCallback(async () => {
    // In production: RevenueCat purchase flow
    // For now: simulate successful subscription
    const now = new Date().toISOString();
    const renewDate = new Date();
    renewDate.setMonth(renewDate.getMonth() + 1);

    const newState: SubscriptionState = {
      tier: "starz_pro",
      isSubscribed: true,
      tokenBalance: 50,
      maxTokens: 50,
      subscriptionDate: now,
      renewalDate: renewDate.toISOString(),
      totalGenerations: state.totalGenerations,
    };

    setState(newState);
    setPaywallVisible(false);

    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_STATUS, "starz_pro");
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, "50");
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_DATE, now);
  }, [state.totalGenerations]);

  const purchaseTopUp = useCallback(async (amount: number) => {
    if (!state.isSubscribed) return;

    const newBalance = state.tokenBalance + amount;
    setState((prev) => ({ ...prev, tokenBalance: newBalance }));
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, newBalance.toString());
  }, [state.isSubscribed, state.tokenBalance]);

  const cancelSubscription = useCallback(async () => {
    setState(DEFAULT_STATE);
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }, []);

  const showPaywall = useCallback(() => setPaywallVisible(true), []);
  const hidePaywall = useCallback(() => setPaywallVisible(false), []);

  const value = useMemo(
    () => ({
      state,
      canAccessPremium,
      canGenerate,
      consumeToken,
      subscribe,
      purchaseTopUp,
      cancelSubscription,
      showPaywall,
      hidePaywall,
      paywallVisible,
    }),
    [state, canAccessPremium, canGenerate, consumeToken, subscribe, purchaseTopUp, cancelSubscription, showPaywall, hidePaywall, paywallVisible]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
}
