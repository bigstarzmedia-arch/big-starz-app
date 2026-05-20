import { z } from "zod";

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
  provider: "grok" | "kling" | "seedance";
  status: "pending" | "processing" | "completed" | "failed";
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
  private seedanceApiKey = process.env.SEEDANCE_API_KEY;

  /**
   * Generate video based on user tier
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const { prompt, duration = 10, style = "cinematic", userId, tier } = request;

    try {
      switch (tier) {
        case "free":
          return await this.generateWithGrok(prompt, duration, style, userId);
        case "pro":
          return await this.generateWithKling(prompt, duration, style, userId);
        case "elite":
          return await this.generateWithSeedance(prompt, duration, style, userId);
        default:
          throw new Error(`Unknown tier: ${tier}`);
      }
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
    // Seedance - using their premium video generation endpoint
    const response = await fetch("https://api.seedance.ai/v1/videos/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.seedanceApiKey}`,
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}`,
        duration, // No limit for elite tier
        quality: "ultra",
        fps: 30,
        resolution: "4k",
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Seedance API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      videoId: data.video_id,
      videoUrl: data.video_url,
      provider: "seedance",
      status: "processing",
      createdAt: new Date(),
    };
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
        return this.seedanceApiKey || "";
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
