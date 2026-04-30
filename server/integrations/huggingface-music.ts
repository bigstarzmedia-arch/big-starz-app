/**
 * Hugging Face FREE Inference API Integration
 * Music Generation using open-source models (MusicGen, AudioCraft)
 * ZERO COST MVP Strategy
 */

import axios from "axios";

export interface MusicGenerationRequest {
  prompt: string;
  duration?: number; // seconds, max 30
  genre?: string;
  bpm?: number;
  style?: string;
}

export interface MusicGenerationResponse {
  audioUrl: string;
  duration: number;
  model: string;
  timestamp: Date;
}

/**
 * Generate music using Hugging Face FREE MusicGen model
 * facebook/musicgen-small - FREE, no cost
 * Supports text-to-music generation
 */
export async function generateMusicWithMusicGen(
  request: MusicGenerationRequest
): Promise<MusicGenerationResponse> {
  try {
    const prompt = buildMusicPrompt(request);

    // Use Hugging Face free inference API
    // facebook/musicgen-small is a free, open-source model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        inputs: prompt,
        parameters: {
          max_length: request.duration ? request.duration * 50 : 600, // Approximate tokens
          temperature: 0.7,
          top_p: 0.9,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-music/musicgen_${Date.now()}.wav`;

    return {
      audioUrl: mockUrl,
      duration: request.duration || 30,
      model: "facebook/musicgen-small",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("MusicGen error:", error);
    throw new Error("Failed to generate music with MusicGen");
  }
}

/**
 * Generate music using Hugging Face FREE AudioCraft model
 * facebook/audiogen-medium - FREE, no cost
 * Supports audio generation from text descriptions
 */
export async function generateAudioWithAudioGen(
  request: MusicGenerationRequest
): Promise<MusicGenerationResponse> {
  try {
    const prompt = buildMusicPrompt(request);

    // Use Hugging Face free inference API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/audiogen-medium",
      {
        inputs: prompt,
        parameters: {
          max_length: request.duration ? request.duration * 50 : 600,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-music/audiogen_${Date.now()}.wav`;

    return {
      audioUrl: mockUrl,
      duration: request.duration || 30,
      model: "facebook/audiogen-medium",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("AudioGen error:", error);
    throw new Error("Failed to generate audio with AudioGen");
  }
}

/**
 * Generate beats using Hugging Face FREE model
 * Supports drum patterns and instrumental generation
 */
export async function generateBeats(
  request: MusicGenerationRequest
): Promise<MusicGenerationResponse> {
  try {
    const prompt = `Generate a ${request.genre || "hip-hop"} beat at ${request.bpm || 90} BPM. ${request.style || "energetic"}. Duration: ${request.duration || 30} seconds.`;

    // Use MusicGen for beat generation
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        inputs: prompt,
        parameters: {
          max_length: request.duration ? request.duration * 50 : 600,
          temperature: 0.6,
        },
      },
      {
        headers: {
          Authorization: process.env.HUGGINGFACE_API_KEY
            ? `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            : undefined,
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    // In production, upload to S3
    const mockUrl = `https://s3.amazonaws.com/big-starz-music/beats_${Date.now()}.wav`;

    return {
      audioUrl: mockUrl,
      duration: request.duration || 30,
      model: "facebook/musicgen-small",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Beat generation error:", error);
    throw new Error("Failed to generate beats");
  }
}

/**
 * Helper: Build optimized music generation prompt
 */
function buildMusicPrompt(request: MusicGenerationRequest): string {
  const parts = [
    request.prompt,
    request.genre ? `Genre: ${request.genre}` : "",
    request.bpm ? `BPM: ${request.bpm}` : "",
    request.style ? `Style: ${request.style}` : "",
    request.duration ? `Duration: ${request.duration} seconds` : "",
  ].filter(Boolean);

  return parts.join(". ");
}

/**
 * List available free Hugging Face music models
 */
export const FREE_HF_MUSIC_MODELS = {
  musicgen_small: {
    name: "facebook/musicgen-small",
    description: "Text-to-music generation (small model)",
    cost: "$0.00",
    maxDuration: 30,
  },
  musicgen_medium: {
    name: "facebook/musicgen-medium",
    description: "Text-to-music generation (medium model)",
    cost: "$0.00",
    maxDuration: 30,
  },
  audiogen: {
    name: "facebook/audiogen-medium",
    description: "Audio generation from text descriptions",
    cost: "$0.00",
    maxDuration: 30,
  },
  bark: {
    name: "suno/bark",
    description: "Text-to-speech with music generation",
    cost: "$0.00",
    maxDuration: 30,
  },
};
