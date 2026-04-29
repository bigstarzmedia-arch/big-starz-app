import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, videos, music, castings, castingApplications, subscriberTracking, earningsLedger, revenueCatEvents, type InsertVideo, type InsertMusic, type InsertCasting, type InsertCastingApplication, type InsertSubscriberTracking, type InsertEarningsLedger, type InsertRevenueCatEvent } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

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
