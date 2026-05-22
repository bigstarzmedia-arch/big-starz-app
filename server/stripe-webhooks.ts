import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 * Manages subscription events and updates user tier status
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const stripeRouter = Router();

interface SubscriptionEvent {
  userId: string;
  customerId: string;
  subscriptionId: string;
  tier: 'free' | 'pro' | 'elite';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
}

// Store subscription data (in production, use database)
const subscriptions = new Map<string, SubscriptionEvent>();

/**
 * Webhook endpoint for Stripe events
 */
stripeRouter.post('/webhooks/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const tier = getTierFromPriceId(subscription.items.data[0]?.price.id);

  const subscriptionEvent: SubscriptionEvent = {
    userId: customerId, // In production, map customerId to userId
    customerId,
    subscriptionId: subscription.id,
    tier,
    status: subscription.status as 'active' | 'canceled' | 'past_due',
    currentPeriodEnd: new Date(((subscription as any).current_period_end || 0) * 1000),
  };

  subscriptions.set(subscription.id, subscriptionEvent);

  // TODO: Update user tier in database
  console.log(`User ${customerId} upgraded to ${tier} tier`);
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = subscription.customer as string;
  const tier = getTierFromPriceId(subscription.items.data[0]?.price.id);

  const subscriptionEvent: SubscriptionEvent = {
    userId: customerId,
    customerId,
    subscriptionId: subscription.id,
    tier,
    status: subscription.status as 'active' | 'canceled' | 'past_due',
    currentPeriodEnd: new Date(((subscription as any).current_period_end || 0) * 1000),
  };

  subscriptions.set(subscription.id, subscriptionEvent);

  // TODO: Update user tier in database
  console.log(`User ${customerId} subscription updated to ${tier} tier`);
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer as string;

  subscriptions.delete(subscription.id);

  // TODO: Downgrade user to free tier
  console.log(`User ${customerId} subscription canceled - downgraded to free tier`);
}

/**
 * Handle payment succeeded event
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);

  const customerId = invoice.customer as string;
  const subscriptionId = ((invoice as any).subscription || '') as string;

  const subscription = subscriptions.get(subscriptionId);
  if (subscription) {
    subscription.status = 'active';
    // TODO: Update payment status in database
    console.log(`Payment confirmed for user ${customerId}`);
  }
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  const customerId = invoice.customer as string;
  const subscriptionId = ((invoice as any).subscription || '') as string;

  const subscription = subscriptions.get(subscriptionId);
  if (subscription) {
    subscription.status = 'past_due';
    // TODO: Notify user and update status in database
    console.log(`Payment failed for user ${customerId}`);
  }
}

/**
 * Map Stripe price ID to tier
 */
function getTierFromPriceId(priceId?: string): 'free' | 'pro' | 'elite' {
  if (!priceId) return 'free';

  // Map your Stripe price IDs to tiers
  const priceMap: Record<string, 'free' | 'pro' | 'elite'> = {
    [process.env.STRIPE_PRICE_PRO || '']: 'pro',
    [process.env.STRIPE_PRICE_ELITE || '']: 'elite',
  };

  return priceMap[priceId] || 'free';
}

/**
 * Get subscription status for user
 */
export function getSubscriptionStatus(subscriptionId: string): SubscriptionEvent | null {
  return subscriptions.get(subscriptionId) || null;
}

/**
 * Get all subscriptions (for admin)
 */
export function getAllSubscriptions(): SubscriptionEvent[] {
  return Array.from(subscriptions.values());
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create Stripe customer
 */
export async function createStripeCustomer(userId: string, email: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}
