import { describe, it, expect } from 'vitest';

describe('Translation API Keys Validation', () => {
  it('should have OpenRouter or OpenAI API key configured', () => {
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const hasValidKeys = (openrouterKey && openrouterKey.length > 0) || (openaiKey && openaiKey.length > 0);

    expect(hasValidKeys).toBe(true);
  });

  it('should validate OpenRouter API key format', () => {
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (openrouterKey) {
      // OpenRouter keys typically start with 'sk-' or similar
      expect(openrouterKey.length).toBeGreaterThan(10);
    }
  });

  it('should validate OpenAI API key format', () => {
    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      // OpenAI keys typically start with 'sk-'
      expect(openaiKey.startsWith('sk-')).toBe(true);
      expect(openaiKey.length).toBeGreaterThan(20);
    }
  });

  it('should have at least one translation service available', () => {
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const hasAtLeastOne = (openrouterKey && openrouterKey.length > 0) || (openaiKey && openaiKey.length > 0);

    expect(hasAtLeastOne).toBe(true);
  });
});
