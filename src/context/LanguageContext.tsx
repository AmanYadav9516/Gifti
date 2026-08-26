import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Occasion, GiftType, WorldTheme, MessageTone } from '../types/gift';

interface Translations {
  appName: string;
  tagline: string;
  byBrand: string;
  headerCreate: string;
  headerPreview: string;
  headerLanguage: string;
  stepOccasion: string;
  stepGift: string;
  stepWorld: string;
  stepMessage: string;
  stepVoice: string;
  stepPhotos: string;
  stepSurpriseOptions: string;
  
  // Occasions
  occasions: Record<Occasion, string>;
  
  // Gifts
  gifts: Record<GiftType, { name: string; desc: string }>;
  
  // Worlds
  worlds: Record<WorldTheme, { name: string; desc: string }>;
  
  // Tones
  tones: Record<MessageTone, string>;
  
  // Sender Studio
  senderNameLabel: string;
  senderNamePlaceholder: string;
  receiverNameLabel: string;
  receiverNamePlaceholder: string;
  aiPromptLabel: string;
  aiPromptPlaceholder: string;
  aiGenerateBtn: string;
  aiGenerating: string;
  aiToneLabel: string;
  quickIdeas: string;
  voiceNoteTitle: string;
  voiceNoteDesc: string;
  recordStart: string;
  recordStop: string;
  recordPlay: string;
  recordDelete: string;
  recordingActive: string;
  photosTitle: string;
  photosDesc: string;
  mysteryEnvelopeToggle: string;
  mysteryEnvelopeDesc: string;
  magicScratchToggle: string;
  magicScratchDesc: string;
  secondGiftToggle: string;
  secondGiftDesc: string;
  generateGiftBtn: string;
  
  // Receiver Journey
  waitASec: string;
  someoneThought: string;
  tapToStart: string;
  scratchToReveal: string;
  mysteryEnvelopePrompt: string;
  tapToOpenEnvelope: string;
  readyPrompt: string;
  openGiftBtn: string;
  tapRosePrompt: string;
  tapCakePrompt: string;
  tapRakhiPrompt: string;
  tapChocolatePrompt: string;
  listenVoiceNote: string;
  sweetMemories: string;
  personalLetterFrom: string;
  secondGiftAlert: string;
  openSecondGiftBtn: string;
  
  // Marketing & Share
  shareTitle: string;
  shareSubtitle: string;
  shareWhatsApp: string;
  shareSMS: string;
  copyLink: string;
  linkCopied: string;
  scanQR: string;
  madeWithLove: string;
  viralTitle: string;
  viralSubtitle: string;
  createYourOwnBtn: string;
  downloadApkBtn: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'Gifti',
    tagline: 'Heart-Touching Digital Moments',
    byBrand: 'BY AAYU SOLUTION',
    headerCreate: 'Create Gift',
    headerPreview: 'Preview',
    headerLanguage: 'Language',
    stepOccasion: '1. Select Occasion',
    stepGift: '2. Choose Interactive Gift',
    stepWorld: '3. Select Cinematic Atmosphere',
    stepMessage: '4. Heartfelt Message & AI Writer',
    stepVoice: '5. Voice Note (Optional)',
    stepPhotos: '6. Memory Album (Optional)',
    stepSurpriseOptions: '7. Magical Surprise Add-ons',
    
    occasions: {
      rakhi: '🎀 Rakhi / रक्षाबंधन',
      birthday: '🎂 Birthday',
      love: '❤️ Love & Romance',
      sister: '👩 Beloved Sister',
      brother: '👨 Dear Brother',
      friendship: '🫂 True Friendship',
      congratulations: '🎉 Congratulations',
      thankyou: '💐 Heartfelt Thanks',
      anniversary: '💍 Happy Anniversary',
    },
    
    gifts: {
      rose: { name: 'Magic Blooming Rose', desc: 'Touch to scatter flying romantic petals' },
      giftbox: { name: 'Mystery Shaking Box', desc: 'Interactive box that shakes & explodes confetti' },
      chocolate: { name: 'Sweet Chocolate Box', desc: 'Delicious interactive unwrap & bite experience' },
      cake: { name: 'Birthday Cake', desc: 'Blow into mic or tap candle to extinguish & launch fireworks' },
      ring: { name: 'Sparkling Diamond Ring', desc: 'Dazzling light shimmer & eternal commitment' },
      rakhi: { name: 'Sacred Golden Rakhi', desc: 'Divine traditional glow with sacred blessing aura' },
      flowers: { name: 'Lush Flower Bouquet', desc: 'Vibrant blooming floral wonderland' },
    },
    
    worlds: {
      galaxy: { name: 'Deep Galaxy & Stars', desc: 'Cosmic glowing stars and nebulae' },
      rosegarden: { name: 'Enchanted Rose Garden', desc: 'Soft falling petals and warm twilight' },
      rainy: { name: 'Cozy Rainy Window', desc: 'Peaceful rain droplets & soothing vibe' },
      mountain: { name: 'Golden Mountain Sunrise', desc: 'Calming sunrise rays & gentle breeze' },
      christmas: { name: 'Sparkling Holiday / Snow', desc: 'Warm fairy lights & magical snowfall' },
      festive: { name: 'Royal Indian Festive', desc: 'Golden diyas, rangoli light & celebration' },
    },
    
    tones: {
      emotional: '💖 Emotional & Touching',
      funny: '😂 Funny & Teasing',
      cute: '🥰 Cute & Sweet',
      romantic: '🌹 Deeply Romantic',
      poetic: '✨ Poetic / Shayari',
      deep: '🌌 Deep & Meaningful',
      short: '⚡ Short & Sweet',
    },
    
    senderNameLabel: 'Your Name (Sender)',
    senderNamePlaceholder: 'e.g. Aman, Priya, Rahul',
    receiverNameLabel: "Recipient's Name",
    receiverNamePlaceholder: 'e.g. Diya, Rohan, Sister',
    aiPromptLabel: 'AI Smart Message Writer (Hindi / English)',
    aiPromptPlaceholder: 'e.g. "My sister always fights for TV remote but she is my biggest supporter" or "Happy 21st birthday to my best friend"',
    aiGenerateBtn: '✨ Generate with Gemini AI',
    aiGenerating: 'Writing heartfelt words...',
    aiToneLabel: 'Select Tone / Vibe:',
    quickIdeas: 'Quick Ideas:',
    voiceNoteTitle: 'Voice Message inside the Gift',
    voiceNoteDesc: 'Record 10–30s of your real voice. When they open the gift, hearing your voice will melt their heart.',
    recordStart: 'Start Recording Voice',
    recordStop: 'Stop Recording',
    recordPlay: 'Listen Preview',
    recordDelete: 'Remove Voice Note',
    recordingActive: 'Recording... Speak now 🎙️',
    photosTitle: 'Cinematic Memory Album (1–5 Photos)',
    photosDesc: 'Upload photos of your favorite memories. They will glide smoothly across the screen like a movie.',
    mysteryEnvelopeToggle: '💌 Add Wax-Sealed Mystery Envelope First',
    mysteryEnvelopeDesc: 'Receiver must break the glowing wax seal before seeing the main surprise.',
    magicScratchToggle: '✨ Add Magic Finger-Scratch Glow Reveal',
    magicScratchDesc: 'Receiver moves their finger across a dark starry screen to reveal a secret quote.',
    secondGiftToggle: '🎁 Add Hidden Second Gift ("Wait, there is more!")',
    secondGiftDesc: 'Creates a multi-step story reveal that keeps them guessing.',
    generateGiftBtn: '✨ Create & Share Magical Gift',
    
    waitASec: 'Hey… wait a second… ✨',
    someoneThought: 'Someone special thought of you today ❤️',
    tapToStart: 'Tap anywhere to begin your journey',
    scratchToReveal: 'Move your finger on the screen to reveal the magic...',
    mysteryEnvelopePrompt: 'You have received a sealed confidential letter...',
    tapToOpenEnvelope: 'Tap the Wax Seal to Open 💌',
    readyPrompt: 'Are you ready for your surprise?',
    openGiftBtn: 'OPEN SURPRISE 🎁',
    tapRosePrompt: 'Tap or swipe the rose to scatter petals 🌹',
    tapCakePrompt: 'Tap the candle to blow it out & celebrate! 🎂',
    tapRakhiPrompt: 'Tap the Rakhi to receive sacred blessings 🎀',
    tapChocolatePrompt: 'Tap the chocolate for a sweet bite 🍫',
    listenVoiceNote: 'Tap to hear their voice message 🔊',
    sweetMemories: 'Cherished Moments & Memories 📸',
    personalLetterFrom: 'A Personal Message For You',
    secondGiftAlert: 'Did you really think that was all? 😏',
    openSecondGiftBtn: 'Open Second Surprise ✨',
    
    shareTitle: 'Your Gift is Ready to Share! 🎁',
    shareSubtitle: 'Send this magical link to your loved one. It opens instantly in any browser without needing to download anything!',
    shareWhatsApp: 'Share on WhatsApp 📲',
    shareSMS: 'Send via SMS 💬',
    copyLink: 'Copy Gift Link 🔗',
    linkCopied: 'Link Copied to Clipboard! 🎉',
    scanQR: 'Scan QR Code 📱',
    madeWithLove: 'Crafted with ❤️ by AAYU SOLUTION',
    viralTitle: 'Touched by this gift? ❤️',
    viralSubtitle: 'Create your own heart-touching digital gift or download the official Gifti Android APK for endless surprises!',
    createYourOwnBtn: '✨ Make a Gift for Someone Special',
    downloadApkBtn: '📲 Download Gifti Android APK',
  },
  
  hi: {
    appName: 'Gifti',
    tagline: 'दिलों को छू लेने वाले डिजिटल लम्हे',
    byBrand: 'BY AAYU SOLUTION',
    headerCreate: 'गिफ्ट बनाएं',
    headerPreview: 'पूर्वावलोकन',
    headerLanguage: 'भाषा / Language',
    stepOccasion: '१. अवसर चुनें (Occasion)',
    stepGift: '२. मनपसंद गिफ्ट चुनें',
    stepWorld: '३. जादुई माहौल (World) चुनें',
    stepMessage: '४. दिल से संदेश व AI राइटर',
    stepVoice: '५. अपनी आवाज़ में संदेश (वैकल्पिक)',
    stepPhotos: '६. यादों का एल्बम (फोटो)',
    stepSurpriseOptions: '७. जादुई सरप्राइज फीचर्स',
    
    occasions: {
      rakhi: '🎀 रक्षाबंधन / राखी',
      birthday: '🎂 जन्मदिन (Birthday)',
      love: '❤️ प्यार और इज़हार',
      sister: '👩 प्यारी बहना (Sister)',
      brother: '👨 लाडला भाई (Brother)',
      friendship: '🫂 सच्ची दोस्ती (Friendship)',
      congratulations: '🎉 हार्दिक बधाई',
      thankyou: '💐 दिल से शुक्रिया',
      anniversary: '💍 सालगिरह (Anniversary)',
    },
    
    gifts: {
      rose: { name: 'जादुई खिलता गुलाब', desc: 'छूने पर उड़ती हुई पंखुड़ियों का अहसास' },
      giftbox: { name: 'रहस्यमयी हिलता हुआ बॉक्स', desc: 'हिलता हुआ डिब्बा जो खुलते ही रोशनी और कंफ़ेद्दी बिखेरता है' },
      chocolate: { name: 'मीठी चॉकलेट', desc: 'खोलने और मिठास घोलने वाला अनोखा अनुभव' },
      cake: { name: 'बर्थडे स्पेशल केक', desc: 'मोमबत्ती पर फूंक मारें या टैप करें और आतिशबाजी देखें' },
      ring: { name: 'चमकती डायमंड रिंग', desc: 'अटूट रिश्ते और प्यार की चमक' },
      rakhi: { name: 'पवित्र सुनहरी राखी', desc: 'पारंपरिक सुरक्षा का धागा और दिव्य आशीर्वाद' },
      flowers: { name: 'खूबसूरत फूलों का गुलदस्ता', desc: 'खिलते हुए फूलों की महक' },
    },
    
    worlds: {
      galaxy: { name: 'तारों भरी गैलेक्सी', desc: 'चमकते सितारे और ब्रह्मांड की सुंदरता' },
      rosegarden: { name: 'गुलाबों का बगीचा', desc: 'धीमी-धीमी गिरती पंखुड़ियां और गुलाबी शाम' },
      rainy: { name: 'बारिश की खिड़की', desc: 'शीशे पर पानी की बूंदें और सुकून भरा अहसास' },
      mountain: { name: 'पहाड़ों का सूर्योदय', desc: 'सुनहरी धूप और ताज़ी हवा' },
      christmas: { name: 'बर्फबारी और रोशनी', desc: 'क्रिसमस की जगमगाती लाइट्स और गिरती बर्फ' },
      festive: { name: 'शाही भारतीय उत्सव', desc: 'जगमगाते दीये और रंगोली की आभा' },
    },
    
    tones: {
      emotional: '💖 भावुक व दिल को छूने वाला',
      funny: '😂 मज़ाकिया व छेड़छाड़ वाला',
      cute: '🥰 प्यारा और मासूम',
      romantic: '🌹 गहरा रोमांटिक',
      poetic: '✨ शायराना / कविता',
      deep: '🌌 गहरा और अर्थपूर्ण',
      short: '⚡ छोटा और मीठा',
    },
    
    senderNameLabel: 'आपका नाम (भेजने वाला)',
    senderNamePlaceholder: 'उदा. अमन, राहुल, प्रिया',
    receiverNameLabel: 'पाने वाले का नाम',
    receiverNamePlaceholder: 'उदा. दीया, गुड़िया, भाई',
    aiPromptLabel: 'AI स्मार्ट मैसेज राइटर (हिन्दी / English)',
    aiPromptPlaceholder: 'उदा. "मेरी बहन मुझसे बहुत लड़ती है लेकिन मैं उससे बहुत प्यार करता हूँ" या "मेरे बेस्ट फ्रेंड को जन्मदिन की बधाई"',
    aiGenerateBtn: '✨ Gemini AI से दिल छूने वाला संदेश लिखें',
    aiGenerating: 'खूबसूरत शब्द लिखे जा रहे हैं...',
    aiToneLabel: 'संदेश का मिज़ाज (Tone) चुनें:',
    quickIdeas: 'त्वरित विचार:',
    voiceNoteTitle: 'गिफ्ट में अपनी आवाज़ का जादू जोड़ें',
    voiceNoteDesc: '10–30 सेकंड का वॉयस मैसेज रिकॉर्ड करें। जब वो गिफ्ट खोलेंगे तो आपकी आवाज़ सुनकर खुश हो जाएंगे।',
    recordStart: 'आवाज़ रिकॉर्ड करना शुरू करें',
    recordStop: 'रिकॉर्डिंग रोकें',
    recordPlay: 'सुनकर देखें',
    recordDelete: 'रिकॉर्डिंग हटाएं',
    recordingActive: 'रिकॉर्डिंग जारी है... बोलिए 🎙️',
    photosTitle: 'यादों का फोटो एल्बम (1–5 फोटो)',
    photosDesc: 'अपनी पसंदीदा तस्वीरें जोड़ें जो स्क्रीन पर एक खूबसूरत फिल्म की तरह चलेंगी।',
    mysteryEnvelopeToggle: '💌 पहले सीलबंद रहस्यमयी लिफाफा दिखाएं',
    mysteryEnvelopeDesc: 'गिफ्ट देखने से पहले मोहर तोड़कर लिफाफा खोलना होगा।',
    magicScratchToggle: '✨ जादुई उंगली से चमकती रोशनी का रहस्य जोड़ें',
    magicScratchDesc: 'स्क्रीन पर उंगली घुमाने से छिपा हुआ जादुई संदेश चमकेगा।',
    secondGiftToggle: '🎁 एक और छुपा हुआ दूसरा गिफ्ट जोड़ें ("रुको, अभी और भी है!")',
    secondGiftDesc: 'उन्हें चौंकाने के लिए एक के बाद एक दो उपहार।',
    generateGiftBtn: '✨ जादुई गिफ्ट बनाएं और शेयर करें',
    
    waitASec: 'अरे… ज़रा एक पल रुकिए… ✨',
    someoneThought: 'आज किसी खास ने आपको दिल से याद किया है ❤️',
    tapToStart: 'शुरू करने के लिए स्क्रीन पर कहीं भी टैप करें',
    scratchToReveal: 'जादू देखने के लिए स्क्रीन पर उंगली घुमाएं...',
    mysteryEnvelopePrompt: 'आपके नाम एक खास सीलबंद पैगाम आया है...',
    tapToOpenEnvelope: 'मोहर दबाकर लिफाफा खोलें 💌',
    readyPrompt: 'क्या आप अपने सरप्राइज के लिए तैयार हैं?',
    openGiftBtn: 'सरप्राइज खोलें 🎁',
    tapRosePrompt: 'गुलाब को छुएं या स्वाइप करें और पंखुड़ियां उड़ाएं 🌹',
    tapCakePrompt: 'मोमबत्ती को बुझाने के लिए टैप करें और जश्न मनाएं! 🎂',
    tapRakhiPrompt: 'राखी को छूकर पवित्र स्नेह और रक्षा का आशीर्वाद लें 🎀',
    tapChocolatePrompt: 'चॉकलेट पर टैप करें और मिठास चखें 🍫',
    listenVoiceNote: 'उनकी आवाज़ सुनने के लिए टैप करें 🔊',
    sweetMemories: 'अनमोल यादें व खूबसूरत लम्हे 📸',
    personalLetterFrom: 'आपके लिए एक खास निजी संदेश',
    secondGiftAlert: 'क्या आपको लगा सिर्फ इतना ही था? 😏',
    openSecondGiftBtn: 'दूसरा सरप्राइज खोलें ✨',
    
    shareTitle: 'आपका जादुई गिफ्ट तैयार है! 🎁',
    shareSubtitle: 'यह लिंक अपने प्रियजन को भेजें। वे बिना कोई ऐप डाउनलोड किए किसी भी ब्राउज़र में इसे तुरंत देख सकते हैं!',
    shareWhatsApp: 'WhatsApp पर भेजें 📲',
    shareSMS: 'SMS द्वारा भेजें 💬',
    copyLink: 'गिफ्ट लिंक कॉपी करें 🔗',
    linkCopied: 'लिंक कॉपी हो गया! 🎉',
    scanQR: 'QR कोड स्कैन करें 📱',
    madeWithLove: 'Crafted with ❤️ by AAYU SOLUTION',
    viralTitle: 'क्या यह गिफ्ट आपको पसंद आया? ❤️',
    viralSubtitle: 'अपने अपनों के लिए ऐसा ही दिल छूने वाला गिफ्ट बनाएं या Gifti का ऑफिशियल Android APK डाउनलोड करें!',
    createYourOwnBtn: '✨ किसी खास के लिए गिफ्ट बनाएं',
    downloadApkBtn: '📲 Gifti Android APK डाउनलोड करें',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
