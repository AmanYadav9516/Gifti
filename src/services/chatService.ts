import { ChatMessage, ReactionType } from '../types/gift';
import { firestoreGetDoc, firestoreSetDoc, firestoreQueryCollection } from './firebase';

export function getConversationId(giftiIdA: string, giftiIdB: string): string {
  const sorted = [giftiIdA.toLowerCase(), giftiIdB.toLowerCase()].sort();
  return `conv_${sorted[0]}_${sorted[1]}`;
}

/**
 * Sends a message with 24-hour normal auto-purge or 1-hour private auto-purge
 */
export async function sendChatMessage(msg: Omit<ChatMessage, 'id' | 'createdAt' | 'expiresAt'>): Promise<ChatMessage> {
  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const now = Date.now();

  // 1-Hour for private, 24-Hours for normal
  const expiresAt = msg.privacy === 'private_1h' 
    ? now + 60 * 60 * 1000 
    : now + 24 * 60 * 60 * 1000;

  const fullMessage: ChatMessage = {
    ...msg,
    id: msgId,
    expiresAt,
    createdAt: now,
  };

  // 1. Save to Firestore
  await firestoreSetDoc('chat_messages', msgId, fullMessage as unknown as Record<string, unknown>);

  // 2. Cache locally
  saveLocalMessage(fullMessage);

  return fullMessage;
}

/**
 * Sends up to 10 Memory Photos in Chat with 24-hour lifecycle
 */
export async function sendChatMemoryPhotos(
  conversationId: string,
  sender: { id: string; name: string; giftiId: string },
  receiverGiftiId: string,
  photos: string[]
): Promise<ChatMessage> {
  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours auto-delete

  const memoryMessage: ChatMessage = {
    id: msgId,
    conversationId,
    senderId: sender.id,
    senderName: sender.name,
    senderGiftiId: sender.giftiId,
    receiverGiftiId,
    text: `📸 Shared ${photos.length} Memory Moments ✨`,
    photos,
    mode: 'magic',
    privacy: 'friendly',
    expiresAt,
    createdAt: now,
  };

  await firestoreSetDoc('chat_messages', msgId, memoryMessage as unknown as Record<string, unknown>);
  saveLocalMessage(memoryMessage);

  return memoryMessage;
}

/**
 * Sends a Reaction Gift on a message
 */
export async function sendReactionGift(conversationId: string, msgId: string, reaction: ReactionType) {
  const doc = await firestoreGetDoc('chat_messages', msgId);
  if (doc) {
    await firestoreSetDoc('chat_messages', msgId, {
      ...doc,
      reaction,
    });
  }
}

/**
 * Synchronized Private Mode state (if either user switches, both switch)
 */
export async function setConversationPrivateMode(convId: string, isPrivate: boolean) {
  await firestoreSetDoc('conversation_states', convId, {
    isPrivate,
    updatedAt: Date.now(),
  });
}

export async function getConversationPrivateMode(convId: string): Promise<boolean> {
  const doc = await firestoreGetDoc('conversation_states', convId);
  return !!doc?.isPrivate;
}

let lastTypingTime = 0;

/**
 * REAL-TIME FIRESTORE TYPING STATUS (Debounced to avoid rapid request flooding)
 */
export async function setLiveTypingStatus(convId: string, giftiId: string, isTyping: boolean) {
  const now = Date.now();
  if (isTyping && now - lastTypingTime < 2000) {
    return; // Debounce 2 seconds
  }
  lastTypingTime = now;

  try {
    await firestoreSetDoc('conversation_typing', convId, {
      typingGiftiId: isTyping ? giftiId : '',
      timestamp: isTyping ? now : 0,
    });
  } catch {
    // ignore
  }
}

export async function getLiveTypingStatus(convId: string, oppositeGiftiId: string): Promise<boolean> {
  try {
    const doc = await firestoreGetDoc('conversation_typing', convId);
    if (!doc) return false;
    const isTarget = String(doc.typingGiftiId || '').toLowerCase() === oppositeGiftiId.toLowerCase();
    const isRecent = Date.now() - Number(doc.timestamp || 0) < 6000; // 6 seconds window
    return isTarget && isRecent;
  } catch {
    return false;
  }
}

/**
 * Fetches messages and cleans up both 24-hour and 1-hour expired messages
 */
export async function fetchConversationMessages(convId: string): Promise<ChatMessage[]> {
  const now = Date.now();

  const allDocs = await firestoreQueryCollection('chat_messages');
  const validMessages: ChatMessage[] = [];

  for (const doc of allDocs) {
    const msg = doc as unknown as ChatMessage;
    if (msg.conversationId === convId) {
      // Check auto-purge expiry
      if (msg.expiresAt && msg.expiresAt < now) {
        continue; // Auto-purged!
      }
      validMessages.push(msg);
    }
  }

  // Combine with local cache
  const localMsgs = getLocalMessages(convId);
  for (const lm of localMsgs) {
    if (!validMessages.some((m) => m.id === lm.id)) {
      if (!(lm.expiresAt && lm.expiresAt < now)) {
        validMessages.push(lm);
      }
    }
  }

  return validMessages.sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Checks for incoming messages for a specific user to trigger in-app notifications
 */
export async function checkIncomingMessagesForUser(myGiftiId: string, sinceTimestamp: number): Promise<ChatMessage[]> {
  try {
    const allDocs = await firestoreQueryCollection('chat_messages');
    const incoming: ChatMessage[] = [];
    const cleanMyId = myGiftiId.toLowerCase();

    for (const doc of allDocs) {
      const msg = doc as unknown as ChatMessage;
      if (
        msg.receiverGiftiId &&
        msg.receiverGiftiId.toLowerCase() === cleanMyId &&
        msg.createdAt > sinceTimestamp &&
        msg.senderGiftiId.toLowerCase() !== cleanMyId
      ) {
        incoming.push(msg);
      }
    }
    return incoming;
  } catch {
    return [];
  }
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
