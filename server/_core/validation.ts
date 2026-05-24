import { z } from 'zod';

/**
 * Input validation schemas for all API endpoints and database operations
 * These schemas prevent malicious or invalid data from entering the system
 */

// User validation
export const UserInputSchema = z.object({
  openId: z.string().min(1, "openId is required"),
  name: z.string().max(100, "name must be 100 characters or less").nullable().optional(),
  email: z.string().email("invalid email format").nullable().optional(),
  loginMethod: z.enum(['oauth', 'email', 'phone']).optional(),
  role: z.enum(['user', 'creator', 'admin']).optional(),
  lastSignedIn: z.date().optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;

// Video validation
export const VideoInputSchema = z.object({
  userId: z.number().int().positive("userId must be a positive integer"),
  title: z.string().min(1).max(255, "title must be 255 characters or less"),
  url: z.string().url("invalid URL format"),
  thumbnail: z.string().url("invalid thumbnail URL").optional(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  processingProgress: z.number().min(0).max(100).optional(),
});

export type VideoInput = z.infer<typeof VideoInputSchema>;

// Music validation
export const MusicInputSchema = z.object({
  userId: z.number().int().positive("userId must be a positive integer"),
  title: z.string().min(1).max(255, "title must be 255 characters or less"),
  generatedMusicUrl: z.string().url("invalid URL format").optional(),
  lyrics: z.string().max(5000, "lyrics must be 5000 characters or less").optional(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type MusicInput = z.infer<typeof MusicInputSchema>;

// Casting validation
export const CastingInputSchema = z.object({
  title: z.string().min(1).max(255, "title must be 255 characters or less"),
  description: z.string().max(2000, "description must be 2000 characters or less"),
  brand: z.string().min(1).max(100, "brand must be 100 characters or less"),
  status: z.enum(['open', 'closed', 'filled']).optional(),
  compensation: z.string().optional(),
});

export type CastingInput = z.infer<typeof CastingInputSchema>;

// Casting Application validation
export const CastingApplicationInputSchema = z.object({
  userId: z.number().int().positive("userId must be a positive integer"),
  castingId: z.number().int().positive("castingId must be a positive integer"),
  status: z.enum(['pending', 'accepted', 'rejected']).optional(),
  portfolioUrl: z.string().url("invalid portfolio URL").optional(),
});

export type CastingApplicationInput = z.infer<typeof CastingApplicationInputSchema>;

// Payment validation
export const PaymentInputSchema = z.object({
  userId: z.number().int().positive("userId must be a positive integer"),
  amount: z.number().positive("amount must be positive"),
  currency: z.string().length(3, "currency must be 3-letter code").default('USD'),
  stripePaymentIntentId: z.string().min(1, "stripePaymentIntentId is required"),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});

export type PaymentInput = z.infer<typeof PaymentInputSchema>;

/**
 * Helper function to safely validate and parse input
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw error;
  }
}
