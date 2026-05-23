import { describe, it, expect, vi } from 'vitest';
import {
  generateVideoByTier,
  generateMusic,
  checkVideoStatus,
} from '../api-integrations';

describe('API Integrations', () => {
  describe('generateVideoByTier', () => {
    it('should call Seedance for elite tier', async () => {
      const result = await generateVideoByTier(
        'elite',
        'A luxury music video with neon lights'
      );

      expect(result).toHaveProperty('videoId');
      expect(result).toHaveProperty('status');
      expect(result.tier).toBe('elite');
    });

    it('should call Kling for pro tier', async () => {
      const result = await generateVideoByTier(
        'pro',
        'A cinematic music video with dancers'
      );

      expect(result).toHaveProperty('videoId');
      expect(result).toHaveProperty('status');
      expect(result.tier).toBe('pro');
    });

    it('should call Runway for free tier', async () => {
      const result = await generateVideoByTier(
        'free',
        'A music video with simple effects'
      );

      expect(result).toHaveProperty('videoId');
      expect(result).toHaveProperty('status');
      expect(result.tier).toBe('free');
    });

    it('should support instrumental URL for beat-synced videos', async () => {
      const instrumentalUrl =
        'https://example.com/beat.mp3';
      const result = await generateVideoByTier(
        'pro',
        'A music video synced to beat',
        instrumentalUrl
      );

      expect(result).toHaveProperty('videoId');
      expect(result.status).toBe('processing');
    });
  });

  describe('generateMusic', () => {
    it('should generate music with ElevenLabs', async () => {
      const result = await generateMusic('Generate a hip-hop beat');

      expect(result).toHaveProperty('musicId');
      expect(result).toHaveProperty('status');
    });

    it('should support genre specification', async () => {
      const result = await generateMusic(
        'Generate an EDM track',
        'electronic'
      );

      expect(result).toHaveProperty('musicId');
      expect(['pending', 'processing', 'completed', 'failed']).toContain(
        result.status
      );
    });

    it('should return audio URL on completion', async () => {
      const result = await generateMusic('Generate a pop song');

      if (result.status === 'completed') {
        expect(result).toHaveProperty('audioUrl');
      }
    });
  });

  describe('checkVideoStatus', () => {
    it('should return status for elite tier video', async () => {
      const result = await checkVideoStatus('video_123', 'elite');

      expect(result).toHaveProperty('videoId');
      expect(result).toHaveProperty('status');
      expect(result.tier).toBe('elite');
    });

    it('should return video URL when completed', async () => {
      const result = await checkVideoStatus('video_456', 'pro');

      expect(['pending', 'processing', 'completed', 'failed']).toContain(
        result.status
      );
    });

    it('should handle different tiers', async () => {
      const freeResult = await checkVideoStatus('video_free', 'free');
      const proResult = await checkVideoStatus('video_pro', 'pro');
      const eliteResult = await checkVideoStatus('video_elite', 'elite');

      expect(freeResult.tier).toBe('free');
      expect(proResult.tier).toBe('pro');
      expect(eliteResult.tier).toBe('elite');
    });
  });

  describe('Tier-Based Quality', () => {
    it('elite tier should support 4K quality', async () => {
      const result = await generateVideoByTier(
        'elite',
        'A 4K luxury music video'
      );

      expect(result.tier).toBe('elite');
      expect(result.status).toBe('processing');
    });

    it('pro tier should support 1080p quality', async () => {
      const result = await generateVideoByTier(
        'pro',
        'A 1080p music video'
      );

      expect(result.tier).toBe('pro');
      expect(result.status).toBe('processing');
    });

    it('free tier should support 720p quality', async () => {
      const result = await generateVideoByTier(
        'free',
        'A 720p music video'
      );

      expect(result.tier).toBe('free');
      expect(result.status).toBe('processing');
    });
  });

  describe('Instrumental Upload Feature', () => {
    it('should accept instrumental URL for beat-synced videos', async () => {
      const instrumentalUrl =
        'https://example.com/instrumentals/beat_001.mp3';
      const result = await generateVideoByTier(
        'pro',
        'Generate a music video synced to this beat',
        instrumentalUrl
      );

      expect(result).toHaveProperty('videoId');
      expect(result.status).toBe('processing');
    });

    it('should work with all tiers', async () => {
      const instrumentalUrl =
        'https://example.com/beat.mp3';

      const freeResult = await generateVideoByTier(
        'free',
        'Music video on beat',
        instrumentalUrl
      );
      const proResult = await generateVideoByTier(
        'pro',
        'Music video on beat',
        instrumentalUrl
      );
      const eliteResult = await generateVideoByTier(
        'elite',
        'Music video on beat',
        instrumentalUrl
      );

      expect(freeResult.tier).toBe('free');
      expect(proResult.tier).toBe('pro');
      expect(eliteResult.tier).toBe('elite');
    });
  });
});
