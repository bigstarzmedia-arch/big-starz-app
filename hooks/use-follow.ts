import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface FollowState {
  [userId: string]: boolean;
}

/**
 * Hook for managing follow/unfollow state
 * Provides real-time state updates without page reload
 */
export function useFollow() {
  const [followState, setFollowState] = useState<FollowState>({});

  const isFollowing = useCallback((userId: string): boolean => {
    return followState[userId] ?? false;
  }, [followState]);

  const toggleFollow = useCallback(
    async (userId: string, creatorName: string) => {
      const currentState = followState[userId] ?? false;
      const newState = !currentState;

      // Optimistic update
      setFollowState((prev) => ({
        ...prev,
        [userId]: newState,
      }));

      // Haptic feedback
      if (Platform.OS !== 'web') {
        if (newState) {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success as any
          );
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light as any);
        }
      }

      // API call (placeholder)
      try {
        const response = await fetch('/api/trpc/user.toggleFollow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUserId: userId,
            action: newState ? 'follow' : 'unfollow',
          }),
        });

        if (!response.ok) {
          // Revert on error
          setFollowState((prev) => ({
            ...prev,
            [userId]: currentState,
          }));
        }
      } catch (error) {
        console.error('Follow/unfollow error:', error);
        // Revert on error
        setFollowState((prev) => ({
          ...prev,
          [userId]: currentState,
        }));
      }
    },
    [followState]
  );

  const followMultiple = useCallback(
    async (userIds: string[]) => {
      // Batch follow operation
      const updates: FollowState = {};
      userIds.forEach((id) => {
        updates[id] = true;
      });

      setFollowState((prev) => ({
        ...prev,
        ...updates,
      }));

      try {
        await fetch('/api/trpc/user.followMultiple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds }),
        });
      } catch (error) {
        console.error('Batch follow error:', error);
      }
    },
    []
  );

  const unfollowMultiple = useCallback(
    async (userIds: string[]) => {
      // Batch unfollow operation
      const updates: FollowState = {};
      userIds.forEach((id) => {
        updates[id] = false;
      });

      setFollowState((prev) => ({
        ...prev,
        ...updates,
      }));

      try {
        await fetch('/api/trpc/user.unfollowMultiple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds }),
        });
      } catch (error) {
        console.error('Batch unfollow error:', error);
      }
    },
    []
  );

  return {
    isFollowing,
    toggleFollow,
    followMultiple,
    unfollowMultiple,
    followState,
  };
}
