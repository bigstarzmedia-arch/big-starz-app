import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, videos, music, castings, castingApplications, subscriberTracking, earningsLedger, revenueCatEvents, type InsertVideo, type InsertMusic, type InsertCasting, type InsertCastingApplication, type InsertSubscriberTracking, type InsertEarningsLedger, type InsertRevenueCatEvent } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { UserInputSchema, validateInput } from "./_core/validation";
import { logger } from "./_core/logger";

// Connection pool for production-grade database access
let _pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    _pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 10,           // Max simultaneous connections
      waitForConnections: true,      // Queue requests when pool is full
      queueLimit: 0,                 // Unlimited queue (0 = unlimited)
      enableKeepAlive: true,         // Keep idle connections alive
      keepAliveInitialDelay: 10000,  // 10 seconds between keepalive probes
      connectTimeout: 5000,          // Fail fast if DB is unreachable
    });
    logger.info("[Database] Connection pool created with 10 max connections");
  }
  return _pool;
}

// Get drizzle instance with connection pool
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = getPool();
      _db = drizzle(pool as any);
      logger.info("[Database] Drizzle ORM initialized with connection pool");
    } catch (error) {
      logger.error({ err: error }, "[Database] Failed to create connection pool");
      throw error; // Don't return null — fail loudly
    }
  }
  if (!_db) {
    throw new Error("[Database] DATABASE_URL is not set");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  // Validate input before processing
  const validatedUser = validateInput(UserInputSchema, user);
  
  if (!validatedUser.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: validatedUser.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = validatedUser[field as keyof typeof validatedUser];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as any)[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (validatedUser.lastSignedIn !== undefined) {
      values.lastSignedIn = validatedUser.lastSignedIn;
      updateSet.lastSignedIn = validatedUser.lastSignedIn;
    }
    if (validatedUser.role !== undefined) {
      (values as any).role = validatedUser.role;
      updateSet.role = validatedUser.role;
    }
    // NOTE: Admin roles must be assigned manually in the database or through a secure admin panel
    // Never automatically assign admin roles based on environment variables

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Validation error')) {
      console.error("[Database] User validation failed:", error.message);
      throw new Error(`Invalid user data: ${error.message}`);
    }
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Video Functions (Cameo & Beautify Engine)
 */
export async function createVideo(data: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(videos).values(data);
  const result = await db.select().from(videos).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getUserVideos(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).where(eq(videos.userId, userId));
}

export async function getVideoById(videoId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateVideoProcessing(videoId: number, status: string, progress: number, error?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(videos).set({
    processingStatus: status as any,
    processingProgress: progress,
    processingError: error,
  }).where(eq(videos.id, videoId));
}

export async function updateVideoBeautified(videoId: number, beautifiedUrl: string, beautifiedKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(videos).set({
    beautifiedVideoUrl: beautifiedUrl,
    beautifiedVideoKey: beautifiedKey,
    processingStatus: "completed",
    processingProgress: 100,
  }).where(eq(videos.id, videoId));
}

/**
 * Music Functions (Music & Lyric Studio)
 */
export async function createMusic(data: InsertMusic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(music).values(data);
  const result = await db.select().from(music).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getUserMusic(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(music).where(eq(music.userId, userId));
}

export async function getMusicById(musicId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(music).where(eq(music.id, musicId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateMusicProcessing(musicId: number, status: string, progress: number, error?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(music).set({
    processingStatus: status as any,
    processingProgress: progress,
    processingError: error,
  }).where(eq(music.id, musicId));
}

export async function updateMusicGenerated(musicId: number, generatedUrl: string, generatedKey: string, lyrics: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(music).set({
    generatedMusicUrl: generatedUrl,
    generatedMusicKey: generatedKey,
    lyrics: lyrics,
    processingStatus: "completed",
    processingProgress: 100,
  }).where(eq(music.id, musicId));
}

/**
 * Casting Functions (Affiliate Modeling Feature)
 */
export async function createCasting(data: InsertCasting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(castings).values(data);
  const result = await db.select().from(castings).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getAllCastings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(castings);
}

export async function getCastingById(castingId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(castings).where(eq(castings.id, castingId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOpenCastings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(castings).where(eq(castings.status, "open"));
}

/**
 * Casting Application Functions
 */
export async function createCastingApplication(data: InsertCastingApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(castingApplications).values(data);
  const result = await db.select().from(castingApplications).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getUserCastingApplications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(castingApplications).where(eq(castingApplications.userId, userId));
}

export async function getCastingApplicationById(applicationId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(castingApplications).where(eq(castingApplications.id, applicationId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCastingApplicationStatus(applicationId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(castingApplications).set({
    status: status as any,
  }).where(eq(castingApplications.id, applicationId));
}

/**
 * Subscriber Tracking Functions (1k Monetization Gate)
 */
export async function getOrCreateSubscriberTracking(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(subscriberTracking).where(eq(subscriberTracking.userId, userId)).limit(1);
  let tracking = result.length > 0 ? result[0] : null;
  
  if (!tracking) {
    await db.insert(subscriberTracking).values({
      userId,
      currentSubscriberCount: 0,
      totalSubscribersAllTime: 0,
      hasReachedThousand: false,
      castingFeesEnabled: false,
    });
    const newResult = await db.select().from(subscriberTracking).where(eq(subscriberTracking.userId, userId)).limit(1);
    tracking = newResult.length > 0 ? newResult[0] : null;
  }
  
  return tracking;
}

export async function updateSubscriberCount(userId: number, count: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const tracking = await getOrCreateSubscriberTracking(userId);
  const hasReachedThousand = count >= 1000;
  
  await db.update(subscriberTracking).set({
    currentSubscriberCount: count,
    totalSubscribersAllTime: Math.max(tracking?.totalSubscribersAllTime || 0, count),
    hasReachedThousand: hasReachedThousand,
    reachedThousandAt: hasReachedThousand && !tracking?.hasReachedThousand ? new Date() : tracking?.reachedThousandAt,
  }).where(eq(subscriberTracking.userId, userId));
}

export async function enableCastingFees(userId: number, feeAmount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriberTracking).set({
    castingFeesEnabled: true,
    castingFeeAmount: feeAmount,
  }).where(eq(subscriberTracking.userId, userId));
}

export async function getSubscriberTracking(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(subscriberTracking).where(eq(subscriberTracking.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Earnings Ledger Functions (Stripe Payouts)
 */
export async function createEarningsEntry(data: InsertEarningsLedger) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(earningsLedger).values(data);
  // Return the last inserted ID by querying the latest entry
  const result = await db.select().from(earningsLedger).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getUserEarnings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(earningsLedger).where(eq(earningsLedger.userId, userId));
}

export async function updateEarningsEntryStatus(entryId: number, status: string, stripeTransferId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (stripeTransferId) {
    updateData.stripeTransferId = stripeTransferId;
  }
  
  await db.update(earningsLedger).set(updateData).where(eq(earningsLedger.id, entryId));
}

/**
 * RevenueCat Event Functions
 */
export async function createRevenueCatEvent(data: InsertRevenueCatEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(revenueCatEvents).values(data);
  // Return the last inserted ID by querying the latest entry
  const result = await db.select().from(revenueCatEvents).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function getUserRevenueCatEvents(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(revenueCatEvents).where(eq(revenueCatEvents.userId, userId));
}

/**
 * Subscription Functions
 */
export async function updateUserSubscription(userId: number, revenueCatCustomerId: string, status: string, expiresAt?: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set({
    revenueCatCustomerId,
    subscriptionStatus: status as any,
    subscriptionExpiresAt: expiresAt,
  }).where(eq(users.id, userId));
}

export async function getUserSubscriptionStatus(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const user = await getUserByOpenId(userId.toString());
  return user ? {
    status: user.subscriptionStatus,
    expiresAt: user.subscriptionExpiresAt,
    customerId: user.revenueCatCustomerId,
  } : null;
}


/**
 * Message Functions (Real-time Chat)
 */
export async function sendMessage(senderId: number, recipientId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Import at function level to avoid circular deps
  const { messages, conversations } = await import("../drizzle/schema");
  const { eq, or, and } = await import("drizzle-orm");
  
  // Insert message
  await db.insert(messages).values({
    senderId,
    recipientId,
    content,
    isRead: false,
  });
  
  // Update or create conversation
  const existingConv = await db.select().from(conversations).where(
    or(
      and(eq(conversations.userId1, senderId), eq(conversations.userId2, recipientId)),
      and(eq(conversations.userId1, recipientId), eq(conversations.userId2, senderId))
    )
  ).limit(1);
  
  if (existingConv.length > 0) {
    await db.update(conversations).set({
      lastMessageAt: new Date(),
    }).where(eq(conversations.id, existingConv[0].id));
  } else {
    await db.insert(conversations).values({
      userId1: Math.min(senderId, recipientId),
      userId2: Math.max(senderId, recipientId),
      lastMessageAt: new Date(),
    });
  }
}

export async function getConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { conversations } = await import("../drizzle/schema");
  const { or, eq } = await import("drizzle-orm");
  
  return db.select().from(conversations).where(
    or(eq(conversations.userId1, userId), eq(conversations.userId2, userId))
  ).orderBy((t) => t.lastMessageAt || t.createdAt);
}

export async function getMessages(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { messages } = await import("../drizzle/schema");
  const { or, and, eq } = await import("drizzle-orm");
  
  return db.select().from(messages).where(
    or(
      and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
      and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
    )
  ).orderBy((t) => t.createdAt);
}

export async function markMessagesAsRead(userId: number, senderId: number) {
  const db = await getDb();
  if (!db) return;
  
  const { messages } = await import("../drizzle/schema");
  const { and, eq } = await import("drizzle-orm");
  
  await db.update(messages).set({
    isRead: true,
  }).where(
    and(eq(messages.recipientId, userId), eq(messages.senderId, senderId))
  );
}

/**
 * Face Clone Functions
 */
export async function uploadFaceClone(userId: number, faceImageUrl: string, faceImageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { faceClones } = await import("../drizzle/schema");
  
  // If this is the first face clone, make it default
  const existing = await db.select().from(faceClones).where(eq(faceClones.userId, userId)).limit(1);
  const isDefault = existing.length === 0;
  
  await db.insert(faceClones).values({
    userId,
    faceImageUrl,
    faceImageKey,
    isDefault,
    processingStatus: "completed",
  });
}

export async function getUserFaceClones(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { faceClones } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  return db.select().from(faceClones).where(eq(faceClones.userId, userId));
}

export async function setDefaultFaceClone(userId: number, faceCloneId: number) {
  const db = await getDb();
  if (!db) return;
  
  const { faceClones } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  // Unset all defaults for this user
  await db.update(faceClones).set({
    isDefault: false,
  }).where(eq(faceClones.userId, userId));
  
  // Set the new default
  await db.update(faceClones).set({
    isDefault: true,
  }).where(and(eq(faceClones.id, faceCloneId), eq(faceClones.userId, userId)));
}

/**
 * Video Generation Functions (Sora API)
 */
export async function createVideoGeneration(userId: number, prompt: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { videoGenerations } = await import("../drizzle/schema");
  
  await db.insert(videoGenerations).values({
    userId,
    prompt,
    processingStatus: "pending",
  });
  
  const result = await db.select().from(videoGenerations).orderBy((t) => t.id).limit(1);
  return result.length > 0 ? result[0].id : 0;
}

export async function updateVideoGenerationStatus(videoGenId: number, status: string, outputUrl?: string, outputKey?: string, error?: string) {
  const db = await getDb();
  if (!db) return;
  
  const { videoGenerations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  await db.update(videoGenerations).set({
    processingStatus: status as any,
    outputVideoUrl: outputUrl,
    outputVideoKey: outputKey,
    processingError: error,
  }).where(eq(videoGenerations.id, videoGenId));
}

export async function getUserVideoGenerations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { videoGenerations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  return db.select().from(videoGenerations).where(eq(videoGenerations.userId, userId));
}
