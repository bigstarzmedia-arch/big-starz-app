/**
 * Vibe Live Integration
 * Gifting engine, watermarking, and referral tracking
 */

import Stripe from "stripe";
import { getDb } from "../db";
import {
  giftTransactions,
  gifts,
  creatorStripeAccounts,
  videoWatermarks,
  referralLinks,
  referralConversions,
  socialShareEvents,
} from "@/drizzle/schema-vibe-live";
import { users } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

/**
 * Gift Gifting Engine
 */
export const giftingEngine = {
  /**
   * List all available gifts
   */
  async listGifts() {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    return db.select().from(gifts).where(eq(gifts.isActive, true));
  },

  /**
   * Process gift purchase and payout
   * 90% to creator, 10% to platform
   */
  async purchaseGift(
    streamId: number,
    giftId: number,
    senderId: number,
    recipientId: number,
    amount: number
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get gift details
    const giftData = await db.select().from(gifts).where(eq(gifts.id, giftId)).limit(1);
    if (!giftData.length) throw new Error("Gift not found");

    const gift = giftData[0];
    const giftValue = parseFloat(gift.value.toString());
    const creatorPayout = giftValue * 0.9;
    const platformFee = giftValue * 0.1;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(giftValue * 100),
      currency: "usd",
      metadata: {
        streamId: streamId.toString(),
        giftId: giftId.toString(),
        senderId: senderId.toString(),
        recipientId: recipientId.toString(),
      },
    });

    // Record transaction
    const transaction = await db.insert(giftTransactions).values({
      streamId,
      giftId,
      senderId,
      recipientId,
      giftValue: giftValue.toString(),
      creatorPayout: creatorPayout.toString(),
      platformFee: platformFee.toString(),
      stripePaymentIntentId: paymentIntent.id,
      payoutStatus: "pending",
    });

    return {
      transactionId: transaction[0].insertId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      creatorPayout: creatorPayout.toFixed(2),
      platformFee: platformFee.toFixed(2),
    };
  },

  /**
   * Complete gift payout after payment confirmation
   */
  async completeGiftPayout(transactionId: number, stripeTransferId: string) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    await db
      .update(giftTransactions)
      .set({
        stripeTransferId,
        payoutStatus: "completed",
        completedAt: new Date(),
      })
      .where(eq(giftTransactions.id, transactionId));

    return { success: true };
  },
};

/**
 * Watermarking System
 */
export const watermarkingSystem = {
  /**
   * Check if user should have watermark
   * Free users: YES, Premium/Elite users: NO
   */
  async shouldHaveWatermark(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Check subscription status
    const userSubs = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userSubs.length) return true;

    // Free users get watermark, Premium/Elite don't
    const user = userSubs[0];
    return user.subscriptionStatus === null || user.subscriptionStatus === "inactive";
  },

  /**
   * Create watermark entry for video
   */
  async createWatermark(videoId: number, userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const hasWatermark = await this.shouldHaveWatermark(userId);

    return db.insert(videoWatermarks).values({
      videoId,
      userId,
      hasWatermark,
      watermarkType: "big_starz_logo",
      watermarkPosition: "bottom_right",
      watermarkOpacity: "0.8",
    });
  },

  /**
   * Remove watermark for premium user
   */
  async removeWatermark(videoId: number, userId: number, reason: string) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return db
      .update(videoWatermarks)
      .set({
        isWatermarkRemoved: true,
        removalReason: reason,
        removedAt: new Date(),
      })
      .where(
        and(
          eq(videoWatermarks.videoId, videoId),
          eq(videoWatermarks.userId, userId)
        )
      );
  },

  /**
   * Get watermark status for video
   */
  async getWatermarkStatus(videoId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    return db
      .select()
      .from(videoWatermarks)
      .where(eq(videoWatermarks.videoId, videoId))
      .limit(1);
  },
};

/**
 * Referral Tracking System
 */
export const referralSystem = {
  /**
   * Generate unique referral code for user
   */
  async generateReferralCode(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const code = `STARZ${userId}${Date.now().toString(36).toUpperCase()}`.slice(0, 50);
    const referralUrl = `https://bigstarz.app/join?ref=${code}`;

    const result = await db.insert(referralLinks).values({
      userId,
      referralCode: code,
      referralUrl,
    });

    return {
      referralCode: code,
      referralUrl,
      linkId: result[0].insertId,
    };
  },

  /**
   * Track referral conversion
   */
  async trackConversion(
    referralCode: string,
    referredUserId: number,
    source: string,
    conversionType: string,
    conversionValue: number
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Find referral link
    const refLink = await db
      .select()
      .from(referralLinks)
      .where(eq(referralLinks.referralCode, referralCode))
      .limit(1);

    if (!refLink.length) throw new Error("Invalid referral code");

    const link = refLink[0];
    const commissionAmount = conversionValue * 0.1; // 10% commission

    // Record conversion
    const conversion = await db.insert(referralConversions).values({
      referralLinkId: link.id,
      referrerId: link.userId,
      referredUserId,
      referralSource: source,
      conversionType,
      conversionValue: conversionValue.toString(),
      commissionAmount: commissionAmount.toString(),
      status: "completed",
      completedAt: new Date(),
    });

    // Update referral link stats
    await db
      .update(referralLinks)
      .set({
        totalConversions: link.totalConversions + 1,
        totalEarnings: (
          parseFloat(link.totalEarnings.toString()) + commissionAmount
        ).toString(),
      })
      .where(eq(referralLinks.id, link.id));

    return {
      conversionId: conversion[0].insertId,
      commissionAmount: commissionAmount.toFixed(2),
    };
  },

  /**
   * Get referral stats for user
   */
  async getReferralStats(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const refLink = await db
      .select()
      .from(referralLinks)
      .where(eq(referralLinks.userId, userId))
      .limit(1);

    if (!refLink.length) return null;

    const link = refLink[0];
    const conversions = await db
      .select()
      .from(referralConversions)
      .where(eq(referralConversions.referralLinkId, link.id));

    return {
      referralCode: link.referralCode,
      referralUrl: link.referralUrl,
      totalReferrals: link.totalReferrals,
      totalConversions: link.totalConversions,
      totalEarnings: link.totalEarnings,
      conversions,
    };
  },
};

/**
 * Social Sharing System
 */
export const socialSharingSystem = {
  /**
   * Track social share event
   */
  async trackShare(
    videoId: number,
    userId: number,
    platform: string,
    referralCode?: string
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const shareUrl = `https://bigstarz.app/video/${videoId}${referralCode ? `?ref=${referralCode}` : ""}`;

    return db.insert(socialShareEvents).values({
      videoId,
      userId,
      platform,
      referralCode: referralCode ? referralCode : "",
      shareUrl,
    });
  },

  /**
   * Track share click
   */
  async trackShareClick(shareEventId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const event = await db
      .select()
      .from(socialShareEvents)
      .where(eq(socialShareEvents.id, shareEventId))
      .limit(1);

    if (!event.length) throw new Error("Share event not found");

    await db
      .update(socialShareEvents)
      .set({
        clickCount: event[0].clickCount + 1,
      })
      .where(eq(socialShareEvents.id, shareEventId));

    return { clickCount: event[0].clickCount + 1 };
  },

  /**
   * Get share performance
   */
  async getSharePerformance(videoId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return db
      .select()
      .from(socialShareEvents)
      .where(eq(socialShareEvents.videoId, videoId));
  },
};

/**
 * Creator Stripe Account Management
 */
export const creatorPayoutSystem = {
  /**
   * Onboard creator to Stripe Connect
   */
  async onboardCreator(userId: number, email: string) {
    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Store account info
    await db.insert(creatorStripeAccounts).values({
      userId,
      stripeConnectAccountId: account.id,
      stripeAccountStatus: "pending",
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: "account_onboarding",
      refresh_url: "https://bigstarz.app/payout-settings",
      return_url: "https://bigstarz.app/payout-settings?success=true",
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  },

  /**
   * Get creator payout account status
   */
  async getPayoutStatus(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return db
      .select()
      .from(creatorStripeAccounts)
      .where(eq(creatorStripeAccounts.userId, userId))
      .limit(1);
  },

  /**
   * Transfer funds to creator
   */
  async transferToCreator(userId: number, amount: number, description: string) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get creator's Stripe account
    const account = await db
      .select()
      .from(creatorStripeAccounts)
      .where(eq(creatorStripeAccounts.userId, userId))
      .limit(1);

    if (!account.length) throw new Error("Creator not onboarded");

    const creatorAccount = account[0];

    // Create transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      destination: creatorAccount.stripeConnectAccountId,
      description,
    });

    // Update payout record
    const newTotal = parseFloat(creatorAccount.totalPayoutsReceived.toString()) + amount;
    await db
      .update(creatorStripeAccounts)
      .set({
        totalPayoutsReceived: newTotal.toString(),
        lastPayoutDate: new Date(),
      })
      .where(eq(creatorStripeAccounts.userId, userId));

    return {
      transferId: transfer.id,
      amount: amount.toFixed(2),
      status: "completed",
    };
  },
};
