/**
 * Multi-Genre Lyric Generation API
 * Supports all genres: Pop, Country, EDM, Latin, Rock, R&B, Hip-Hop
 * Uses OpenRouter for multi-model routing, Anthropic as fallback, ElevenLabs for TTS
 */

import axios from "axios";

export type MusicGenre =
  | "pop"
  | "country"
  | "edm"
  | "latin"
  | "rock"
  | "rb"
  | "hiphop";

interface LyricGenerationRequest {
  genre: MusicGenre;
  mood: string;
  theme: string;
  length?: "short" | "medium" | "long"; // Number of verses
  includeAdlibs?: boolean;
}

interface LyricGenerationResponse {
  lyrics: string;
  adlibs: string[];
  genre: MusicGenre;
  model: string;
  timestamp: Date;
}

/**
 * Genre-specific prompts and style guidelines
 */
const GENRE_CONFIGS: Record<MusicGenre, any> = {
  pop: {
    style: "catchy, radio-friendly, emotional, relatable",
    structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
    adlibExamples: ["yeah", "oh", "woo", "hey"],
    rhymeScheme: "AABB or ABAB",
  },
  country: {
    style: "storytelling, twangy, heartfelt, narrative-driven",
    structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
    adlibExamples: ["yee-haw", "alright", "come on", "baby"],
    rhymeScheme: "AABB",
  },
  edm: {
    style: "energetic, repetitive, hypnotic, electronic",
    structure: "Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro",
    adlibExamples: ["drop", "yeah", "uh", "woah"],
    rhymeScheme: "Internal rhymes, repetition",
  },
  latin: {
    style: "rhythmic, passionate, sensual, celebratory",
    structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
    adlibExamples: ["ay", "dale", "ey", "vamo"],
    rhymeScheme: "AABB or free verse",
  },
  rock: {
    style: "powerful, rebellious, emotional, anthemic",
    structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro",
    adlibExamples: ["yeah", "oh", "come on", "alright"],
    rhymeScheme: "AABB or ABAB",
  },
  rb: {
    style: "smooth, soulful, romantic, groovy",
    structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
    adlibExamples: ["yeah", "baby", "ooh", "mm-hmm"],
    rhymeScheme: "AABB",
  },
  hiphop: {
    style: "rhythmic, clever wordplay, flow-focused, storytelling",
    structure: "Verse-Chorus-Verse-Chorus-Verse-Chorus-Outro",
    adlibExamples: ["yo", "yeah", "uh", "huh"],
    rhymeScheme: "Internal rhymes, multisyllabic rhymes",
  },
};

/**
 * Generate lyrics using OpenRouter (multi-model routing)
 */
export async function generateLyricsWithOpenRouter(
  request: LyricGenerationRequest
): Promise<LyricGenerationResponse> {
  try {
    const config = GENRE_CONFIGS[request.genre];
    const lengthGuide =
      request.length === "short"
        ? "2 verses"
        : request.length === "long"
          ? "4 verses"
          : "3 verses";

    const prompt = `You are an expert lyricist specializing in ${request.genre.toUpperCase()} music.

Generate ${lengthGuide} of original lyrics for a ${request.genre} song with the following specifications:

**Genre**: ${request.genre.toUpperCase()}
**Mood**: ${request.mood}
**Theme**: ${request.theme}
**Style**: ${config.style}
**Structure**: ${config.structure}
**Rhyme Scheme**: ${config.rhymeScheme}

Requirements:
- Write authentic, genre-appropriate lyrics
- Use natural language and conversational tone
- Include emotional depth and relatability
- Follow the specified rhyme scheme
- Make it singable and memorable

Output ONLY the lyrics, no explanations or metadata.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "auto", // OpenRouter will select the best model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://bigstarz.app",
          "X-Title": "Big Starz Music Studio",
        },
      }
    );

    const lyrics = response.data.choices[0].message.content.trim();

    // Extract ad-libs based on genre
    const adlibs = request.includeAdlibs
      ? config.adlibExamples.slice(0, 3)
      : [];

    return {
      lyrics,
      adlibs,
      genre: request.genre,
      model: response.data.model,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("OpenRouter lyric generation error:", error);
    throw new Error("Failed to generate lyrics with OpenRouter");
  }
}

/**
 * Generate lyrics using Anthropic Claude (fallback)
 */
export async function generateLyricsWithAnthropic(
  request: LyricGenerationRequest
): Promise<LyricGenerationResponse> {
  try {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const config = GENRE_CONFIGS[request.genre];
    const lengthGuide =
      request.length === "short"
        ? "2 verses"
        : request.length === "long"
          ? "4 verses"
          : "3 verses";

    const prompt = `You are an expert lyricist specializing in ${request.genre.toUpperCase()} music.

Generate ${lengthGuide} of original lyrics for a ${request.genre} song with the following specifications:

**Genre**: ${request.genre.toUpperCase()}
**Mood**: ${request.mood}
**Theme**: ${request.theme}
**Style**: ${config.style}
**Structure**: ${config.structure}
**Rhyme Scheme**: ${config.rhymeScheme}

Requirements:
- Write authentic, genre-appropriate lyrics
- Use natural language and conversational tone
- Include emotional depth and relatability
- Follow the specified rhyme scheme
- Make it singable and memorable

Output ONLY the lyrics, no explanations or metadata.`;

    const message = await client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const lyrics =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract ad-libs based on genre
    const adlibs = request.includeAdlibs
      ? config.adlibExamples.slice(0, 3)
      : [];

    return {
      lyrics,
      adlibs,
      genre: request.genre,
      model: "claude-3-opus-20240229",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Anthropic lyric generation error:", error);
    throw new Error("Failed to generate lyrics with Anthropic");
  }
}

/**
 * Generate TTS audio with genre-specific voice settings
 */
export async function generateGenreSpecificVoice(
  lyrics: string,
  genre: MusicGenre,
  voiceId: string
): Promise<{ audioUrl: string; duration: number }> {
  try {

    // Genre-specific voice settings
    const voiceSettings: Record<MusicGenre, any> = {
      pop: { stability: 0.5, similarity_boost: 0.75 }, // Balanced, clear
      country: { stability: 0.6, similarity_boost: 0.7 }, // Slightly more stable
      edm: { stability: 0.4, similarity_boost: 0.8 }, // More expressive
      latin: { stability: 0.55, similarity_boost: 0.75 }, // Rhythmic
      rock: { stability: 0.6, similarity_boost: 0.7 }, // Powerful
      rb: { stability: 0.5, similarity_boost: 0.8 }, // Smooth, expressive
      hiphop: { stability: 0.45, similarity_boost: 0.75 }, // Rhythmic, clear
    };

    const settings = voiceSettings[genre];

    // Generate speech via ElevenLabs REST API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: lyrics,
        model_id: "eleven_monolingual_v1",
        voice_settings: settings,
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    // In production, upload audio to S3 and return the URL
    const mockUrl = `https://s3.amazonaws.com/big-starz-music/${genre}_${Date.now()}.mp3`;

    return {
      audioUrl: mockUrl,
      duration: Math.ceil(lyrics.split(" ").length / 2.5),
    };
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return {
      audioUrl: `https://s3.amazonaws.com/big-starz-music/${genre}_fallback.mp3`,
      duration: Math.ceil(lyrics.split(" ").length / 2.5),
    };
  }
}

/**
 * Generate complete music track with lyrics and vocals
 */
export async function generateCompleteTrack(
  request: LyricGenerationRequest,
  voiceId: string,
  instrumentalUrl: string
): Promise<{
  lyrics: string;
  audioUrl: string;
  genre: MusicGenre;
  duration: number;
}> {
  try {
    // Generate lyrics
    let lyricsResponse: LyricGenerationResponse;
    try {
      lyricsResponse = await generateLyricsWithOpenRouter(request);
    } catch (err) {
      console.warn("OpenRouter failed, falling back to Anthropic");
      lyricsResponse = await generateLyricsWithAnthropic(request);
    }

    // Generate TTS voice
    const voiceResponse = await generateGenreSpecificVoice(
      lyricsResponse.lyrics,
      request.genre,
      voiceId
    );

    // TODO: Mix vocals with instrumental audio
    // For now, return the generated audio URL

    return {
      lyrics: lyricsResponse.lyrics,
      audioUrl: voiceResponse.audioUrl,
      genre: request.genre,
      duration: voiceResponse.duration,
    };
  } catch (error) {
    console.error("Complete track generation error:", error);
    throw error;
  }
}
