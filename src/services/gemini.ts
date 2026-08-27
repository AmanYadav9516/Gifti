import { Language, MessageTone, Occasion, Relationship, MessageLength } from '../types/gift';

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
  relationship?: Relationship | string;
  occasion: Occasion;
  tone: MessageTone;
  lengthOption?: MessageLength;
  language: Language;
  apiKey?: string;
}

export interface GeneratedOptions {
  options: string[];
}

export async function generateHeartfeltMessageOptions({
  prompt,
  senderName,
  receiverName,
  relationship = 'special',
  occasion,
  tone,
  lengthOption = 'medium',
  language,
  apiKey,
}: GenerateMessageParams): Promise<string[]> {
  const keyToUse = apiKey || getApiKey();

  const languageInstruction = language === 'hi' 
    ? 'Write in natural, pure, heartwarming Hindi (Devanagari script).'
    : 'Write in natural, touching English (or sweet friendly Hinglish if festive).';

  const toneGuides: Record<MessageTone, string> = {
    emotional: 'Deeply heartfelt, emotional, touching the soul, expressing unconditional love, bond and gratitude.',
    funny: 'Humorous, playful, friendly teasing, jokes about funny fights, remote snatching or crazy habits, ending with sweet love.',
    cute: 'Extremely sweet, innocent, warm like a gentle hug with cute emojis.',
    romantic: 'Deeply romantic, passionate, poetic, praising their beauty and importance in life.',
    poetic: 'In the style of a memorable 2 or 4 line Shayari / lyrical poem with rhythm.',
    deep: 'Philosophical, mature, discussing how rare and precious true connections are in this universe.',
    short: 'Crisp, impactful, 2-3 lines punchy and unforgettable.',
  };

  const lengthGuides: Record<MessageLength, string> = {
    short: 'Keep it very short (2 to 3 lines, crisp and punchy).',
    medium: 'Keep it medium length (4 to 5 lines, nicely balanced).',
    long: 'Keep it detailed and story-like (6 to 8 lines with deep emotion).',
  };

  const systemPrompt = `You are Gifti AI, an award-winning personal speech and card writer by AAYU SOLUTION.
Generate exactly 3 DISTINCT, UNIQUE message suggestions based on the following context:

- Sender Name: "${senderName || 'Sender'}"
- Recipient Name: "${receiverName || 'Receiver'}"
- Relationship: "${relationship}" (e.g. sister, brother, best friend, partner, etc.)
- Occasion: "${occasion}"
- Tone: "${tone} - ${toneGuides[tone]}"
- Length: "${lengthGuides[lengthOption]}"
- Language: "${languageInstruction}"
- Sender's custom thought/prompt: "${prompt || 'Write a memorable, heart-touching message'}"

RULES:
1. Provide 3 COMPLETELY DIFFERENT options:
   - Option 1: Direct, sweet and classic.
   - Option 2: Creative, poetic with memorable metaphors.
   - Option 3: Modern, emotional and playful.
2. Separate each option with the exact delimiter: "===OPTION==="
3. Do NOT include introductory phrases like "Here is Option 1:", quotes around the text, or conversational filler.
4. Each option must directly address ${receiverName || 'Recipient'} and sign off with ${senderName || 'Sender'}.
5. Use relevant emojis naturally.`;

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
            temperature: 0.9,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (generatedText) {
          const parts = generatedText
            .split(/===OPTION===|\n\n---\n\n|Option \d+:/i)
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 15);

          if (parts.length >= 2) {
            return parts.slice(0, 3);
          } else if (parts.length === 1) {
            return [parts[0], ...getCuratedFallbackOptions({ senderName, receiverName, relationship, occasion, tone, lengthOption, language }).slice(1)];
          }
        }
      }
    } catch (error) {
      console.warn('Gemini API call failed, using curated variations:', error);
    }
  }

  // Curated Fallbacks with 3 distinct options
  return getCuratedFallbackOptions({ senderName, receiverName, relationship, occasion, tone, lengthOption, language });
}

function getCuratedFallbackOptions({
  senderName,
  receiverName,
  relationship,
  occasion,
  tone,
  lengthOption,
  language,
}: {
  senderName: string;
  receiverName: string;
  relationship?: string;
  occasion: Occasion;
  tone: MessageTone;
  lengthOption: MessageLength;
  language: Language;
}): string[] {
  const to = receiverName || (language === 'hi' ? 'प्रिय' : 'Dearest');
  const from = senderName || (language === 'hi' ? 'आपका अपना' : 'Yours always');

  if (language === 'hi') {
    if (occasion === 'rakhi' || relationship === 'sister') {
      return [
        `मेरी प्यारी बहना ${to},\nतू भले ही मुझसे कितना भी लड़ ले, पर तेरे बिना ये पूरी दुनिया अधूरी है। रक्षाबंधन की ढेर सारी शुभकामनाएं मेरी सबसे क्यूट बहना! ❤️\n— ${from}`,
        `रेशम के धागों में बसा है प्यार हमारा,\nतू ही तो है मेरी जिंदगी का सबसे चमकता सितारा! ✨\nHappy Rakhi ${to}! हमेशा ऐसे ही मुस्कुराती रहो। 🎀\n— ${from}`,
        `Dearest ${to},\nचाहे हम कितनी भी दूर हों, हमारा भाई-बहन का रिश्ता हमेशा सबसे खास रहेगा। मेरी हर खुशी पर सिर्फ तुम्हारा हक है। Happy Rakshabandhan! 💖\n— ${from}`,
      ];
    }

    if (occasion === 'birthday') {
      return [
        `जन्मदिन की ढेर सारी शुभकामनाएं ${to}! 🎂🎉\nईश्वर करे ये नया साल तुम्हारी जिंदगी में अनगिनत खुशियां, अच्छी सेहत और बड़ी सफलता लेकर आए। हमेशा खुश रहो! ❤️\n— ${from}`,
        `चांद सितारों से रोशन हो हर शाम तुम्हारी,\nखुशियों और मुस्कान से भर जाए ये जिंदगी तुम्हारी! 🎂✨\nHappy Birthday ${to}! Keep shining! 🌟\n— ${from}`,
        `आज का दिन उतना ही खास है जितना कि तुम! 🎁\nतुम्हारे सारे सपने सच हों और तुम्हारी मुस्कान हमेशा ऐसे ही खिली रहे। Happy Birthday ${to}! 🎉❤️\n— ${from}`,
      ];
    }

    if (occasion === 'love' || tone === 'romantic') {
      return [
        `मेरी जान ${to},\nतुमसे मिलकर जाना कि मोहब्बत कितनी खूबसूरत हो सकती है। तुम्हारे साथ का हर लम्हा मेरे लिए किसी जन्नत से कम नहीं है। 🌹❤️\n— ${from}`,
        `तुम्हारी हंसी से शुरू होती है मेरी हर सुबह,\nतुम ही तो हो मेरी हर दुआ, मेरी हर चाह! ✨💖\nI love you forever ${to}.\n— ${from}`,
        `Dearest ${to},\nजिंदगी में बहुत कुछ बदला, पर तुम्हारे लिए मेरा प्यार हर दिन और गहरा होता गया। तुम मेरा सबसे खूबसूरत तोहफा हो। 💍❤️\n— ${from}`,
      ];
    }

    return [
      `मेरी प्यारी ${to},\nकुछ रिश्ते शब्दों के मोहताज नहीं होते। आपका साथ मेरी जिंदगी का सबसे अनमोल तोहफा है। हमेशा ऐसे ही मुस्कुराते रहिए! ✨❤️\n— ${from}`,
      `दिलों की दूरी कभी रिश्तों को कम नहीं करती,\nसच्ची यादें हमेशा दिल के करीब रहती हैं! 🌟\nWith lots of love ${to}!\n— ${from}`,
      `Dearest ${to},\nJust a little reminder that you are deeply loved and appreciated today and always! 💖\n— ${from}`,
    ];
  }

  // English fallback options
  if (occasion === 'rakhi' || relationship === 'sister') {
    return [
      `Dearest ${to},\nYou annoy me more than anyone else in the world 😂, but honestly life would be totally incomplete without your drama! Happy Rakhi to my favorite sister! ❤️\n— ${from}`,
      `To the sweetest sister ${to},\nSome people make the world brighter simply by being in it. Thank you for always having my back and being my greatest strength. 🎀✨\nHappy Rakhi with all my love!\n— ${from}`,
      `Happy Rakhi ${to}! 🌟\nDistance means so little when someone means so much. Wishing you endless happiness, laughter, and blessings today! 💖\n— ${from}`,
    ];
  }

  if (occasion === 'birthday') {
    return [
      `Happy Birthday to the most amazing ${to}! 🎂✨\nMay this year bring you infinite laughter, incredible adventures, and everything your heart desires. Keep shining bright! ❤️\n— ${from}`,
      `May stars align to light your way,\nAnd joy surround you every day! 🌟🎂\nWishing you a magical and unforgettable Birthday, dearest ${to}!\n— ${from}`,
      `Another year older, wiser, and even more fabulous! 🎉\nSo grateful to celebrate another year of your wonderful life. Happy Birthday ${to}! 🎁❤️\n— ${from}`,
    ];
  }

  if (occasion === 'love' || tone === 'romantic') {
    return [
      `My dearest ${to},\nEvery single day with you feels like a dream come true. You are my home, my peace, and my greatest blessing. 🌹❤️\nForever and always,\n— ${from}`,
      `You are the rhythm in my heartbeat and the smile behind my thoughts. ✨\nThank you for choosing me every single day. I love you endlessly, ${to}! 💖\n— ${from}`,
      `To my favorite person ${to},\nNo words in any language can truly capture how much you mean to me. Loving you is the easiest thing I've ever done. 💍❤️\n— ${from}`,
    ];
  }

  return [
    `Dearest ${to},\nJust wanted to remind you how deeply special and appreciated you are. Life is so much more beautiful with you in it! ✨❤️\n— ${from}`,
    `Some connections are rare and timeless, and yours is one of the greatest gifts in my life. 🌟\nWishing you pure joy always, ${to}!\n— ${from}`,
    `Sending you a big warm hug and all my love today! Keep smiling and being your incredible self, ${to}! 💖\n— ${from}`,
  ];
}
