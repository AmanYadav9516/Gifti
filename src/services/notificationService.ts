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

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch {
    return false;
  }
}

export function showGiftReceivedNotification(senderName: string, userName?: string) {
  sounds.playNotificationChime();
  const randomLine = EMOTIONAL_GIFT_LINES[Math.floor(Math.random() * EMOTIONAL_GIFT_LINES.length)];
  const title = `🎁 ${userName ? `Hey ${userName}!` : 'Surprise!'} From ${senderName}`;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: randomLine,
        icon: './icon.svg',
        badge: './icon.svg',
      });
    } catch {
      // Notification fallback
    }
  }
}

/**
 * Initializes the daily care schedule checks (Morning, Afternoon Water, Night)
 */
export function initDailyCareScheduler(userName: string) {
  // Check every hour
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
  }, 1000 * 60 * 15); // Every 15 minutes
}

function triggerDailyCareAlert(type: 'morning' | 'water' | 'night', userName: string) {
  sounds.playNotificationChime();
  const pool = DAILY_CARE_MESSAGES[type];
  const msg = pool[Math.floor(Math.random() * pool.length)];

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Gifti Daily Care • ${userName || 'Dearest One'}`, {
        body: msg,
        icon: './icon.svg',
      });
    } catch {
      // ignore
    }
  }
}
