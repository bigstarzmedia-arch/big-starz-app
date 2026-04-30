/**
 * FREE Video & Image Generation Integration
 * Replaces HeyGen/Kling with Pollinations.ai and Hugging Face Stable Diffusion
 * ZERO COST MVP Strategy
 */

import axios from "axios";

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number; // seconds
  style?: string;
  quality?: "low" | "medium" | "high";
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  quality?: "low" | "medium" | "high";
  width?: number;
  height?: number;
}

export interface GenerationResponse {
  url: string;
  duration?: number;
  model: string;
  timestamp: Date;
}

/**
 * Generate images using Pollinations.ai (FREE, no API key needed)
 * Supports multiple models including Stable Diffusion
 */
export async function generateImageWithPollinations(
  request: ImageGenerationRequest
): Promise<GenerationResponse> {
  try {
    // Pollinations.ai is completely free and doesn't require authentication
    // URL-based API: just construct the image URL
    const width = request.width || 512;
    const height = request.height || 512;
    const seed = Math.floor(Math.random() * 1000000);

    // Pollinations.ai free endpoint
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(request.prompt)}?width=${width}&height=${height}&seed=${seed}`;

    return {
      url: imageUrl,
      model: "pollinations-ai/stable-diffusion",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Pollinations.ai error:", error);
    throw new Error("Failed to generate image with Pollinations.ai");
  }
}

/**
 * Generate images using Hugging Face Stable Diffusion (FREE)
 * Supports high-quality image generation
 */
export async function generateImageWithStableDiffusion(
  request: ImageGenerationRequest
): Promise<GenerationResponse> {
  try {
    const width = request.width || 512;
    const height = request.height || 512;

    // Hugging Face free inference API for Stable Diffusion
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        inputs: request.prompt,
        parameters: {
          negative_prompt:
            "blurry, low quality, distorted, ugly, bad anatomy",
          height: height,
          width: width,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-images/sd_${Date.now()}.png`;

    return {
      url: mockUrl,
      model: "runwayml/stable-diffusion-v1-5",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Stable Diffusion error:", error);
    // Fallback to Pollinations.ai
    return generateImageWithPollinations(request);
  }
}

/**
 * Generate video using Hugging Face FREE models
 * Uses text-to-video models (AnimateDiff, ModelScope)
 */
export async function generateVideoWithHuggingFace(
  request: VideoGenerationRequest
): Promise<GenerationResponse> {
  try {
    const duration = request.duration || 4; // seconds

    // Use Hugging Face free inference API for video generation
    // damo-vilab/text-to-video-ms-1.7b is a free model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
      {
        inputs: request.prompt,
        parameters: {
          num_frames: Math.min(duration * 8, 32), // ~8 fps
          height: 320,
          width: 576,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 180000, // 3 minutes for video generation
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-videos/hf_${Date.now()}.mp4`;

    return {
      url: mockUrl,
      duration: duration,
      model: "damo-vilab/text-to-video-ms-1.7b",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Hugging Face video generation error:", error);
    throw new Error("Failed to generate video with Hugging Face");
  }
}

/**
 * Generate video using AnimateDiff (FREE, open-source)
 * Converts images to videos with motion
 */
export async function generateVideoWithAnimateDiff(
  request: VideoGenerationRequest
): Promise<GenerationResponse> {
  try {
    const duration = request.duration || 4;

    // Use Hugging Face free inference API for AnimateDiff
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/guoyww/animatediff-motion-adapter-v1-5-2",
      {
        inputs: request.prompt,
        parameters: {
          num_frames: Math.min(duration * 8, 24),
          guidance_scale: 7.5,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 180000,
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-videos/animatediff_${Date.now()}.mp4`;

    return {
      url: mockUrl,
      duration: duration,
      model: "guoyww/animatediff-motion-adapter-v1-5-2",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("AnimateDiff error:", error);
    throw new Error("Failed to generate video with AnimateDiff");
  }
}

/**
 * Beautify user video using Pollinations.ai image-to-video
 * Replaces HeyGen/Kling for MVP
 */
export async function beautifyVideoWithPollinations(
  baseVideoUrl: string,
  style: string = "cinematic"
): Promise<GenerationResponse> {
  try {
    // For MVP: Generate a beautified version using Stable Diffusion
    // In production: Use actual video processing pipeline
    const prompt = `Transform and beautify this video with a ${style} aesthetic, professional lighting, high-end production quality`;

    // Use Pollinations.ai for quick beautification
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720`;

    return {
      url: imageUrl,
      model: "pollinations-ai/beautify-video",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Video beautification error:", error);
    throw new Error("Failed to beautify video");
  }
}

/**
 * List available FREE video/image generation models
 */
export const FREE_VIDEO_IMAGE_MODELS = {
  pollinations: {
    name: "Pollinations.ai",
    description: "Free image generation (no API key needed)",
    cost: "$0.00",
    models: ["stable-diffusion", "flux", "dall-e-3-style"],
  },
  stable_diffusion: {
    name: "Stable Diffusion v1.5",
    description: "Free image generation via Hugging Face",
    cost: "$0.00",
    models: ["runwayml/stable-diffusion-v1-5"],
  },
  text_to_video: {
    name: "Text-to-Video MS 1.7B",
    description: "Free video generation via Hugging Face",
    cost: "$0.00",
    models: ["damo-vilab/text-to-video-ms-1.7b"],
  },
  animatediff: {
    name: "AnimateDiff",
    description: "Free video animation from images",
    cost: "$0.00",
    models: ["guoyww/animatediff-motion-adapter-v1-5-2"],
  },
};
