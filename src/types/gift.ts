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

export interface GiftData {
  id: string;
  senderName: string;
  receiverName: string;
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
