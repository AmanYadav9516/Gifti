import { ChatMessage } from '../types/gift';
import { firestoreGetDoc, firestoreSetDoc, firestoreQueryCollection } from './firebase';

export function getConversationId(giftiIdA: string, giftiIdB: string): string {
  const sorted = [giftiIdA.toLowerCase(), giftiIdB.toLowerCase()].sort();
  return `conv_${sorted[0]}_${sorted[1]}`;
}

/**
 * Sends a message with Magic/Classic mode & Private 1-Hour auto-expiration
 */
export async function sendChatMessage(msg: Omit<ChatMessage, 'id' | 'createdAt' | 'expiresAt'>): Promise<ChatMessage> {
  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const now = Date.now();
  const expiresAt = msg.privacy === 'private_1h' ? now + 60 * 60 * 1000 : undefined;

  const fullMessage: ChatMessage = {
    ...msg,
    id: msgId,
    expiresAt,
    createdAt: now,
  };

  // 1. Save message to Firestore collection
  await firestoreSetDoc('chat_messages', msgId, fullMessage as unknown as Record<string, unknown>);

  // 2. Cache in local storage for instant offline read
  saveLocalMessage(fullMessage);

  return fullMessage;
}

/**
 * Fetches conversation messages and filters out expired 1-hour private messages
 */
export async function fetchConversationMessages(convId: string): Promise<ChatMessage[]> {
  const now = Date.now();

  // 1. Read from Firestore
  const allDocs = await firestoreQueryCollection('chat_messages');
  const validMessages: ChatMessage[] = [];

  for (const doc of allDocs) {
    const msg = doc as unknown as ChatMessage;
    if (msg.conversationId === convId) {
      // Check if 1-hour private message has expired
      if (msg.privacy === 'private_1h' && msg.expiresAt && msg.expiresAt < now) {
        continue; // Filter out expired message!
      }
      validMessages.push(msg);
    }
  }

  // Also combine with local cache
  const localMsgs = getLocalMessages(convId);
  for (const lm of localMsgs) {
    if (!validMessages.some((m) => m.id === lm.id)) {
      if (!(lm.privacy === 'private_1h' && lm.expiresAt && lm.expiresAt < now)) {
        validMessages.push(lm);
      }
    }
  }

  return validMessages.sort((a, b) => a.createdAt - b.createdAt);
}

function saveLocalMessage(msg: ChatMessage) {
  try {
    const key = `local_chat_${msg.conversationId}`;
    const existing = getLocalMessages(msg.conversationId);
    existing.push(msg);
    localStorage.setItem(key, JSON.stringify(existing.slice(-50)));
  } catch {
    // ignore
  }
}

function getLocalMessages(convId: string): ChatMessage[] {
  try {
    const key = `local_chat_${convId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}
