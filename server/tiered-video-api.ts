import { z } from "zod";
import { processVideoWithWatermark } from "./watermark";
import { generateSeedanceVideo, getSeedanceStatus, type SeedanceGenerateRequest } from "./seedance-api";

export type UserTier = "free" | "pro" | "elite";

interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  style?: string;
  userId: string;
  tier: UserTier;
}

interface VideoGenerationResponse {
  videoId: string;
  videoUrl: string;
  watermarkedUrl?: string;
  provider: "grok" | "kling" | "seedance";
  status: "pending" | "processing" | "completed" | "failed";
  hasWatermark: boolean;
  createdAt: Date;
}

/**
 * Tiered Video Generation API
 * - Free Tier: Grok (free tier, limited quality)
 * - Pro Tier: Kling AI (better quality, faster processing)
 * - Elite Tier: Seedance (best quality, fastest processing)
 */
export class TieredVideoAPI {
  private grokApiKey = process.env.XAI_API_KEY;
  private klingAccessKey = process.env.KLING_ACCESS_KEY;
  private klingSecretKey = process.env.KLING_SECRET_KEY;
  private atlascloudApiKey = process.env.ATLASCLOUD_API_KEY;

  /**
   * Generate video based on user tier
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const { prompt, duration = 10, style = "cinematic", userId, tier } = request;

    try {
      let response: VideoGenerationResponse;

      switch (tier) {
        case "free":
          response = await this.generateWithGrok(prompt, duration, style, userId);
          break;
        case "pro":
          response = await this.generateWithKling(prompt, duration, style, userId);
          break;
        case "elite":
          response = await this.generateWithSeedance(prompt, duration, style, userId);
          break;
        default:
          throw new Error(`Unknown tier: ${tier}`);
      }

      // Apply watermark for non-Elite tiers
      if (tier !== "elite") {
        const watermarked = await processVideoWithWatermark({
          videoUrl: response.videoUrl,
          tier,
          position: "bottom-right",
          opacity: 0.6,
          scale: 1,
        });
        response.watermarkedUrl = watermarked.watermarkedUrl;
        response.hasWatermark = watermarked.hasWatermark;
      } else {
        response.hasWatermark = false;
      }

      return response;
    } catch (error) {
      console.error(`Video generation failed for tier ${tier}:`, error);
      throw error;
    }
  }

  /**
   * Generate video using Grok (Free Tier)
   * Limited to 30-second videos, lower quality
   */
  private async generateWithGrok(
    prompt: string,
    duration: number,
    style: string,
    userId: string
  ): Promise<VideoGenerationResponse> {
    // Grok free tier - using text-to-video endpoint
    const response = await fetch("https://api.x.ai/v1/video/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.grokApiKey}`,
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}`,
        duration: Math.min(duration, 30), // Max 30 seconds for free tier
        quality: "standard",
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      videoId: data.video_id,
      videoUrl: data.video_url,
      provider: "grok",
      status: "processing",
      hasWatermark: false, // Will be set by generateVideo()
      createdAt: new Date(),
    };
  }

  /**
   * Generate video using Kling AI (Pro Tier)
   * Up to 60-second videos, high quality
   */
  private async generateWithKling(
    prompt: string,
    duration: number,
    style: string,
    userId: string
  ): Promise<VideoGenerationResponse> {
    // Kling AI - using their video generation endpoint
    const response = await fetch("https://api.klingai.com/v1/videos/text2video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.klingAccessKey}`,
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}`,
        duration: Math.min(duration, 60), // Max 60 seconds for pro tier
        quality: "high",
        fps: 24,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Kling API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      videoId: data.video_id,
      videoUrl: data.video_url,
      provider: "kling",
      status: "processing",
      hasWatermark: false, // Will be set by generateVideo()
      createdAt: new Date(),
    };
  }

  /**
   * Generate video using Seedance (Elite Tier)
   * Unlimited duration, ultra-high quality, fastest processing
   */
  private async generateWithSeedance(
    prompt: string,
    duration: number,
    style: string,
    userId: string
  ): Promise<VideoGenerationResponse> {
    if (!this.atlascloudApiKey) {
      throw new Error('Seedance API key not configured');
    }

    try {
      const seedanceRequest: SeedanceGenerateRequest = {
        prompt: `${prompt}. Style: ${style}`,
        duration: Math.min(duration, 15), // Seedance max 15s
        resolution: '1440p-SR', // Super-resolution 4K for Elite
        ratio: '9:16', // Mobile vertical format
        generateAudio: true,
        watermark: false, // Elite tier - no watermark
        returnLastFrame: false,
      };

      const result = await generateSeedanceVideo(seedanceRequest);

      return {
        videoId: result.id,
        videoUrl: result.videoUrl || '',
        provider: 'seedance',
        status: result.status === 'completed' ? 'completed' : 'processing',
        hasWatermark: false, // Elite tier - no watermark
        createdAt: new Date(result.createdAt),
      };
    } catch (error) {
      console.error('Seedance generation error:', error);
      throw error;
    }
  }

  /**
   * Check video generation status
   */
  async checkStatus(videoId: string, provider: "grok" | "kling" | "seedance"): Promise<VideoGenerationResponse> {
    const endpoints: Record<string, string> = {
      grok: "https://api.x.ai/v1/video/status",
      kling: "https://api.klingai.com/v1/videos/status",
      seedance: "https://api.seedance.ai/v1/videos/status",
    };

    const response = await fetch(`${endpoints[provider]}?video_id=${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.getApiKeyForProvider(provider)}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      videoId: data.video_id,
      videoUrl: data.video_url || "",
      provider,
      status: data.status,
      hasWatermark: false,
      createdAt: new Date(data.created_at),
    };
  }

  private getApiKeyForProvider(provider: "grok" | "kling" | "seedance"): string {
    switch (provider) {
      case "grok":
        return this.grokApiKey || "";
      case "kling":
        return this.klingAccessKey || "";
      case "seedance":
        return this.atlascloudApiKey || "";
    }
  }
}

// Validation schema for video generation request
export const videoGenerationSchema = z.object({
  prompt: z.string().min(10).max(500),
  duration: z.number().min(5).max(120).optional(),
  style: z.enum(["cinematic", "anime", "neon", "fashion", "music-video"]).optional(),
  userId: z.string(),
  tier: z.enum(["free", "pro", "elite"]),
});
