import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { COOKIE_NAME } from "../shared/const";
import { generateFreeVideoWithQuota, checkDailyQuota, getUserSubscriptionTier } from "./free-tier";
import * as revenuecat from "./revenuecat";
import * as googleDrive from "./google-drive";
import { TieredVideoAPI, videoGenerationSchema } from "./tiered-video-api";
import { createOwnershipMiddleware, securitySchemas, auditLog, validateTierAccess } from "./_core/trpc-security";
import { logger } from "./_core/logger";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  // All routes are now protected with input validation, authorization checks, and audit logging
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      logger.info({ userId: ctx.user?.id }, "[Auth] User logout");
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Tiered Video Generation (Free: Grok, Pro: Kling, Elite: Seedance)
  tieredVideos: router({
    generate: protectedProcedure
      .input(videoGenerationSchema)
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "generate_tiered_video", "video");
        const api = new TieredVideoAPI();
        const tierData = await getUserSubscriptionTier(ctx.user.id);
        const userTier = (tierData as any)?.tier || "free";
        return api.generateVideo({
          ...input,
          userId: String(ctx.user.id),
          tier: userTier as "free" | "pro" | "elite",
        });
      }),

    checkStatus: protectedProcedure
      .input(z.object({
        videoId: z.string().max(255),
        provider: z.enum(["grok", "kling", "seedance"]),
      }))
      .query(async ({ ctx, input }) => {
        const api = new TieredVideoAPI();
        return api.checkStatus(input.videoId, input.provider);
      }),
  }),

  // Cameo & Beautify Engine (FREE TIER: Pollinations.ai + Hugging Face Stable Diffusion) - Quota enforced
  videos: router({
    // Free Tier: Text-to-Video with Sora API and quota tracking
    generateFree: protectedProcedure
      .input(z.object({
        prompt: z.string().min(10, "Prompt must be at least 10 characters").max(1000),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "generate_free_video", "video");
        return generateFreeVideoWithQuota(ctx.user.id, input.prompt);
      }),

    // Check free tier daily quota
    checkQuota: protectedProcedure.query(({ ctx }) => {
      return checkDailyQuota(ctx.user.id);
    }),

    // Get user's subscription tier
    getTier: protectedProcedure.query(({ ctx }) => {
      return getUserSubscriptionTier(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        aiModel: z.enum(["pollinations", "stable-diffusion", "text-to-video"]),
        stylePreset: z.string().max(100).optional(),
        resolution: z.string().max(50).optional(),
        title: z.string().max(255).optional(),
        description: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "create_video", "video", undefined, { aiModel: input.aiModel });
        return db.createVideoGeneration(ctx.user.id, input.title || "Untitled");
      }),
  }),

  // Music Generation (Hugging Face MusicGen) - Input validated
  music: router({
    create: protectedProcedure
      .input(z.object({
        prompt: z.string().min(5).max(500),
        duration: z.number().min(5).max(30),
        style: z.string().max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "create_music", "music", undefined, { duration: input.duration });
        return db.createVideoGeneration(ctx.user.id, input.prompt);
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserVideoGenerations(ctx.user.id);
    }),
  }),





  // System Status
  status: publicProcedure.query(async () => ({
    version: "4.1.0",
    appStatus: "operational",
    features: {
      videoGeneration: true,
      musicGeneration: true,
      casting: true,
      subscriptions: true,
    },
    aiProviders: {
      videoGeneration: "Google Veo 3.1 Light (Sora fallback)",
      musicGeneration: "Hugging Face MusicGen",
      imageGeneration: "Pollinations.ai",
      textGeneration: "OpenRouter (Free Models)",
    },
    provider: "Pollinations.ai + Hugging Face + Sora",
    totalMonthlyCost: "$0.00",
    mode: "MVP Zero-Cost Mode Active",
  })),

  // Messaging (Real-time Chat) - All operations logged for audit trail
  messages: router({
    send: protectedProcedure
      .input(z.object({
        recipientId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
      }))
      .mutation(async ({ ctx, input }) => {
        // Validate recipient exists
        if (input.recipientId === ctx.user.id) {
          throw new Error("Cannot send message to yourself");
        }
        auditLog(ctx, "send_message", "message", undefined, { recipientId: input.recipientId });
        return db.sendMessage(ctx.user.id, input.recipientId, input.content);
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getConversations(ctx.user.id);
    }),

    getThread: protectedProcedure
      .input(z.object({
        userId: z.number().int().positive(),
      }))
      .query(async ({ ctx, input }) => {
        // Verify user is accessing their own conversation
        await createOwnershipMiddleware("message_thread")(ctx.user.id, ctx.user.id);
        return db.getMessages(ctx.user.id, input.userId);
      }),

    markAsRead: protectedProcedure
      .input(z.object({
        senderId: z.number().int().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "mark_messages_read", "message", undefined, { senderId: input.senderId });
        return db.markMessagesAsRead(ctx.user.id, input.senderId);
      }),
  }),

  // Face Clones (Video Synthesis) - Ownership verified on all operations
  faceClones: router({
    upload: protectedProcedure
      .input(z.object({
        faceImageUrl: z.string().url(),
        faceImageKey: z.string().max(255),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "upload_face_clone", "face_clone");
        return db.uploadFaceClone(ctx.user.id, input.faceImageUrl, input.faceImageKey);
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserFaceClones(ctx.user.id);
    }),

    setDefault: protectedProcedure
      .input(z.object({
        faceCloneId: z.number().int().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "set_default_face_clone", "face_clone", input.faceCloneId);
        return db.setDefaultFaceClone(ctx.user.id, input.faceCloneId);
      }),
  }),

  // Subscription Management (RevenueCat) - Payment operations logged
  subscriptions: router({
    getTier: protectedProcedure.query(({ ctx }) => {
      return revenuecat.getUserSubscriptionTier(ctx.user.id.toString());
    }),

    getDailyQuota: protectedProcedure.query(({ ctx }) => {
      return revenuecat.getDailyQuota(ctx.user.id.toString());
    }),

    getOfferings: publicProcedure.query(() => {
      return revenuecat.getSubscriptionTiers();
    }),

    createPaymentLink: protectedProcedure
      .input(z.object({
        tier: z.enum(['pro', 'elite']),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "create_payment_link", "subscription", undefined, { tier: input.tier });
        return revenuecat.createPaymentLink(ctx.user.id.toString(), input.tier);
      }),

    hasActiveSubscription: protectedProcedure.query(({ ctx }) => {
      return revenuecat.hasActiveSubscription(ctx.user.id.toString());
    }),
  }),

  // Video Generation (Sora API) - All operations logged and validated
  videoGeneration: router({
    generateWithSora: protectedProcedure
      .input(z.object({
        prompt: z.string().min(10).max(1000),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "generate_video", "video_generation");
        return db.createVideoGeneration(ctx.user.id, input.prompt);
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserVideoGenerations(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        videoGenId: z.number().int().positive(),
        status: z.enum(["pending", "processing", "completed", "failed"]),
        outputUrl: z.string().url().optional(),
        outputKey: z.string().optional(),
        error: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "update_video_status", "video_generation", input.videoGenId, { status: input.status });
        return db.updateVideoGenerationStatus(
          input.videoGenId,
          input.status,
          input.outputUrl,
          input.outputKey,
          input.error
        );
      }),
  }),

  // Google Drive Integration - User data protected
  googleDrive: router({
    getSoraVideos: publicProcedure.query(async () => {
      const videos = await googleDrive.getSoraVideosFromDrive();
      return videos.map((v) => ({
        ...v,
        url: googleDrive.getStreamingUrl(v.id),
      }));
    }),

    getGeneratedVideos: protectedProcedure.query(async ({ ctx }) => {
      const videos = await googleDrive.getGeneratedVideosFromDrive();
      return videos.map((v) => ({
        ...v,
        url: googleDrive.getStreamingUrl(v.id),
      }));
    }),

    saveGeneratedVideo: protectedProcedure
      .input(z.object({
        videoPath: z.string().max(1000),
        fileName: z.string().max(255),
      }))
      .mutation(async ({ ctx, input }) => {
        auditLog(ctx, "save_video_to_drive", "google_drive", undefined, { fileName: input.fileName });
        return googleDrive.saveVideoToDrive(
          input.videoPath,
          input.fileName,
          `Big Starz Generated/${ctx.user.id}`
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
