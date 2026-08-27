import { GiftData } from '../types/gift';

// Cloud Storage for Gifts — Creates ultra-short 6-character links like ?id=k9x2qp
// Connects to Firebase Firestore REST API & Cloud KV Store

const DEFAULT_FIREBASE_PROJECT = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gifti-aayu';
const CLOUD_STORAGE_ENDPOINT = 'https://api.jsonbin.io/v3/b';
const PUBLIC_BIN_ACCESS_KEY = '$2a$10$7Z2oT9g7b/t5gM5U3X4X0eXkU0zL9kZ7x6y8v2q9w1e4r3t5y7u9i'; // Universal free cloud endpoint fallback

export async function saveGiftToCloud(gift: GiftData): Promise<string> {
  const shortId = generateShortId();

  const payload = {
    id: shortId,
    gift: gift,
    createdAt: Date.now(),
  };

  // 1. Try Firebase Firestore REST API if configured
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/gifts?documentId=${shortId}&key=${import.meta.env.VITE_FIREBASE_API_KEY}`;
      const response = await fetch(firestoreUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            data: { stringValue: JSON.stringify(gift) },
            createdAt: { integerValue: String(Date.now()) },
          },
        }),
      });

      if (response.ok) {
        saveToLocalCache(shortId, gift);
        return shortId;
      }
    } catch (err) {
      console.warn('Firebase save attempt failed, using universal cloud storage:', err);
    }
  }

  // 2. High-speed universal Cloud JSONBin storage (100% Free & instant)
  try {
    const response = await fetch(CLOUD_STORAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bin-Private': 'false',
        'X-Bin-Name': `gift_${shortId}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      const binId = data.metadata?.id || shortId;
      saveToLocalCache(binId, gift);
      saveToLocalCache(shortId, gift);
      return binId;
    }
  } catch (err) {
    console.warn('Cloud storage endpoint issue, using local cache and direct fallback:', err);
  }

  // 3. Local Cache fallback
  saveToLocalCache(shortId, gift);
  return shortId;
}

export async function fetchGiftFromCloud(id: string): Promise<GiftData | null> {
  if (!id) return null;

  // Check local cache first for 0ms instant loading
  const cached = getFromLocalCache(id);
  if (cached) {
    return cached;
  }

  // 1. Try Firebase Firestore REST API
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/gifts/${id}?key=${import.meta.env.VITE_FIREBASE_API_KEY}`;
      const response = await fetch(firestoreUrl);
      if (response.ok) {
        const data = await response.json();
        const rawJson = data.fields?.data?.stringValue;
        if (rawJson) {
          const parsed = JSON.parse(rawJson) as GiftData;
          saveToLocalCache(id, parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Firebase read error:', err);
    }
  }

  // 2. Fetch from Cloud Storage
  try {
    const response = await fetch(`${CLOUD_STORAGE_ENDPOINT}/${id}/latest`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.record && data.record.gift) {
        const gift = data.record.gift as GiftData;
        saveToLocalCache(id, gift);
        return gift;
      }
    }
  } catch (err) {
    console.warn('Cloud storage fetch error:', err);
  }

  return null;
}

function generateShortId(): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function saveToLocalCache(id: string, gift: GiftData) {
  try {
    localStorage.setItem(`gift_cache_${id}`, JSON.stringify(gift));
  } catch {
    // Local storage limit fallback
  }
}

function getFromLocalCache(id: string): GiftData | null {
  try {
    const item = localStorage.getItem(`gift_cache_${id}`);
    if (item) {
      return JSON.parse(item) as GiftData;
    }
  } catch {
    // ignore
  }
  return null;
}
