import { z } from 'zod';
import jwt from 'jsonwebtoken';

/**
 * Kling AI Video Generation Service
 * Generates high-quality videos from text prompts or images
 * Docs: https://app.klingai.com/global/dev/document-api
 */

const KlingVideoGenerationSchema = z.object({
  prompt: z.string().min(10).max(500),
  duration: z.enum(['5', '10']).default('10'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('9:16'),
  imageUrl: z.string().url().optional(),
  negativePrompt: z.string().optional(),
});

export type KlingVideoGenerationInput = z.infer<typeof KlingVideoGenerationSchema>;

interface KlingVideoResponse {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
}

export class KlingVideoGenerator {
  private accessKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.klingai.com/v1';

  constructor() {
    this.accessKey = process.env.KLING_ACCESS_KEY || '';
    this.secretKey = process.env.KLING_SECRET_KEY || '';

    if (!this.accessKey || !this.secretKey) {
      throw new Error('KLING_ACCESS_KEY and KLING_SECRET_KEY are required');
    }
  }

  /**
   * Generate JWT token for Kling API authentication
   */
  private generateToken(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.accessKey,
      exp: now + 1800, // 30 minutes
      nbf: now - 5,
    };

    return jwt.sign(payload, this.secretKey, { algorithm: 'HS256' });
  }

  /**
   * Generate video from text prompt
   */
  async generateFromPrompt(input: KlingVideoGenerationInput): Promise<KlingVideoResponse> {
    try {
      const validated = KlingVideoGenerationSchema.parse(input);
      const token = this.generateToken();

      const response = await fetch(`${this.baseUrl}/videos/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: validated.prompt,
          negative_prompt: validated.negativePrompt,
          duration: validated.duration,
          aspect_ratio: validated.aspectRatio,
          image_url: validated.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        videoId: data.data.video_id,
        status: 'pending',
      };
    } catch (error) {
      console.error('Kling video generation error:', error);
      return {
        videoId: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check video generation status
   */
  async checkStatus(videoId: string): Promise<KlingVideoResponse> {
    try {
      const token = this.generateToken();

      const response = await fetch(`${this.baseUrl}/videos/status?video_id=${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.statusText}`);
      }

      const data = await response.json();
      const videoData = data.data;

      return {
        videoId,
        status: videoData.status as KlingVideoResponse['status'],
        videoUrl: videoData.video_url,
        errorMessage: videoData.error_message,
      };
    } catch (error) {
      console.error('Kling status check error:', error);
      return {
        videoId,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate video with character customization (for AI Cameo Studio)
   */
  async generateCameoVideo(
    characterPrompt: string,
    scriptText: string,
    musicUrl?: string
  ): Promise<KlingVideoResponse> {
    const fullPrompt = `
      Generate a professional cinematic video of ${characterPrompt} performing the following script:
      "${scriptText}"
      ${musicUrl ? `Sync the video to this music: ${musicUrl}` : ''}
      Style: Professional, high-quality, well-lit, cinematic production
      Duration: 10 seconds
    `.trim();

    return this.generateFromPrompt({
      prompt: fullPrompt,
      duration: '10',
      aspectRatio: '9:16',
    });
  }

  /**
   * Generate dance/casting video (for AI Casting System)
   */
  async generateCastingVideo(
    danceStyle: string,
    musicUrl: string,
    characterDescription: string
  ): Promise<KlingVideoResponse> {
    const prompt = `
      Generate a professional dance video of a ${characterDescription} performing ${danceStyle} dance moves.
      Sync the choreography to this music: ${musicUrl}
      Style: Professional music video quality, well-choreographed, high-energy
      Duration: 10 seconds
      Aspect ratio: 9:16 (vertical video for TikTok/Instagram Reels)
    `.trim();

    return this.generateFromPrompt({
      prompt,
      duration: '10',
      aspectRatio: '9:16',
    });
  }
}

/**
 * Singleton instance
 */
let klingInstance: KlingVideoGenerator | null = null;

export function getKlingGenerator(): KlingVideoGenerator {
  if (!klingInstance) {
    klingInstance = new KlingVideoGenerator();
  }
  return klingInstance;
}
