import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkDailyQuota,
  wrapPromptWithAesthetic,
  generateFreeVideoWithQuota,
  getUserSubscriptionTier,
  upgradeUserTier,
} from "./free-tier";

describe("Free Tier Video Generation", () => {
  const testUserId = 12345;

  describe("wrapPromptWithAesthetic", () => {
    it("should inject master aesthetic into prompt", () => {
      const userPrompt = "A dancing robot";
      const result = wrapPromptWithAesthetic(userPrompt);

      expect(result).toContain("Cinematic 4K music video style");
      expect(result).toContain("high-end luxury aesthetic");
      expect(result).toContain("44-inch sleek blonde hair");
      expect(result).toContain("A dancing robot");
    });

    it("should preserve user prompt at the end", () => {
      const userPrompt = "A neon synthwave scene";
      const result = wrapPromptWithAesthetic(userPrompt);

      expect(result.endsWith(userPrompt)).toBe(true);
    });

    it("should create consistent output", () => {
      const userPrompt = "Test prompt";
      const result1 = wrapPromptWithAesthetic(userPrompt);
      const result2 = wrapPromptWithAesthetic(userPrompt);

      expect(result1).toBe(result2);
    });
  });

  describe("checkDailyQuota", () => {
    it("should return quota object with correct structure", async () => {
      const result = await checkDailyQuota(testUserId);

      expect(result).toHaveProperty("hasQuota");
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("resetTime");
      expect(typeof result.hasQuota).toBe("boolean");
      expect(typeof result.remaining).toBe("number");
      expect(result.resetTime instanceof Date).toBe(true);
    });

    it("should return true for hasQuota on first check", async () => {
      const result = await checkDailyQuota(testUserId);
      expect(result.hasQuota).toBe(true);
    });

    it("should return reset time in future", async () => {
      const result = await checkDailyQuota(testUserId);
      const now = new Date();
      expect(result.resetTime.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe("getUserSubscriptionTier", () => {
    it("should return valid tier string", async () => {
      const tier = await getUserSubscriptionTier(testUserId);
      expect(["free", "pro", "elite"]).toContain(tier);
    });
  });

  describe("upgradeUserTier", () => {
    it("should return true on successful upgrade", async () => {
      const result = await upgradeUserTier(testUserId, "pro");
      expect(typeof result).toBe("boolean");
    });

    it("should support pro tier upgrade", async () => {
      const result = await upgradeUserTier(testUserId, "pro");
      expect(result).toBe(true);
    });

    it("should support elite tier upgrade", async () => {
      const result = await upgradeUserTier(testUserId, "elite");
      expect(result).toBe(true);
    });
  });

  describe("generateFreeVideoWithQuota", () => {
    it("should return object with required properties", async () => {
      const prompt = "A beautiful cinematic scene with neon lights";
      const result = await generateFreeVideoWithQuota(testUserId, prompt);

      expect(result).toHaveProperty("success");
      expect(typeof result.success).toBe("boolean");

      if (result.success) {
        expect(result).toHaveProperty("videoId");
        expect(result).toHaveProperty("remainingQuota");
      } else {
        expect(result).toHaveProperty("error");
      }
    });
  });

  describe("Quota Validation", () => {
    it("should track remaining quota as non-negative", async () => {
      const quota = await checkDailyQuota(testUserId);
      expect(quota.remaining).toBeGreaterThanOrEqual(0);
    });

    it("should return valid remaining count for any tier", async () => {
      const quota = await checkDailyQuota(testUserId);
      // Valid counts: 0-3 (free), 0-50 (pro), 0-999 (elite)
      expect(quota.remaining).toBeGreaterThanOrEqual(0);
      expect(quota.remaining).toBeLessThanOrEqual(999);
    });
  });

  describe("Master Aesthetic Integration", () => {
    it("should maintain prompt quality after wrapping", () => {
      const userPrompt =
        "A professional CEO in a luxury office with golden accents";
      const wrapped = wrapPromptWithAesthetic(userPrompt);

      expect(wrapped.length).toBeGreaterThan(userPrompt.length);
      expect(wrapped).toContain("Cinematic");
      expect(wrapped).toContain("CEO");
    });

    it("should not duplicate user prompt", () => {
      const userPrompt = "A dancing figure";
      const wrapped = wrapPromptWithAesthetic(userPrompt);

      const matches = wrapped.split(userPrompt).length - 1;
      expect(matches).toBe(1);
    });
  });
});
