/**
 * Google Workspace Routes
 * tRPC procedures for Gmail and Google Sheets integrations
 * Triggers on user signup, video generation, music creation, and casting events
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as gmail from "./integrations/gmail";
import * as sheets from "./integrations/google-sheets";
import * as jotform from "./integrations/jotform-sheets";

export const googleWorkspaceRouter = router({
  // Gmail triggers
  gmail: router({
    /**
     * Send welcome email on user signup
     * Triggered automatically by auth flow
     */
    sendWelcomeEmail: protectedProcedure
      .input(
        z.object({
          userName: z.string(),
          userEmail: z.string().email(),
          subscriptionStatus: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const success = await gmail.sendWelcomeEmail({
          userEmail: input.userEmail,
          userName: input.userName,
          userId: ctx.user?.id || 0,
          signupDate: new Date(),
          subscriptionStatus: input.subscriptionStatus,
        });

        return { success, message: success ? "Welcome email sent" : "Failed to send email" };
      }),

    /**
     * Send subscription confirmation email
     */
    sendSubscriptionConfirmation: protectedProcedure
      .input(
        z.object({
          subscriptionTier: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const success = await gmail.sendSubscriptionConfirmationEmail(
          ctx.user?.email || "",
          ctx.user?.name || "User",
          input.subscriptionTier
        );

        return {
          success,
          message: success ? "Confirmation email sent" : "Failed to send email",
        };
      }),

    /**
     * Send casting opportunity notification
     */
    sendCastingNotification: protectedProcedure
      .input(
        z.object({
          castingBrand: z.string(),
          castingCompensation: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const success = await gmail.sendCastingNotificationEmail(
          ctx.user?.email || "",
          ctx.user?.name || "User",
          input.castingBrand,
          input.castingCompensation
        );

        return {
          success,
          message: success ? "Casting notification sent" : "Failed to send email",
        };
      }),
  }),

  // Google Sheets triggers
  sheets: router({
    /**
     * Initialize master dashboard spreadsheet
     * Called once during setup
     */
    initializeDashboard: protectedProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await sheets.initializeMasterDashboard(input.spreadsheetId);

        return {
          success,
          message: success
            ? "Dashboard initialized"
            : "Failed to initialize dashboard",
        };
      }),

    /**
     * Append user to Users sheet
     * Triggered on user signup
     */
    appendUser: protectedProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const success = await sheets.appendUserToSheet(input.spreadsheetId, {
          id: ctx.user?.id || 0,
          email: ctx.user?.email || "",
          name: ctx.user?.name || "Unknown",
          role: (ctx.user as any)?.role || "user",
          subscriberCount: 0,
          subscriptionStatus: "inactive",
          createdAt: (ctx.user as any)?.createdAt || new Date(),
          lastSignedIn: (ctx.user as any)?.lastSignedIn || new Date(),
          totalEarnings: "0",
        });

        return {
          success,
          message: success ? "User appended to sheet" : "Failed to append user",
        };
      }),

    /**
     * Append video to Videos sheet
     * Triggered on video upload
     */
    appendVideo: protectedProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
          videoId: z.number(),
          title: z.string().optional(),
          aiModel: z.string(),
          processingStatus: z.string(),
          createdAt: z.date(),
          beautifiedVideoUrl: z.string().optional(),
          stylePreset: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await sheets.appendVideoToSheet(input.spreadsheetId, {
          id: input.videoId,
          userId: 0, // Would be set from context in real implementation
          title: input.title || "",
          aiModel: input.aiModel,
          processingStatus: input.processingStatus,
          createdAt: input.createdAt,
          beautifiedVideoUrl: input.beautifiedVideoUrl || null,
          stylePreset: input.stylePreset || null,
        });

        return {
          success,
          message: success ? "Video appended to sheet" : "Failed to append video",
        };
      }),

    /**
     * Append music to Music sheet
     * Triggered on music creation
     */
    appendMusic: protectedProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
          musicId: z.number(),
          title: z.string().optional(),
          genre: z.string().optional(),
          lyricModel: z.string(),
          processingStatus: z.string(),
          createdAt: z.date(),
          generatedMusicUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await sheets.appendMusicToSheet(input.spreadsheetId, {
          id: input.musicId,
          userId: 0,
          title: input.title || "",
          genre: input.genre || "",
          lyricModel: input.lyricModel,
          processingStatus: input.processingStatus,
          createdAt: input.createdAt,
          generatedMusicUrl: input.generatedMusicUrl || null,
        });

        return {
          success,
          message: success ? "Music appended to sheet" : "Failed to append music",
        };
      }),

    /**
     * Append casting to Castings sheet
     */
    appendCasting: protectedProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
          castingId: z.number(),
          brandName: z.string(),
          productCategory: z.string(),
          compensation: z.string(),
          status: z.string(),
          applicationDeadline: z.date(),
          createdAt: z.date(),
        })
      )
      .mutation(async ({ input }) => {
        const success = await sheets.appendCastingToSheet(input.spreadsheetId, {
          id: input.castingId,
          brandName: input.brandName,
          productCategory: input.productCategory,
          compensation: input.compensation,
          status: input.status,
          applicationDeadline: input.applicationDeadline,
          createdAt: input.createdAt,
        });

        return {
          success,
          message: success ? "Casting appended to sheet" : "Failed to append casting",
        };
      }),

    /**
     * Get all users from Users sheet
     */
    getAllUsers: publicProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
        })
      )
      .query(async ({ input }) => {
        const users = await sheets.getAllUsersFromSheet(input.spreadsheetId);
        return { users, count: users.length };
      }),

    /**
     * Get all leads from Leads sheet
     */
    getAllLeads: publicProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
        })
      )
      .query(async ({ input }) => {
        const leads = await sheets.getAllLeadsFromSheet(input.spreadsheetId);
        return { leads, count: leads.length };
      }),
  }),

  // Jotform triggers
  jotform: router({
    /**
     * Process Jotform submission webhook
     * Automatically captures leads into Google Sheets
     */
    processSubmission: publicProcedure
      .input(
        z.object({
          spreadsheetId: z.string(),
          submission: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        const success = await jotform.processJotformSubmission(
          input.submission as unknown as jotform.JotformSubmission,
          input.spreadsheetId
        );

        return {
          success,
          message: success ? "Lead captured" : "Failed to capture lead",
        };
      }),

    /**
     * Sync historical Jotform submissions
     * One-time migration from Jotform to Google Sheets
     */
    syncHistorical: protectedProcedure
      .input(
        z.object({
          formId: z.string(),
          spreadsheetId: z.string(),
          limit: z.number().default(1000),
        })
      )
      .mutation(async ({ input }) => {
        const count = await jotform.syncHistoricalSubmissions(
          input.formId,
          input.spreadsheetId,
          input.limit
        );

        return {
          success: count > 0,
          synced: count,
          message: `Synced ${count} submissions`,
        };
      }),
  }),

  // Status & configuration
  status: router({
    /**
     * Check Google Workspace integration status
     */
    getStatus: publicProcedure.query(async () => {
      const hasGmailConfig = !!process.env.GMAIL_SENDER_EMAIL;
      const hasJotformConfig = !!process.env.JOTFORM_API_KEY;
      const hasJotformSecret = !!process.env.JOTFORM_WEBHOOK_SECRET;

      return {
        gmail: {
          configured: hasGmailConfig,
          senderEmail: process.env.GMAIL_SENDER_EMAIL as string || "Not configured",
        },
        jotform: {
          configured: hasJotformConfig && hasJotformSecret,
          hasApiKey: hasJotformConfig,
          hasWebhookSecret: hasJotformSecret,
        },
        sheets: {
          configured: true,
          note: "Requires spreadsheet ID from user",
        },
        allConfigured: hasGmailConfig && hasJotformConfig && hasJotformSecret,
      };
    }),

    /**
     * Get Gmail labels (for debugging)
     */
    getGmailLabels: publicProcedure.query(async () => {
      const labels = await gmail.listGmailLabels();
      return { labels, count: labels.length };
    }),
  }),
});

export type GoogleWorkspaceRouter = typeof googleWorkspaceRouter;
