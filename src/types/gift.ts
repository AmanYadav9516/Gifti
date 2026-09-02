export type Occasion = 
  | 'rakhi'
  | 'birthday'
  | 'love'
  | 'sister'
  | 'brother'
  | 'friendship'
  | 'congratulations'
  | 'thankyou'
  | 'anniversary'
  | 'engagement';

export type GiftType = 
  | 'rose'
  | 'giftbox'
  | 'chocolate'
  | 'cake'
  | 'ring'
  | 'rakhi'
  | 'flowers';

export type WorldTheme = 
  | 'galaxy'
  | 'rosegarden'
  | 'rainy'
  | 'mountain'
  | 'christmas'
  | 'festive';

export type ChatTheme = 
  | 'galaxy'
  | 'neon_rose'
  | 'cyber_dark'
  | 'sunset_gold';

export type MessageTone = 
  | 'emotional'
  | 'funny'
  | 'cute'
  | 'romantic'
  | 'poetic'
  | 'deep'
  | 'short';

export type MessageLength = 'short' | 'medium' | 'long';

export type Relationship = 
  | 'sister'
  | 'brother'
  | 'bestfriend'
  | 'friend'
  | 'girlfriend'
  | 'boyfriend'
  | 'crush'
  | 'wife'
  | 'husband'
  | 'mother'
  | 'father'
  | 'colleague'
  | 'special';

export type ReactionType = 
  | 'rose'
  | 'balloon'
  | 'confetti'
  | 'star'
  | 'hug'
  | 'coffee'
  | 'gift'
  | 'laugh';

export type Language = 'en' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  giftiId: string; // Unique alphanumeric, e.g. "aman9516"
  bio?: string; // Instagram-style profile description
  passwordHash?: string; // Secure password
  dob: string; // YYYY-MM-DD for 12:01 AM Birthday engine
  gender: 'male' | 'female' | 'other' | string;
  phone: string; // 100% private to user & admin
  city: string;
  district: string;
  state: string;
  country: string;
  avatarUrl: string;
  following?: string[]; // Array of Gifti IDs followed
  followersCount?: number;
  inviteCount: number;
  giftsSentCount: number;
  giftsReceivedCount: number;
  isBanned?: boolean;
  role?: 'user' | 'admin';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderGiftiId: string;
  receiverGiftiId: string;
  text: string;
  photos?: string[]; // Array of up to 10 photos for 3D Flying Memories
  mode: 'magic' | 'classic';
  privacy: 'friendly' | 'private_1h';
  reaction?: ReactionType;
  expiresAt?: number; // 1-hour for private, 24-hours for normal/photos
  createdAt: number;
}

export interface GiftData {
  id: string;
  senderName: string;
  senderGiftiId?: string;
  receiverName: string;
  receiverGiftiId?: string;
  relationship?: Relationship | string;
  occasion: Occasion;
  giftType: GiftType;
  secondaryGiftType?: GiftType;
  worldTheme: WorldTheme;
  customIntroText?: string;
  message: string;
  messageLength?: MessageLength;
  senderVoiceNote?: string;
  photos?: string[];
  hasMysteryEnvelope: boolean;
  hasMagicScratch: boolean;
  hasSecondGift: boolean;
  secondGiftMessage?: string;
  enableAmbientMusic: boolean;
  scheduledFor?: number; // Timestamp for 12:01 AM Time-Capsule surprise mode
  createdAt: number;
}

export interface FeedbackSubmission {
  id: string;
  userId: string;
  userName: string;
  giftiId: string;
  rating: number; // 1 to 5 stars
  feedback: string;
  createdAt: number;
}
