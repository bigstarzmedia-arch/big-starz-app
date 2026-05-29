import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shareAnalytics, type ShareEvent, type ShareStats } from '../lib/share-analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('Social Sharing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Share Event Tracking', () => {
    it('should track a share event', async () => {
      const event: ShareEvent = {
        videoId: 'video-1',
        platform: 'instagram',
        timestamp: Date.now(),
        creatorId: 'creator-1',
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await shareAnalytics.trackShare(event);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should track multiple share events', async () => {
      const events: ShareEvent[] = [
        {
          videoId: 'video-1',
          platform: 'instagram',
          timestamp: Date.now(),
        },
        {
          videoId: 'video-1',
          platform: 'tiktok',
          timestamp: Date.now(),
        },
        {
          videoId: 'video-2',
          platform: 'twitter',
          timestamp: Date.now(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      for (const event of events) {
        await shareAnalytics.trackShare(event);
      }

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
    });

    it('should handle storage errors gracefully', async () => {
      const event: ShareEvent = {
        videoId: 'video-1',
        platform: 'instagram',
        timestamp: Date.now(),
      };

      vi.mocked(AsyncStorage.getItem).mockRejectedValueOnce(new Error('Storage error'));

      // Should not throw
      await expect(shareAnalytics.trackShare(event)).resolves.not.toThrow();
    });
  });

  describe('Video Share Statistics', () => {
    it('should calculate total shares for a video', async () => {
      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'tiktok', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'twitter', timestamp: Date.now() },
        { videoId: 'video-2', platform: 'instagram', timestamp: Date.now() },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getVideoShareStats('video-1');

      expect(stats.totalShares).toBe(3);
    });

    it('should count shares by platform', async () => {
      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'tiktok', timestamp: Date.now() },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getVideoShareStats('video-1');

      expect(stats.sharesByPlatform['instagram']).toBe(2);
      expect(stats.sharesByPlatform['tiktok']).toBe(1);
    });

    it('should count shares from this week', async () => {
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: now },
        { videoId: 'video-1', platform: 'tiktok', timestamp: now - 1 * 24 * 60 * 60 * 1000 },
        { videoId: 'video-1', platform: 'twitter', timestamp: weekAgo - 1000 }, // Older than week
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getVideoShareStats('video-1');

      expect(stats.sharesThisWeek).toBe(2);
    });

    it('should count shares from this month', async () => {
      const now = Date.now();
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: now },
        { videoId: 'video-1', platform: 'tiktok', timestamp: now - 10 * 24 * 60 * 60 * 1000 },
        { videoId: 'video-1', platform: 'twitter', timestamp: monthAgo - 1000 }, // Older than month
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getVideoShareStats('video-1');

      expect(stats.sharesThisMonth).toBe(2);
    });

    it('should track last share date', async () => {
      const now = Date.now();
      const yesterday = now - 24 * 60 * 60 * 1000;

      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: yesterday },
        { videoId: 'video-1', platform: 'tiktok', timestamp: now },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getVideoShareStats('video-1');

      expect(stats.lastShareDate).toBe(now);
    });
  });

  describe('Creator Share Statistics', () => {
    it('should calculate total shares for a creator', async () => {
      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now(), creatorId: 'creator-1' },
        { videoId: 'video-2', platform: 'tiktok', timestamp: Date.now(), creatorId: 'creator-1' },
        { videoId: 'video-3', platform: 'twitter', timestamp: Date.now(), creatorId: 'creator-2' },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getCreatorShareStats('creator-1');

      expect(stats.totalShares).toBe(2);
    });
  });

  describe('Platform Statistics', () => {
    it('should calculate platform distribution', async () => {
      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-2', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-3', platform: 'tiktok', timestamp: Date.now() },
        { videoId: 'video-4', platform: 'twitter', timestamp: Date.now() },
        { videoId: 'video-5', platform: 'twitter', timestamp: Date.now() },
        { videoId: 'video-6', platform: 'twitter', timestamp: Date.now() },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const stats = await shareAnalytics.getPlatformStats();

      expect(stats['instagram']).toBe(2);
      expect(stats['tiktok']).toBe(1);
      expect(stats['twitter']).toBe(3);
    });
  });

  describe('Top Shared Videos', () => {
    it('should return top shared videos', async () => {
      const events: ShareEvent[] = [
        { videoId: 'video-1', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'tiktok', timestamp: Date.now() },
        { videoId: 'video-1', platform: 'twitter', timestamp: Date.now() },
        { videoId: 'video-2', platform: 'instagram', timestamp: Date.now() },
        { videoId: 'video-2', platform: 'tiktok', timestamp: Date.now() },
        { videoId: 'video-3', platform: 'instagram', timestamp: Date.now() },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const topVideos = await shareAnalytics.getTopSharedVideos(3);

      expect(topVideos[0].videoId).toBe('video-1');
      expect(topVideos[0].shares).toBe(3);
      expect(topVideos[1].videoId).toBe('video-2');
      expect(topVideos[1].shares).toBe(2);
      expect(topVideos[2].videoId).toBe('video-3');
      expect(topVideos[2].shares).toBe(1);
    });

    it('should respect limit parameter', async () => {
      const events: ShareEvent[] = Array.from({ length: 20 }, (_, i) => ({
        videoId: `video-${i}`,
        platform: 'instagram',
        timestamp: Date.now(),
      }));

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(events));

      const topVideos = await shareAnalytics.getTopSharedVideos(5);

      expect(topVideos.length).toBe(5);
    });
  });

  describe('Analytics Cleanup', () => {
    it('should clear all analytics data', async () => {
      vi.mocked(AsyncStorage.removeItem).mockResolvedValueOnce(undefined);

      await shareAnalytics.clearAnalytics();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('share_analytics');
    });
  });
});
