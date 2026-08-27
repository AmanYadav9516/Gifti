import LZString from 'lz-string';
import QRCode from 'qrcode';
import { GiftData } from '../types/gift';

export function encodeGiftToUrl(gift: GiftData): string {
  try {
    // Strip unnecessary runtime data to keep URL ultra-short
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
      p: gift.photos, // Now tiny ImgBB URLs
      e: gift.hasMysteryEnvelope ? 1 : 0,
      sc: gift.hasMagicScratch ? 1 : 0,
      s2: gift.hasSecondGift ? 1 : 0,
    };

    const json = JSON.stringify(lightweightGift);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}#g=${compressed}`;
  } catch (err) {
    console.error('Failed to compress gift:', err);
    return `${window.location.origin + window.location.pathname}#g_raw=${encodeURIComponent(JSON.stringify(gift))}`;
  }
}

export function decodeGiftFromUrl(): GiftData | null {
  try {
    const hash = window.location.hash;
    if (!hash) return null;

    if (hash.startsWith('#g=')) {
      const compressed = hash.replace('#g=', '');
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
      if (!decompressed) return null;
      const lw = JSON.parse(decompressed);

      return {
        id: 'gift_' + Date.now(),
        senderName: lw.s || '',
        receiverName: lw.r || '',
        relationship: lw.rel,
        occasion: lw.o || 'rakhi',
        giftType: lw.g || 'rose',
        secondaryGiftType: lw.g2,
        worldTheme: lw.w || 'galaxy',
        message: lw.m || '',
        senderVoiceNote: lw.vn,
        photos: lw.p || [],
        hasMysteryEnvelope: lw.e === 1,
        hasMagicScratch: lw.sc === 1,
        hasSecondGift: lw.s2 === 1,
        enableAmbientMusic: true,
        createdAt: Date.now(),
      };
    }

    // Support legacy format for backwards compatibility
    if (hash.startsWith('#gift=')) {
      const compressed = hash.replace('#gift=', '');
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
      if (!decompressed) return null;
      return JSON.parse(decompressed) as GiftData;
    }

    return null;
  } catch (err) {
    console.error('Failed to decode gift from URL:', err);
    return null;
  }
}

export function generateWhatsAppLink(giftUrl: string, receiverName: string, senderName: string, occasion: string): string {
  const text = `🎁 *Hey ${receiverName || 'there'}!* \n\n✨ *${senderName || 'Someone special'}* has sent you an interactive gift surprise for *${occasion.toUpperCase()}*!\n\n👇 *Tap to open your surprise:* \n${giftUrl}\n\n_Crafted on Gifti by AAYU SOLUTION_`;
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
