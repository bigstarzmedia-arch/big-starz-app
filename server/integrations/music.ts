import axios from "axios";
import { invokeLLM } from "../_core/llm";

/**
 * Music Generation Integration
 * Handles lyric generation (OpenAI/Anthropic) and TTS (ElevenLabs)
 */

interface LyricGenerationRequest {
  prompt: string;
  model: "openai" | "anthropic";
  style?: string;
  length?: "short" | "medium" | "long";
}

interface LyricGenerationResponse {
  lyrics: string;
  model: string;
  tokensUsed: number;
}

interface TTSRequest {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
}

interface TTSResponse {
  audioUrl: string;
  audioKey: string;
  duration: number;
}

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Generate lyrics using OpenAI GPT-4
 */
export async function generateLyricsOpenAI(
  prompt: string,
  style: string = "hip-hop",
  length: "short" | "medium" | "long" = "medium"
): Promise<LyricGenerationResponse> {
  try {
    const lengthGuide = {
      short: "2-3 verses",
      medium: "3-4 verses with chorus",
      long: "4-5 verses with multiple chorus repeats",
    };

    const systemPrompt = `You are a professional songwriter specializing in ${style} music. Generate original, creative lyrics based on the user's prompt. The lyrics should be engaging, authentic, and suitable for a music video. Format the output with clear verse and chorus sections.`;

    const userPrompt = `Create ${lengthGuide[length]} of ${style} lyrics based on this concept: ${prompt}. Make it catchy, memorable, and suitable for a music video.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const lyrics = typeof content === "string" ? content : "";

    return {
      lyrics,
      model: "openai",
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error("OpenAI lyric generation error:", error);
    throw new Error(`Failed to generate lyrics with OpenAI: ${error}`);
  }
}

/**
 * Generate lyrics using Anthropic Claude
 */
export async function generateLyricsAnthropic(
  prompt: string,
  style: string = "hip-hop",
  length: "short" | "medium" | "long" = "medium"
): Promise<LyricGenerationResponse> {
  try {
    const lengthGuide = {
      short: "2-3 verses",
      medium: "3-4 verses with chorus",
      long: "4-5 verses with multiple chorus repeats",
    };

    const systemPrompt = `You are a professional songwriter specializing in ${style} music. Generate original, creative lyrics based on the user's prompt. The lyrics should be engaging, authentic, and suitable for a music video. Format the output with clear verse and chorus sections.`;

    const userPrompt = `Create ${lengthGuide[length]} of ${style} lyrics based on this concept: ${prompt}. Make it catchy, memorable, and suitable for a music video.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const lyrics = typeof content === "string" ? content : "";

    return {
      lyrics,
      model: "anthropic",
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error("Anthropic lyric generation error:", error);
    throw new Error(`Failed to generate lyrics with Anthropic: ${error}`);
  }
}

/**
 * Generate lyrics using specified model
 */
export async function generateLyrics(
  prompt: string,
  model: "openai" | "anthropic" = "openai",
  style: string = "hip-hop",
  length: "short" | "medium" | "long" = "medium"
): Promise<LyricGenerationResponse> {
  if (model === "openai") {
    return generateLyricsOpenAI(prompt, style, length);
  } else {
    return generateLyricsAnthropic(prompt, style, length);
  }
}

/**
 * Generate speech using ElevenLabs TTS
 */
export async function generateSpeech(
  text: string,
  voiceId: string,
  stability: number = 0.5,
  similarityBoost: number = 0.75
): Promise<TTSResponse> {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const response = await axios.post(
      `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost,
        },
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = Buffer.from(response.data);
    const audioBase64 = audioBuffer.toString("base64");

    return {
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      audioKey: `audio/${Date.now()}-${voiceId}.mp3`,
      duration: Math.ceil(text.length / 150),
    };
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    throw new Error(`Failed to generate speech: ${error}`);
  }
}

/**
 * List available ElevenLabs voices
 */
export async function listElevenLabsVoices() {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const response = await axios.get(`${ELEVENLABS_API_BASE}/voices`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    return response.data.voices;
  } catch (error) {
    console.error("ElevenLabs voices list error:", error);
    throw new Error(`Failed to list ElevenLabs voices: ${error}`);
  }
}

/**
 * Get ElevenLabs voice details
 */
export async function getElevenLabsVoiceDetails(voiceId: string) {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const response = await axios.get(`${ELEVENLABS_API_BASE}/voices/${voiceId}`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("ElevenLabs voice details error:", error);
    throw new Error(`Failed to get voice details: ${error}`);
  }
}
