import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ShareEvent {
  videoId: string;
  platform: string;
  timestamp: number;
  creatorId?: string;
}

export interface ShareStats {
  totalShares: number;
  sharesByPlatform: Record<string, number>;
  sharesThisWeek: number;
  sharesThisMonth: number;
  lastShareDate?: number;
}

/**
 * Share Analytics Service
 * Tracks social sharing metrics for videos and creators
 */
class ShareAnalytics {
  private storageKey = 'share_analytics';

  /**
   * Track a share event
   */
  async trackShare(event: ShareEvent): Promise<void> {
    try {
      const events = await this.getShareEvents();
      events.push(event);

      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = events.slice(-1000);

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  }

  /**
   * Get all share events
   */
  async getShareEvents(): Promise<ShareEvent[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get share events:', error);
      return [];
    }
  }

  /**
   * Get share statistics for a video
   */
  async getVideoShareStats(videoId: string): Promise<ShareStats> {
    try {
      const events = await this.getShareEvents();
      const videoEvents = events.filter((e) => e.videoId === videoId);

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

      const sharesByPlatform: Record<string, number> = {};
      let sharesThisWeek = 0;
      let sharesThisMonth = 0;
      let lastShareDate: number | undefined;

      videoEvents.forEach((event) => {
        // Count by platform
        sharesByPlatform[event.platform] = (sharesByPlatform[event.platform] || 0) + 1;

        // Count this week
        if (event.timestamp > weekAgo) {
          sharesThisWeek++;
        }

        // Count this month
        if (event.timestamp > monthAgo) {
          sharesThisMonth++;
        }

        // Track last share date
        if (!lastShareDate || event.timestamp > lastShareDate) {
          lastShareDate = event.timestamp;
        }
      });

      return {
        totalShares: videoEvents.length,
        sharesByPlatform,
        sharesThisWeek,
        sharesThisMonth,
        lastShareDate,
      };
    } catch (error) {
      console.error('Failed to get video share stats:', error);
      return {
        totalShares: 0,
        sharesByPlatform: {},
        sharesThisWeek: 0,
        sharesThisMonth: 0,
      };
    }
  }

  /**
   * Get share statistics for a creator
   */
  async getCreatorShareStats(creatorId: string): Promise<ShareStats> {
    try {
      const events = await this.getShareEvents();
      const creatorEvents = events.filter((e) => e.creatorId === creatorId);

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

      const sharesByPlatform: Record<string, number> = {};
      let sharesThisWeek = 0;
      let sharesThisMonth = 0;
      let lastShareDate: number | undefined;

      creatorEvents.forEach((event) => {
        // Count by platform
        sharesByPlatform[event.platform] = (sharesByPlatform[event.platform] || 0) + 1;

        // Count this week
        if (event.timestamp > weekAgo) {
          sharesThisWeek++;
        }

        // Count this month
        if (event.timestamp > monthAgo) {
          sharesThisMonth++;
        }

        // Track last share date
        if (!lastShareDate || event.timestamp > lastShareDate) {
          lastShareDate = event.timestamp;
        }
      });

      return {
        totalShares: creatorEvents.length,
        sharesByPlatform,
        sharesThisWeek,
        sharesThisMonth,
        lastShareDate,
      };
    } catch (error) {
      console.error('Failed to get creator share stats:', error);
      return {
        totalShares: 0,
        sharesByPlatform: {},
        sharesThisWeek: 0,
        sharesThisMonth: 0,
      };
    }
  }

  /**
   * Get top shared videos
   */
  async getTopSharedVideos(limit: number = 10): Promise<Array<{ videoId: string; shares: number }>> {
    try {
      const events = await this.getShareEvents();
      const videoShares: Record<string, number> = {};

      events.forEach((event) => {
        videoShares[event.videoId] = (videoShares[event.videoId] || 0) + 1;
      });

      return Object.entries(videoShares)
        .map(([videoId, shares]) => ({ videoId, shares }))
        .sort((a, b) => b.shares - a.shares)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get top shared videos:', error);
      return [];
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(): Promise<Record<string, number>> {
    try {
      const events = await this.getShareEvents();
      const platformStats: Record<string, number> = {};

      events.forEach((event) => {
        platformStats[event.platform] = (platformStats[event.platform] || 0) + 1;
      });

      return platformStats;
    } catch (error) {
      console.error('Failed to get platform stats:', error);
      return {};
    }
  }

  /**
   * Clear all analytics data
   */
  async clearAnalytics(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear analytics:', error);
    }
  }
}

export const shareAnalytics = new ShareAnalytics();
