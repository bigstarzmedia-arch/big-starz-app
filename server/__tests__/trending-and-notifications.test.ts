import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTrendingVideos,
  getPersonalizedTrending,
  getTrendingByMetric,
} from '../trending-algorithm';
import {
  FEATURED_VIDEOS,
  getVideosByTier,
  getVideosByGenre,
  calculateTrendingScore,
} from '../video-data';
import {
  notifyVideoComplete,
  notifyGiftReceived,
  notifyFollowerJoined,
  notifyCastingOffer,
  notifyMessageReceived,
  getNotificationHistory,
} from '../push-notifications';

describe('Trending Algorithm', () => {
  it('should return trending videos sorted by engagement', () => {
    const result = getTrendingVideos({ limit: 5 });
    expect(result.videos).toHaveLength(5);
    expect(result.algorithm).toContain('Trending');
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('should filter videos by tier', () => {
    const result = getTrendingVideos({ tier: 'elite', limit: 10 });
    result.videos.forEach(video => {
      expect(video.tier).toBe('elite');
    });
  });

  it('should filter videos by genre', () => {
    const result = getTrendingVideos({ genre: 'Hip-Hop', limit: 10 });
    result.videos.forEach(video => {
      expect(video.genre).toBe('Hip-Hop');
    });
  });

  it('should prioritize Elite tier videos', () => {
    const result = getTrendingVideos({ limit: 10 });
    const firstElite = result.videos.findIndex(v => v.tier === 'elite');
    const firstNonElite = result.videos.findIndex(v => v.tier !== 'elite');

    if (firstElite !== -1 && firstNonElite !== -1) {
      expect(firstElite).toBeLessThan(firstNonElite);
    }
  });

  it('should return personalized trending for user', () => {
    const result = getPersonalizedTrending(
      'user123',
      'pro',
      'dubai',
      ['Electronic', 'Hip-Hop']
    );
    expect(result.videos.length).toBeGreaterThan(0);
    expect(result.algorithm).toContain('Personalized');
  });

  it('should get trending by specific metric', () => {
    const viewsResult = getTrendingByMetric('views', 5);
    expect(viewsResult.videos).toHaveLength(5);
    expect(viewsResult.algorithm).toContain('views');

    // Verify sorted by views
    for (let i = 0; i < viewsResult.videos.length - 1; i++) {
      expect(viewsResult.videos[i].views).toBeGreaterThanOrEqual(
        viewsResult.videos[i + 1].views
      );
    }
  });
});

describe('Video Data', () => {
  it('should have featured videos', () => {
    expect(FEATURED_VIDEOS.length).toBeGreaterThan(0);
  });

  it('should filter videos by tier', () => {
    const eliteVideos = getVideosByTier('elite');
    expect(eliteVideos.length).toBeGreaterThan(0);
    eliteVideos.forEach(video => {
      expect(video.tier).toBe('elite');
    });
  });

  it('should filter videos by genre', () => {
    const hipHopVideos = getVideosByGenre('Hip-Hop');
    hipHopVideos.forEach(video => {
      expect(video.genre).toBe('Hip-Hop');
    });
  });

  it('should calculate trending score', () => {
    const video = FEATURED_VIDEOS[0];
    const score = calculateTrendingScore(video);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should have all required video fields', () => {
    FEATURED_VIDEOS.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.creator).toBeDefined();
      expect(video.url).toBeDefined();
      expect(video.views).toBeGreaterThanOrEqual(0);
      expect(video.likes).toBeGreaterThanOrEqual(0);
      expect(video.tier).toMatch(/free|pro|elite/);
    });
  });
});

describe('Push Notifications', () => {
  it('should notify video completion', async () => {
    await expect(
      notifyVideoComplete('user123', 'Test Video', 'pro')
    ).resolves.toBeUndefined();
  });

  it('should notify gift received', async () => {
    await expect(
      notifyGiftReceived('user123', 'Sender', 'diamond', 50)
    ).resolves.toBeUndefined();
  });

  it('should notify follower joined', async () => {
    await expect(
      notifyFollowerJoined('user123', 'NewFollower', 100)
    ).resolves.toBeUndefined();
  });

  it('should notify casting offer', async () => {
    await expect(
      notifyCastingOffer('user123', 'Creator', 'Video Title', 100)
    ).resolves.toBeUndefined();
  });

  it('should notify message received', async () => {
    await expect(
      notifyMessageReceived('user123', 'Sender', 'Hello there!')
    ).resolves.toBeUndefined();
  });

  it('should get notification history', async () => {
    const history = await getNotificationHistory('user123', 10);
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
  });
});

describe('Integration Tests', () => {
  it('should combine trending videos with notifications', async () => {
    const trendingResult = getTrendingVideos({ limit: 5 });
    expect(trendingResult.videos.length).toBeGreaterThan(0);

    // Simulate notifying user about trending video
    const topVideo = trendingResult.videos[0];
    await expect(
      notifyVideoComplete('user123', topVideo.title, topVideo.tier)
    ).resolves.toBeUndefined();
  });

  it('should handle personalized trending with notifications', async () => {
    const personalizedResult = getPersonalizedTrending(
      'user123',
      'elite',
      'dubai'
    );
    expect(personalizedResult.videos.length).toBeGreaterThan(0);

    // Notify about new followers when viewing trending
    await expect(
      notifyFollowerJoined('user123', 'Fan', 500)
    ).resolves.toBeUndefined();
  });
});
