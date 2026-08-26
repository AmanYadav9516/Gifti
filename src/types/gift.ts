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

export type Language = 'en' | 'hi';

export interface GiftData {
  id: string;
  senderName: string;
  receiverName: string;
  relationship?: string;
  occasion: Occasion;
  giftType: GiftType;
  secondaryGiftType?: GiftType;
  worldTheme: WorldTheme;
  customIntroText?: string;
  message: string;
  senderVoiceNote?: string; // base64 data url or sound reference
  photos?: string[]; // base64 data urls or image links
  hasMysteryEnvelope: boolean;
  hasMagicScratch: boolean;
  hasSecondGift: boolean;
  secondGiftMessage?: string;
  enableAmbientMusic: boolean;
  createdAt: number;
}
