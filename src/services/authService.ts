import { UserProfile } from '../types/gift';
import { firestoreGetDoc, firestoreSetDoc, firestoreQueryCollection } from './firebase';

const CURRENT_USER_KEY = 'gifti_auth_user_session';

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80', // Emerald Mountain Nature
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=300&auto=format&fit=crop&q=80', // Luxury Supercar
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80', // Cosmic Galaxy
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&auto=format&fit=crop&q=80', // Snowy Mountain Starry Sky
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80', // Neon Sunset City
];

export function getRandomDefaultAvatar(): string {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}

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
 * Validates alphanumeric GIFTI ID: Must contain both letters and numbers
 */
export function validateGiftiIdFormat(rawId: string): { valid: boolean; error?: string } {
  const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  if (cleanId.length < 3) {
    return { valid: false, error: 'GIFTI ID must be at least 3 characters.' };
  }
  const hasLetter = /[a-z]/.test(cleanId);
  const hasNumber = /[0-9]/.test(cleanId);
  if (!hasLetter || !hasNumber) {
    return { valid: false, error: 'GIFTI ID must include both letters and numbers (e.g. aman95, gifti2026).' };
  }
  return { valid: true };
}

/**
 * Checks if a GIFTI ID is available (unique handle check)
 */
export async function checkGiftiIdAvailability(rawId: string): Promise<boolean> {
  const check = validateGiftiIdFormat(rawId);
  if (!check.valid) return false;

  const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  const existing = await firestoreGetDoc('gifti_ids', cleanId);
  return !existing;
}

/**
 * Registers a new user account with alphanumeric ID, bio, password, DOB, and smart default avatar
 */
export async function registerUserProfile(
  data: Omit<UserProfile, 'id' | 'createdAt' | 'inviteCount' | 'giftsSentCount' | 'giftsReceivedCount'> & { password?: string }
): Promise<UserProfile> {
  const validation = validateGiftiIdFormat(data.giftiId);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanGiftiId = data.giftiId.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  const newUser: UserProfile = {
    name: data.name,
    giftiId: cleanGiftiId,
    bio: data.bio || '✨ Member of Gifti World • Spreading joy and surprises!',
    passwordHash: data.password ? simpleHash(data.password) : undefined,
    dob: data.dob,
    gender: data.gender,
    phone: data.phone,
    city: data.city,
    district: data.district,
    state: data.state,
    country: data.country,
    avatarUrl: data.avatarUrl || getRandomDefaultAvatar(),
    following: [],
    followersCount: 0,
    id: userId,
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
    bio: newUser.bio,
    createdAt: Date.now(),
  });

  // 3. Cache session locally so user stays logged in
  saveUserSession(newUser);

  return newUser;
}

/**
 * Logs in with Gifti ID/Phone + Password
 */
export async function loginWithGiftiIdOrPhone(identifier: string, password?: string): Promise<UserProfile | null> {
  const clean = identifier.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();

  // Try Gifti ID registry first
  const idEntry = await firestoreGetDoc('gifti_ids', clean);
  let user: UserProfile | null = null;

  if (idEntry && idEntry.userId) {
    const userDoc = await firestoreGetDoc('users', String(idEntry.userId));
    if (userDoc) {
      user = userDoc as unknown as UserProfile;
    }
  }

  // Fallback search by mobile
  if (!user) {
    const allUsers = await firestoreQueryCollection('users');
    const found = allUsers.find((u) => u.phone === identifier || u.giftiId === clean);
    if (found) {
      user = found as unknown as UserProfile;
    }
  }

  if (user) {
    if (user.isBanned) {
      throw new Error('This account has been suspended by administrator.');
    }
    // Verify password if user has one set
    if (user.passwordHash && password) {
      if (user.passwordHash !== simpleHash(password)) {
        throw new Error('Incorrect password. Please try again.');
      }
    }
    saveUserSession(user);
    return user;
  }

  return null;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash);
}

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
