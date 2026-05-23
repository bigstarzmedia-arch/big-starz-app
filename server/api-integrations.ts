import axios from 'axios';

const SEEDANCE_API_KEY = process.env.ATLASCLOUD_API_KEY || '';
const KLING_ACCESS_KEY = process.env.KLING_ACCESS_KEY || '';
const KLING_SECRET_KEY = process.env.KLING_SECRET_KEY || '';
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY || '';
const GROK_API_KEY = process.env.XAI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

export interface VideoGenerationRequest {
  prompt: string;
  style?: string;
  duration?: number;
  instrumentalUrl?: string;
}

export interface VideoGenerationResponse {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  tier: 'free' | 'pro' | 'elite';
}

export interface MusicGenerationRequest {
  prompt: string;
  duration?: number;
  genre?: string;
}

export interface MusicGenerationResponse {
  musicId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  error?: string;
}

// SEEDANCE API (Elite Tier - 4K 1440p-SR)
export async function generateWithSeedance(
  prompt: string,
  instrumentalUrl?: string
): Promise<VideoGenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.atlascloud.ai/v2/video/generate',
      {
        prompt,
        duration: 60,
        quality: '1440p-sr',
        reference_video: instrumentalUrl,
      },
      {
        headers: {
          'X-Api-Key': SEEDANCE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      videoId: response.data.video_id,
      status: 'processing',
      tier: 'elite',
    };
  } catch (error) {
    console.error('Seedance API error:', error);
    return {
      videoId: '',
      status: 'failed',
      error: 'Failed to generate video with Seedance',
      tier: 'elite',
    };
  }
}

// KLING API (Pro Tier - 1080p)
export async function generateWithKling(
  prompt: string,
  instrumentalUrl?: string
): Promise<VideoGenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.klingai.com/v1/video/generate',
      {
        prompt,
        duration: 60,
        quality: '1080p',
        reference_video: instrumentalUrl,
      },
      {
        headers: {
          'X-Api-Key': KLING_ACCESS_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      videoId: response.data.video_id,
      status: 'processing',
      tier: 'pro',
    };
  } catch (error) {
    console.error('Kling API error:', error);
    return {
      videoId: '',
      status: 'failed',
      error: 'Failed to generate video with Kling',
      tier: 'pro',
    };
  }
}

// RUNWAY API (Free Tier - 720p)
export async function generateWithRunway(
  prompt: string,
  instrumentalUrl?: string
): Promise<VideoGenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.runwayml.com/v1/video/generate',
      {
        prompt,
        duration: 60,
        quality: '720p',
        reference_video: instrumentalUrl,
      },
      {
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      videoId: response.data.video_id,
      status: 'processing',
      tier: 'free',
    };
  } catch (error) {
    console.error('Runway API error:', error);
    return {
      videoId: '',
      status: 'failed',
      error: 'Failed to generate video with Runway',
      tier: 'free',
    };
  }
}

// GROK API (Fallback - Text-to-Video)
export async function generateWithGrok(
  prompt: string
): Promise<VideoGenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.x.ai/v1/video/generate',
      {
        prompt,
        duration: 60,
        quality: '1080p',
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      videoId: response.data.video_id,
      status: 'processing',
      tier: 'pro',
    };
  } catch (error) {
    console.error('Grok API error:', error);
    return {
      videoId: '',
      status: 'failed',
      error: 'Failed to generate video with Grok',
      tier: 'pro',
    };
  }
}

// ELEVENLABS API (Music & Voice Generation)
export async function generateMusic(
  prompt: string,
  genre?: string
): Promise<MusicGenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech',
      {
        text: prompt,
        voice_id: 'default',
        model_id: 'eleven_monolingual_v1',
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      musicId: response.data.id,
      status: 'completed',
      audioUrl: response.data.audio_url,
    };
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return {
      musicId: '',
      status: 'failed',
      error: 'Failed to generate music',
    };
  }
}

// SELECT API BASED ON TIER
export async function generateVideoByTier(
  tier: 'free' | 'pro' | 'elite',
  prompt: string,
  instrumentalUrl?: string
): Promise<VideoGenerationResponse> {
  switch (tier) {
    case 'elite':
      return generateWithSeedance(prompt, instrumentalUrl);
    case 'pro':
      return generateWithKling(prompt, instrumentalUrl);
    case 'free':
    default:
      return generateWithRunway(prompt, instrumentalUrl);
  }
}

// CHECK VIDEO GENERATION STATUS
export async function checkVideoStatus(videoId: string, tier: 'free' | 'pro' | 'elite'): Promise<VideoGenerationResponse> {
  try {
    let endpoint = '';
    let headers: any = {};

    if (tier === 'elite') {
      endpoint = `https://api.atlascloud.ai/v1/video_status.get?video_id=${videoId}`;
      headers['X-Api-Key'] = SEEDANCE_API_KEY;
    } else if (tier === 'pro') {
      endpoint = `https://api.klingai.com/v1/video/status?video_id=${videoId}`;
      headers['X-Api-Key'] = KLING_ACCESS_KEY;
    } else {
      endpoint = `https://api.runwayml.com/v1/video/status?video_id=${videoId}`;
      headers['Authorization'] = `Bearer ${RUNWAY_API_KEY}`;
    }

    const response = await axios.get(endpoint, { headers });

    return {
      videoId,
      status: response.data.status,
      videoUrl: response.data.video_url,
      tier,
    };
  } catch (error) {
    console.error('Status check error:', error);
    return {
      videoId,
      status: 'failed',
      error: 'Failed to check video status',
      tier,
    };
  }
}
