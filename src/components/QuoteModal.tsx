import React, { useState, useEffect } from 'react';
import { X, Volume2, CheckCircle2, Quote, Cloud, Sparkles } from 'lucide-react';
import { curriculumOverrideService, type GermanQuote } from '../services/curriculumOverrideService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import type { AuthUser } from '../types/auth';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuote?: GermanQuote | null;
  currentUser?: AuthUser | null;
  onSaved?: (quote: GermanQuote) => void;
  speechRate?: number;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  currentQuote,
  currentUser,
  onSaved,
  speechRate = 1.0
}) => {
  const [german, setGerman] = useState<string>('');
  const [english, setEnglish] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [category, setCategory] = useState<string>('Motivation & Weisheit');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (currentQuote) {
      setGerman(currentQuote.german);
      setEnglish(currentQuote.english);
      setAuthor(currentQuote.author);
      setCategory(currentQuote.category || 'Motivation & Weisheit');
    } else {
      setGerman('');
      setEnglish('');
      setAuthor('Deutsches Sprichwort');
      setCategory('Motivation & Weisheit');
    }
    setSavedSuccess(false);
  }, [currentQuote, isOpen]);

  if (!isOpen) return null;

  const handlePlayPreview = () => {
    if (!german.trim()) return;
    soundEffects.playTap();
    setIsPlayingAudio(true);
    speechService.speak(german.trim(), {
      rate: speechRate,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!german.trim() || !english.trim()) return;

    setIsSubmitting(true);
    // Setting daily quote seamlessly replaces the existing daily slot
    const saved = curriculumOverrideService.setDailyQuote(
      german.trim(),
      english.trim(),
      author.trim() || 'Deutsches Sprichwort',
      category.trim() || 'Motivation & Weisheit',
      currentUser?.displayName || currentUser?.username || 'Autorisierter Benutzer'
    );

    soundEffects.playCorrect();
    setSavedSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      onSaved?.(saved);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <Quote className="w-3.5 h-3.5 text-emerald-400" />
              Zitat des Tages Aktualisieren
            </span>
            {currentUser && (
              <span className="text-[11px] text-slate-400 font-medium">
                Als <strong className="text-emerald-300 font-bold">{currentUser.displayName}</strong> ({currentUser.username})
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            Neues Deutsches Zitat Setzen
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Geben Sie das neue deutsche Zitat und seine englische Bedeutung ein. Das Speichern ersetzt das aktuelle Tageszitat sofort für alle Benutzer auf der Plattform.
          </p>
        </div>

        {/* Replacement Slot Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200/90 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-emerald-300 font-semibold">Tageszitat-Slot:</strong> Dieses Zitat wird als einziges aktives Zitat des Tages angezeigt und synchronisiert sich sofort in die Vercel-Cloud.
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Zitat des Tages erfolgreich ersetzt und in der Cloud gespeichert!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* German Quote Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Deutscher Satz / Zitat *
              </label>
              {german.trim() && (
                <button
                  type="button"
                  onClick={handlePlayPreview}
                  disabled={isPlayingAudio}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudio ? 'Wiedergabe...' : 'Aussprache anhören'}</span>
                </button>
              )}
            </div>
            <textarea
              value={german}
              onChange={(e) => setGerman(e.target.value)}
              placeholder="z. B. Aller Anfang ist schwer, aber wer wagt, gewinnt."
              rows={2}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 font-serif italic"
              required
            />
          </div>

          {/* English Meaning / Translation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Englische Bedeutung / Übersetzung *
            </label>
            <textarea
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="z. B. Every beginning is difficult, but fortune favors the bold."
              rows={2}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Autor / Quelle
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="z. B. Johann Wolfgang von Goethe"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Motivation & Weisheit">Motivation &amp; Weisheit</option>
                <option value="Klassiker & Philosophie">Klassiker &amp; Philosophie</option>
                <option value="Sprichwort & Volksmund">Sprichwort &amp; Volksmund</option>
                <option value="Literatur & Poesie">Literatur &amp; Poesie</option>
                <option value="Alltag & Kultur">Alltag &amp; Kultur</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !german.trim() || !english.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <Cloud className="w-4 h-4 text-emerald-200" />
              <span>{isSubmitting ? 'Wird gespeichert...' : 'Tageszitat Ersetzen & Synchronisieren'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
