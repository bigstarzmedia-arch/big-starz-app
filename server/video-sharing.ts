import { Router, Request, Response } from 'express';
import axios from 'axios';

/**
 * Video Sharing Module
 * Enables sharing generated videos to TikTok, Instagram, YouTube
 */

export const sharingRouter = Router();

export interface SocialMediaShare {
  id: string;
  videoId: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  status: 'pending' | 'shared' | 'failed';
  externalUrl?: string;
  timestamp: Date;
  error?: string;
}

// Store sharing records (in production, use database)
const sharingRecords: Map<string, SocialMediaShare> = new Map();

/**
 * Share video to TikTok
 */
async function shareToTikTok(
  videoId: string,
  videoUrl: string,
  caption: string,
  accessToken: string
): Promise<SocialMediaShare> {
  const share: SocialMediaShare = {
    id: `share_${Date.now()}_tiktok`,
    videoId,
    platform: 'tiktok',
    status: 'pending',
    timestamp: new Date(),
  };

  try {
    // TikTok API endpoint for uploading videos
    const response = await axios.post(
      'https://open.tiktok.com/v1/video/upload/',
      {
        video_url: videoUrl,
        caption,
        privacy_level: 'PUBLIC_TO_ANYONE',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    share.status = 'shared';
    share.externalUrl = response.data.video_url;
    console.log(`✅ Video shared to TikTok: ${response.data.video_url}`);
  } catch (error: any) {
    share.status = 'failed';
    share.error = error.message;
    console.error('❌ TikTok share failed:', error.message);
  }

  sharingRecords.set(share.id, share);
  return share;
}

/**
 * Share video to Instagram
 */
async function shareToInstagram(
  videoId: string,
  videoUrl: string,
  caption: string,
  accessToken: string
): Promise<SocialMediaShare> {
  const share: SocialMediaShare = {
    id: `share_${Date.now()}_instagram`,
    videoId,
    platform: 'instagram',
    status: 'pending',
    timestamp: new Date(),
  };

  try {
    // Instagram Graph API endpoint
    const response = await axios.post(
      'https://graph.instagram.com/v18.0/me/media',
      {
        media_type: 'VIDEO',
        video_url: videoUrl,
        caption,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    share.status = 'shared';
    share.externalUrl = `https://instagram.com/p/${response.data.id}`;
    console.log(`✅ Video shared to Instagram: ${share.externalUrl}`);
  } catch (error: any) {
    share.status = 'failed';
    share.error = error.message;
    console.error('❌ Instagram share failed:', error.message);
  }

  sharingRecords.set(share.id, share);
  return share;
}

/**
 * Share video to YouTube
 */
async function shareToYouTube(
  videoId: string,
  videoUrl: string,
  title: string,
  description: string,
  accessToken: string
): Promise<SocialMediaShare> {
  const share: SocialMediaShare = {
    id: `share_${Date.now()}_youtube`,
    videoId,
    platform: 'youtube',
    status: 'pending',
    timestamp: new Date(),
  };

  try {
    // YouTube Data API endpoint
    const response = await axios.post(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet,status',
      {
        snippet: {
          title,
          description,
          categoryId: '10', // Music category
          tags: ['BigStarz', 'Music', 'AI', 'Generated'],
        },
        status: {
          privacyStatus: 'public',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    share.status = 'shared';
    share.externalUrl = `https://youtube.com/watch?v=${response.data.id}`;
    console.log(`✅ Video shared to YouTube: ${share.externalUrl}`);
  } catch (error: any) {
    share.status = 'failed';
    share.error = error.message;
    console.error('❌ YouTube share failed:', error.message);
  }

  sharingRecords.set(share.id, share);
  return share;
}

/**
 * API endpoint to share video to multiple platforms
 */
sharingRouter.post('/share', async (req: Request, res: Response) => {
  const { videoId, videoUrl, title, caption, platforms, accessTokens } = req.body;

  if (!videoId || !videoUrl || !platforms || !accessTokens) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const results: SocialMediaShare[] = [];

  try {
    // Share to TikTok
    if (platforms.includes('tiktok') && accessTokens.tiktok) {
      const tiktokShare = await shareToTikTok(videoId, videoUrl, caption, accessTokens.tiktok);
      results.push(tiktokShare);
    }

    // Share to Instagram
    if (platforms.includes('instagram') && accessTokens.instagram) {
      const instagramShare = await shareToInstagram(
        videoId,
        videoUrl,
        caption,
        accessTokens.instagram
      );
      results.push(instagramShare);
    }

    // Share to YouTube
    if (platforms.includes('youtube') && accessTokens.youtube) {
      const youtubeShare = await shareToYouTube(
        videoId,
        videoUrl,
        title,
        caption,
        accessTokens.youtube
      );
      results.push(youtubeShare);
    }

    res.json({
      success: true,
      videoId,
      shares: results,
      successCount: results.filter((r) => r.status === 'shared').length,
      failureCount: results.filter((r) => r.status === 'failed').length,
    });
  } catch (error: any) {
    console.error('Sharing error:', error);
    res.status(500).json({
      error: 'Failed to share video',
      message: error.message,
    });
  }
});

/**
 * Get sharing history for a video
 */
sharingRouter.get('/share/history/:videoId', (req: Request, res: Response) => {
  const { videoId } = req.params;

  const videoShares = Array.from(sharingRecords.values()).filter((s) => s.videoId === videoId);

  res.json({
    videoId,
    shares: videoShares,
    totalShares: videoShares.length,
    successfulShares: videoShares.filter((s) => s.status === 'shared').length,
  });
});

/**
 * Get sharing statistics
 */
sharingRouter.get('/share/stats', (req: Request, res: Response) => {
  const stats = {
    totalShares: sharingRecords.size,
    byPlatform: {
      tiktok: 0,
      instagram: 0,
      youtube: 0,
    },
    byStatus: {
      pending: 0,
      shared: 0,
      failed: 0,
    },
  };

  for (const share of sharingRecords.values()) {
    stats.byPlatform[share.platform]++;
    stats.byStatus[share.status]++;
  }

  res.json(stats);
});

export function getShareRecord(shareId: string): SocialMediaShare | undefined {
  return sharingRecords.get(shareId);
}

export function getSharesByVideo(videoId: string): SocialMediaShare[] {
  return Array.from(sharingRecords.values()).filter((s) => s.videoId === videoId);
}
