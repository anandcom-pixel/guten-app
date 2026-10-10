import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  ShieldCheck,
  Volume2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Mic,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import type { MistakeEntry, MistakeType } from '../types';
import { mistakeVaultService } from '../services/mistakeVaultService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { srsService } from '../services/srsService';
import { GermanKeyboardHelper } from './GermanKeyboardHelper';

interface MistakeVaultViewProps {
  speechRate: number;
  onNavigateToVoice: (german: string) => void;
}

export const MistakeVaultView: React.FC<MistakeVaultViewProps> = ({
  speechRate,
  onNavigateToVoice
}) => {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(mistakeVaultService.getMistakes());
  const [stats, setStats] = useState(mistakeVaultService.getStats());
  const [filterType, setFilterType] = useState<MistakeType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'unresolved' | 'mastered'>('unresolved');

  // Interactive Re-testing / Cleansing session state
  const [isCleansingSession, setIsCleansingSession] = useState<boolean>(false);
  const [cleansingQueue, setCleansingQueue] = useState<MistakeEntry[]>([]);
  const [currentCleansingIndex, setCurrentCleansingIndex] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedGenderAnswer, setSelectedGenderAnswer] = useState<string | null>(null);
  const [cleansingFeedback, setCleansingFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    const unsub = mistakeVaultService.subscribe(() => {
      setMistakes([...mistakeVaultService.getMistakes()]);
      setStats(mistakeVaultService.getStats());
    });
    return () => unsub();
  }, []);

  const filteredMistakes = mistakes.filter(m => {
    const matchesType = filterType === 'ALL' || m.type === filterType;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'unresolved' && m.status !== 'mastered') ||
      (filterStatus === 'mastered' && m.status === 'mastered');
    return matchesType && matchesStatus;
  });

  const startCleansingSession = () => {
    soundEffects.playTap();
    const queue = mistakes.filter(m => m.status !== 'mastered');
    if (queue.length === 0) return;

    setCleansingQueue(queue);
    setCurrentCleansingIndex(0);
    setTypedAnswer('');
    setSelectedGenderAnswer(null);
    setCleansingFeedback(null);
    setIsCleansingSession(true);

    if (queue[0]) {
      speechService.speak(queue[0].german, { rate: speechRate });
    }
  };

  const handleValidateCleansing = () => {
    const current = cleansingQueue[currentCleansingIndex];
    if (!current) return;

    let isCorrect = false;

    if (current.type === 'gender') {
      if (!selectedGenderAnswer) return;
      const targetArticle = current.german.split(' ')[0].toLowerCase();
      isCorrect = selectedGenderAnswer.toLowerCase() === targetArticle;
    } else {
      const cleanInput = typedAnswer.trim().toLowerCase().replace(/[.,!?]/g, '');
      const cleanTarget = current.german.trim().toLowerCase().replace(/[.,!?]/g, '');
      isCorrect = cleanInput === cleanTarget;
    }

    if (isCorrect) {
      soundEffects.playCorrect();
      setCleansingFeedback('correct');
      mistakeVaultService.recordMistakeReview(current.id, true);
      srsService.addXP(15);

      if (current.consecutiveCorrect + 1 >= 2) {
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {
          // ignore
        }
      }
    } else {
      soundEffects.playIncorrect();
      setCleansingFeedback('incorrect');
      mistakeVaultService.recordMistakeReview(current.id, false);
    }
  };

  const handleNextCleansingItem = () => {
    soundEffects.playTap();
    if (currentCleansingIndex + 1 < cleansingQueue.length) {
      const nextIdx = currentCleansingIndex + 1;
      setCurrentCleansingIndex(nextIdx);
      setTypedAnswer('');
      setSelectedGenderAnswer(null);
      setCleansingFeedback(null);
      setTimeout(() => {
        speechService.speak(cleansingQueue[nextIdx].german, { rate: speechRate });
      }, 200);
    } else {
      soundEffects.playVictory();
      setIsCleansingSession(false);
    }
  };

  const currentCleansingItem = cleansingQueue[currentCleansingIndex];

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-5xl mx-auto">
      {/* Header Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Fehler-Tresor (Mistake Vault)
              </span>
              <span className="text-xs text-slate-400">Gezieltes Rekonditionieren & Meistern</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dein Persönlicher Fehler-Tresor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Jeder verwechselte Artikel (der/die/das), falsche Wortstellungen und Aussprache-Stolperer werden hier archiviert. Meistere sie mit 2 aufeinanderfolgenden korrekten Antworten!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={stats.unresolved === 0}
              onClick={startCleansingSession}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tresor Bereinigen ({stats.unresolved} offen)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="text-2xl font-black text-rose-400">{stats.unresolved}</div>
          <div className="text-[11px] text-slate-400 font-medium">Offene Fehler</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="text-2xl font-black text-emerald-400">{stats.mastered}</div>
          <div className="text-[11px] text-slate-400 font-medium">Gemeistert ✓</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="text-2xl font-black text-amber-400">{stats.genderCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Artikel (der/die/das)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="text-2xl font-black text-indigo-400">{stats.vocabCount + stats.pronunciationCount + stats.grammarCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Vokabeln, Voix & Syntax</div>
        </div>
      </div>

      {/* Active Cleansing Session Card */}
      {isCleansingSession && currentCleansingItem && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <span className="text-rose-400 font-bold">Tresor-Training :</span>
              <span>Element {currentCleansingIndex + 1} von {cleansingQueue.length}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsCleansingSession(false)}
              className="text-rose-400 hover:text-rose-300"
            >
              Session Beenden
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                {currentCleansingItem.type === 'gender' ? 'Artikel-Fehler' : currentCleansingItem.type === 'vocab' ? 'Vokabular' : currentCleansingItem.type === 'pronunciation' ? 'Aussprache' : 'Grammatik'}
              </span>
              <span className="text-xs text-amber-400 font-bold">Niveau {currentCleansingItem.level}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Aufgabe / Bedeutung :</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                „{currentCleansingItem.english}“
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 max-w-lg mx-auto">
              <strong className="text-amber-400">Vorheriger Fehlergrund :</strong> {currentCleansingItem.contextNote}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => speechService.speak(currentCleansingItem.german, { rate: speechRate })}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Deutsche Aussprache Anhören</span>
              </button>
            </div>
          </div>

          {/* Interactive Input for Gender or Typing */}
          {currentCleansingItem.type === 'gender' ? (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 text-center">
                Wähle den korrekten Artikel für: <strong className="text-white">{currentCleansingItem.german.split(' ').slice(1).join(' ') || currentCleansingItem.german}</strong>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['der', 'die', 'das'].map(art => (
                  <button
                    key={art}
                    type="button"
                    disabled={cleansingFeedback !== null}
                    onClick={() => setSelectedGenderAnswer(art)}
                    className={`p-4 rounded-2xl border text-xl font-black uppercase transition-all ${
                      selectedGenderAnswer === art
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {art}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400">
                Tippe das deutsche Wort / den Satz korrekt ein:
              </div>
              <input
                type="text"
                value={typedAnswer}
                disabled={cleansingFeedback !== null}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (cleansingFeedback === null) {
                      handleValidateCleansing();
                    } else {
                      handleNextCleansingItem();
                    }
                  }
                }}
                placeholder="Korrekte deutsche Formulierung eingeben..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-base focus:outline-none focus:border-amber-500"
                autoFocus
              />
              {cleansingFeedback === null && (
                <GermanKeyboardHelper onInsertChar={(c) => setTypedAnswer(prev => prev + c)} />
              )}
            </div>
          )}

          {/* Cleansing Feedback */}
          {cleansingFeedback === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hervorragend korrigiert! Fortschritt im Tresor gespeichert (+15 XP).</span>
            </div>
          )}

          {cleansingFeedback === 'incorrect' && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Noch nicht ganz richtig:</span>
              </div>
              <div>Richtig wäre gewesen: <strong className="text-white underline">{currentCleansingItem.german}</strong></div>
            </div>
          )}

          {/* Cleansing Actions Footer */}
          <div className="pt-2 flex justify-between items-center">
            {currentCleansingItem.type === 'pronunciation' && (
              <button
                type="button"
                onClick={() => onNavigateToVoice(currentCleansingItem.german)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 underline font-semibold"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Im Voice Studio laut aussprechen</span>
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              {cleansingFeedback === null ? (
                <button
                  type="button"
                  disabled={currentCleansingItem.type === 'gender' ? !selectedGenderAnswer : !typedAnswer.trim()}
                  onClick={handleValidateCleansing}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-600/30"
                >
                  Prüfen
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCleansingItem}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                >
                  <span>{currentCleansingIndex + 1 < cleansingQueue.length ? 'Nächster Eintrag' : 'Session Abschließen'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vault Browser Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Kategorie :</span>
            {(['ALL', 'gender', 'vocab', 'pronunciation', 'grammar'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === cat
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'Alle' : cat === 'gender' ? 'Artikel (der/die/das)' : cat === 'vocab' ? 'Vokabular' : cat === 'pronunciation' ? 'Aussprache' : 'Grammatik'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterStatus('unresolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'unresolved'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Zu üben ({stats.unresolved})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('mastered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === 'mastered'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Gemeistert ({stats.mastered})
            </button>
            {stats.mastered > 0 && (
              <button
                type="button"
                onClick={() => mistakeVaultService.clearMastered()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                title="Gemeisterte Einträge löschen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* List of Mistake Cards */}
        {filteredMistakes.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Keine Fehler in dieser Kategorie!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Dein Fehler-Tresor ist für diesen Filter leer. Trainiere weiter in den Lektionen, Tests oder im Speed Drill.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredMistakes.map(item => {
              const isMastered = item.status === 'mastered';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isMastered
                      ? 'bg-emerald-950/10 border-emerald-500/20 opacity-70'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Type Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'gender'
                            ? 'bg-amber-500/20 text-amber-300'
                            : item.type === 'vocab'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : item.type === 'pronunciation'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-violet-500/20 text-violet-300'
                        }`}>
                          {item.type === 'gender' ? 'Artikel' : item.type === 'vocab' ? 'Vokabular' : item.type === 'pronunciation' ? 'Aussprache' : 'Grammatik'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                          {item.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isMastered ? 'Gemeistert ✓' : `${item.consecutiveCorrect}/2 Validiert`}
                        </span>
                        <button
                          type="button"
                          onClick={() => mistakeVaultService.removeMistake(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded-md"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Target Expression & Listen Button */}
                    <div className="flex items-start justify-between gap-2 mt-2">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {item.german}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.english}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => speechService.speak(item.german, { rate: speechRate })}
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
                        title="Anhören"
                      >
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>

                    {/* Context Note */}
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      <span className="text-amber-400 font-semibold">Diagnose : </span>
                      <span>{item.contextNote}</span>
                    </div>

                    {item.phoneticTip && (
                      <div className="mt-1 text-[11px] text-indigo-300 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Hinweis : {item.phoneticTip}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Erfasst am {item.failedAt.split('T')[0]}
                    </span>

                    {item.type === 'pronunciation' ? (
                      <button
                        type="button"
                        onClick={() => onNavigateToVoice(item.german)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Sprech-Check</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCleansingQueue([item]);
                          setCurrentCleansingIndex(0);
                          setTypedAnswer('');
                          setSelectedGenderAnswer(null);
                          setCleansingFeedback(null);
                          setIsCleansingSession(true);
                        }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Wiederholen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
