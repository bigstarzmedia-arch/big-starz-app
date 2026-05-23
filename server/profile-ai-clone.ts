import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || '';

export interface ProfileUploadRequest {
  userId: string;
  imageUri: string;
  imageName: string;
}

export interface AICloneRequest {
  userId: string;
  profileImageUri: string;
  voiceId?: string;
  script?: string;
}

export interface AICloneResponse {
  cloneId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

// UPLOAD PROFILE PICTURE
export async function uploadProfilePicture(
  userId: string,
  imageUri: string,
  imageName: string
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // In production, upload to S3 or cloud storage
    // For now, return a mock URL
    const imageUrl = `https://storage.bigstarz.app/profiles/${userId}/${imageName}`;

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('Profile upload error:', error);
    return {
      success: false,
      error: 'Failed to upload profile picture',
    };
  }
}

// GENERATE AI CLONE WITH HEYGEN
export async function generateAIClone(
  userId: string,
  profileImageUri: string,
  voiceId: string = 'default',
  script: string = 'Hello, I am your AI clone!'
): Promise<AICloneResponse> {
  try {
    // Step 1: Create avatar from profile image
    const avatarResponse = await axios.post(
      'https://api.heygen.com/v2/avatar/create',
      {
        name: `AI_Clone_${userId}`,
        image_url: profileImageUri,
      },
      {
        headers: {
          'X-Api-Key': HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const avatarId = avatarResponse.data.avatar_id;

    // Step 2: Generate video with avatar
    const videoResponse = await axios.post(
      'https://api.heygen.com/v2/video/generate',
      {
        avatar_id: avatarId,
        voice_id: voiceId,
        script,
        video_resolution: '1080p',
        background_color: '#000000',
      },
      {
        headers: {
          'X-Api-Key': HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      cloneId: videoResponse.data.video_id,
      status: 'processing',
      videoUrl: videoResponse.data.video_url,
    };
  } catch (error) {
    console.error('AI Clone generation error:', error);
    return {
      cloneId: '',
      status: 'failed',
      error: 'Failed to generate AI clone',
    };
  }
}

// CHECK AI CLONE STATUS
export async function checkAICloneStatus(
  cloneId: string
): Promise<AICloneResponse> {
  try {
    const response = await axios.get(
      `https://api.heygen.com/v1/video_status.get?video_id=${cloneId}`,
      {
        headers: {
          'X-Api-Key': HEYGEN_API_KEY,
        },
      }
    );

    return {
      cloneId,
      status: response.data.status,
      videoUrl: response.data.video_url,
    };
  } catch (error) {
    console.error('AI Clone status check error:', error);
    return {
      cloneId,
      status: 'failed',
      error: 'Failed to check AI clone status',
    };
  }
}

// GET USER PROFILE WITH AI CLONE
export async function getUserProfile(userId: string) {
  try {
    // In production, fetch from database
    return {
      userId,
      profilePicture: `https://storage.bigstarz.app/profiles/${userId}/profile.jpg`,
      aiClones: [
        {
          cloneId: `clone_${userId}_1`,
          status: 'completed',
          videoUrl: `https://storage.bigstarz.app/clones/${userId}/clone_1.mp4`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

// UPDATE PROFILE PICTURE
export async function updateProfilePicture(
  userId: string,
  newImageUri: string
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const imageName = `profile_${timestamp}.jpg`;

    return uploadProfilePicture(userId, newImageUri, imageName);
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Failed to update profile picture',
    };
  }
}

// DELETE AI CLONE
export async function deleteAIClone(
  cloneId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.delete(
      `https://api.heygen.com/v2/avatar/delete/${cloneId}`,
      {
        headers: {
          'X-Api-Key': HEYGEN_API_KEY,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Delete AI clone error:', error);
    return {
      success: false,
      error: 'Failed to delete AI clone',
    };
  }
}
