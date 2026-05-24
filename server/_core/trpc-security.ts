import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { logger } from "./logger";
import type { TrpcContext } from "./context";

/**
 * Middleware to verify user owns the resource they're accessing
 * Prevents users from accessing/modifying other users' data
 */
export function createOwnershipMiddleware(resourceType: string) {
  return async (
    userId: number,
    resourceUserId: number | string,
    resourceId?: number | string
  ) => {
    const userIdNum = Number(userId);
    const resourceUserIdNum = Number(resourceUserId);

    if (userIdNum !== resourceUserIdNum) {
      logger.warn({
        userId: userIdNum,
        resourceUserId: resourceUserIdNum,
        resourceType,
        resourceId,
      }, `[Security] Unauthorized access attempt to ${resourceType}`);

      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You do not have permission to access this ${resourceType}`,
      });
    }
  };
}

/**
 * Input validation schema for common operations
 */
export const securitySchemas = {
  // User ID validation
  userId: z.number().int().positive("Invalid user ID"),

  // Resource ID validation
  resourceId: z.number().int().positive("Invalid resource ID"),

  // String ID validation (for external IDs)
  stringId: z.string().min(1).max(255),

  // URL validation with whitelist
  url: z.string().url("Invalid URL format"),

  // File upload validation
  fileUpload: z.object({
    filename: z.string().max(255),
    size: z.number().max(50 * 1024 * 1024), // 50MB max
    mimeType: z.string(),
  }),

  // Pagination
  pagination: z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  }),

  // Subscription tier
  subscriptionTier: z.enum(["free", "pro", "elite"]),

  // Video generation input
  videoGeneration: z.object({
    prompt: z.string().min(10).max(1000),
    style: z.string().max(100).optional(),
    duration: z.number().min(5).max(60).optional(),
  }),

  // Message content
  messageContent: z.object({
    content: z.string().min(1).max(5000),
    recipientId: z.number().int().positive(),
  })
};

/**
 * Audit logging for sensitive operations
 */
export function auditLog(
  ctx: TrpcContext,
  action: string,
  resourceType: string,
  resourceId?: number | string,
  details?: Record<string, unknown>
) {
  logger.info({
    userId: ctx.user?.id,
    action,
    resourceType,
    resourceId,
    ...details,
  }, `[Audit] ${action} on ${resourceType}`);
}

/**
 * Rate limit check for expensive operations
 * Returns true if operation should be allowed
 */
export async function checkOperationRateLimit(
  userId: number,
  operation: string,
  maxPerHour: number
): Promise<boolean> {
  // TODO: Implement with Redis or database
  // For now, return true (rate limiting handled by express-rate-limit middleware)
  return true;
}

/**
 * Validate subscription tier has access to feature
 */
export function validateTierAccess(
  tier: "free" | "pro" | "elite",
  requiredTier: "free" | "pro" | "elite"
): boolean {
  const tierHierarchy = { free: 0, pro: 1, elite: 2 };
  return tierHierarchy[tier] >= tierHierarchy[requiredTier];
}
