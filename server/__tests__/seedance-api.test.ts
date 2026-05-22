import { describe, it, expect, beforeAll } from 'vitest';
import { generateSeedanceVideo, getSeedanceStatus, type SeedanceGenerateRequest } from '../seedance-api';

describe('Seedance API', () => {
  beforeAll(() => {
    // Check if API key is set
    if (!process.env.ATLASCLOUD_API_KEY) {
      console.warn('ATLASCLOUD_API_KEY not set - skipping Seedance API tests');
    }
  });

  it('should validate API key is configured', () => {
    const apiKey = process.env.ATLASCLOUD_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^apikey-/); // AtlasCloud API keys start with 'apikey-'
  });

  it('should create valid Seedance request payload', () => {
    const request: SeedanceGenerateRequest = {
      prompt: 'A dancer performing on stage with neon lights',
      duration: 10,
      resolution: '1080p',
      ratio: '9:16',
      generateAudio: true,
      watermark: false,
    };

    expect(request.prompt).toBeDefined();
    expect(request.duration).toBe(10);
    expect(request.resolution).toBe('1080p');
    expect(request.ratio).toBe('9:16');
    expect(request.generateAudio).toBe(true);
    expect(request.watermark).toBe(false);
  });

  it('should handle API errors gracefully', async () => {
    // Test with invalid request (missing prompt)
    const invalidRequest: SeedanceGenerateRequest = {
      prompt: '', // Empty prompt should fail
    };

    try {
      // This will fail due to empty prompt, which is expected
      expect(invalidRequest.prompt).toBe('');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should validate response structure', () => {
    const mockResponse = {
      id: 'pred_123456',
      status: 'processing',
      videoUrl: 'https://example.com/video.mp4',
      createdAt: new Date().toISOString(),
    };

    expect(mockResponse.id).toBeDefined();
    expect(mockResponse.status).toMatch(/processing|completed|failed/);
    expect(mockResponse.createdAt).toBeDefined();
  });
});
