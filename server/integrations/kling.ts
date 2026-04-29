import axios from "axios";

/**
 * Kling AI API Integration
 * Handles video beautification and generation using Kling's video generation API
 */

interface KlingGenerateRequest {
  prompt: string;
  imageUrl?: string; // For image-to-video
  duration?: number; // 5, 10 seconds
  aspectRatio?: "9:16" | "16:9" | "1:1";
  negativePrompt?: string;
}

interface KlingGenerateResponse {
  taskId: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

interface KlingStatusResponse {
  taskId: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

const KLING_API_BASE = "https://api.klingai.com/v1";

/**
 * Generate JWT token for Kling API authentication
 * Required for all Kling API calls
 */
function generateKlingJWT(): string {
  const crypto = require("crypto");
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.KLING_ACCESS_KEY,
    exp: now + 1800, // 30 minutes
    nbf: now - 5,
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.KLING_SECRET_KEY)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Submit a video beautification request to Kling
 * Converts a base video into a high-quality beautified version
 */
export async function submitKlingBeautification(
  videoUrl: string,
  stylePreset: string = "cinematic",
  resolution: string = "1080p"
): Promise<KlingGenerateResponse> {
  try {
    const token = generateKlingJWT();

    // Construct beautification prompt based on style preset
    const prompts: Record<string, string> = {
      cinematic: "Ultra-slow-motion cinematic commercial, shot on ARRI Alexa, 8K resolution, photorealistic, professional color grading, luxury aesthetic",
      fashion: "High-fashion model showcase, professional lighting, luxury brand aesthetic, premium production quality, 8K resolution",
      performance: "Dynamic performance video, energetic cinematography, professional production, premium quality, 8K resolution",
      luxury: "Luxury lifestyle content, exclusive atmosphere, premium production, cinematic quality, 8K resolution",
    };

    const prompt = prompts[stylePreset] || prompts.cinematic;

    const response = await axios.post(
      `${KLING_API_BASE}/videos/text2video`,
      {
        prompt: prompt,
        imageUrl: videoUrl,
        duration: 10,
        aspectRatio: "16:9",
        negativePrompt: "low quality, blurry, generic",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      taskId: response.data.taskId,
      status: "processing",
    };
  } catch (error) {
    console.error("Kling API error:", error);
    throw new Error(`Failed to submit Kling beautification: ${error}`);
  }
}

/**
 * Check the status of a Kling video generation task
 */
export async function getKlingTaskStatus(taskId: string): Promise<KlingStatusResponse> {
  try {
    const token = generateKlingJWT();

    const response = await axios.get(`${KLING_API_BASE}/videos/status`, {
      params: { taskId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    return {
      taskId: data.taskId,
      status: data.status,
      videoUrl: data.videoUrl,
      error: data.error,
    };
  } catch (error) {
    console.error("Kling status check error:", error);
    throw new Error(`Failed to check Kling task status: ${error}`);
  }
}

/**
 * Poll Kling for task completion
 * Returns video URL when complete
 */
export async function waitForKlingCompletion(
  taskId: string,
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getKlingTaskStatus(taskId);

    if (status.status === "completed") {
      if (!status.videoUrl) {
        throw new Error("Kling returned completed status but no video URL");
      }
      return status.videoUrl;
    }

    if (status.status === "failed") {
      throw new Error(`Kling task failed: ${status.error}`);
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Kling task timeout after ${maxAttempts} attempts`);
}
