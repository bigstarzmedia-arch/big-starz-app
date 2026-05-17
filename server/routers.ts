import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { COOKIE_NAME } from "../shared/const";
import { generateFreeVideoWithQuota, checkDailyQuota, getUserSubscriptionTier } from "./free-tier";
import * as revenuecat from "./revenuecat";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Cameo & Beautify Engine (FREE TIER: Pollinations.ai + Hugging Face Stable Diffusion)
  videos: router({
    // Free Tier: Text-to-Video with Sora API and quota tracking
    generateFree: protectedProcedure
      .input(z.object({
        prompt: z.string().min(10, "Prompt must be at least 10 characters"),
      }))
      .mutation(({ ctx, input }) => {
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
        stylePreset: z.string().optional(),
        resolution: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        originalVideoUrl: z.string(),
        originalVideoKey: z.string(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createVideo({
          userId: ctx.user.id,
          aiModel: input.aiModel,
          stylePreset: input.stylePreset,
          resolution: input.resolution,
          title: input.title,
          description: input.description,
          originalVideoUrl: input.originalVideoUrl,
          originalVideoKey: input.originalVideoKey,
          processingStatus: "pending",
        });
      }),
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserVideos(ctx.user.id)
    ),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getVideoById(input.id)),
  }),

  // Music & Lyric Studio (FREE TIER: OpenRouter Free Models + Hugging Face MusicGen)
  music: router({
    create: protectedProcedure
      .input(z.object({
        lyricModel: z.enum(["gemini-flash-free", "llama-3.8b-free"]),
        musicModel: z.enum(["musicgen-small", "audiogen", "beats"]),
        lyricPrompt: z.string(),
        title: z.string().optional(),
        artist: z.string().optional(),
        genre: z.string().optional(),
        mood: z.string().optional(),
        instrumentalUrl: z.string(),
        instrumentalKey: z.string(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createMusic({
          userId: ctx.user.id,
          lyricModel: input.lyricModel,
          voiceModel: input.musicModel,
          lyricPrompt: input.lyricPrompt,
          title: input.title,
          artist: input.artist,
          genre: input.genre,
          mood: input.mood,
          instrumentalUrl: input.instrumentalUrl,
          instrumentalKey: input.instrumentalKey,
          processingStatus: "pending",
        });
      }),
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserMusic(ctx.user.id)
    ),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getMusicById(input.id)),
  }),

  // Affiliate Modeling Feature
  castings: router({
    list: publicProcedure.query(() => db.getAllCastings()),
    getOpen: publicProcedure.query(() => db.getOpenCastings()),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getCastingById(input.id)),
  }),

  // Casting Applications
  castingApplications: router({
    create: protectedProcedure
      .input(z.object({
        castingId: z.number(),
        portfolioVideoIds: z.array(z.number()).optional(),
        answers: z.record(z.string(), z.string()).optional(),
        availabilityConfirmed: z.boolean().default(false),
      }))
      .mutation(({ ctx, input }) => {
        return db.createCastingApplication({
          userId: ctx.user.id,
          castingId: input.castingId,
          portfolioVideoIds: input.portfolioVideoIds,
          answers: input.answers,
          availabilityConfirmed: input.availabilityConfirmed,
        });
      }),
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserCastingApplications(ctx.user.id)
    ),
  }),

  // Subscriber & Monetization (1k Gate)
  subscribers: router({
    getTracking: protectedProcedure.query(({ ctx }) =>
      db.getSubscriberTracking(ctx.user.id)
    ),
    updateCount: protectedProcedure
      .input(z.object({ count: z.number() }))
      .mutation(({ ctx, input }) =>
        db.updateSubscriberCount(ctx.user.id, input.count)
      ),
    enableCastingFees: protectedProcedure
      .input(z.object({ feeAmount: z.string() }))
      .mutation(({ ctx, input }) =>
        db.enableCastingFees(ctx.user.id, input.feeAmount)
      ),
  }),

  // Earnings & Payouts
  earnings: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserEarnings(ctx.user.id)
    ),
  }),

  // Subscription Management (RevenueCat)
  subscription: router({
    getStatus: protectedProcedure.query(({ ctx }) =>
      db.getUserSubscriptionStatus(ctx.user.id)
    ),
    updateStatus: protectedProcedure
      .input(z.object({
        revenueCatCustomerId: z.string(),
        status: z.enum(["active", "inactive", "cancelled"]),
        expiresAt: z.date().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.updateUserSubscription(ctx.user.id, input.revenueCatCustomerId, input.status, input.expiresAt)
      ),
  }),

  // Free-Tier API Status & Models
  freeTierStatus: router({
    getAvailableModels: publicProcedure.query(() => ({
      lyrics: {
        models: ["google/gemini-1.5-flash-exp:free", "meta-llama/llama-3-8b-instruct:free"],
        cost: "$0.00",
        provider: "OpenRouter",
      },
      music: {
        models: ["facebook/musicgen-small", "facebook/audiogen-medium"],
        cost: "$0.00",
        provider: "Hugging Face",
      },
      video: {
        models: ["Pollinations.ai", "Stable Diffusion v1.5", "Text-to-Video MS 1.7B", "Sora"],
        cost: "$0.00",
        provider: "Pollinations.ai + Hugging Face + Sora",
      },
      totalMonthlyCost: "$0.00",
      status: "MVP Zero-Cost Mode Active",
    })),
  }),

  // Messaging (Real-time Chat)
  messages: router({
    send: protectedProcedure
      .input(z.object({
        recipientId: z.number(),
        content: z.string().min(1).max(5000),
      }))
      .mutation(({ ctx, input }) => {
        return db.sendMessage(ctx.user.id, input.recipientId, input.content);
      }),
    
    list: protectedProcedure.query(({ ctx }) => {
      return db.getConversations(ctx.user.id);
    }),
    
    getThread: protectedProcedure
      .input(z.object({
        userId: z.number(),
      }))
      .query(({ ctx, input }) => {
        return db.getMessages(ctx.user.id, input.userId);
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({
        senderId: z.number(),
      }))
      .mutation(({ ctx, input }) => {
        return db.markMessagesAsRead(ctx.user.id, input.senderId);
      }),
  }),

  // Face Clones (Video Synthesis)
  faceClones: router({
    upload: protectedProcedure
      .input(z.object({
        faceImageUrl: z.string().url(),
        faceImageKey: z.string(),
      }))
      .mutation(({ ctx, input }) => {
        return db.uploadFaceClone(ctx.user.id, input.faceImageUrl, input.faceImageKey);
      }),
    
    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserFaceClones(ctx.user.id);
    }),
    
    setDefault: protectedProcedure
      .input(z.object({
        faceCloneId: z.number(),
      }))
      .mutation(({ ctx, input }) => {
        return db.setDefaultFaceClone(ctx.user.id, input.faceCloneId);
      }),
  }),

  // Subscription Management (RevenueCat)
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
      .mutation(({ ctx, input }) => {
        return revenuecat.createPaymentLink(ctx.user.id.toString(), input.tier);
      }),

    hasActiveSubscription: protectedProcedure.query(({ ctx }) => {
      return revenuecat.hasActiveSubscription(ctx.user.id.toString());
    }),
  }),

  // Video Generation (Sora API)
  videoGeneration: router({
    generateWithSora: protectedProcedure
      .input(z.object({
        prompt: z.string().min(10).max(1000),
      }))
      .mutation(({ ctx, input }) => {
        return db.createVideoGeneration(ctx.user.id, input.prompt);
      }),
    
    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserVideoGenerations(ctx.user.id);
    }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        videoGenId: z.number(),
        status: z.enum(["pending", "processing", "completed", "failed"]),
        outputUrl: z.string().optional(),
        outputKey: z.string().optional(),
        error: z.string().optional(),
      }))
      .mutation(({ input }) => {
        return db.updateVideoGenerationStatus(
          input.videoGenId,
          input.status,
          input.outputUrl,
          input.outputKey,
          input.error
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
