import LZString from 'lz-string';
import QRCode from 'qrcode';
import { GiftData } from '../types/gift';

export function encodeGiftToUrl(gift: GiftData): string {
  try {
    const json = JSON.stringify(gift);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}#gift=${compressed}`;
  } catch (err) {
    console.error('Failed to compress gift:', err);
    // Fallback base64
    const base64 = btoa(encodeURIComponent(JSON.stringify(gift)));
    return `${window.location.origin + window.location.pathname}#gift_raw=${base64}`;
  }
}

export function decodeGiftFromUrl(): GiftData | null {
  try {
    const hash = window.location.hash;
    if (!hash) return null;

    if (hash.startsWith('#gift=')) {
      const compressed = hash.replace('#gift=', '');
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
      if (!decompressed) return null;
      return JSON.parse(decompressed) as GiftData;
    }

    if (hash.startsWith('#gift_raw=')) {
      const raw = hash.replace('#gift_raw=', '');
      const json = decodeURIComponent(atob(raw));
      return JSON.parse(json) as GiftData;
    }

    return null;
  } catch (err) {
    console.error('Failed to decode gift from URL:', err);
    return null;
  }
}

export function generateWhatsAppLink(giftUrl: string, receiverName: string, senderName: string, occasion: string): string {
  const text = `🎁 *Hey ${receiverName || 'there'}!* \n\n✨ *${senderName || 'Someone special'}* has sent you a heart-touching interactive digital surprise for *${occasion.toUpperCase()}*!\n\n👇 *Tap to open your magical gift:* \n${giftUrl}\n\n_Crafted with ❤️ on Gifti by AAYU SOLUTION_`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateSmsLink(giftUrl: string, receiverName: string, senderName: string): string {
  const text = `🎁 Hey ${receiverName || 'there'}! ${senderName || 'Someone special'} sent you an interactive gift surprise: ${giftUrl} (By AAYU SOLUTION)`;
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
