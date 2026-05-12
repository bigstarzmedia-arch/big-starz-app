/**
 * Subscription & Token Economy Context - THREE-TIER MODEL
 * 
 * Free Tier: Uses Sora API, 5 videos/month
 * Mid Tier ($30/month): Uses Kling API, 50 videos/month
 * Elite Tier ($99/month): Uses HeyGen API, unlimited videos, priority processing
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SUBSCRIPTION_STATUS: "@bigstarz/subscription_status",
  TOKEN_BALANCE: "@bigstarz/token_balance",
  SUBSCRIPTION_DATE: "@bigstarz/subscription_date",
  TOTAL_GENERATIONS: "@bigstarz/total_generations",
  SUBSCRIPTION_TIER: "@bigstarz/subscription_tier",
};

export type SubscriptionTier = "free" | "starz_pro" | "starz_elite";
export type VideoAPI = "sora" | "kling" | "heygen";

export interface SubscriptionState {
  tier: SubscriptionTier;
  isSubscribed: boolean;
  tokenBalance: number;
  maxTokens: number;
  subscriptionDate: string | null;
  renewalDate: string | null;
  totalGenerations: number;
  monthlyGenerationLimit: number;
  videoGenerationAPI: VideoAPI;
}

export interface SubscriptionContextValue {
  state: SubscriptionState;
  canAccessPremium: boolean;
  canGenerate: boolean;
  consumeToken: () => Promise<boolean>;
  subscribe: (tier: "starz_pro" | "starz_elite") => Promise<void>;
  purchaseTopUp: (amount: number) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  showPaywall: () => void;
  hidePaywall: () => void;
  paywallVisible: boolean;
  tiers: Array<{ id: string; name: string; price: number; monthlyLimit: number; api: VideoAPI; features: string[] }>;
  getVideoAPI: () => VideoAPI;
}

const initialState: SubscriptionState = {
  tier: "free",
  isSubscribed: false,
  tokenBalance: 5,
  maxTokens: 5,
  subscriptionDate: null,
  renewalDate: null,
  totalGenerations: 0,
  monthlyGenerationLimit: 5,
  videoGenerationAPI: "sora",
};

const TIER_CONFIG = {
  free: { maxTokens: 5, limit: 5, api: "sora" as VideoAPI, price: 0 },
  starz_pro: { maxTokens: 50, limit: 50, api: "kling" as VideoAPI, price: 30 },
  starz_elite: { maxTokens: 999, limit: 999, api: "heygen" as VideoAPI, price: 99 },
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(initialState);
  const [paywallVisible, setPaywallVisible] = useState(false);

  // Load subscription state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const tier = (await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_TIER)) as SubscriptionTier | null;
        const tokenBalance = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_BALANCE);
        const subscriptionDate = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_DATE);
        const totalGenerations = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_GENERATIONS);

        if (tier) {
          const config = TIER_CONFIG[tier];
          setState((prev) => ({
            ...prev,
            tier,
            isSubscribed: tier !== "free",
            tokenBalance: tokenBalance ? parseInt(tokenBalance) : config.maxTokens,
            maxTokens: config.maxTokens,
            monthlyGenerationLimit: config.limit,
            videoGenerationAPI: config.api,
            subscriptionDate,
            totalGenerations: totalGenerations ? parseInt(totalGenerations) : 0,
          }));
        }
      } catch (error) {
        console.error("Failed to load subscription state:", error);
      }
    };

    loadState();
  }, []);

  const canAccessPremium = useMemo(() => state.isSubscribed, [state.isSubscribed]);

  const canGenerate = useMemo(() => state.tokenBalance > 0, [state.tokenBalance]);

  const consumeToken = useCallback(async () => {
    if (!canGenerate) return false;

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
  }, [canGenerate, state.tokenBalance, state.totalGenerations]);

  const subscribe = useCallback(async (tier: "starz_pro" | "starz_elite" = "starz_pro") => {
    const config = TIER_CONFIG[tier];

    setState((prev) => ({
      ...prev,
      tier,
      isSubscribed: true,
      tokenBalance: config.maxTokens,
      maxTokens: config.maxTokens,
      monthlyGenerationLimit: config.limit,
      videoGenerationAPI: config.api,
      subscriptionDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TIER, tier);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, config.maxTokens.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_DATE, new Date().toISOString());
  }, []);

  const purchaseTopUp = useCallback(async (amount: number) => {
    const newBalance = state.tokenBalance + amount;

    setState((prev) => ({
      ...prev,
      tokenBalance: newBalance,
    }));

    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, newBalance.toString());
  }, [state.tokenBalance]);

  const cancelSubscription = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      tier: "free",
      isSubscribed: false,
      tokenBalance: 5,
      maxTokens: 5,
      monthlyGenerationLimit: 5,
      videoGenerationAPI: "sora",
      subscriptionDate: null,
      renewalDate: null,
    }));

    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TIER, "free");
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE, "5");
  }, []);

  const showPaywall = useCallback(() => setPaywallVisible(true), []);
  const hidePaywall = useCallback(() => setPaywallVisible(false), []);

  const getVideoAPI = useCallback((): VideoAPI => {
    return state.videoGenerationAPI;
  }, [state.videoGenerationAPI]);

  const tiers = useMemo(
    () => [
      {
        id: "free",
        name: "Free",
        price: 0,
        monthlyLimit: 5,
        api: "sora" as VideoAPI,
        features: ["Sora AI video generation", "5 videos/month", "Basic editing", "Download videos"],
      },
      {
        id: "starz_pro",
        name: "Starz Pro",
        price: 30,
        monthlyLimit: 50,
        api: "kling" as VideoAPI,
        features: ["Kling AI video generation", "50 videos/month", "Advanced editing", "Priority processing", "Download & share"],
      },
      {
        id: "starz_elite",
        name: "Starz Elite",
        price: 99,
        monthlyLimit: 999,
        api: "heygen" as VideoAPI,
        features: ["HeyGen AI video generation", "Unlimited videos", "Advanced editing", "Priority processing", "Download & share", "Analytics dashboard"],
      },
    ],
    []
  );

  const value: SubscriptionContextValue = {
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
    tiers,
    getVideoAPI,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}
