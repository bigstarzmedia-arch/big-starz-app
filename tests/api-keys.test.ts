import { describe, it, expect, beforeAll } from "vitest";

/**
 * API Keys Validation Test
 * Verifies that all required API keys are configured and accessible
 */
describe("API Keys Configuration", () => {
  beforeAll(() => {
    // Ensure all required keys are set
    expect(process.env.OPENROUTER_API_KEY).toBeDefined();
    expect(process.env.ANTHROPIC_API_KEY).toBeDefined();
    expect(process.env.ELEVENLABS_API_KEY).toBeDefined();
    expect(process.env.GROK_API_KEY).toBeDefined();
  });

  it("should have OpenRouter API key configured", () => {
    const key = process.env.OPENROUTER_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key?.length).toBeGreaterThan(0);
  });

  it("should have Anthropic API key configured", () => {
    const key = process.env.ANTHROPIC_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key?.length).toBeGreaterThan(0);
  });

  it("should have ElevenLabs API key configured", () => {
    const key = process.env.ELEVENLABS_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key?.length).toBeGreaterThan(0);
  });

  it("should have Grok API key configured", () => {
    const key = process.env.GROK_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key?.length).toBeGreaterThan(0);
  });

  it("should validate OpenRouter API key format", async () => {
    const key = process.env.OPENROUTER_API_KEY;
    // OpenRouter keys typically start with "sk-"
    expect(key).toMatch(/^sk-/);
  });

  it("should validate Anthropic API key format", async () => {
    const key = process.env.ANTHROPIC_API_KEY;
    // Anthropic keys typically start with "sk-ant-"
    expect(key).toMatch(/^sk-ant-/);
  });

  it("should validate ElevenLabs API key format", async () => {
    const key = process.env.ELEVENLABS_API_KEY;
    // ElevenLabs keys typically start with "sk_" followed by alphanumeric
    expect(key).toMatch(/^sk_[a-zA-Z0-9]+$/);
  });

  it("should validate Grok API key format", async () => {
    const key = process.env.GROK_API_KEY;
    // Grok keys typically start with "xai-"
    expect(key).toMatch(/^xai-/);
  });
});
