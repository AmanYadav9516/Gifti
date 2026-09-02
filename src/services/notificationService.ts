import { sounds } from './soundEffects';

const EMOTIONAL_GIFT_LINES = [
  '✨ ANY HEART TOUCHER REMEMBERED YOU: Someone who loves you sent a magical unboxing! 🎁',
  '🌹 A special memory just bloomed for you! Tap to open your heart-touching gift.',
  '🎂 A sweet surprise full of love and blessings is waiting for you! ✨',
  '💖 Someone held you close to their heart today. Unbox your magical moment!',
  '🌟 You received a surprise filled with precious thoughts and 3D magic!',
  '🫂 A warm hug packed into a digital gift just arrived for you!',
  '💫 Distance means so little when someone means so much. Open your gift now!',
];

const DAILY_CARE_MESSAGES = {
  morning: [
    '🌅 Good Morning! May your day be as bright, joyful, and magical as your smile. ✨',
    '☀️ Rise and shine! Today is a new canvas for beautiful memories. Have a wonderful day!',
    '🌸 A fresh morning blessing from Gifti: Shine bright and spread happiness today!',
  ],
  water: [
    '💧 Health Reminder: Have you drank water? Health is far more precious than anything in this world! Stay hydrated and energetic. 🥤',
    '🌿 Pause and take a sip of water! Your health and well-being matters to everyone who loves you. 💧',
  ],
  night: [
    '🌙 Good Night! Rest well with a peaceful mind and sweet dreams. Tomorrow brings new magic. ✨',
    '✨ As the stars shine tonight, remember you are deeply cherished. Sleep peacefully and recharge! 🌟',
  ],
};

export type InAppToastCallback = (toast: { title: string; body: string; icon?: string }) => void;
let inAppToastListener: InAppToastCallback | null = null;

export function registerInAppToastListener(cb: InAppToastCallback) {
  inAppToastListener = cb;
}

export function unregisterInAppToastListener() {
  inAppToastListener = null;
}

/**
 * Explicit user-triggered permission request (avoids browser auto-block)
 */
export async function triggerNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      sounds.playNotificationChime();
      showNotificationDirect('🔔 Magic Notifications Activated!', 'You will now receive instant alerts when someone sends you gifts, love notes, and daily care!');
    }
    return perm;
  } catch {
    return 'denied';
  }
}

export function showNotificationDirect(title: string, body: string) {
  sounds.playNotificationChime();

  // 1. In-App Floating Toast Banner
  if (inAppToastListener) {
    inAppToastListener({ title, body });
  }

  // 2. Browser System Notification if allowed
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: './icon.svg',
        badge: './icon.svg',
      });
    } catch {
      // ignore
    }
  }
}

export function showGiftReceivedNotification(senderName: string, userName?: string) {
  sounds.playNotificationChime();
  const randomLine = EMOTIONAL_GIFT_LINES[Math.floor(Math.random() * EMOTIONAL_GIFT_LINES.length)];
  const title = `🎁 ${userName ? `Hey ${userName}!` : 'Surprise!'} From ${senderName}`;
  showNotificationDirect(title, randomLine);
}

export function showChatMessageNotification(senderName: string, textSnippet: string) {
  sounds.playNotificationChime();
  const title = `🪄 New GIFTU Message from ${senderName}`;
  showNotificationDirect(title, textSnippet);
}

/**
 * Initializes the daily care schedule checks (Morning, Afternoon Water, Night)
 */
export function initDailyCareScheduler(userName: string) {
  setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    const todayStr = now.toDateString();

    const lastNotif = localStorage.getItem('gifti_last_daily_care_type');
    const lastDate = localStorage.getItem('gifti_last_daily_care_date');

    // 8:00 AM - Morning Inspiration
    if (hour === 8 && !(lastDate === todayStr && lastNotif === 'morning')) {
      triggerDailyCareAlert('morning', userName);
      localStorage.setItem('gifti_last_daily_care_type', 'morning');
      localStorage.setItem('gifti_last_daily_care_date', todayStr);
    }

    // 2:00 PM (14:00) - Water & Health Check
    if (hour === 14 && !(lastDate === todayStr && lastNotif === 'water')) {
      triggerDailyCareAlert('water', userName);
      localStorage.setItem('gifti_last_daily_care_type', 'water');
      localStorage.setItem('gifti_last_daily_care_date', todayStr);
    }

    // 10:00 PM (22:00) - Good Night
    if (hour === 22 && !(lastDate === todayStr && lastNotif === 'night')) {
      triggerDailyCareAlert('night', userName);
      localStorage.setItem('gifti_last_daily_care_type', 'night');
      localStorage.setItem('gifti_last_daily_care_date', todayStr);
    }
  }, 1000 * 60 * 15); // Check every 15 minutes
}

function triggerDailyCareAlert(type: 'morning' | 'water' | 'night', userName: string) {
  const pool = DAILY_CARE_MESSAGES[type];
  const msg = pool[Math.floor(Math.random() * pool.length)];
  showNotificationDirect(`Gifti Daily Care • ${userName || 'Dearest One'}`, msg);
}
