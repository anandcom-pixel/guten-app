import React, { useState, useEffect } from 'react';
import {
  Brain,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCw,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import type { LeitnerCard } from '../types';
import { srsService } from '../services/srsService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface SRSReviewViewProps {
  speechRate: number;
}

export const SRSReviewView: React.FC<SRSReviewViewProps> = ({ speechRate }) => {
  const [cards, setCards] = useState<LeitnerCard[]>(srsService.getCards());
  const [boxCounts, setBoxCounts] = useState(srsService.getBoxCounts());
  const [isReviewSessionActive, setIsReviewSessionActive] = useState<boolean>(false);
  const [reviewQueue, setReviewQueue] = useState<LeitnerCard[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    const unsub = srsService.subscribe(() => {
      setCards([...srsService.getCards()]);
      setBoxCounts(srsService.getBoxCounts());
    });
    return () => unsub();
  }, []);

  const dueCards = srsService.getDueCards();

  const startReviewSession = () => {
    soundEffects.playTap();
    const queue = dueCards.length > 0 ? dueCards : cards.slice(0, 10);
    setReviewQueue(queue);
    setCurrentQueueIndex(0);
    setIsCardFlipped(false);
    setIsReviewSessionActive(true);

    if (queue[0]) {
      speechService.speak(queue[0].german, { rate: speechRate });
    }
  };

  const handleCardResult = (knewIt: boolean) => {
    const currentCard = reviewQueue[currentQueueIndex];
    if (!currentCard) return;

    if (knewIt) {
      soundEffects.playCorrect();
      srsService.recordResult(currentCard.vocabId, true);
    } else {
      soundEffects.playIncorrect();
      srsService.recordResult(currentCard.vocabId, false);
    }

    if (currentQueueIndex + 1 < reviewQueue.length) {
      const nextIndex = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIndex);
      setIsCardFlipped(false);
      setTimeout(() => {
        speechService.speak(reviewQueue[nextIndex].german, { rate: speechRate });
      }, 250);
    } else {
      soundEffects.playVictory();
      setIsReviewSessionActive(false);
    }
  };

  const currentReviewCard = reviewQueue[currentQueueIndex];

  const filteredCards = cards.filter(c => {
    const matchesSearch =
      c.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.english.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBox = selectedBoxFilter === 'all' || c.box === selectedBoxFilter;
    return matchesSearch && matchesBox;
  });

  const BOX_INFO = [
    { box: 1, title: 'Box 1', interval: 'Täglich (1 Tag)', color: 'border-rose-500/50 bg-rose-950/20 text-rose-300' },
    { box: 2, title: 'Box 2', interval: 'Alle 2 Tage', color: 'border-amber-500/50 bg-amber-950/20 text-amber-300' },
    { box: 3, title: 'Box 3', interval: 'Alle 4 Tage', color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
    { box: 4, title: 'Box 4', interval: 'Alle 7 Tage', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300' },
    { box: 5, title: 'Box 5', interval: 'Langzeit (14 Tage)', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' }
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Spaced Repetition System (SRS)
              </span>
              <span className="text-xs text-slate-400">Leitner 5-Fächer-Methode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gedächtnis-Deck & Kognitiver Anker
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verpasste Vokabeln oder verwechselte Artikel fallen sofort in Box 1 zurück. Regelmäßige Abfragen verankern Begriffe fest im Langzeitgedächtnis (Box 5).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={startReviewSession}
              disabled={cards.length === 0}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {dueCards.length > 0 ? `Jetzt Wiederholen (${dueCards.length} fällig)` : 'Übungseinheit Starten'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Leitner 5 Boxes Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {BOX_INFO.map(b => {
          const count = boxCounts[b.box as 1 | 2 | 3 | 4 | 5];
          const isSelected = selectedBoxFilter === b.box;
          return (
            <div
              key={b.box}
              onClick={() => setSelectedBoxFilter(isSelected ? 'all' : b.box)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-amber-400 scale-[1.02]' : ''
              } ${b.color}`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{b.title}</span>
                <span className="text-lg font-black">{count}</span>
              </div>
              <div className="text-[11px] opacity-80">{b.interval}</div>
              <div className="mt-3 w-full h-1.5 rounded-full bg-slate-900/60 overflow-hidden">
                <div
                  className="h-full bg-current transition-all"
                  style={{ width: `${cards.length > 0 ? Math.min((count / cards.length) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Interactive Review Session (Flashcards) */}
      {isReviewSessionActive && currentReviewCard && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>
              Karte {currentQueueIndex + 1} von {reviewQueue.length} (Box {currentReviewCard.box})
            </span>
            <button
              type="button"
              onClick={() => setIsReviewSessionActive(false)}
              className="text-rose-400 hover:text-rose-300"
            >
              Session Beenden
            </button>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="cursor-pointer min-h-[220px] sm:min-h-[260px] p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center text-center space-y-4 group relative"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400">
              {isCardFlipped ? '🇬🇧 Übersetzung & Bedeutung' : '🇩🇪 Deutsches Wort (Klicken zum Umdrehen)'}
            </span>

            {!isCardFlipped ? (
              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-black text-white group-hover:text-amber-200 transition-colors">
                  {currentReviewCard.german}
                </h3>
                <span className="text-xs text-amber-400 font-semibold block">
                  Niveau {currentReviewCard.level}
                </span>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in">
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {currentReviewCard.english}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentReviewCard.german}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEffects.playTap();
                  speechService.speak(currentReviewCard.german, { rate: speechRate });
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Wort anhören"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
              </button>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Karte umdrehen
              </span>
            </div>
          </div>

          {/* Review Decision Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleCardResult(false)}
              className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 hover:bg-rose-900/40 text-rose-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Noch unsicher (Zurück zu Box 1)</span>
            </button>
            <button
              type="button"
              onClick={() => handleCardResult(true)}
              className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gewusst / Gemeistert (+10 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* SRS Deck Browser & Search Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Vokabel-Deck ({cards.length} registrierte Karten)
          </h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wort filtern..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {selectedBoxFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedBoxFilter('all')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                <span>Filter: B{selectedBoxFilter}</span>
                <span className="text-slate-500">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Cards Table */}
        <div className="overflow-x-auto max-h-96 overflow-y-auto pr-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Deutscher Ausdruck</th>
                <th className="py-2.5 px-3">Englische Bedeutung</th>
                <th className="py-2.5 px-3">Niveau</th>
                <th className="py-2.5 px-3">Leitner-Box</th>
                <th className="py-2.5 px-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCards.map(card => {
                const boxMeta = BOX_INFO[card.box - 1];
                return (
                  <tr key={card.vocabId} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {card.german}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {card.english}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                        {card.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${boxMeta.color}`}>
                        Box {card.box} ({boxMeta.interval})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playTap();
                          speechService.speak(card.german, { rate: speechRate });
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Anhören"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
