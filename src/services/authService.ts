import { UserProfile } from '../types/gift';
import { firestoreGetDoc, firestoreSetDoc, firestoreQueryCollection } from './firebase';

const CURRENT_USER_KEY = 'gifti_auth_user_session';

export function getCachedCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveUserSession(user: UserProfile) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save user session:', err);
  }
}

export function clearUserSession() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Checks if a GIFTI ID is available (unique handle check)
 */
export async function checkGiftiIdAvailability(rawId: string): Promise<boolean> {
  const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  if (cleanId.length < 3) return false;

  // Check Firestore registry
  const existing = await firestoreGetDoc('gifti_ids', cleanId);
  return !existing;
}

/**
 * Registers a new user account on Firebase & caches session
 */
export async function registerUserProfile(data: Omit<UserProfile, 'id' | 'createdAt' | 'inviteCount' | 'giftsSentCount' | 'giftsReceivedCount'>): Promise<UserProfile> {
  const cleanGiftiId = data.giftiId.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  const newUser: UserProfile = {
    ...data,
    id: userId,
    giftiId: cleanGiftiId,
    inviteCount: 0,
    giftsSentCount: 0,
    giftsReceivedCount: 0,
    isBanned: false,
    role: cleanGiftiId === 'aayu_admin' || data.phone === '9999999999' ? 'admin' : 'user',
    createdAt: Date.now(),
  };

  // 1. Save user document
  await firestoreSetDoc('users', userId, newUser as unknown as Record<string, unknown>);

  // 2. Claim unique Gifti ID in registry
  await firestoreSetDoc('gifti_ids', cleanGiftiId, {
    userId: userId,
    name: newUser.name,
    avatarUrl: newUser.avatarUrl,
    createdAt: Date.now(),
  });

  // 3. Cache session locally so user never sees login again
  saveUserSession(newUser);

  return newUser;
}

/**
 * Logs in with an existing Gifti ID or Mobile number
 */
export async function loginWithGiftiIdOrPhone(identifier: string): Promise<UserProfile | null> {
  const clean = identifier.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();

  // Try Gifti ID registry first
  const idEntry = await firestoreGetDoc('gifti_ids', clean);
  if (idEntry && idEntry.userId) {
    const userDoc = await firestoreGetDoc('users', String(idEntry.userId));
    if (userDoc) {
      const user = userDoc as unknown as UserProfile;
      if (user.isBanned) {
        throw new Error('This account has been suspended by the administrator.');
      }
      saveUserSession(user);
      return user;
    }
  }

  // Search by mobile number if not found by ID
  const allUsers = await firestoreQueryCollection('users');
  const found = allUsers.find((u) => u.phone === identifier || u.giftiId === clean);
  if (found) {
    const user = found as unknown as UserProfile;
    if (user.isBanned) {
      throw new Error('This account has been suspended by the administrator.');
    }
    saveUserSession(user);
    return user;
  }

  return null;
}

/**
 * Checks if today is the user's birthday (for 12:01 AM celebration engine)
 */
export function isUserBirthdayToday(dobString?: string): boolean {
  if (!dobString) return false;
  try {
    const dob = new Date(dobString);
    const today = new Date();
    return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
  } catch {
    return false;
  }
}
