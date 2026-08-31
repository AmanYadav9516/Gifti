import { UserProfile } from '../types/gift';
import { firestoreSetDoc } from './firebase';
import { saveUserSession } from './authService';

export async function toggleFollowUser(
  currentUser: UserProfile,
  targetGiftiId: string
): Promise<{ isFollowing: boolean; updatedUser: UserProfile }> {
  const currentFollowing = currentUser.following || [];
  const exists = currentFollowing.includes(targetGiftiId);

  let newFollowing: string[];
  if (exists) {
    newFollowing = currentFollowing.filter((id) => id !== targetGiftiId);
  } else {
    newFollowing = [...currentFollowing, targetGiftiId];
  }

  const updatedUser: UserProfile = {
    ...currentUser,
    following: newFollowing,
  };

  // 1. Update in Firestore
  await firestoreSetDoc('users', currentUser.id, updatedUser as unknown as Record<string, unknown>);

  // 2. Update local session
  saveUserSession(updatedUser);

  return {
    isFollowing: !exists,
    updatedUser,
  };
}

export function isUserFollowing(currentUser: UserProfile, targetGiftiId: string): boolean {
  return (currentUser.following || []).includes(targetGiftiId);
}
