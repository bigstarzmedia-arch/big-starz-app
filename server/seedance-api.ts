import axios from 'axios';

/**
 * Seedance 2.0 API Integration
 * Elite tier video generation with reference images, videos, and audio
 */

const ATLASCLOUD_API_KEY = process.env.ATLASCLOUD_API_KEY;
const BASE_URL = 'https://api.atlascloud.ai/api/v1';

export interface SeedanceGenerateRequest {
  prompt: string;
  referenceImages?: string[];
  referenceVideos?: string[];
  referenceAudios?: string[];
  duration?: number; // 4-15 seconds
  resolution?: '480p' | '720p' | '720p-SR' | '1080p' | '1080p-SR' | '1440p-SR';
  ratio?: '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | '21:9' | 'adaptive';
  generateAudio?: boolean;
  watermark?: boolean;
  returnLastFrame?: boolean;
}

export interface SeedanceVideoResponse {
  id: string;
  status: 'processing' | 'completed' | 'succeeded' | 'failed' | 'timeout';
  videoUrl?: string;
  lastFrameUrl?: string;
  error?: string;
  createdAt: string;
  completionTokens?: number;
  totalTokens?: number;
}

/**
 * Generate video using Seedance 2.0 API
 */
export async function generateSeedanceVideo(
  request: SeedanceGenerateRequest
): Promise<SeedanceVideoResponse> {
  if (!ATLASCLOUD_API_KEY) {
    throw new Error('ATLASCLOUD_API_KEY not configured');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ATLASCLOUD_API_KEY}`,
  };

  const payload = {
    model: 'bytedance/seedance-2.0/reference-to-video',
    prompt: request.prompt || 'The character in image 1 dances gracefully to the music',
    reference_images: request.referenceImages || [],
    reference_videos: request.referenceVideos || [],
    reference_audios: request.referenceAudios || [],
    duration: request.duration || 10,
    resolution: request.resolution || '1080p',
    ratio: request.ratio || 'adaptive',
    generate_audio: request.generateAudio !== false,
    watermark: request.watermark || false,
    return_last_frame: request.returnLastFrame || false,
  };

  try {
    // Step 1: Submit video generation request
    const generateResponse = await axios.post(`${BASE_URL}/model/generateVideo`, payload, {
      headers,
    });

    const predictionId = generateResponse.data?.data?.id;
    if (!predictionId) {
      throw new Error('No prediction ID returned from Seedance API');
    }

    // Step 2: Poll for completion
    const videoUrl = await pollSeedanceStatus(predictionId, headers);

    return {
      id: predictionId,
      status: 'completed',
      videoUrl,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Seedance video generation error:', error);
    throw error;
  }
}

/**
 * Poll Seedance API for video generation status
 */
async function pollSeedanceStatus(
  predictionId: string,
  headers: Record<string, string>,
  maxAttempts: number = 120 // 4 minutes with 2s intervals
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const statusResponse = await axios.get(
        `${BASE_URL}/model/prediction/${predictionId}`,
        { headers }
      );

      const status = statusResponse.data?.data?.status;
      const outputs = statusResponse.data?.data?.outputs;

      if (status === 'completed' || status === 'succeeded') {
        if (outputs && outputs.length > 0) {
          return outputs[0]; // Return video URL
        }
        throw new Error('No video URL in response');
      }

      if (status === 'failed' || status === 'timeout') {
        const error = statusResponse.data?.data?.error || 'Generation failed';
        throw new Error(`Seedance generation failed: ${error}`);
      }

      // Still processing, wait 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      if (attempts >= maxAttempts - 1) {
        throw new Error(`Seedance polling timeout after ${maxAttempts} attempts`);
      }
      throw error;
    }
  }

  throw new Error('Seedance video generation timeout');
}

/**
 * Get video generation status
 */
export async function getSeedanceStatus(predictionId: string): Promise<SeedanceVideoResponse> {
  if (!ATLASCLOUD_API_KEY) {
    throw new Error('ATLASCLOUD_API_KEY not configured');
  }

  const headers = {
    Authorization: `Bearer ${ATLASCLOUD_API_KEY}`,
  };

  try {
    const response = await axios.get(`${BASE_URL}/model/prediction/${predictionId}`, {
      headers,
    });

    const data = response.data?.data;
    const videoUrl = data?.outputs?.[0];

    return {
      id: predictionId,
      status: data?.status || 'processing',
      videoUrl,
      lastFrameUrl: data?.outputs?.[1],
      error: data?.error,
      createdAt: data?.created_at || new Date().toISOString(),
      completionTokens: data?.completion_tokens,
      totalTokens: data?.total_tokens,
    };
  } catch (error) {
    console.error('Error fetching Seedance status:', error);
    throw error;
  }
}

/**
 * Upload media to Seedance (for reference images/videos/audio)
 */
export async function uploadSeedanceMedia(
  filePath: string,
  fileType: 'image' | 'video' | 'audio'
): Promise<string> {
  if (!ATLASCLOUD_API_KEY) {
    throw new Error('ATLASCLOUD_API_KEY not configured');
  }

  const headers = {
    Authorization: `Bearer ${ATLASCLOUD_API_KEY}`,
  };

  try {
    // In production, you would read the file and upload it
    // For now, return a placeholder
    console.log(`Uploading ${fileType} from ${filePath}`);
    return `asset://uploaded-${Date.now()}`;
  } catch (error) {
    console.error('Error uploading to Seedance:', error);
    throw error;
  }
}
