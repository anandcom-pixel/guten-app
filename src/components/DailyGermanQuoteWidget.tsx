import React, { useState, useEffect } from 'react';
import {
  Quote,
  Sparkles,
  Volume2,
  Edit3,
  Cloud
} from 'lucide-react';
import {
  curriculumOverrideService,
  type GermanQuote
} from '../services/curriculumOverrideService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import type { AuthUser } from '../types/auth';
import { QuoteModal } from './QuoteModal';

interface DailyGermanQuoteWidgetProps {
  speechRate?: number;
  currentUser?: AuthUser | null;
}

export const DailyGermanQuoteWidget: React.FC<DailyGermanQuoteWidgetProps> = ({
  speechRate = 1.0,
  currentUser
}) => {
  const [dailyQuote, setDailyQuote] = useState<GermanQuote>(() =>
    curriculumOverrideService.getDailyQuote()
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = curriculumOverrideService.subscribe(() => {
      setDailyQuote(curriculumOverrideService.getDailyQuote());
    });
    return () => unsub();
  }, []);

  const handlePlayAudio = () => {
    if (!dailyQuote) return;
    soundEffects.playTap();
    setIsPlayingAudio(true);
    speechService.speak(dailyQuote.german, {
      rate: speechRate,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  const handleOpenModal = () => {
    soundEffects.playTap();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 p-4 sm:p-6 shadow-xl transition-all relative overflow-hidden">
        {/* Subtle decorative emerald glow backdrop */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 relative z-10">
          {/* Left Column: Header Tags, German Quote, English Meaning & Author */}
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Zitat des Tages • Daily German Quote</span>
              </span>

              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Tages-Slot
              </span>

              {dailyQuote.category && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
                  {dailyQuote.category}
                </span>
              )}

              {dailyQuote.updatedBy && dailyQuote.updatedBy !== 'system' && (
                <span className="text-[10px] text-slate-400 font-medium">
                  Aktualisiert von <strong className="text-emerald-300">{dailyQuote.updatedBy}</strong>
                </span>
              )}
            </div>

            {/* German Quote Sentence */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2">
                <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-1 rotate-180 opacity-70" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug font-serif italic break-words">
                  „{dailyQuote.german}“
                </h2>
              </div>

              {/* English Meaning */}
              <div className="pl-0 sm:pl-7 flex flex-wrap items-baseline gap-2">
                <span className="text-sm sm:text-base font-bold text-emerald-300">
                  — {dailyQuote.english}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 italic">
                  ({dailyQuote.author})
                </span>
              </div>
            </div>

            {/* Subtle note about single slot replacement */}
            {currentUser && (
              <p className="text-[11px] text-slate-400 pl-0 sm:pl-7 flex items-center gap-1.5 pt-0.5">
                <Cloud className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Ein neues Zitat ersetzt den aktuellen Tages-Slot nahtlos und synchronisiert für alle Benutzer.</span>
              </p>
            )}
          </div>

          {/* Right Column: Audio Listen Button + Universal Add/Edit Replacement Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Audio Pronunciation Button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border flex-1 sm:flex-initial ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-slate-700/80 hover:border-emerald-500/50 shadow-md'
              }`}
              title="Aussprache des Zitats anhören"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-white' : 'text-emerald-400'}`} />
              <span>{isPlayingAudio ? 'Aussprache läuft...' : 'Aussprache anhören'}</span>
              {isPlayingAudio && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-white rounded-full animate-wave-1" />
                  <span className="w-1 h-4 bg-white rounded-full animate-wave-2" />
                  <span className="w-1 h-2 bg-white rounded-full animate-wave-3" />
                </span>
              )}
            </button>

            {/* Universal Add / Edit Replacement Button for Authorized Users */}
            {currentUser && (
              <button
                type="button"
                onClick={handleOpenModal}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold border border-emerald-400/40 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 flex-1 sm:flex-initial"
                title="Tageszitat ersetzen oder bearbeiten"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Zitat Ersetzen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentQuote={dailyQuote}
        currentUser={currentUser}
        speechRate={speechRate}
        onSaved={(newQuote) => {
          setDailyQuote(newQuote);
        }}
      />
    </>
  );
};
