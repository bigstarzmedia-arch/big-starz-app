import Stripe from "stripe";

/**
 * Stripe Integration
 * Handles user-to-user casting fee payments and payouts
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

interface CreateConnectAccountRequest {
  email: string;
  country: string;
  type: "individual" | "company";
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  castingId: number;
  payerId: number;
  payeeId: number;
}

interface CreateTransferRequest {
  amount: number;
  currency: string;
  destination: string;
  sourceTransaction: string;
  description: string;
}

/**
 * Create a Stripe Connect account for a user
 * Enables them to receive payouts from casting fees
 */
export async function createConnectAccount(
  data: CreateConnectAccountRequest
): Promise<string> {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: data.country,
      email: data.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return account.id;
  } catch (error) {
    console.error("Stripe Connect account creation error:", error);
    throw new Error(`Failed to create Stripe Connect account: ${error}`);
  }
}

/**
 * Get Stripe Connect account details
 */
export async function getConnectAccount(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return {
      id: account.id,
      email: account.email,
      country: account.country,
      type: account.type,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements,
    };
  } catch (error) {
    console.error("Stripe account retrieval error:", error);
    throw new Error(`Failed to retrieve Stripe account: ${error}`);
  }
}

/**
 * Create a payment intent for casting fee
 * Charges the payer and prepares funds for transfer to payee
 */
export async function createCastingFeePayment(
  data: CreatePaymentIntentRequest
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency,
      description: data.description,
      metadata: {
        castingId: data.castingId.toString(),
        payerId: data.payerId.toString(),
        payeeId: data.payeeId.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || "",
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe payment intent creation error:", error);
    throw new Error(`Failed to create payment intent: ${error}`);
  }
}

/**
 * Confirm a payment intent
 */
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error("Stripe payment intent confirmation error:", error);
    throw new Error(`Failed to confirm payment intent: ${error}`);
  }
}

/**
 * Create a transfer from platform account to payee's Stripe Connect account
 * This is called after a successful payment
 */
export async function createPayeeTransfer(
  data: CreateTransferRequest
): Promise<string> {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency,
      destination: data.destination,
      source_transaction: data.sourceTransaction,
      description: data.description,
    });

    return transfer.id;
  } catch (error) {
    console.error("Stripe transfer creation error:", error);
    throw new Error(`Failed to create transfer: ${error}`);
  }
}

/**
 * Get transfer details
 */
export async function getTransfer(transferId: string) {
  try {
    const transfer = await stripe.transfers.retrieve(transferId);

    return {
      id: transfer.id,
      amount: transfer.amount / 100,
      currency: transfer.currency,
      destination: transfer.destination,
      status: transfer.status,
      created: transfer.created,
    };
  } catch (error) {
    console.error("Stripe transfer retrieval error:", error);
    throw new Error(`Failed to retrieve transfer: ${error}`);
  }
}

/**
 * List all transfers for a destination account
 */
export async function listTransfers(destination: string, limit: number = 10) {
  try {
    const transfers = await stripe.transfers.list({
      destination: destination,
      limit: limit,
    });

    return transfers.data.map((t: any) => ({
      id: t.id,
      amount: t.amount / 100,
      currency: t.currency,
      destination: t.destination,
      status: t.status,
      created: t.created,
    }));
  } catch (error) {
    console.error("Stripe transfers list error:", error);
    throw new Error(`Failed to list transfers: ${error}`);
  }
}

/**
 * Create a payout to a bank account
 */
export async function createPayout(
  accountId: string,
  amount: number,
  currency: string = "usd"
) {
  try {
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
      },
      {
        stripeAccount: accountId,
      }
    );

    return {
      id: payout.id,
      amount: payout.amount / 100,
      currency: payout.currency,
      status: payout.status,
      arrivalDate: payout.arrival_date,
    };
  } catch (error) {
    console.error("Stripe payout creation error:", error);
    throw new Error(`Failed to create payout: ${error}`);
  }
}

/**
 * Get payout details
 */
export async function getPayout(accountId: string, payoutId: string) {
  try {
    const payout = await stripe.payouts.retrieve(payoutId, {
      stripeAccount: accountId,
    });

    return {
      id: payout.id,
      amount: payout.amount / 100,
      currency: payout.currency,
      status: payout.status,
      arrivalDate: payout.arrival_date,
    };
  } catch (error) {
    console.error("Stripe payout retrieval error:", error);
    throw new Error(`Failed to retrieve payout: ${error}`);
  }
}

/**
 * List payouts for an account
 */
export async function listPayouts(accountId: string, limit: number = 10) {
  try {
    const payouts = await stripe.payouts.list(
      { limit: limit },
      {
        stripeAccount: accountId,
      }
    );

    return payouts.data.map((p: any) => ({
      id: p.id,
      amount: p.amount / 100,
      currency: p.currency,
      status: p.status,
      arrivalDate: p.arrival_date,
    }));
  } catch (error) {
    console.error("Stripe payouts list error:", error);
    throw new Error(`Failed to list payouts: ${error}`);
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(accountId: string) {
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    return {
      available: balance.available.map((b: any) => ({
        amount: b.amount / 100,
        currency: b.currency,
      })),
      pending: balance.pending.map((b: any) => ({
        amount: b.amount / 100,
        currency: b.currency,
      })),
    };
  } catch (error) {
    console.error("Stripe balance retrieval error:", error);
    throw new Error(`Failed to retrieve account balance: ${error}`);
  }
}
