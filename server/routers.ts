import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { COOKIE_NAME } from "../shared/const";

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

  // Cameo & Beautify Engine
  videos: router({
    create: protectedProcedure
      .input(z.object({
        aiModel: z.enum(["kling", "heygen"]),
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

  // Music & Lyric Studio
  music: router({
    create: protectedProcedure
      .input(z.object({
        lyricModel: z.enum(["openai", "anthropic"]),
        voiceModel: z.string(),
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
          voiceModel: input.voiceModel,
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

  // Subscriber & Monetization
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

  // Subscription Management
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
});

export type AppRouter = typeof appRouter;
