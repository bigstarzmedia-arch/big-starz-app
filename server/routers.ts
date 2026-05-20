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

  // Tiered Video Generation (Free: Grok, Pro: Kling, Elite: Seedance)
  tieredVideos: router({
    generate: protectedProcedure
      .input(videoGenerationSchema)
      .mutation(async ({ ctx, input }) => {
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
        videoId: z.string(),
        provider: z.enum(["grok", "kling", "seedance"]),
      }))
      .query(async ({ input }) => {
        const api = new TieredVideoAPI();
        return api.checkStatus(input.videoId, input.provider);
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
      }))
      .mutation(({ ctx, input }) => {
        return db.createVideoGeneration(ctx.user.id, input.title || "Untitled");
      }),
  }),

  // Music Generation (Hugging Face MusicGen)
  music: router({
    create: protectedProcedure
      .input(z.object({
        prompt: z.string().min(5).max(500),
        duration: z.number().min(5).max(30),
        style: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createVideoGeneration(ctx.user.id, input.prompt);
      }),

    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserVideoGenerations(ctx.user.id);
    }),
  }),





  // System Status
  status: publicProcedure.query(() => ({
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

  // Google Drive Integration
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
        videoPath: z.string(),
        fileName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return googleDrive.saveVideoToDrive(
          input.videoPath,
          input.fileName,
          `Big Starz Generated/${ctx.user.id}`
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
