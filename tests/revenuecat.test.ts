import { describe, it, expect } from 'vitest';

describe('RevenueCat API Integration', () => {
  it('should validate RevenueCat API key is set', () => {
    const apiKey = process.env.REVENUECAT_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^sk_/);
  });

  it('should have valid RevenueCat API key format', () => {
    const apiKey = process.env.REVENUECAT_API_KEY;
    // RevenueCat secret keys start with sk_
    expect(apiKey).toMatch(/^sk_[a-zA-Z0-9]+$/);
    expect(apiKey!.length).toBeGreaterThan(10);
  });

  it('should be able to construct RevenueCat headers', () => {
    const apiKey = process.env.REVENUECAT_API_KEY;
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    
    expect(headers['Authorization']).toBeDefined();
    expect(headers['Authorization']).toContain('sk_');
  });
});
