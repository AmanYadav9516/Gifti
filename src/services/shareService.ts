import LZString from 'lz-string';
import QRCode from 'qrcode';
import { GiftData } from '../types/gift';
import { saveGiftToCloud, fetchGiftFromCloud } from './cloudGiftService';

/**
 * Creates an ultra-short, reliable cloud-backed link for WhatsApp (e.g. https://.../?id=k9x2qp)
 */
export async function createShortGiftUrl(gift: GiftData): Promise<string> {
  const origin = window.location.origin + window.location.pathname;
  try {
    const cloudId = await saveGiftToCloud(gift);
    if (cloudId) {
      return `${origin}?id=${cloudId}`;
    }
  } catch (err) {
    console.warn('Cloud save failed, generating compact query:', err);
  }

  // Fallback to compact compressed URL
  return encodeGiftToFallbackUrl(gift);
}

export function encodeGiftToFallbackUrl(gift: GiftData): string {
  try {
    const lightweightGift = {
      s: gift.senderName,
      r: gift.receiverName,
      rel: gift.relationship,
      o: gift.occasion,
      g: gift.giftType,
      g2: gift.secondaryGiftType,
      w: gift.worldTheme,
      m: gift.message,
      vn: gift.senderVoiceNote,
      p: gift.photos,
      e: gift.hasMysteryEnvelope ? 1 : 0,
      sc: gift.hasMagicScratch ? 1 : 0,
      s2: gift.hasSecondGift ? 1 : 0,
    };

    const json = JSON.stringify(lightweightGift);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?g=${compressed}`;
  } catch {
    return window.location.href;
  }
}

/**
 * Parses gift data from the current browser URL (supports ?id=, #id=, ?g=, #g=)
 */
export async function loadGiftFromCurrentUrl(): Promise<GiftData | null> {
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;

  // 1. Check for Cloud ID parameter (?id= or #id=)
  const idFromSearch = searchParams.get('id');
  if (idFromSearch) {
    return await fetchGiftFromCloud(idFromSearch);
  }

  if (hash.startsWith('#id=')) {
    const idFromHash = hash.replace('#id=', '');
    return await fetchGiftFromCloud(idFromHash);
  }

  // 2. Check for compressed data (?g= or #g= or #gift=)
  const gFromSearch = searchParams.get('g');
  if (gFromSearch) {
    return decodeFromCompressedString(gFromSearch);
  }

  if (hash.startsWith('#g=')) {
    return decodeFromCompressedString(hash.replace('#g=', ''));
  }

  if (hash.startsWith('#gift=')) {
    return decodeFromCompressedString(hash.replace('#gift=', ''));
  }

  return null;
}

function decodeFromCompressedString(compressed: string): GiftData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);

    // Support lightweight format
    if (parsed.s || parsed.r || parsed.o) {
      return {
        id: 'gift_' + Date.now(),
        senderName: parsed.s || '',
        receiverName: parsed.r || '',
        relationship: parsed.rel,
        occasion: parsed.o || 'rakhi',
        giftType: parsed.g || 'rose',
        secondaryGiftType: parsed.g2,
        worldTheme: parsed.w || 'galaxy',
        message: parsed.m || '',
        senderVoiceNote: parsed.vn,
        photos: parsed.p || [],
        hasMysteryEnvelope: parsed.e === 1,
        hasMagicScratch: parsed.sc === 1,
        hasSecondGift: parsed.s2 === 1,
        enableAmbientMusic: true,
        createdAt: Date.now(),
      };
    }

    return parsed as GiftData;
  } catch (err) {
    console.error('Error decoding gift payload:', err);
    return null;
  }
}

export function generateWhatsAppLink(giftUrl: string, receiverName: string, senderName: string, occasion: string): string {
  const text = `🎁 *Hey ${receiverName || 'there'}!* \n\n✨ *${senderName || 'Someone special'}* has sent you a surprise for *${occasion.toUpperCase()}*!\n\n👇 *Tap to open your gift:* \n${giftUrl}\n\n_Crafted on Gifti by AAYU SOLUTION_`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateSmsLink(giftUrl: string, receiverName: string, senderName: string): string {
  const text = `🎁 Hey ${receiverName || 'there'}! ${senderName || 'Someone special'} sent you an interactive gift: ${giftUrl} (By AAYU SOLUTION)`;
  return `sms:?body=${encodeURIComponent(text)}`;
}

export async function generateQrCodeUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: {
        dark: '#FF4D6D',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
