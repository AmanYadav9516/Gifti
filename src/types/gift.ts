export type Occasion = 
  | 'rakhi'
  | 'birthday'
  | 'love'
  | 'sister'
  | 'brother'
  | 'friendship'
  | 'congratulations'
  | 'thankyou'
  | 'anniversary';

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

export type Language = 'en' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  giftiId: string; // Unique, e.g. "aman_gifts"
  dob: string; // YYYY-MM-DD for 12:01 AM Birthday engine
  gender: 'male' | 'female' | 'other' | string;
  phone: string; // 100% private to user & admin
  city: string;
  district: string;
  state: string;
  country: string;
  avatarUrl: string;
  invitedBy?: string;
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
  mode: 'magic' | 'classic';
  privacy: 'friendly' | 'private_1h';
  expiresAt?: number; // timestamp for 1-hour auto-delete
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
  senderVoiceNote?: string; // base64 data url or sound reference
  photos?: string[]; // ImgBB cloud URLs
  hasMysteryEnvelope: boolean;
  hasMagicScratch: boolean;
  hasSecondGift: boolean;
  secondGiftMessage?: string;
  enableAmbientMusic: boolean;
  createdAt: number;
}
