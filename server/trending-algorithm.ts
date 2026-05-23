// Trending algorithm - surfaces top-performing videos by engagement, tier, and geography
import { VideoData, FEATURED_VIDEOS, calculateTrendingScore } from './video-data';

export interface TrendingOptions {
  limit?: number;
  tier?: 'free' | 'pro' | 'elite' | 'all';
  geography?: string; // 'dubai' | 'india' | 'kenya' | 'uae' | 'all'
  genre?: string;
  timeRange?: 'day' | 'week' | 'month' | 'all';
}

export interface TrendingResult {
  videos: VideoData[];
  algorithm: string;
  timestamp: Date;
}

// Main trending algorithm
export function getTrendingVideos(options: TrendingOptions = {}): TrendingResult {
  const {
    limit = 20,
    tier = 'all',
    geography = 'all',
    genre,
    timeRange = 'week',
  } = options;

  let videos = [...FEATURED_VIDEOS];

  // Filter by tier
  if (tier !== 'all') {
    videos = videos.filter(v => v.tier === tier);
  }

  // Filter by genre
  if (genre) {
    videos = videos.filter(v => v.genre.toLowerCase() === genre.toLowerCase());
  }

  // Filter by time range
  if (timeRange !== 'all') {
    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === 'day') {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    videos = videos.filter(v => new Date(v.uploadedAt) >= cutoffDate);
  }

  // Calculate trending scores
  videos = videos.map(v => ({
    ...v,
    trending: calculateTrendingScore(v),
  }));

  // Sort by trending score (highest first)
  videos.sort((a, b) => b.trending - a.trending);

  // Apply geography boost (if implemented)
  if (geography !== 'all') {
    videos = applyGeographyBoost(videos, geography);
  }

  // Elite tier gets priority ranking
  videos = videos.sort((a, b) => {
    if (a.tier === 'elite' && b.tier !== 'elite') return -1;
    if (a.tier !== 'elite' && b.tier === 'elite') return 1;
    return b.trending - a.trending;
  });

  return {
    videos: videos.slice(0, limit),
    algorithm: `Trending (tier: ${tier}, geography: ${geography}, timeRange: ${timeRange})`,
    timestamp: new Date(),
  };
}

// Apply geography boost for regional content
function applyGeographyBoost(videos: VideoData[], geography: string): VideoData[] {
  // Mock geography data - in production, this would come from video metadata
  const geographyMap: Record<string, string[]> = {
    dubai: ['10811', '9760', '9976'],
    india: ['10810', '9798', '9887'],
    kenya: ['9760', '9976'],
    uae: ['10811', '9798'],
  };

  const regionalVideos = geographyMap[geography.toLowerCase()] || [];

  return videos.sort((a, b) => {
    const aIsRegional = regionalVideos.includes(a.id);
    const bIsRegional = regionalVideos.includes(b.id);

    if (aIsRegional && !bIsRegional) return -1;
    if (!aIsRegional && bIsRegional) return 1;
    return b.trending - a.trending;
  });
}

// Get personalized trending for user
export function getPersonalizedTrending(
  userId: string,
  userTier: 'free' | 'pro' | 'elite',
  userGeography: string,
  userGenres: string[] = []
): TrendingResult {
  let videos = [...FEATURED_VIDEOS];

  // Show all content to all tiers, but prioritize Elite
  videos = videos.sort((a, b) => {
    if (a.tier === 'elite' && b.tier !== 'elite') return -1;
    if (a.tier !== 'elite' && b.tier === 'elite') return 1;
    return b.trending - a.trending;
  });

  // Boost user's preferred genres
  if (userGenres.length > 0) {
    videos = videos.sort((a, b) => {
      const aPreferred = userGenres.includes(a.genre);
      const bPreferred = userGenres.includes(b.genre);

      if (aPreferred && !bPreferred) return -1;
      if (!aPreferred && bPreferred) return 1;
      return b.trending - a.trending;
    });
  }

  // Apply geography boost
  videos = applyGeographyBoost(videos, userGeography);

  return {
    videos: videos.slice(0, 20),
    algorithm: `Personalized Trending (user: ${userId}, tier: ${userTier}, geography: ${userGeography})`,
    timestamp: new Date(),
  };
}

// Get trending by specific metric
export function getTrendingByMetric(
  metric: 'views' | 'likes' | 'comments' | 'shares',
  limit: number = 10
): TrendingResult {
  const videos = [...FEATURED_VIDEOS].sort((a, b) => {
    return b[metric] - a[metric];
  });

  return {
    videos: videos.slice(0, limit),
    algorithm: `Top by ${metric}`,
    timestamp: new Date(),
  };
}
