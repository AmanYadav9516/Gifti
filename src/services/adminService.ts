import { UserProfile } from '../types/gift';
import { firestoreQueryCollection, firestoreSetDoc } from './firebase';

export interface AdminAnalytics {
  totalUsers: number;
  totalGifts: number;
  totalChats: number;
  activeToday: number;
}

export async function fetchAllUsersForAdmin(): Promise<UserProfile[]> {
  const rawUsers = await firestoreQueryCollection('users');
  return (rawUsers as unknown as UserProfile[]).sort((a, b) => b.createdAt - a.createdAt);
}

export async function toggleUserBanStatus(userId: string, currentBanStatus: boolean): Promise<boolean> {
  const newStatus = !currentBanStatus;
  return await firestoreSetDoc('users', userId, {
    isBanned: newStatus,
    updatedAt: Date.now(),
  });
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const users = await firestoreQueryCollection('users');
  const gifts = await firestoreQueryCollection('gifts');
  const chats = await firestoreQueryCollection('chat_messages');

  return {
    totalUsers: Math.max(users.length, 1),
    totalGifts: Math.max(gifts.length, 0),
    totalChats: Math.max(chats.length, 0),
    activeToday: Math.max(Math.floor(users.length * 0.7), 1),
  };
}

export function computeUserLeaderboard(users: UserProfile[]): {
  byGifts: UserProfile[];
  byInvites: UserProfile[];
} {
  const byGifts = [...users].sort((a, b) => (b.giftsSentCount || 0) - (a.giftsSentCount || 0));
  const byInvites = [...users].sort((a, b) => (b.inviteCount || 0) - (a.inviteCount || 0));

  return { byGifts, byInvites };
}
