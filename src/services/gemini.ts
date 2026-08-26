import { Language, MessageTone, Occasion } from '../types/gift';

// Configurable Gemini API key from environment or local storage
const getApiKey = (): string => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  const storedKey = localStorage.getItem('gifti_gemini_key');
  if (storedKey) return storedKey;
  return '';
};

export interface GenerateMessageParams {
  prompt?: string;
  senderName: string;
  receiverName: string;
  occasion: Occasion;
  tone: MessageTone;
  language: Language;
  apiKey?: string;
}

export async function generateHeartfeltMessage({
  prompt,
  senderName,
  receiverName,
  occasion,
  tone,
  language,
  apiKey,
}: GenerateMessageParams): Promise<string> {
  const keyToUse = apiKey || getApiKey();

  const languageInstruction = language === 'hi' 
    ? 'Write in pure, emotional Hindi (Devanagari script) with natural warmth and deep emotional expression.'
    : 'Write in natural, touching English (or mixed friendly Hinglish if festive).';

  const toneGuides: Record<MessageTone, string> = {
    emotional: 'Deeply heartfelt, emotional, touching the soul, expressing pure unconditional love and gratitude.',
    funny: 'Humorous, playful, friendly teasing, jokes about fights/remote/fun moments but ending with sweet love.',
    cute: 'Extremely sweet, innocent, cute, warm, like a warm hug with lovely emojis.',
    romantic: 'Romantic, passionate, poetic, praising their presence in life and promising eternal support.',
    poetic: 'In the form of a beautiful two-line or four-line Shayari / poem with rhythmic charm and depth.',
    deep: 'Philosophical, mature, discussing how rare and precious true bonds and moments are in this universe.',
    short: 'Crisp, powerful, 2-3 lines punchy and unforgettable.',
  };

  const systemPrompt = `You are Gifti AI, an expert emotional speech and card writer created by AAYU SOLUTION.
Your mission is to turn simple thoughts into breathtaking, memorable personal messages for greeting cards and digital gifts.

Sender Name: "${senderName || 'Someone who loves you'}"
Recipient Name: "${receiverName || 'Someone special'}"
Occasion: "${occasion}"
Tone: "${tone} - ${toneGuides[tone]}"
Language: "${languageInstruction}"
User's raw thought or idea: "${prompt || 'Write a memorable surprise message for this occasion'}"

Rules:
1. Make it sound genuine, human, and directly addressed from ${senderName || 'Sender'} to ${receiverName || 'Receiver'}.
2. Use suitable emojis naturally.
3. Keep the length around 3 to 6 lines (sweet and readable on mobile).
4. Do NOT include markdown headers, quotes around everything, or robotic conversational filler like "Here is your message:". Just return the exact heartfelt message directly.`;

  if (keyToUse) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 300,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (generatedText) {
          return generatedText;
        }
      }
    } catch (error) {
      console.warn('Gemini API call failed or network issue, using curated template:', error);
    }
  }

  // Graceful fallback with rich, emotional messages
  return getCuratedFallbackMessage({ senderName, receiverName, occasion, tone, language, prompt });
}

function getCuratedFallbackMessage({
  senderName,
  receiverName,
  occasion,
  tone,
  language,
  prompt,
}: {
  senderName: string;
  receiverName: string;
  occasion: Occasion;
  tone: MessageTone;
  language: Language;
  prompt?: string;
}): string {
  const to = receiverName || (language === 'hi' ? 'प्रिय' : 'Dearest');
  const from = senderName || (language === 'hi' ? 'आपका अपना' : 'Yours always');

  if (language === 'hi') {
    if (occasion === 'rakhi' || occasion === 'sister' || occasion === 'brother') {
      if (tone === 'funny') {
        return `मेरी प्यारी ${to},\nतू कितनी भी लड़ ले और रिमोट छुपा ले, लेकिन तेरे बिना ये घर बिल्कुल खाली है! 😂\nरक्षाबंधन की बहुत-बहुत बधाई मेरी सबसे क्यूट बहना! ❤️\n— ${from}`;
      }
      if (tone === 'poetic') {
        return `रेशम के धागों में बसा है प्यार हमारा,\nतू ही तो है मेरी दुनिया का सबसे चमकता सितारा! ✨\nरक्षाबंधन की ढेर सारी शुभकामनाएं ${to}! 🎀\n— ${from}`;
      }
      return `मेरी सबसे प्यारी ${to},\nचाहे हम कितने भी दूर हों, दिल हमेशा तुम्हारे पास रहता है। तुम्हारे हर सपने के साथ मेरा साथ हमेशा रहेगा। ❤️\nरक्षाबंधन की ढेरों शुभकामनाएं!\n— ${from}`;
    }

    if (occasion === 'birthday') {
      if (tone === 'poetic') {
        return `चांद सितारों से रोशन हो हर शाम तुम्हारी,\nखुशियों से भर जाए ये पूरी जिंदगी तुम्हारी! 🎂✨\nजन्मदिन की ढेर सारी शुभकामनाएं ${to}! 🎁\n— ${from}`;
      }
      return `जन्मदिन की बहुत-बहुत शुभकामनाएं ${to}! 🎂🎉\nईश्वर से प्रार्थना है कि ये साल आपकी जिंदगी में अनगिनत खुशियां, सफलता और प्यार लेकर आए। आप हमेशा ऐसे ही मुस्कुराते रहें! ❤️\n— ${from}`;
    }

    if (occasion === 'love' || occasion === 'anniversary') {
      return `मेरी जान ${to},\nतुमसे मिलकर जाना कि जिंदगी कितनी खूबसूरत हो सकती है। तुम्हारे साथ का हर एक पल मेरे लिए किसी सपने जैसा है। 🌹❤️\nहमेशा मेरे साथ रहना।\n— ${from}`;
    }

    return `प्यारी ${to},\nकुछ रिश्ते शब्दों से परे होते हैं, और आपका साथ मेरे लिए सबसे अनमोल तोहफा है। हमेशा ऐसे ही मुस्कुराते रहिए! ✨❤️\n— ${from}`;
  }

  // English fallback messages
  if (occasion === 'rakhi' || occasion === 'sister') {
    if (tone === 'funny') {
      return `Dearest ${to},\nYou annoy me more than anyone else in the whole world 😂 but honestly, life without your drama would be super boring!\nHappy Rakhi to my favorite troublemaker! ❤️\n— ${from}`;
    }
    return `To the sweetest sister ${to},\nSome people make the world brighter simply by being in it. Thank you for always having my back and being my pillar of strength. 🎀✨\nHappy Rakhi with all my love!\n— ${from}`;
  }

  if (occasion === 'birthday') {
    if (tone === 'poetic') {
      return `May stars align to light your way,\nAnd joy surround you every day! 🌟🎂\nWishing you a magical and unforgettable Birthday, dearest ${to}!\n— ${from}`;
    }
    return `Happy Birthday to the most amazing ${to}! 🎂✨\nI hope this year brings you infinite laughter, grand adventures, and all the happiness you truly deserve. Keep shining bright! ❤️\n— ${from}`;
  }

  if (occasion === 'love' || occasion === 'anniversary') {
    return `My dearest ${to},\nEvery single day with you feels like a beautiful dream come true. You are my home, my peace, and my greatest blessing. 🌹❤️\nForever and always,\n— ${from}`;
  }

  return `Dearest ${to},\nJust wanted to remind you how special you are to me. Life is so much more beautiful with you in it! ✨❤️\nWith all my love,\n— ${from}`;
}
