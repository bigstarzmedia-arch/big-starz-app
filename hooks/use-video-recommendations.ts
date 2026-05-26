import { useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  creator: string;
  views: number;
  likes: number;
  comments: number;
  genre: string;
  timestamp: Date;
  engagementScore: number;
}

interface UserPreferences {
  followedCreators: string[];
  likedGenres: string[];
  viewedVideos: string[];
  likeHistory: string[];
  commentHistory: string[];
}

export function useVideoRecommendations(userId: string) {
  const [recommendations, setRecommendations] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    followedCreators: [],
    likedGenres: [],
    viewedVideos: [],
    likeHistory: [],
    commentHistory: [],
  });

  // Calculate engagement score for a video
  const calculateEngagementScore = (video: Video): number => {
    const viewWeight = 0.3;
    const likeWeight = 0.4;
    const commentWeight = 0.3;

    const normalizedViews = Math.min(video.views / 10000, 1);
    const normalizedLikes = Math.min(video.likes / 1000, 1);
    const normalizedComments = Math.min(video.comments / 100, 1);

    return (
      normalizedViews * viewWeight +
      normalizedLikes * likeWeight +
      normalizedComments * commentWeight
    );
  };

  // Generate personalized recommendations
  const generateRecommendations = (allVideos: Video[]): Video[] => {
    // Score each video based on user preferences
    const scoredVideos = allVideos.map((video) => {
      let score = 0;

      // Boost score if from followed creator
      if (userPreferences.followedCreators.includes(video.creator)) {
        score += 0.5;
      }

      // Boost score if matches liked genres
      if (userPreferences.likedGenres.includes(video.genre)) {
        score += 0.3;
      }

      // Add engagement score
      score += calculateEngagementScore(video) * 0.2;

      // Penalize if already viewed
      if (userPreferences.viewedVideos.includes(video.id)) {
        score -= 0.2;
      }

      // Boost trending videos
      const daysSinceUpload = (Date.now() - video.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpload < 7) {
        score += 0.2;
      }

      return { ...video, engagementScore: score };
    });

    // Sort by score and return top recommendations
    return scoredVideos
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 20);
  };

  // Fetch and generate recommendations
  useEffect(() => {
    setIsLoading(true);

    // Simulate fetching videos from server
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'AI Music Video - Cyberpunk',
        creator: '@NeonVex',
        views: 125000,
        likes: 8500,
        comments: 450,
        genre: 'Electronic',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
      {
        id: '2',
        title: 'Dance Challenge - Summer Vibes',
        creator: '@DanceQueen',
        views: 89000,
        likes: 6200,
        comments: 320,
        genre: 'Dance',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
      {
        id: '3',
        title: 'Lo-Fi Beats - Study Session',
        creator: '@ChillVibes',
        views: 156000,
        likes: 9800,
        comments: 520,
        genre: 'Lo-Fi',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
      {
        id: '4',
        title: 'Comedy Skit - Office Life',
        creator: '@FunnyStuff',
        views: 67000,
        likes: 4500,
        comments: 280,
        genre: 'Comedy',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
      {
        id: '5',
        title: 'Makeup Tutorial - Glam Look',
        creator: '@BeautyPro',
        views: 98000,
        likes: 7200,
        comments: 410,
        genre: 'Beauty',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
      {
        id: '6',
        title: 'Fitness Motivation - Gym Goals',
        creator: '@FitLife',
        views: 112000,
        likes: 8100,
        comments: 390,
        genre: 'Fitness',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        engagementScore: 0,
      },
    ];

    // Generate recommendations
    const recs = generateRecommendations(mockVideos);
    setRecommendations(recs);
    setIsLoading(false);
  }, [userPreferences]);

  // Update user preferences when they interact with content
  const recordVideoView = (videoId: string) => {
    setUserPreferences((prev) => ({
      ...prev,
      viewedVideos: [...prev.viewedVideos, videoId],
    }));
  };

  const recordVideoLike = (videoId: string) => {
    setUserPreferences((prev) => ({
      ...prev,
      likeHistory: [...prev.likeHistory, videoId],
    }));
  };

  const recordCreatorFollow = (creatorId: string) => {
    setUserPreferences((prev) => ({
      ...prev,
      followedCreators: [...prev.followedCreators, creatorId],
    }));
  };

  const recordGenrePreference = (genre: string) => {
    setUserPreferences((prev) => ({
      ...prev,
      likedGenres: [...prev.likedGenres, genre],
    }));
  };

  return {
    recommendations,
    isLoading,
    recordVideoView,
    recordVideoLike,
    recordCreatorFollow,
    recordGenrePreference,
    userPreferences,
  };
}
