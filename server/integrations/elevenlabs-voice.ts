import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * ElevenLabs Voice Service
 * Handles voice cloning, text-to-speech, and voice generation
 */
export class ElevenLabsVoiceService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = ELEVENLABS_API_KEY;

    if (!this.apiKey) {
      console.warn('ELEVENLABS_API_KEY not configured - voice features will be disabled');
    }
  }

  /**
   * Get available voices (free and premium)
   */
  async getAvailableVoices(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        console.warn('ElevenLabs not configured');
        return [];
      }

      const response = await axios.get(`${ELEVENLABS_BASE_URL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  /**
   * Convert text to speech using a specific voice
   */
  async textToSpeech(
    text: string,
    voiceId: string = 'EXAVITQu4vr4xnSDxMaL', // Default voice (Bella)
    outputPath?: string
  ): Promise<Buffer | string> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.post(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1', // Free model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioBuffer = Buffer.from(response.data);

      // Save to file if path provided
      if (outputPath) {
        fs.writeFileSync(outputPath, audioBuffer);
        console.log(`Audio saved to ${outputPath}`);
        return outputPath;
      }

      return audioBuffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Clone a voice from an audio file
   */
  async cloneVoice(
    voiceName: string,
    audioFilePath: string,
    description?: string
  ): Promise<{ voice_id: string; name: string }> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const audioBuffer = fs.readFileSync(audioFilePath);

      const formData = new FormData();
      formData.append('name', voiceName);
      formData.append('description', description || `Cloned voice: ${voiceName}`);
      formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }), path.basename(audioFilePath));

      const response = await axios.post(`${ELEVENLABS_BASE_URL}/voices/add`, formData, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        voice_id: response.data.voice_id,
        name: response.data.name,
      };
    } catch (error) {
      console.error('Error cloning voice:', error);
      throw error;
    }
  }

  /**
   * Generate speech with voice cloning (for cast members)
   */
  async generateCastMemberVoice(
    castMemberId: string,
    text: string,
    voiceId: string
  ): Promise<Buffer> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.post(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Error generating voice for cast member ${castMemberId}:`, error);
      throw error;
    }
  }

  /**
   * Get voice settings for a specific voice
   */
  async getVoiceSettings(voiceId: string): Promise<any> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.get(`${ELEVENLABS_BASE_URL}/voices/${voiceId}/settings`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching voice settings:', error);
      throw error;
    }
  }

  /**
   * Update voice settings
   */
  async updateVoiceSettings(
    voiceId: string,
    stability: number,
    similarityBoost: number
  ): Promise<void> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      await axios.post(
        `${ELEVENLABS_BASE_URL}/voices/${voiceId}/settings/edit`,
        {
          stability,
          similarity_boost: similarityBoost,
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error updating voice settings:', error);
      throw error;
    }
  }

  /**
   * Delete a cloned voice
   */
  async deleteVoice(voiceId: string): Promise<void> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      await axios.delete(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
    } catch (error) {
      console.error('Error deleting voice:', error);
      throw error;
    }
  }

  /**
   * Get user subscription info (check free tier limits)
   */
  async getSubscriptionInfo(): Promise<any> {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.get(`${ELEVENLABS_BASE_URL}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching subscription info:', error);
      throw error;
    }
  }
}

// Singleton instance
export const elevenLabsVoiceService = new ElevenLabsVoiceService();
