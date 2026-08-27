import React, { useState } from 'react';
import { Occasion, MessageTone, Language, Relationship, MessageLength } from '../../types/gift';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { generateHeartfeltMessageOptions } from '../../services/gemini';
import { Wand2, Sparkles, MessageSquare, Loader2, Check, UserCheck, AlignLeft } from 'lucide-react';

interface AIMessageWriterProps {
  senderName: string;
  receiverName: string;
  relationship?: Relationship | string;
  onRelationshipChange?: (rel: Relationship) => void;
  occasion: Occasion;
  message: string;
  onMessageChange: (message: string) => void;
}

export const AIMessageWriter: React.FC<AIMessageWriterProps> = ({
  senderName,
  receiverName,
  relationship = 'special',
  onRelationshipChange,
  occasion,
  message,
  onMessageChange,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { playSparkle, playUnbox } = useAudio();

  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState<MessageTone>('emotional');
  const [selectedLength, setSelectedLength] = useState<MessageLength>('medium');
  const [selectedRel, setSelectedRel] = useState<Relationship>((relationship as Relationship) || 'special');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

  const tones: { id: MessageTone; icon: string }[] = [
    { id: 'emotional', icon: '💖' },
    { id: 'funny', icon: '😂' },
    { id: 'cute', icon: '🥰' },
    { id: 'romantic', icon: '🌹' },
    { id: 'poetic', icon: '✨' },
    { id: 'deep', icon: '🌌' },
    { id: 'short', icon: '⚡' },
  ];

  const relationshipList: Relationship[] = [
    'sister',
    'brother',
    'bestfriend',
    'friend',
    'girlfriend',
    'boyfriend',
    'crush',
    'wife',
    'husband',
    'mother',
    'father',
    'special',
  ];

  const lengthList: MessageLength[] = ['short', 'medium', 'long'];

  const getQuickIdeas = () => {
    if (language === 'hi') {
      switch (occasion) {
        case 'rakhi':
        case 'sister':
          return ['रिमोट के लिए झगड़ा पर सबसे प्यारी बहन', 'हमेशा मेरा ख्याल रखने वाली', 'दूरी भले हो पर प्यार हमेशा रहेगा'];
        case 'birthday':
          return ['जिंदगी का सबसे बेहतरीन साल हो', 'हमेशा ऐसे ही मुस्कुराते रहो', 'सारे सपने सच हों'];
        case 'love':
        case 'anniversary':
          return ['तुम मेरी जिंदगी का सबसे खूबसूरत अहसास हो', 'हमेशा तुम्हारा हाथ थामे रहूँगा'];
        default:
          return ['सच्ची दोस्ती हमेशा अनमोल होती है', 'दिल से बहुत-बहुत शुक्रिया'];
      }
    } else {
      switch (occasion) {
        case 'rakhi':
        case 'sister':
          return ['Always fighting for the TV remote 😂', 'My biggest supporter & secret keeper', 'Distance cannot change our bond ❤️'];
        case 'birthday':
          return ['Wishing you endless laughter & dreams fulfilled', 'To another year of epic adventures', 'Happy 21st / special birthday'];
        case 'love':
        case 'anniversary':
          return ['You are my favorite place to be', 'Thank you for choosing me every day'];
        default:
          return ['True friends are rare gems', 'Thank you for being there for me'];
      }
    }
  };

  const handleGenerate = async (customPromptText?: string) => {
    const promptToUse = customPromptText || aiPrompt;
    setIsGenerating(true);
    playSparkle();

    try {
      const options = await generateHeartfeltMessageOptions({
        prompt: promptToUse,
        senderName,
        receiverName,
        relationship: selectedRel,
        occasion,
        tone: selectedTone,
        lengthOption: selectedLength,
        language,
      });

      setGeneratedOptions(options);
      setActiveOptionIndex(0);
      if (options.length > 0) {
        onMessageChange(options[0]);
      }
      playUnbox();
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (index: number) => {
    playSparkle();
    setActiveOptionIndex(index);
    if (generatedOptions[index]) {
      onMessageChange(generatedOptions[index]);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
      
      {/* Header & Language Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white">
            <Wand2 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.stepMessage}
            </h3>
            <p className="text-[11px] text-rose-300 font-medium">
              3 Distinct Variations Powered by Gemini AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSparkle();
            setLanguage(language === 'en' ? 'hi' : 'en');
          }}
          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-300 border border-amber-400/30 flex items-center gap-1 transition-all"
        >
          <span>{language === 'en' ? '🇮🇳 हिन्दी में लिखें' : '🌐 Write in English'}</span>
        </button>
      </div>

      {/* 1. Relationship Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>{t.relationshipLabel}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {relationshipList.map((rel) => {
            const isSelected = selectedRel === rel;
            return (
              <button
                key={rel}
                type="button"
                onClick={() => {
                  playSparkle();
                  setSelectedRel(rel);
                  onRelationshipChange?.(rel);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30 scale-105'
                    : 'bg-black/40 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {t.relationships[rel]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tone & Length Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        
        {/* Tone Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300">
            {t.aiToneLabel}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tones.map((tone) => {
              const isSelected = selectedTone === tone.id;
              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => {
                    playSparkle();
                    setSelectedTone(tone.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow'
                      : 'bg-black/30 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>{tone.icon}</span>
                  <span>{t.tones[tone.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Length Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.messageLengthLabel}</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {lengthList.map((len) => {
              const isSelected = selectedLength === len;
              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => {
                    playSparkle();
                    setSelectedLength(len);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/25'
                      : 'bg-black/30 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {t.lengths[len]}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Prompt Input & Generate Button */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-semibold text-gray-300">
          {t.aiPromptLabel}
        </label>
        <div className="relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t.aiPromptPlaceholder}
            className="w-full px-3.5 py-2.5 pr-32 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-all"
          />
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.aiGenerating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '३ विकल्प बनाएं ✨' : 'Generate 3 ✨'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Idea Pills */}
      <div className="space-y-1">
        <span className="text-[11px] text-gray-400 font-medium">
          💡 {t.quickIdeas}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {getQuickIdeas().map((idea, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setAiPrompt(idea);
                handleGenerate(idea);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-200 border border-white/5 hover:border-rose-400/40 transition-all text-left"
            >
              + {idea}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Generated Options Selector (3 Variations) */}
      {generatedOptions.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-white/10 animate-fade-in">
          <span className="text-xs font-bold text-amber-300">
            {t.selectOptionPrompt}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {generatedOptions.map((opt, idx) => {
              const isSelected = activeOptionIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                      : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-rose-300 uppercase">
                        {t.optionLabel} {idx + 1}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-200 font-['Kalam',sans-serif] line-clamp-3 leading-snug">
                      "{opt}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOption(idx);
                    }}
                    className={`mt-2 py-1 px-2 rounded-lg text-[10px] font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected ✓' : t.useThisOption}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Final Editable Message Box */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'अंतिम संदेश (आप इसे बदल भी सकते हैं):' : 'Final Card Message (Fully Editable):'}</span>
        </label>

        <textarea
          rows={5}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={language === 'hi' ? 'यहाँ अपना प्यारा संदेश लिखें या ऊपर AI से लिखवाएं...' : 'Write your lovely message here or generate options above...'}
          className="w-full p-3.5 rounded-2xl bg-black/50 border border-rose-500/30 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 font-['Kalam',sans-serif] leading-relaxed transition-all shadow-inner"
        />
      </div>

    </div>
  );
};
