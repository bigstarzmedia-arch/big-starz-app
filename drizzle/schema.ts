import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  
  // Big Starz specific fields
  userRole: mysqlEnum("userRole", ["creator", "model", "artist", "producer"]),
  profilePicture: varchar("profilePicture", { length: 512 }),
  bio: text("bio"),
  subscriberCount: int("subscriberCount").default(0).notNull(),
  totalEarnings: varchar("totalEarnings", { length: 50 }).default("0").notNull(),
  revenueCatCustomerId: varchar("revenueCatCustomerId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "inactive", "cancelled"]).default("inactive"),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  stripeAccountId: varchar("stripeAccountId", { length: 255 }),
  stripeConnectOnboarded: boolean("stripeConnectOnboarded").default(false),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table (Cameo & Beautify Engine)
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  originalVideoUrl: varchar("originalVideoUrl", { length: 512 }).notNull(),
  originalVideoKey: varchar("originalVideoKey", { length: 512 }).notNull(),
  beautifiedVideoUrl: varchar("beautifiedVideoUrl", { length: 512 }),
  beautifiedVideoKey: varchar("beautifiedVideoKey", { length: 512 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  tags: json("tags"),
  visibility: mysqlEnum("visibility", ["private", "public"]).default("private"),
  aiModel: mysqlEnum("aiModel", ["kling", "heygen", "pollinations", "stable-diffusion", "text-to-video", "sora"]).notNull(),
  stylePreset: varchar("stylePreset", { length: 100 }),
  resolution: varchar("resolution", { length: 50 }).default("1080p"),
  processingStatus: mysqlEnum("processingStatus", ["pending", "processing", "completed", "failed"]).default("pending"),
  processingProgress: int("processingProgress").default(0),
  processingError: text("processingError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Music table (Music & Lyric Studio)
 */
export const music = mysqlTable("music", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  instrumentalUrl: varchar("instrumentalUrl", { length: 512 }).notNull(),
  instrumentalKey: varchar("instrumentalKey", { length: 512 }).notNull(),
  generatedMusicUrl: varchar("generatedMusicUrl", { length: 512 }),
  generatedMusicKey: varchar("generatedMusicKey", { length: 512 }),
  title: varchar("title", { length: 255 }),
  artist: varchar("artist", { length: 255 }),
  genre: varchar("genre", { length: 100 }),
  mood: varchar("mood", { length: 100 }),
  lyrics: text("lyrics"),
  lyricPrompt: text("lyricPrompt"),
  lyricModel: mysqlEnum("lyricModel", ["openai", "anthropic", "gemini-flash-free", "llama-3.8b-free", "sora"]).notNull(),
  voiceModel: varchar("voiceModel", { length: 100 }).notNull(),
  processingStatus: mysqlEnum("processingStatus", ["pending", "processing", "completed", "failed"]).default("pending"),
  processingProgress: int("processingProgress").default(0),
  processingError: text("processingError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Castings table (Affiliate Modeling Feature)
 */
export const castings = mysqlTable("castings", {
  id: int("id").autoincrement().primaryKey(),
  brandName: varchar("brandName", { length: 255 }).notNull(),
  productCategory: varchar("productCategory", { length: 255 }).notNull(),
  briefDescription: text("briefDescription"),
  fullBrief: text("fullBrief"),
  brandGuidelines: text("brandGuidelines"),
  requiredAttributes: json("requiredAttributes"),
  compensation: varchar("compensation", { length: 50 }).notNull(),
  compensationType: mysqlEnum("compensationType", ["flat_fee", "percentage"]).default("flat_fee"),
  applicationDeadline: timestamp("applicationDeadline").notNull(),
  shootDate: timestamp("shootDate"),
  status: mysqlEnum("status", ["open", "in_review", "closed"]).default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Casting Applications table
 */
export const castingApplications = mysqlTable("castingApplications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  castingId: int("castingId").notNull(),
  portfolioVideoIds: json("portfolioVideoIds"),
  answers: json("answers"),
  availabilityConfirmed: boolean("availabilityConfirmed").default(false),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Subscriber Tracking table (for 1k monetization gate)
 */
export const subscriberTracking = mysqlTable("subscriberTracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentSubscriberCount: int("currentSubscriberCount").default(0).notNull(),
  totalSubscribersAllTime: int("totalSubscribersAllTime").default(0).notNull(),
  hasReachedThousand: boolean("hasReachedThousand").default(false),
  reachedThousandAt: timestamp("reachedThousandAt"),
  castingFeesEnabled: boolean("castingFeesEnabled").default(false),
  castingFeeAmount: varchar("castingFeeAmount", { length: 50 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Earnings Ledger table (Stripe payouts tracking)
 */
export const earningsLedger = mysqlTable("earningsLedger", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transactionType: mysqlEnum("transactionType", ["casting_fee", "affiliate_commission", "refund"]).notNull(),
  amount: varchar("amount", { length: 50 }).notNull(),
  castingApplicationId: int("castingApplicationId"),
  castingId: int("castingId"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * RevenueCat Events table (for subscription analytics)
 */
export const revenueCatEvents = mysqlTable("revenueCatEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  productId: varchar("productId", { length: 255 }).notNull(),
  revenueCatEventId: varchar("revenueCatEventId", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Export types
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

export type Music = typeof music.$inferSelect;
export type InsertMusic = typeof music.$inferInsert;

export type Casting = typeof castings.$inferSelect;
export type InsertCasting = typeof castings.$inferInsert;

export type CastingApplication = typeof castingApplications.$inferSelect;
export type InsertCastingApplication = typeof castingApplications.$inferInsert;

export type SubscriberTracking = typeof subscriberTracking.$inferSelect;
export type InsertSubscriberTracking = typeof subscriberTracking.$inferInsert;

export type EarningsLedger = typeof earningsLedger.$inferSelect;
export type InsertEarningsLedger = typeof earningsLedger.$inferInsert;

export type RevenueCatEvent = typeof revenueCatEvents.$inferSelect;
export type InsertRevenueCatEvent = typeof revenueCatEvents.$inferInsert;

export type FreeTierQuota = typeof freeTierQuota.$inferSelect;
export type InsertFreeTierQuota = typeof freeTierQuota.$inferInsert;

/**
 * Free Tier Quota table (Daily generation limits)
 */
export const freeTierQuota = mysqlTable("freeTierQuota", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  dailyGenerationsRemaining: int("dailyGenerationsRemaining").default(3).notNull(),
  totalGenerationsThisMonth: int("totalGenerationsThisMonth").default(0).notNull(),
  lastResetDate: timestamp("lastResetDate").defaultNow().notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "elite"]).default("free").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Messages table (Real-time chat)
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Conversations table (Chat list)
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId1: int("userId1").notNull(),
  userId2: int("userId2").notNull(),
  lastMessageId: int("lastMessageId"),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Face Clones table (Face upload for video synthesis)
 */
export const faceClones = mysqlTable("faceClones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  faceImageUrl: varchar("faceImageUrl", { length: 512 }).notNull(),
  faceImageKey: varchar("faceImageKey", { length: 512 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  processingStatus: mysqlEnum("processingStatus", ["pending", "processing", "completed", "failed"]).default("pending"),
  processingError: text("processingError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FaceClone = typeof faceClones.$inferSelect;
export type InsertFaceClone = typeof faceClones.$inferInsert;

/**
 * Video Generations table (Sora API job tracking)
 */
export const videoGenerations = mysqlTable("videoGenerations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  prompt: text("prompt").notNull(),
  soraJobId: varchar("soraJobId", { length: 255 }),
  outputVideoUrl: varchar("outputVideoUrl", { length: 512 }),
  outputVideoKey: varchar("outputVideoKey", { length: 512 }),
  processingStatus: mysqlEnum("processingStatus", ["pending", "processing", "completed", "failed"]).default("pending"),
  processingError: text("processingError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoGeneration = typeof videoGenerations.$inferSelect;
export type InsertVideoGeneration = typeof videoGenerations.$inferInsert;
