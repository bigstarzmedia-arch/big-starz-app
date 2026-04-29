/**
 * Webhook Handlers
 * Processes callbacks from Kling, HeyGen, Stripe, and RevenueCat
 */

import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { videos, music, earningsLedger } from "@/drizzle/schema";

/**
 * Handle Kling AI video beautification completion webhook
 */
export async function handleKlingWebhook(payload: any) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const { taskId, status, videoUrl, error } = payload;

    // Find video by Kling task ID
    const video = await db
      .select()
      .from(videos)
      .where(eq(videos.id, parseInt(taskId)))
      .limit(1);

    if (!video.length) {
      console.error(`Video not found for Kling task: ${taskId}`);
      return { success: false, error: "Video not found" };
    }

    const videoRecord = video[0];

    if (status === "completed") {
      // Update video with beautified URL
      await db
        .update(videos)
        .set({
          beautifiedVideoUrl: videoUrl,
          beautifiedVideoKey: `kling_${taskId}`,
          processingStatus: "completed",
          processingProgress: 100,
          updatedAt: new Date(),
        })
        .where(eq(videos.id, videoRecord.id));

      console.log(`✅ Kling video beautification completed: ${videoRecord.id}`);
      return { success: true };
    } else if (status === "failed") {
      // Mark video as failed
      await db
        .update(videos)
        .set({
          processingStatus: "failed",
          processingError: error || "Kling processing failed",
          updatedAt: new Date(),
        })
        .where(eq(videos.id, videoRecord.id));

      console.error(`❌ Kling video beautification failed: ${videoRecord.id}`);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Kling webhook error:", err);
    throw err;
  }
}

/**
 * Handle HeyGen video generation completion webhook
 */
export async function handleHeyGenWebhook(payload: any) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const { videoId, status, videoUrl, error } = payload;

    // Find video by HeyGen video ID
    const video = await db
      .select()
      .from(videos)
      .where(eq(videos.id, parseInt(videoId)))
      .limit(1);

    if (!video.length) {
      console.error(`Video not found for HeyGen task: ${videoId}`);
      return { success: false, error: "Video not found" };
    }

    const videoRecord = video[0];

    if (status === "completed") {
      // Update video with beautified URL
      await db
        .update(videos)
        .set({
          beautifiedVideoUrl: videoUrl,
          beautifiedVideoKey: `heygen_${videoId}`,
          processingStatus: "completed",
          processingProgress: 100,
          updatedAt: new Date(),
        })
        .where(eq(videos.id, videoRecord.id));

      console.log(`✅ HeyGen video generation completed: ${videoRecord.id}`);
      return { success: true };
    } else if (status === "failed") {
      // Mark video as failed
      await db
        .update(videos)
        .set({
          processingStatus: "failed",
          processingError: error || "HeyGen processing failed",
          updatedAt: new Date(),
        })
        .where(eq(videos.id, videoRecord.id));

      console.error(`❌ HeyGen video generation failed: ${videoRecord.id}`);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("HeyGen webhook error:", err);
    throw err;
  }
}

/**
 * Handle Stripe payment completion webhook
 */
export async function handleStripeWebhook(payload: any) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const { type, data } = payload;

    if (type === "payment_intent.succeeded") {
      const { id: paymentIntentId, metadata } = data.object;
      const { userId, castingApplicationId, castingFeeAmount } = metadata;

      // Create earnings ledger entry
      await db.insert(earningsLedger).values({
        userId: parseInt(userId),
        transactionType: "casting_fee",
        amount: castingFeeAmount,
        castingApplicationId: parseInt(castingApplicationId),
        stripePaymentIntentId: paymentIntentId,
        status: "completed",
      });

      console.log(
        `✅ Stripe payment completed: ${paymentIntentId} for user ${userId}`
      );
      return { success: true };
    } else if (type === "payment_intent.payment_failed") {
      const { id: paymentIntentId, metadata } = data.object;
      const { userId, castingApplicationId } = metadata;

      // Mark earnings entry as failed
      await db
        .update(earningsLedger)
        .set({
          status: "failed",
          updatedAt: new Date(),
        })
        .where(eq(earningsLedger.stripePaymentIntentId, paymentIntentId));

      console.error(
        `❌ Stripe payment failed: ${paymentIntentId} for user ${userId}`
      );
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Stripe webhook error:", err);
    throw err;
  }
}

/**
 * Handle RevenueCat subscription webhook
 */
export async function handleRevenueCatWebhook(payload: any) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const { event } = payload;
    const { type, app_user_id, product_id } = event;

    if (type === "INITIAL_PURCHASE" || type === "RENEWAL") {
      // User has active subscription
      console.log(
        `✅ RevenueCat subscription active for user ${app_user_id}: ${product_id}`
      );

      // TODO: Update user subscription status in database
      // await db.update(users).set({
      //   subscriptionStatus: "active",
      //   subscriptionExpiresAt: new Date(event.expiration_at_ms),
      // }).where(eq(users.revenueCatCustomerId, app_user_id));

      return { success: true };
    } else if (type === "EXPIRATION" || type === "CANCELLATION") {
      // User subscription expired or cancelled
      console.log(
        `⚠️ RevenueCat subscription expired/cancelled for user ${app_user_id}`
      );

      // TODO: Update user subscription status
      // await db.update(users).set({
      //   subscriptionStatus: "inactive",
      // }).where(eq(users.revenueCatCustomerId, app_user_id));

      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error("RevenueCat webhook error:", err);
    throw err;
  }
}

/**
 * Verify webhook signature (generic helper)
 */
export function verifyWebhookSignature(
  signature: string,
  payload: string,
  secret: string
): boolean {
  // TODO: Implement signature verification based on provider
  // This is a placeholder - each provider has different verification methods
  return true;
}
