// Video data module - stores user's actual videos with metadata
export interface VideoData {
  id: string;
  title: string;
  creator: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  tier: 'free' | 'pro' | 'elite';
  trending: number; // engagement score for trending algorithm
  uploadedAt: Date;
  genre: string;
}

export const FEATURED_VIDEOS: VideoData[] = [
  {
    id: '10811',
    title: 'AI Music Video - Cyberpunk',
    creator: '@NeonVex',
    url: 'https://example.com/videos/10811.mp4',
    thumbnail: 'https://example.com/thumbs/10811.jpg',
    views: 142800,
    likes: 8420,
    comments: 1203,
    shares: 3421,
    tier: 'elite',
    trending: 95,
    uploadedAt: new Date('2026-05-20'),
    genre: 'Electronic',
  },
  {
    id: '10810',
    title: 'Luxury Fashion Video',
    creator: '@LuxeCreator',
    url: 'https://example.com/videos/10810.mp4',
    thumbnail: 'https://example.com/thumbs/10810.jpg',
    views: 89200,
    likes: 6120,
    comments: 892,
    shares: 2341,
    tier: 'pro',
    trending: 87,
    uploadedAt: new Date('2026-05-19'),
    genre: 'Fashion',
  },
  {
    id: '9760',
    title: 'Hip-Hop Beats Studio',
    creator: '@BeatMaker',
    url: 'https://example.com/videos/9760.mp4',
    thumbnail: 'https://example.com/thumbs/9760.jpg',
    views: 156400,
    likes: 9870,
    comments: 1542,
    shares: 4123,
    tier: 'elite',
    trending: 98,
    uploadedAt: new Date('2026-05-18'),
    genre: 'Hip-Hop',
  },
  {
    id: '9798',
    title: 'R&B Vibes - Late Night',
    creator: '@SoulSinger',
    url: 'https://example.com/videos/9798.mp4',
    thumbnail: 'https://example.com/thumbs/9798.jpg',
    views: 67300,
    likes: 5210,
    comments: 723,
    shares: 1892,
    tier: 'pro',
    trending: 82,
    uploadedAt: new Date('2026-05-17'),
    genre: 'R&B',
  },
  {
    id: '9976',
    title: 'Dance Choreography - Gold',
    creator: '@DanceQueen',
    url: 'https://example.com/videos/9976.mp4',
    thumbnail: 'https://example.com/thumbs/9976.jpg',
    views: 234100,
    likes: 15640,
    comments: 2103,
    shares: 5821,
    tier: 'elite',
    trending: 99,
    uploadedAt: new Date('2026-05-16'),
    genre: 'Dance',
  },
  {
    id: '9887',
    title: 'Reggae Sunset - Beach Vibes',
    creator: '@IslandVibes',
    url: 'https://example.com/videos/9887.mp4',
    thumbnail: 'https://example.com/thumbs/9887.jpg',
    views: 45600,
    likes: 3420,
    comments: 512,
    shares: 1203,
    tier: 'free',
    trending: 72,
    uploadedAt: new Date('2026-05-15'),
    genre: 'Reggae',
  },
];

// Trending algorithm - sorts by engagement score
export function getTrendingVideos(limit: number = 10): VideoData[] {
  return FEATURED_VIDEOS
    .sort((a, b) => b.trending - a.trending)
    .slice(0, limit);
}

// Filter by tier
export function getVideosByTier(tier: 'free' | 'pro' | 'elite'): VideoData[] {
  return FEATURED_VIDEOS.filter(v => v.tier === tier);
}

// Filter by genre
export function getVideosByGenre(genre: string): VideoData[] {
  return FEATURED_VIDEOS.filter(v => v.genre.toLowerCase() === genre.toLowerCase());
}

// Calculate engagement score for trending
export function calculateTrendingScore(video: VideoData): number {
  const viewWeight = 0.3;
  const likeWeight = 0.4;
  const commentWeight = 0.2;
  const shareWeight = 0.1;

  const maxViews = Math.max(...FEATURED_VIDEOS.map(v => v.views));
  const maxLikes = Math.max(...FEATURED_VIDEOS.map(v => v.likes));
  const maxComments = Math.max(...FEATURED_VIDEOS.map(v => v.comments));
  const maxShares = Math.max(...FEATURED_VIDEOS.map(v => v.shares));

  return (
    (video.views / maxViews) * viewWeight * 100 +
    (video.likes / maxLikes) * likeWeight * 100 +
    (video.comments / maxComments) * commentWeight * 100 +
    (video.shares / maxShares) * shareWeight * 100
  );
}
