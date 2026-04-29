import axios from "axios";

/**
 * HeyGen API Integration
 * Handles video beautification and avatar-based video generation
 */

interface HeyGenGenerateRequest {
  avatarId: string;
  voiceId: string;
  scriptText: string;
  stylePreset?: string;
}

interface HeyGenGenerateResponse {
  videoId: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

interface HeyGenStatusResponse {
  videoId: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

const HEYGEN_API_BASE = "https://api.heygen.com/v2";
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

/**
 * Generate a beautified video using HeyGen avatars
 * Creates a high-quality video with professional avatar and voice
 */
export async function submitHeyGenBeautification(
  videoUrl: string,
  stylePreset: string = "cinematic"
): Promise<HeyGenGenerateResponse> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("HEYGEN_API_KEY not configured");
    }

    // Map style presets to HeyGen avatar and voice combinations
    const styleConfigs: Record<string, { avatarId: string; voiceId: string }> = {
      cinematic: {
        avatarId: "avatar_1", // Professional male avatar
        voiceId: "voice_1", // Deep, professional voice
      },
      fashion: {
        avatarId: "avatar_2", // Professional female avatar
        voiceId: "voice_2", // Clear, confident voice
      },
      performance: {
        avatarId: "avatar_3", // Dynamic avatar
        voiceId: "voice_3", // Energetic voice
      },
      luxury: {
        avatarId: "avatar_1",
        voiceId: "voice_1",
      },
    };

    const config = styleConfigs[stylePreset] || styleConfigs.cinematic;

    const response = await axios.post(
      `${HEYGEN_API_BASE}/video/generate`,
      {
        avatarId: config.avatarId,
        voiceId: config.voiceId,
        scriptText: `This is a professionally beautified video created with HeyGen. Watch as this content is transformed into a high-quality production with cinematic styling and professional presentation.`,
        videoUrl: videoUrl,
        stylePreset: stylePreset,
      },
      {
        headers: {
          "X-Api-Key": HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      videoId: response.data.videoId,
      status: "processing",
    };
  } catch (error) {
    console.error("HeyGen API error:", error);
    throw new Error(`Failed to submit HeyGen beautification: ${error}`);
  }
}

/**
 * Check the status of a HeyGen video generation task
 */
export async function getHeyGenTaskStatus(videoId: string): Promise<HeyGenStatusResponse> {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("HEYGEN_API_KEY not configured");
    }

    const response = await axios.get(`${HEYGEN_API_BASE}/video_status.get`, {
      params: { videoId },
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    const data = response.data;
    return {
      videoId: data.videoId,
      status: data.status,
      videoUrl: data.videoUrl,
      error: data.error,
    };
  } catch (error) {
    console.error("HeyGen status check error:", error);
    throw new Error(`Failed to check HeyGen task status: ${error}`);
  }
}

/**
 * Poll HeyGen for task completion
 * Returns video URL when complete
 */
export async function waitForHeyGenCompletion(
  videoId: string,
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getHeyGenTaskStatus(videoId);

    if (status.status === "completed") {
      if (!status.videoUrl) {
        throw new Error("HeyGen returned completed status but no video URL");
      }
      return status.videoUrl;
    }

    if (status.status === "failed") {
      throw new Error(`HeyGen task failed: ${status.error}`);
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`HeyGen task timeout after ${maxAttempts} attempts`);
}

/**
 * List available HeyGen avatars
 */
export async function listHeyGenAvatars() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("HEYGEN_API_KEY not configured");
    }

    const response = await axios.get(`${HEYGEN_API_BASE}/avatars`, {
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    return response.data.avatars;
  } catch (error) {
    console.error("HeyGen avatars list error:", error);
    throw new Error(`Failed to list HeyGen avatars: ${error}`);
  }
}

/**
 * List available HeyGen voices
 */
export async function listHeyGenVoices() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("HEYGEN_API_KEY not configured");
    }

    const response = await axios.get(`${HEYGEN_API_BASE}/voices`, {
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    return response.data.voices;
  } catch (error) {
    console.error("HeyGen voices list error:", error);
    throw new Error(`Failed to list HeyGen voices: ${error}`);
  }
}
