import crypto from "crypto";
import { logger } from "./logger";
import { TRPCError } from "@trpc/server";

/**
 * Stripe webhook signature verification
 * Prevents unauthorized webhook calls
 */
export function verifyStripeWebhookSignature(
  body: string,
  signature: string | undefined,
  secret: string
): { valid: boolean; error?: string } {
  if (!signature) {
    return {
      valid: false,
      error: "Missing signature header",
    };
  }

  try {
    // Extract timestamp and signatures from header
    const elements = signature.split(",");
    const timestampEl = elements.find((el) => el.startsWith("t="));
    const signatureEl = elements.find((el) => el.startsWith("v1="));

    if (!timestampEl || !signatureEl) {
      return {
        valid: false,
        error: "Invalid signature format",
      };
    }

    const timestamp = timestampEl.substring(2);
    const receivedSignature = signatureEl.substring(3);

    // Check timestamp is within 5 minutes (prevent replay attacks)
    const currentTime = Math.floor(Date.now() / 1000);
    const signedTime = parseInt(timestamp);
    const timeDiff = Math.abs(currentTime - signedTime);

    if (timeDiff > 300) {
      logger.warn({ timeDiff }, "[Webhook] Timestamp outside acceptable range");
      return {
        valid: false,
        error: "Webhook timestamp too old",
      };
    }

    // Compute expected signature
    const signedContent = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedContent)
      .digest("hex");

    // Compare signatures (constant-time comparison to prevent timing attacks)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.warn({}, "[Webhook] Signature verification failed");
      return {
        valid: false,
        error: "Invalid signature",
      };
    }

    return { valid: true };
  } catch (error) {
    logger.error({ err: error }, "[Webhook] Signature verification error");
    return {
      valid: false,
      error: "Signature verification failed",
    };
  }
}

/**
 * RevenueCat webhook signature verification
 */
export function verifyRevenueCatWebhookSignature(
  body: string,
  signature: string | undefined,
  publicKey: string
): { valid: boolean; error?: string } {
  if (!signature) {
    return {
      valid: false,
      error: "Missing signature header",
    };
  }

  try {
    // RevenueCat uses SHA256 HMAC
    const expectedSignature = crypto
      .createHmac("sha256", publicKey)
      .update(body)
      .digest("base64");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.warn({}, "[RevenueCat Webhook] Signature verification failed");
      return {
        valid: false,
        error: "Invalid signature",
      };
    }

    return { valid: true };
  } catch (error) {
    logger.error({ err: error }, "[RevenueCat Webhook] Signature verification error");
    return {
      valid: false,
      error: "Signature verification failed",
    };
  }
}

/**
 * Idempotency tracking to prevent duplicate webhook processing
 * Store webhook IDs in database to detect replays
 */
export async function checkIdempotencyKey(
  webhookId: string,
  webhookType: string
): Promise<{ isDuplicate: boolean }> {
  // TODO: Implement with database
  // For now, return false (no duplicate)
  // In production:
  // 1. Check if webhookId exists in idempotency_keys table
  // 2. If exists, return { isDuplicate: true }
  // 3. If not, insert it and return { isDuplicate: false }
  return { isDuplicate: false };
}

/**
 * Log webhook event for audit trail
 */
export function logWebhookEvent(
  webhookType: string,
  webhookId: string,
  eventType: string,
  userId?: number,
  details?: Record<string, unknown>
) {
  logger.info({
    webhookType,
    webhookId,
    eventType,
    userId,
    ...details,
  }, `[Webhook] ${webhookType} - ${eventType}`);
}

/**
 * Validate webhook payload structure
 */
export function validateWebhookPayload(
  payload: unknown,
  requiredFields: string[]
): { valid: boolean; error?: string } {
  if (!payload || typeof payload !== "object") {
    return {
      valid: false,
      error: "Invalid payload format",
    };
  }

  const obj = payload as Record<string, unknown>;

  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === null || obj[field] === undefined) {
      return {
        valid: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Secure webhook endpoint wrapper
 * Handles signature verification, idempotency, and error handling
 */
export async function secureWebhookHandler(
  webhookId: string,
  webhookType: "stripe" | "revenuecat",
  signature: string | undefined,
  body: string,
  handler: () => Promise<void>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify signature
    let signatureValid = false;
    if (webhookType === "stripe") {
      const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!stripeSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET not configured");
      }
      const result = verifyStripeWebhookSignature(body, signature, stripeSecret);
      signatureValid = result.valid;
      if (!signatureValid) {
        logger.error({}, `[Webhook] ${webhookType} signature verification failed`);
        return { success: false, error: result.error };
      }
    } else if (webhookType === "revenuecat") {
      const rcSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
      if (!rcSecret) {
        throw new Error("REVENUECAT_WEBHOOK_SECRET not configured");
      }
      const result = verifyRevenueCatWebhookSignature(body, signature, rcSecret);
      signatureValid = result.valid;
      if (!signatureValid) {
        logger.error({}, `[Webhook] ${webhookType} signature verification failed`);
        return { success: false, error: result.error };
      }
    }

    // Check for duplicate (idempotency)
    const { isDuplicate } = await checkIdempotencyKey(webhookId, webhookType);
    if (isDuplicate) {
      logger.warn({ webhookId }, `[Webhook] Duplicate ${webhookType} webhook detected`);
      return { success: true }; // Return success to prevent retry
    }

    // Process webhook
    await handler();
    logWebhookEvent(webhookType, webhookId, "processed");
    return { success: true };
  } catch (error) {
    logger.error({ err: error, webhookId }, `[Webhook] ${webhookType} processing failed`);
    return { success: false, error: "Webhook processing failed" };
  }
}
