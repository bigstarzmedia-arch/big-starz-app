import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

/**
 * Gift/Tip System for Big Starz
 * Allows viewers to send virtual gifts to creators with Stripe integration
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

export const giftRouter = Router();

export interface Gift {
  id: string;
  giftId: string;
  name: string;
  emoji: string;
  price: number; // in cents
  description: string;
}

export interface GiftTransaction {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  giftId: string;
  giftName: string;
  amount: number; // in cents
  timestamp: Date;
  stripePaymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
}

// Available gifts
const AVAILABLE_GIFTS: Gift[] = [
  {
    id: 'rose',
    giftId: 'gift_rose_001',
    name: 'Rose',
    emoji: '🌹',
    price: 99, // $0.99
    description: 'A beautiful rose for your favorite creator',
  },
  {
    id: 'diamond',
    giftId: 'gift_diamond_001',
    name: 'Diamond',
    emoji: '💎',
    price: 499, // $4.99
    description: 'A precious diamond to show your love',
  },
  {
    id: 'crown',
    giftId: 'gift_crown_001',
    name: 'Crown',
    emoji: '👑',
    price: 999, // $9.99
    description: 'Crown the creator as royalty',
  },
  {
    id: 'rocket',
    giftId: 'gift_rocket_001',
    name: 'Rocket',
    emoji: '🚀',
    price: 1999, // $19.99
    description: 'Send them to the moon',
  },
  {
    id: 'fire',
    giftId: 'gift_fire_001',
    name: 'Fire',
    emoji: '🔥',
    price: 4999, // $49.99
    description: 'They are on fire',
  },
];

// Store transactions (in production, use database)
const transactions: Map<string, GiftTransaction> = new Map();

/**
 * Get available gifts
 */
giftRouter.get('/gifts', (req: Request, res: Response) => {
  res.json({
    gifts: AVAILABLE_GIFTS,
    count: AVAILABLE_GIFTS.length,
  });
});

/**
 * Send a gift to a creator
 */
giftRouter.post('/gifts/send', async (req: Request, res: Response) => {
  const { senderId, senderName, recipientId, recipientName, giftId, stripeTokenId } = req.body;

  // Validate input
  if (!senderId || !recipientId || !giftId || !stripeTokenId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find the gift
  const gift = AVAILABLE_GIFTS.find((g) => g.id === giftId);
  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' });
  }

  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gift.price,
      currency: 'usd',
      payment_method: stripeTokenId,
      confirm: true,
      metadata: {
        senderId,
        senderName,
        recipientId,
        recipientName,
        giftId: gift.id,
        giftName: gift.name,
      },
    });

    // Create transaction record
    const transaction: GiftTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      senderName,
      recipientId,
      recipientName,
      giftId: gift.id,
      giftName: gift.name,
      amount: gift.price,
      timestamp: new Date(),
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
    };

    transactions.set(transaction.id, transaction);

    // TODO: Update creator earnings in database
    // TODO: Send notification to recipient
    // TODO: Log transaction to analytics

    res.json({
      success: true,
      transaction,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
      },
    });
  } catch (error: any) {
    console.error('Gift payment error:', error);
    res.status(500).json({
      error: 'Failed to process gift payment',
      message: error.message,
    });
  }
});

/**
 * Get gift transaction history for a creator
 */
giftRouter.get('/gifts/history/:creatorId', (req: Request, res: Response) => {
  const { creatorId } = req.params;

  const creatorTransactions = Array.from(transactions.values()).filter(
    (t) => t.recipientId === creatorId
  );

  const totalEarnings = creatorTransactions.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    creatorId,
    transactions: creatorTransactions,
    totalEarnings,
    transactionCount: creatorTransactions.length,
  });
});

/**
 * Get gift leaderboard
 */
giftRouter.get('/gifts/leaderboard', (req: Request, res: Response) => {
  const leaderboard = new Map<string, { name: string; totalEarnings: number; count: number }>();

  for (const transaction of transactions.values()) {
    if (transaction.status === 'completed') {
      const key = transaction.recipientId;
      if (!leaderboard.has(key)) {
        leaderboard.set(key, {
          name: transaction.recipientName,
          totalEarnings: 0,
          count: 0,
        });
      }

      const entry = leaderboard.get(key)!;
      entry.totalEarnings += transaction.amount;
      entry.count += 1;
    }
  }

  const sorted = Array.from(leaderboard.values())
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, 100);

  res.json({
    leaderboard: sorted,
    count: sorted.length,
  });
});

/**
 * Get creator earnings summary
 */
giftRouter.get('/gifts/earnings/:creatorId', (req: Request, res: Response) => {
  const { creatorId } = req.params;

  const creatorTransactions = Array.from(transactions.values()).filter(
    (t) => t.recipientId === creatorId && t.status === 'completed'
  );

  const totalEarnings = creatorTransactions.reduce((sum, t) => sum + t.amount, 0);
  const platformFee = Math.floor(totalEarnings * 0.1); // 10% platform fee
  const creatorPayout = totalEarnings - platformFee;

  res.json({
    creatorId,
    totalEarnings,
    platformFee,
    creatorPayout,
    transactionCount: creatorTransactions.length,
    lastUpdated: new Date(),
  });
});

export function getGiftById(giftId: string): Gift | undefined {
  return AVAILABLE_GIFTS.find((g) => g.id === giftId);
}

export function getAllGifts(): Gift[] {
  return AVAILABLE_GIFTS;
}

export function getTransactionById(transactionId: string): GiftTransaction | undefined {
  return transactions.get(transactionId);
}
