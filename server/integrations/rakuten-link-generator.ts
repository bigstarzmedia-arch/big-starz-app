/**
 * Rakuten Affiliate Link Generation Service
 * Generates tracking URLs with dynamic Sub-IDs for cast members
 */

interface LinkGenerationInput {
  cast_member_id: string;
  merchant_id: string;
  product_url: string;
}

interface GeneratedLink {
  cast_member_id: string;
  merchant_id: string;
  tracking_url: string;
  product_url: string;
  generated_at: Date;
}

export class RakutenLinkGenerator {
  private publisherId: string;
  private apiKey: string;

  constructor() {
    this.publisherId = process.env.RAKUTEN_PUBLISHER_ID || '';
    this.apiKey = process.env.RAKUTEN_API_KEY || '';

    if (!this.publisherId || !this.apiKey) {
      console.warn('Rakuten credentials not configured - link generation will be disabled');
    }
  }

  /**
   * Generate a tracking link with cast member Sub-ID
   * Format: https://click.linksynergy.com/deeplink?id=[Publisher_ID]&mid=[Merchant_ID]&murl=[Escaped_Product_URL]&u1=[Cast_Member_ID]
   */
  generateLink(input: LinkGenerationInput): GeneratedLink {
    const { cast_member_id, merchant_id, product_url } = input;

    // Validate inputs
    if (!cast_member_id || !merchant_id || !product_url) {
      throw new Error('Missing required fields: cast_member_id, merchant_id, product_url');
    }

    // Encode the product URL
    const encodedProductUrl = encodeURIComponent(product_url);

    // Build the tracking URL with u1 Sub-ID
    const trackingUrl = `https://click.linksynergy.com/deeplink?id=${this.publisherId}&mid=${merchant_id}&murl=${encodedProductUrl}&u1=${cast_member_id}`;

    return {
      cast_member_id,
      merchant_id,
      tracking_url: trackingUrl,
      product_url,
      generated_at: new Date(),
    };
  }

  /**
   * Generate multiple links for a cast member across different products
   */
  generateBulkLinks(
    cast_member_id: string,
    products: Array<{ merchant_id: string; product_url: string }>
  ): GeneratedLink[] {
    return products.map((product) =>
      this.generateLink({
        cast_member_id,
        merchant_id: product.merchant_id,
        product_url: product.product_url,
      })
    );
  }

  /**
   * Validate a tracking URL
   */
  validateTrackingUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;

      // Check required parameters
      return (
        params.has('id') &&
        params.has('mid') &&
        params.has('murl') &&
        params.has('u1') &&
        params.get('id') === this.publisherId
      );
    } catch {
      return false;
    }
  }

  /**
   * Extract cast member ID from tracking URL
   */
  extractCastMemberId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('u1');
    } catch {
      return null;
    }
  }

  /**
   * Extract merchant ID from tracking URL
   */
  extractMerchantId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('mid');
    } catch {
      return null;
    }
  }
}

// Singleton instance
export const rakutenLinkGenerator = new RakutenLinkGenerator();
