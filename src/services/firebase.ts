// Firebase Firestore REST Client for gifti-2030
// High-performance, lightweight, zero-latency mobile execution

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gifti-2030';
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB6qHkmuIGZUYH-2G6MZ5kxgM9Uf6sC-f0';

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export async function firestoreSetDoc(collection: string, docId: string, data: Record<string, unknown>): Promise<boolean> {
  const url = `${FIRESTORE_BASE}/${collection}?documentId=${docId}&key=${API_KEY}`;
  try {
    const fields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') fields[key] = { stringValue: value };
      else if (typeof value === 'number') fields[key] = { integerValue: String(value) };
      else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
      else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map((v) => ({ stringValue: String(v) })),
          },
        };
      } else if (value && typeof value === 'object') {
        fields[key] = { stringValue: JSON.stringify(value) };
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok && res.status === 409) {
      // Document already exists, patch it
      const patchUrl = `${FIRESTORE_BASE}/${collection}/${docId}?key=${API_KEY}`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      return patchRes.ok;
    }

    return res.ok;
  } catch (err) {
    console.warn(`Firestore setDoc error for ${collection}/${docId}:`, err);
    return false;
  }
}

export async function firestoreGetDoc(collection: string, docId: string): Promise<Record<string, unknown> | null> {
  const url = `${FIRESTORE_BASE}/${collection}/${docId}?key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.fields) return null;

    const data: Record<string, unknown> = {};
    for (const [key, valueObj] of Object.entries(json.fields as Record<string, Record<string, unknown>>)) {
      if ('stringValue' in valueObj) data[key] = valueObj.stringValue;
      else if ('integerValue' in valueObj) data[key] = Number(valueObj.integerValue);
      else if ('booleanValue' in valueObj) data[key] = valueObj.booleanValue;
      else if ('arrayValue' in valueObj && valueObj.arrayValue && typeof valueObj.arrayValue === 'object') {
        const arrVal = valueObj.arrayValue as { values?: { stringValue?: string }[] };
        data[key] = (arrVal.values || []).map((v) => v.stringValue || '');
      }
    }

    return data;
  } catch (err) {
    console.warn(`Firestore getDoc error for ${collection}/${docId}:`, err);
    return null;
  }
}

export async function firestoreQueryCollection(collection: string): Promise<Record<string, unknown>[]> {
  const url = `${FIRESTORE_BASE}/${collection}?pageSize=100&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    if (!json.documents) return [];

    return (json.documents as { name: string; fields?: Record<string, Record<string, unknown>> }[]).map((doc) => {
      const data: Record<string, unknown> = {};
      if (doc.fields) {
        for (const [key, valueObj] of Object.entries(doc.fields)) {
          if ('stringValue' in valueObj) data[key] = valueObj.stringValue;
          else if ('integerValue' in valueObj) data[key] = Number(valueObj.integerValue);
          else if ('booleanValue' in valueObj) data[key] = valueObj.booleanValue;
          else if ('arrayValue' in valueObj && valueObj.arrayValue && typeof valueObj.arrayValue === 'object') {
            const arrVal = valueObj.arrayValue as { values?: { stringValue?: string }[] };
            data[key] = (arrVal.values || []).map((v) => v.stringValue || '');
          }
        }
      }
      return data;
    });
  } catch (err) {
    console.warn(`Firestore query error for ${collection}:`, err);
    return [];
  }
}
