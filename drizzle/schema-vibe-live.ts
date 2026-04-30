/**
 * Vibe Live Schema Extensions
 * Live streams, gifting, watermarking, and referral tracking
 */

import { mysqlTable, text, int, boolean, timestamp, decimal, varchar } from "drizzle-orm/mysql-core";
import { users } from "./schema";

export const liveStreams = mysqlTable("live_streams", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull().default(""),
  streamUrl: varchar({ length: 500 }).notNull(),
  thumbnailUrl: varchar({ length: 500 }).default(""),
  isLive: boolean().notNull().default(true),
  viewerCount: int().notNull().default(0),
  totalGiftsReceived: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  startedAt: timestamp().notNull().defaultNow(),
  endedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const liveComments = mysqlTable("live_comments", {
  id: int().primaryKey().autoincrement(),
  streamId: int().notNull().references(() => liveStreams.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  comment: text().notNull(),
  isPinned: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});

export const gifts = mysqlTable("gifts", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  icon: varchar({ length: 50 }).notNull(),
  displayName: varchar({ length: 100 }).notNull(),
  value: decimal({ precision: 10, scale: 2 }).notNull(),
  emoji: varchar({ length: 10 }).default(""),
  description: text().notNull().default(""),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
});

export const giftTransactions = mysqlTable("gift_transactions", {
  id: int().primaryKey().autoincrement(),
  streamId: int().notNull().references(() => liveStreams.id, { onDelete: "cascade" }),
  giftId: int().notNull().references(() => gifts.id),
  senderId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  giftValue: decimal({ precision: 10, scale: 2 }).notNull(),
  creatorPayout: decimal({ precision: 10, scale: 2 }).notNull(),
  platformFee: decimal({ precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar({ length: 255 }).default(""),
  stripeTransferId: varchar({ length: 255 }).default(""),
  payoutStatus: varchar({ length: 50 }).notNull().default("pending"),
  createdAt: timestamp().notNull().defaultNow(),
  completedAt: timestamp(),
});

export const creatorStripeAccounts = mysqlTable("creator_stripe_accounts", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  stripeConnectAccountId: varchar({ length: 255 }).notNull().unique(),
  stripeAccountStatus: varchar({ length: 50 }).notNull().default("pending"),
  bankAccountLinked: boolean().notNull().default(false),
  totalPayoutsReceived: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  lastPayoutDate: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const videoWatermarks = mysqlTable("video_watermarks", {
  id: int().primaryKey().autoincrement(),
  videoId: int().notNull(),
  userId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  hasWatermark: boolean().notNull().default(true),
  watermarkType: varchar({ length: 50 }).notNull().default("big_starz_logo"),
  watermarkPosition: varchar({ length: 50 }).notNull().default("bottom_right"),
  watermarkOpacity: decimal({ precision: 3, scale: 2 }).notNull().default("0.8"),
  isWatermarkRemoved: boolean().notNull().default(false),
  removalReason: varchar({ length: 100 }).default(""),
  removedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const referralLinks = mysqlTable("referral_links", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  referralCode: varchar({ length: 50 }).notNull().unique(),
  referralUrl: varchar({ length: 500 }).notNull(),
  totalReferrals: int().notNull().default(0),
  totalConversions: int().notNull().default(0),
  totalEarnings: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const referralConversions = mysqlTable("referral_conversions", {
  id: int().primaryKey().autoincrement(),
  referralLinkId: int().notNull().references(() => referralLinks.id, { onDelete: "cascade" }),
  referrerId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  referredUserId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  referralSource: varchar({ length: 50 }).notNull(),
  conversionType: varchar({ length: 50 }).notNull().default("signup"),
  conversionValue: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  commissionAmount: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
  status: varchar({ length: 50 }).notNull().default("pending"),
  createdAt: timestamp().notNull().defaultNow(),
  completedAt: timestamp(),
});

export const socialShareEvents = mysqlTable("social_share_events", {
  id: int().primaryKey().autoincrement(),
  videoId: int().notNull(),
  userId: int().notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: varchar({ length: 50 }).notNull(),
  referralCode: varchar({ length: 50 }).default(""),
  shareUrl: varchar({ length: 500 }).default(""),
  clickCount: int().notNull().default(0),
  conversionCount: int().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
});

export type LiveStream = typeof liveStreams.$inferSelect;
export type LiveComment = typeof liveComments.$inferSelect;
export type Gift = typeof gifts.$inferSelect;
export type GiftTransaction = typeof giftTransactions.$inferSelect;
export type CreatorStripeAccount = typeof creatorStripeAccounts.$inferSelect;
export type VideoWatermark = typeof videoWatermarks.$inferSelect;
export type ReferralLink = typeof referralLinks.$inferSelect;
export type ReferralConversion = typeof referralConversions.$inferSelect;
export type SocialShareEvent = typeof socialShareEvents.$inferSelect;
