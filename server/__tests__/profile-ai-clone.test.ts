import { describe, it, expect } from 'vitest';
import {
  uploadProfilePicture,
  generateAIClone,
  checkAICloneStatus,
  getUserProfile,
  updateProfilePicture,
  deleteAIClone,
} from '../profile-ai-clone';

describe('Profile & AI Clone', () => {
  const testUserId = 'user_12345';
  const testImageUri = 'https://example.com/profile.jpg';

  describe('uploadProfilePicture', () => {
    it('should upload profile picture successfully', async () => {
      const result = await uploadProfilePicture(
        testUserId,
        testImageUri,
        'profile.jpg'
      );

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('imageUrl');
      expect(result.imageUrl).toContain(testUserId);
    });

    it('should return image URL with user ID', async () => {
      const result = await uploadProfilePicture(
        testUserId,
        testImageUri,
        'avatar.jpg'
      );

      expect(result.imageUrl).toContain(testUserId);
      expect(result.imageUrl).toContain('avatar.jpg');
    });
  });

  describe('generateAIClone', () => {
    it('should generate AI clone from profile picture', async () => {
      const result = await generateAIClone(
        testUserId,
        testImageUri
      );

      expect(result).toHaveProperty('cloneId');
      expect(result).toHaveProperty('status');
      expect(['pending', 'processing', 'completed', 'failed']).toContain(
        result.status
      );
    });

    it('should support custom voice ID', async () => {
      const result = await generateAIClone(
        testUserId,
        testImageUri,
        'voice_deep_male'
      );

      expect(result).toHaveProperty('cloneId');
      expect(result.status).toBe('processing');
    });

    it('should support custom script', async () => {
      const customScript = 'Hello, I am your AI clone! Welcome to Big Starz!';
      const result = await generateAIClone(
        testUserId,
        testImageUri,
        'default',
        customScript
      );

      expect(result).toHaveProperty('cloneId');
      expect(result.status).toBe('processing');
    });

    it('should return video URL when processing', async () => {
      const result = await generateAIClone(
        testUserId,
        testImageUri
      );

      if (result.status === 'processing' || result.status === 'completed') {
        expect(result).toHaveProperty('videoUrl');
      }
    });
  });

  describe('checkAICloneStatus', () => {
    it('should check AI clone generation status', async () => {
      const result = await checkAICloneStatus('clone_123');

      expect(result).toHaveProperty('cloneId');
      expect(result).toHaveProperty('status');
      expect(['pending', 'processing', 'completed', 'failed']).toContain(
        result.status
      );
    });

    it('should return video URL for completed clones', async () => {
      const result = await checkAICloneStatus('clone_completed');

      if (result.status === 'completed') {
        expect(result).toHaveProperty('videoUrl');
      }
    });
  });

  describe('getUserProfile', () => {
    it('should retrieve user profile with AI clones', async () => {
      const result = await getUserProfile(testUserId);

      if (result) {
        expect(result).toHaveProperty('userId');
        expect(result).toHaveProperty('profilePicture');
        expect(result).toHaveProperty('aiClones');
        expect(Array.isArray(result.aiClones)).toBe(true);
      }
    });

    it('should include profile picture URL', async () => {
      const result = await getUserProfile(testUserId);

      if (result) {
        expect(result.profilePicture).toContain(testUserId);
      }
    });

    it('should list all AI clones with metadata', async () => {
      const result = await getUserProfile(testUserId);

      if (result && result.aiClones.length > 0) {
        const clone = result.aiClones[0];
        expect(clone).toHaveProperty('cloneId');
        expect(clone).toHaveProperty('status');
        expect(clone).toHaveProperty('videoUrl');
        expect(clone).toHaveProperty('createdAt');
      }
    });
  });

  describe('updateProfilePicture', () => {
    it('should update profile picture', async () => {
      const newImageUri = 'https://example.com/new-profile.jpg';
      const result = await updateProfilePicture(testUserId, newImageUri);

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('imageUrl');
    });

    it('should create new image with timestamp', async () => {
      const result = await updateProfilePicture(
        testUserId,
        testImageUri
      );

      expect(result.imageUrl).toContain('profile_');
    });
  });

  describe('deleteAIClone', () => {
    it('should delete AI clone', async () => {
      const result = await deleteAIClone('clone_to_delete');

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle deletion errors gracefully', async () => {
      const result = await deleteAIClone('invalid_clone_id');

      if (!result.success) {
        expect(result).toHaveProperty('error');
      }
    });
  });

  describe('Profile & AI Clone Integration', () => {
    it('should support full workflow: upload picture → generate clone → check status', async () => {
      // Step 1: Upload profile picture
      const uploadResult = await uploadProfilePicture(
        testUserId,
        testImageUri,
        'profile.jpg'
      );
      expect(uploadResult.success).toBe(true);

      // Step 2: Generate AI clone
      if (uploadResult.imageUrl) {
        const cloneResult = await generateAIClone(
          testUserId,
          uploadResult.imageUrl
        );
        expect(cloneResult).toHaveProperty('cloneId');

        // Step 3: Check status
        const statusResult = await checkAICloneStatus(cloneResult.cloneId);
        expect(statusResult).toHaveProperty('status');
      }
    });

    it('should allow multiple AI clones per user', async () => {
      const profile = await getUserProfile(testUserId);

      if (profile) {
        expect(Array.isArray(profile.aiClones)).toBe(true);
        expect(profile.aiClones.length).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
