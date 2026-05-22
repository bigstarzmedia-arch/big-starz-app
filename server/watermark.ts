import { UserTier } from "./tiered-video-api";

/**
 * Watermark Module
 * Adds "Big Starz" watermark to all non-Elite tier videos
 * Elite tier videos are watermark-free
 */

export interface WatermarkOptions {
  tier: UserTier;
  videoUrl: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  opacity?: number;
  scale?: number;
}

export interface WatermarkedVideo {
  originalUrl: string;
  watermarkedUrl: string;
  hasWatermark: boolean;
  tier: UserTier;
}

/**
 * Determines if a video should have a watermark based on user tier
 */
export function shouldAddWatermark(tier: UserTier): boolean {
  // Only Elite tier videos are watermark-free
  return tier !== "elite";
}

/**
 * Generates watermark overlay SVG
 */
export function generateWatermarkSVG(
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center" = "bottom-right",
  opacity: number = 0.6,
  scale: number = 1
): string {
  const baseWidth = 200 * scale;
  const baseHeight = 60 * scale;
  const fontSize = 24 * scale;
  const padding = 16 * scale;

  // Position coordinates
  const positions: Record<string, { x: number; y: number }> = {
    "bottom-right": { x: 1920 - baseWidth - padding, y: 1080 - baseHeight - padding },
    "bottom-left": { x: padding, y: 1080 - baseHeight - padding },
    "top-right": { x: 1920 - baseWidth - padding, y: padding },
    "top-left": { x: padding, y: padding },
    center: { x: (1920 - baseWidth) / 2, y: (1080 - baseHeight) / 2 },
  };

  const pos = positions[position];

  return `
    <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
        </style>
      </defs>
      <g opacity="${opacity}">
        <!-- Background rectangle -->
        <rect
          x="${pos.x}"
          y="${pos.y}"
          width="${baseWidth}"
          height="${baseHeight}"
          fill="#FF0055"
          rx="8"
          ry="8"
        />
        <!-- Watermark text -->
        <text
          x="${pos.x + baseWidth / 2}"
          y="${pos.y + baseHeight / 2 + fontSize / 3}"
          font-family="Inter, sans-serif"
          font-size="${fontSize}"
          font-weight="700"
          fill="white"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          Big Starz
        </text>
      </g>
    </svg>
  `;
}

/**
 * Process video with watermark based on tier
 * In production, this would use FFmpeg or a video processing service
 */
export async function processVideoWithWatermark(
  options: WatermarkOptions
): Promise<WatermarkedVideo> {
  const { tier, videoUrl, position = "bottom-right", opacity = 0.6, scale = 1 } = options;

  const hasWatermark = shouldAddWatermark(tier);

  if (!hasWatermark) {
    // Elite tier - return original URL without watermark
    return {
      originalUrl: videoUrl,
      watermarkedUrl: videoUrl,
      hasWatermark: false,
      tier,
    };
  }

  // For Free and Pro tiers, add watermark
  // In a real implementation, you would:
  // 1. Download the video from videoUrl
  // 2. Use FFmpeg to overlay the watermark SVG
  // 3. Upload the watermarked video to S3
  // 4. Return the new URL

  // For now, we'll return a placeholder that includes watermark metadata
  const watermarkSvg = generateWatermarkSVG(position, opacity, scale);
  const watermarkedUrl = `${videoUrl}?watermark=big-starz&tier=${tier}&position=${position}`;

  return {
    originalUrl: videoUrl,
    watermarkedUrl,
    hasWatermark: true,
    tier,
  };
}

/**
 * Batch process multiple videos
 */
export async function batchProcessVideos(
  videos: Array<{ url: string; tier: UserTier }>
): Promise<WatermarkedVideo[]> {
  return Promise.all(
    videos.map((video) =>
      processVideoWithWatermark({
        videoUrl: video.url,
        tier: video.tier,
      })
    )
  );
}

/**
 * Get watermark status for a video
 */
export function getWatermarkStatus(tier: UserTier): {
  hasWatermark: boolean;
  message: string;
} {
  if (tier === "elite") {
    return {
      hasWatermark: false,
      message: "Elite tier - No watermark",
    };
  }

  if (tier === "pro") {
    return {
      hasWatermark: true,
      message: "Pro tier - Big Starz watermark applied",
    };
  }

  return {
    hasWatermark: true,
    message: "Free tier - Big Starz watermark applied",
  };
}
