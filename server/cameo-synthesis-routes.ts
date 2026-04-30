/**
 * Cameo Synthesis tRPC Routes
 * Handles cameo-synthesis, voice clone training, and biometric verification
 */

import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  analyzeHeadTurnScan,
  trainVoiceClone,
  handleCameoSynthesis,
  verifyCameoScanCompletion,
  getUserVoiceClone,
  getMusicStudioGateMessage,
} from "./integrations/cameo-biometric-bridge";

export const cameoSynthesisRouter = router({
  /**
   * POST /trpc/cameo-synthesis.analyzeScan
   * Analyze head-turn video and extract biometric data
   */
  analyzeScan: protectedProcedure
    .input(
      z.object({
        videoUri: z.string().url("Invalid video URI"),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        const scanData = await analyzeHeadTurnScan(input.videoUri);
        scanData.userId = ctx.user.id;

        // Train voice clone from scan data
        const voiceClone = await trainVoiceClone(scanData);

        return {
          success: true,
          voiceCloneId: voiceClone.voiceCloneId,
          voiceProfile: voiceClone,
          message: "Cameo Scan completed successfully. Your AI voice clone is ready!",
        };
      } catch (error) {
        console.error("Cameo scan analysis failed:", error);
        return {
          success: false,
          error: "Failed to analyze Cameo Scan. Please try again.",
        };
      }
    }),

  /**
   * POST /trpc/cameo-synthesis.generateMusic
   * Generate music with user's voice clone
   */
  generateMusic: protectedProcedure
    .input(
      z.object({
        lyrics: z.string().min(10, "Lyrics must be at least 10 characters"),
        genre: z.enum(["Pop", "Country", "EDM", "Latin", "Rock", "R&B", "Hip-Hop"]),
        duration: z.number().min(30).max(300), // 30 seconds to 5 minutes
        style: z.enum(["cinematic", "energetic", "smooth", "powerful"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // Verify user has completed Cameo Scan
        const hasScanned = await verifyCameoScanCompletion(ctx.user.id);
        if (!hasScanned) {
          return {
            success: false,
            error: "Voice Identity Not Found. Complete your Cameo Scan to unlock your AI Clone.",
            requiresScan: true,
          };
        }

        // Get user's voice clone
        const voiceClone = await getUserVoiceClone(ctx.user.id);
        if (!voiceClone) {
          return {
            success: false,
            error: "Voice clone not found. Please complete your Cameo Scan.",
            requiresScan: true,
          };
        }

        // Generate music with voice clone
        const result = await handleCameoSynthesis(
          {
            userId: ctx.user.id,
            voiceCloneId: voiceClone.voiceCloneId,
            lyrics: input.lyrics,
            genre: input.genre,
            duration: input.duration,
            style: input.style,
          },
          voiceClone
        );

        return {
          success: result.status === "success",
          audioUri: result.audioUri,
          videoUri: result.videoUri,
          processingTimeMs: result.processingTimeMs,
          message: "Music generated successfully with your AI voice!",
        };
      } catch (error) {
        console.error("Music generation failed:", error);
        return {
          success: false,
          error: "Failed to generate music. Please try again.",
        };
      }
    }),

  /**
   * GET /trpc/cameo-synthesis.getVoiceClone
   * Get user's voice clone profile
   */
  getVoiceClone: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      const voiceClone = await getUserVoiceClone(ctx.user.id);

      if (!voiceClone) {
        const gateMessage = getMusicStudioGateMessage();
        return {
          found: false,
          gateMessage,
          message: "No voice clone found. Please complete your Cameo Scan.",
        };
      }

      return {
        found: true,
        voiceClone,
        gateMessage: null,
        message: "Voice clone profile retrieved successfully.",
      };
    } catch (error) {
      console.error("Failed to retrieve voice clone:", error);
      return {
        found: false,
        error: "Failed to retrieve voice clone profile.",
      };
    }
  }),

  /**
   * GET /trpc/cameo-synthesis.checkScanStatus
   * Check if user has completed Cameo Scan
   */
  checkScanStatus: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      const hasScanned = await verifyCameoScanCompletion(ctx.user.id);
      const voiceClone = hasScanned ? await getUserVoiceClone(ctx.user.id) : null;

      return {
        hasScanned,
        voiceCloneId: voiceClone?.voiceCloneId || null,
        trainingStatus: voiceClone?.trainingStatus || "not_started",
        message: hasScanned
          ? "Cameo Scan completed. Your AI voice clone is ready!"
          : "Please complete your Cameo Scan to unlock the Music Studio.",
      };
    } catch (error) {
      console.error("Failed to check scan status:", error);
      return {
        hasScanned: false,
        error: "Failed to check Cameo Scan status.",
      };
    }
  }),

  /**
   * POST /trpc/cameo-synthesis.verifyMusicStudioAccess
   * Verify user can access Music Studio (gate logic)
   */
  verifyMusicStudioAccess: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      const hasScanned = await verifyCameoScanCompletion(ctx.user.id);

      if (!hasScanned) {
        return {
          canAccess: false,
          gateMessage: "Voice Identity Not Found. Complete your Cameo Scan to unlock your AI Clone.",
          redirectToScan: true,
        };
      }

      return {
        canAccess: true,
        gateMessage: null,
        redirectToScan: false,
        message: "Music Studio access granted.",
      };
    } catch (error) {
      console.error("Failed to verify Music Studio access:", error);
      return {
        canAccess: false,
        error: "Failed to verify access.",
      };
    }
  }),
});
