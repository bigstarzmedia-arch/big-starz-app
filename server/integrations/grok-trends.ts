/**
 * Grok API Integration - Real-time X (Twitter) Trend Monitoring
 * Monitors fashion trends on X and recommends which affiliate brands users should model
 */

import axios from "axios";
import { getDb } from "../db";
import { castings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export interface TrendRecommendation {
  brand: string;
  trend: string;
  relevanceScore: number;
  trendingNow: boolean;
  musicGenres: string[];
  reason: string;
}

/**
 * Monitor X (Twitter) for fashion trends using Grok
 */
export async function monitorFashionTrends(): Promise<TrendRecommendation[]> {
  try {
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      throw new Error("GROK_API_KEY not configured");
    }

    // Query Grok for current fashion trends on X
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-4",
        messages: [
          {
            role: "user",
            content: `You are a fashion trend analyst. Analyze current trending topics on X (Twitter) related to fashion, luxury brands, streetwear, and jewelry. 

Return a JSON array of the top 5 trending fashion topics with this structure:
[
  {
    "trend": "trend name",
    "brands": ["brand1", "brand2"],
    "musicGenres": ["genre1", "genre2"],
    "relevanceScore": 0.95,
    "reason": "why this trend is relevant"
  }
]

Consider these brands when matching trends:
LUXURY: SSENSE, Farfetch, Nordstrom, Saks Fifth Avenue, Neiman Marcus, Macy's, LTK, ShopStyle Collective, MR PORTER, Cettire, End Clothing
STREETWEAR: Fashion Nova, BoohooMAN, StockX, Stadium Goods, True Religion, PacSun
JEWELRY: The GLD Shop, Frost NYC, Jaxxon, King Ice, Cernucci, Gold Presidents, Helloice, Guess

Also suggest which music genres (Pop, Country, EDM, Latin, Rock, R&B, Hip-Hop) would pair well with each trend.

Return ONLY valid JSON, no other text.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${grokApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const trendData = response.data.choices[0].message.content;

    // Parse Grok response
    let trends: any[] = [];
    try {
      trends = JSON.parse(trendData);
    } catch (parseError) {
      console.error("Failed to parse Grok response:", trendData);
      return [];
    }

    // Convert trends to recommendations
    const recommendations: TrendRecommendation[] = [];

    for (const trend of trends) {
      for (const brand of trend.brands || []) {
        recommendations.push({
          brand,
          trend: trend.trend,
          relevanceScore: trend.relevanceScore || 0.8,
          trendingNow: true,
          musicGenres: trend.musicGenres || ["Pop", "Hip-Hop"],
          reason: trend.reason || "Trending on X",
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error("Grok trend monitoring error:", error);
    throw error;
  }
}

/**
 * Get brand recommendations based on current X trends
 */
export async function getBrandRecommendations(): Promise<TrendRecommendation[]> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("Database not available for brand recommendations");
      return [];
    }

    // Get current trends
    const trends = await monitorFashionTrends();

    // Filter to only include brands that have open castings
    const allCastings = await db.select().from(castings);
    const openBrands = new Set(
      allCastings
        .filter((c) => c.status === "open")
        .map((c) => c.brandName)
    );

    const filteredRecommendations = trends.filter((rec) =>
      openBrands.has(rec.brand)
    );

    // Sort by relevance score
    return filteredRecommendations.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );
  } catch (error) {
    console.error("Error getting brand recommendations:", error);
    return [];
  }
}

/**
 * Background task to run trend monitoring periodically
 */
export async function startTrendMonitoringTask(intervalMinutes: number = 60) {
  console.log(
    `🚀 Starting Grok trend monitoring every ${intervalMinutes} minutes`
  );

  // Run immediately
  await runTrendMonitoring();

  // Then run periodically
  setInterval(async () => {
    await runTrendMonitoring();
  }, intervalMinutes * 60 * 1000);
}

/**
 * Execute trend monitoring and log results
 */
async function runTrendMonitoring() {
  try {
    console.log("📊 Running Grok trend monitoring...");
    const recommendations = await getBrandRecommendations();

    if (recommendations.length > 0) {
      console.log(`✅ Found ${recommendations.length} trending opportunities:`);
      recommendations.forEach((rec) => {
        console.log(
          `  • ${rec.brand}: ${rec.trend} (${(rec.relevanceScore * 100).toFixed(0)}% relevant)`
        );
        console.log(`    Genres: ${rec.musicGenres.join(", ")}`);
        console.log(`    Reason: ${rec.reason}`);
      });
    } else {
      console.log("ℹ️ No trending opportunities at this time");
    }

    return recommendations;
  } catch (error) {
    console.error("Trend monitoring task error:", error);
  }
}

/**
 * Get personalized brand recommendations for a user based on their music genre preference
 */
export async function getPersonalizedBrandRecommendations(
  userMusicGenre: string
): Promise<TrendRecommendation[]> {
  try {
    const allRecommendations = await getBrandRecommendations();

    // Filter recommendations that match user's music genre
    return allRecommendations.filter((rec) =>
      rec.musicGenres.some(
        (genre) =>
          genre.toLowerCase() === userMusicGenre.toLowerCase()
      )
    );
  } catch (error) {
    console.error("Error getting personalized recommendations:", error);
    return [];
  }
}
