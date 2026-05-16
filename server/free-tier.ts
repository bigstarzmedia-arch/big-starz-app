/**
 * Free Tier Video Generation Pipeline
 * 
 * This module handles:
 * 1. Prompt wrapping with master aesthetic
 * 2. Daily quota tracking and enforcement
 * 3. API calls to Google Veo 3.1 Light (or Sora fallback)
 * 4. Credit deduction and upgrade triggers
 */

import { eq } from "drizzle-orm";
import { freeTierQuota, videos } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Master Aesthetic for Free Tier
 * Automatically injected into every free-tier user prompt
 */
const MASTER_AESTHETIC = `Cinematic 4K music video style, high-end luxury aesthetic. Confident CEO-figure with 44-inch sleek blonde hair, custom high-fashion streetwear with intricate gold detailing. Hyper-realistic, opulent studio, smooth gimbal pans, warm golden-hour glow.`;

/**
 * Free Tier Configuration
 */
const FREE_TIER_CONFIG = {
  DAILY_GENERATION_LIMIT: 3,
  MONTHLY_GENERATION_LIMIT: 30,
  API_ENDPOINT: process.env.GOOGLE_VEO_API_URL || "https://api.google.com/veo/v1/generate",
  API_KEY: process.env.GOOGLE_VEO_API_KEY || process.env.SORA_API_KEY,
};

/**
 * Check if user has remaining daily quota
 */
export async function checkDailyQuota(userId: number): Promise<{
  hasQuota: boolean;
  remaining: number;
  resetTime: Date;
}> {
  const database = await getDb();
  
  if (!database) {
    return {
      hasQuota: true,
      remaining: FREE_TIER_CONFIG.DAILY_GENERATION_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  const quota = await database
    .select()
    .from(freeTierQuota)
    .where(eq(freeTierQuota.userId, userId))
    .limit(1);

  if (!quota.length) {
    // Create initial quota for new user
    await database.insert(freeTierQuota).values({
      userId,
      dailyGenerationsRemaining: FREE_TIER_CONFIG.DAILY_GENERATION_LIMIT,
      totalGenerationsThisMonth: 0,
      subscriptionTier: "free",
    });

    return {
      hasQuota: true,
      remaining: FREE_TIER_CONFIG.DAILY_GENERATION_LIMIT,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  const userQuota = quota[0];
  const now = new Date();
  const lastReset = new Date(userQuota.lastResetDate);
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (24 * 60 * 60 * 1000));

  // Reset daily quota if 24 hours have passed
  if (daysSinceReset >= 1 && database) {
    await database
      .update(freeTierQuota)
      .set({
        dailyGenerationsRemaining: FREE_TIER_CONFIG.DAILY_GENERATION_LIMIT,
        lastResetDate: now,
      })
      .where(eq(freeTierQuota.userId, userId));

    return {
      hasQuota: true,
      remaining: FREE_TIER_CONFIG.DAILY_GENERATION_LIMIT,
      resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    };
  }

  return {
    hasQuota: userQuota.dailyGenerationsRemaining > 0,
    remaining: userQuota.dailyGenerationsRemaining,
    resetTime: new Date(lastReset.getTime() + 24 * 60 * 60 * 1000),
  };
}

/**
 * Wrap user prompt with master aesthetic
 */
export function wrapPromptWithAesthetic(userPrompt: string): string {
  return `${MASTER_AESTHETIC} ${userPrompt}`;
}

/**
 * Generate video with Free Tier constraints
 * 
 * @param userId - User ID
 * @param userPrompt - User's text-to-video prompt
 * @returns Video generation result or error
 */
export async function generateFreeVideoWithQuota(
  userId: number,
  userPrompt: string
): Promise<{
  success: boolean;
  videoId?: number;
  error?: string;
  upgradeRequired?: boolean;
  remainingQuota?: number;
  resetTime?: Date;
}> {
  // Step 1: Check daily quota
  const quotaCheck = await checkDailyQuota(userId);

  if (!quotaCheck.hasQuota) {
    return {
      success: false,
      error: "Daily generation limit reached. Upgrade to Pro for unlimited generations.",
      upgradeRequired: true,
      remainingQuota: 0,
      resetTime: quotaCheck.resetTime,
    };
  }

  // Step 2: Wrap prompt with master aesthetic
  const wrappedPrompt = wrapPromptWithAesthetic(userPrompt);

  // Step 3: Call Google Veo API (or Sora fallback)
  try {
    const videoResponse = await callVideoGenerationAPI(wrappedPrompt);

    if (!videoResponse.success) {
      return {
        success: false,
        error: "Video generation failed. Please try again.",
      };
    }

    // Step 4: Deduct quota
    const database = await getDb();
    if (!database) {
      return {
        success: false,
        error: "Database connection failed.",
      };
    }

    const currentQuota = await database
      .select()
      .from(freeTierQuota)
      .where(eq(freeTierQuota.userId, userId))
      .limit(1);

    await database
      .update(freeTierQuota)
      .set({
        dailyGenerationsRemaining: quotaCheck.remaining - 1,
        totalGenerationsThisMonth: (currentQuota[0]?.totalGenerationsThisMonth || 0) + 1,
      })
      .where(eq(freeTierQuota.userId, userId));

    // Step 5: Store video record in database
    const result = await database.insert(videos).values({
      originalVideoUrl: videoResponse.videoUrl,
      originalVideoKey: videoResponse.videoKey,
      title: `AI Generated Video - ${new Date().toLocaleDateString()}`,
      description: userPrompt,
      aiModel: "sora",
      processingStatus: "completed",
      processingProgress: 100,
      visibility: "private",
    } as any);

    return {
      success: true,
      videoId: 0, // Video ID will be auto-generated by database
      remainingQuota: quotaCheck.remaining - 1,
    };
  } catch (error) {
    console.error("Free tier video generation error:", error);
    return {
      success: false,
      error: "Video generation service error. Please try again later.",
    };
  }
}

/**
 * Call Google Veo 3.1 Light API (or Sora fallback)
 */
async function callVideoGenerationAPI(prompt: string): Promise<{
  success: boolean;
  videoUrl?: string;
  videoKey?: string;
  error?: string;
}> {
  try {
    const response = await fetch(FREE_TIER_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FREE_TIER_CONFIG.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: "google-veo-3.1-light",
        duration: 6,
        resolution: "1080p",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      videoUrl: data.videoUrl,
      videoKey: data.videoKey,
    };
  } catch (error) {
    console.error("Video API call failed:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Get user's current subscription tier
 */
export async function getUserSubscriptionTier(userId: number): Promise<"free" | "pro" | "elite"> {
  const database = await getDb();
  if (!database) return "free";
  
  const quota = await database
    .select()
    .from(freeTierQuota)
    .where(eq(freeTierQuota.userId, userId))
    .limit(1);

  if (!quota.length) {
    return "free";
  }

  return quota[0].subscriptionTier as "free" | "pro" | "elite";
}

/**
 * Upgrade user subscription tier (called after successful payment)
 */
export async function upgradeUserTier(
  userId: number,
  newTier: "pro" | "elite"
): Promise<boolean> {
  const database = await getDb();
  if (!database) return false;

  try {
    await database
      .update(freeTierQuota)
      .set({
        subscriptionTier: newTier,
        dailyGenerationsRemaining: newTier === "pro" ? 50 : 999, // Pro: 50/day, Elite: unlimited
      })
      .where(eq(freeTierQuota.userId, userId));

    return true;
  } catch (error) {
    console.error("Tier upgrade failed:", error);
    return false;
  }
}
