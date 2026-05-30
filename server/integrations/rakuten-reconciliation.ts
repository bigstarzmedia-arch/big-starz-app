/**
 * Rakuten Reconciliation & Payout Service
 * Fetches transaction data from Rakuten Reporting API and calculates commissions
 */

interface RakutenTransaction {
  transaction_id: string;
  cast_member_id: string; // Extracted from u1 parameter
  merchant_id: string;
  sale_amount: number;
  commission_amount: number;
  transaction_date: Date;
  status: 'approved' | 'pending' | 'declined';
}

interface CommissionSplit {
  transaction_id: string;
  cast_member_id: string;
  raw_sale_amount: number;
  total_commission_received: number;
  platform_split_percentage: number; // 0.20 = 20%
  platform_retained_amount: number;
  cast_payout_amount: number;
  status: 'pending_clearance' | 'cleared' | 'paid';
  processed_at: Date;
}

export class RakutenReconciliationService {
  private publisherId: string;
  private apiKey: string;
  private platformSplitPercentage: number = 0.20; // 20% platform cut, 80% to cast member

  constructor() {
    this.publisherId = process.env.RAKUTEN_PUBLISHER_ID || '';
    this.apiKey = process.env.RAKUTEN_API_KEY || '';

    if (!this.publisherId || !this.apiKey) {
      console.warn('Rakuten credentials not configured - reconciliation will be disabled');
    }
  }

  /**
   * Parse Rakuten transaction report and extract cast member earnings
   */
  parseTransactionReport(reportData: any[]): RakutenTransaction[] {
    return reportData.map((transaction) => ({
      transaction_id: transaction.transaction_id || transaction.txn_id,
      cast_member_id: transaction.u1 || '', // Sub-ID field
      merchant_id: transaction.mid || transaction.merchant_id,
      sale_amount: parseFloat(transaction.sale_amount || transaction.amount || '0'),
      commission_amount: parseFloat(transaction.commission || transaction.commission_amount || '0'),
      transaction_date: new Date(transaction.transaction_date || transaction.date),
      status: (transaction.status || 'pending').toLowerCase() as any,
    }));
  }

  /**
   * Calculate commission split for a single transaction
   */
  calculateCommissionSplit(transaction: RakutenTransaction): CommissionSplit {
    const totalCommission = transaction.commission_amount;
    const platformRetained = totalCommission * this.platformSplitPercentage;
    const castPayout = totalCommission - platformRetained;

    return {
      transaction_id: transaction.transaction_id,
      cast_member_id: transaction.cast_member_id,
      raw_sale_amount: transaction.sale_amount,
      total_commission_received: totalCommission,
      platform_split_percentage: this.platformSplitPercentage,
      platform_retained_amount: Math.round(platformRetained * 100) / 100, // Round to 2 decimals
      cast_payout_amount: Math.round(castPayout * 100) / 100,
      status: 'pending_clearance',
      processed_at: new Date(),
    };
  }

  /**
   * Calculate commission splits for multiple transactions
   */
  calculateBulkCommissionSplits(transactions: RakutenTransaction[]): CommissionSplit[] {
    return transactions.map((txn) => this.calculateCommissionSplit(txn));
  }

  /**
   * Aggregate earnings by cast member
   */
  aggregateEarningsByCastMember(splits: CommissionSplit[]): Record<string, any> {
    const aggregated: Record<string, any> = {};

    splits.forEach((split) => {
      if (!aggregated[split.cast_member_id]) {
        aggregated[split.cast_member_id] = {
          cast_member_id: split.cast_member_id,
          total_sales: 0,
          total_commission: 0,
          platform_retained: 0,
          cast_payout: 0,
          transaction_count: 0,
          transactions: [],
        };
      }

      aggregated[split.cast_member_id].total_sales += split.raw_sale_amount;
      aggregated[split.cast_member_id].total_commission += split.total_commission_received;
      aggregated[split.cast_member_id].platform_retained += split.platform_retained_amount;
      aggregated[split.cast_member_id].cast_payout += split.cast_payout_amount;
      aggregated[split.cast_member_id].transaction_count += 1;
      aggregated[split.cast_member_id].transactions.push(split);
    });

    return aggregated;
  }

  /**
   * Generate payout ledger for database update
   */
  generatePayoutLedger(splits: CommissionSplit[]): Array<{
    cast_member_id: string;
    amount: number;
    transaction_ids: string[];
    status: string;
  }> {
    const aggregated = this.aggregateEarningsByCastMember(splits);

    return Object.values(aggregated).map((data: any) => ({
      cast_member_id: data.cast_member_id,
      amount: data.cast_payout,
      transaction_ids: data.transactions.map((t: CommissionSplit) => t.transaction_id),
      status: 'pending_payout',
    }));
  }

  /**
   * Validate transaction data
   */
  validateTransaction(transaction: RakutenTransaction): boolean {
    return (
      !!transaction.transaction_id &&
      !!transaction.cast_member_id &&
      transaction.commission_amount > 0 &&
      transaction.status === 'approved'
    );
  }

  /**
   * Filter valid transactions (approved only)
   */
  filterValidTransactions(transactions: RakutenTransaction[]): RakutenTransaction[] {
    return transactions.filter((txn) => this.validateTransaction(txn));
  }

  /**
   * Set custom platform split percentage
   */
  setPlatformSplitPercentage(percentage: number): void {
    if (percentage < 0 || percentage > 1) {
      throw new Error('Platform split percentage must be between 0 and 1');
    }
    this.platformSplitPercentage = percentage;
  }

  /**
   * Get current platform split percentage
   */
  getPlatformSplitPercentage(): number {
    return this.platformSplitPercentage;
  }
}

// Singleton instance
export const rakutenReconciliationService = new RakutenReconciliationService();
