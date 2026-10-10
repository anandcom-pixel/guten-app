import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Puzzle,
  CheckCircle2,
  XCircle,
  Volume2,
  RefreshCw,
  ArrowRight,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import type { SentenceBuilderItem, CEFRLevel } from '../types';
import { SENTENCE_BUILDER_DATA } from '../data/sentenceBuilderData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { srsService } from '../services/srsService';
import { mistakeVaultService } from '../services/mistakeVaultService';

interface SentenceBuilderViewProps {
  speechRate: number;
  onNavigateToVault: () => void;
}

export const SentenceBuilderView: React.FC<SentenceBuilderViewProps> = ({
  speechRate,
  onNavigateToVault
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [draggedWordIndex, setDraggedWordIndex] = useState<{ source: 'available' | 'assembled'; index: number } | null>(null);
  const [validationState, setValidationState] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const filteredData = SENTENCE_BUILDER_DATA.filter(
    item => selectedLevel === 'ALL' || item.level === selectedLevel
  );

  const currentItem: SentenceBuilderItem | undefined = filteredData[currentIndex] || filteredData[0];

  useEffect(() => {
    if (currentItem) {
      const shuffled = [...currentItem.scrambledWords].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
      setAssembledWords([]);
      setValidationState(null);
      setShowHint(false);
    }
  }, [currentIndex, selectedLevel]);

  if (!currentItem) {
    return null;
  }

  const handleWordClickAvailable = (word: string, index: number) => {
    soundEffects.playTap();
    setAvailableWords(prev => prev.filter((_, i) => i !== index));
    setAssembledWords(prev => [...prev, word]);
    setValidationState(null);
  };

  const handleWordClickAssembled = (word: string, index: number) => {
    soundEffects.playTap();
    setAssembledWords(prev => prev.filter((_, i) => i !== index));
    setAvailableWords(prev => [...prev, word]);
    setValidationState(null);
  };

  const handleReset = () => {
    soundEffects.playTap();
    const shuffled = [...currentItem.scrambledWords].sort(() => 0.5 - Math.random());
    setAvailableWords(shuffled);
    setAssembledWords([]);
    setValidationState(null);
  };

  const handleDragStart = (source: 'available' | 'assembled', index: number) => {
    setDraggedWordIndex({ source, index });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnAssembled = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    if (!draggedWordIndex) return;

    soundEffects.playTap();
    setValidationState(null);

    if (draggedWordIndex.source === 'available') {
      const word = availableWords[draggedWordIndex.index];
      setAvailableWords(prev => prev.filter((_, i) => i !== draggedWordIndex.index));

      if (targetIndex !== undefined) {
        setAssembledWords(prev => {
          const next = [...prev];
          next.splice(targetIndex, 0, word);
          return next;
        });
      } else {
        setAssembledWords(prev => [...prev, word]);
      }
    } else if (draggedWordIndex.source === 'assembled' && targetIndex !== undefined) {
      setAssembledWords(prev => {
        const next = [...prev];
        const [moved] = next.splice(draggedWordIndex.index, 1);
        next.splice(targetIndex, 0, moved);
        return next;
      });
    }

    setDraggedWordIndex(null);
  };

  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWordIndex || draggedWordIndex.source !== 'assembled') return;

    soundEffects.playTap();
    setValidationState(null);
    const word = assembledWords[draggedWordIndex.index];
    setAssembledWords(prev => prev.filter((_, i) => i !== draggedWordIndex.index));
    setAvailableWords(prev => [...prev, word]);
    setDraggedWordIndex(null);
  };

  const handleValidate = () => {
    if (assembledWords.length === 0) return;

    const assembledSentence = assembledWords.join(' ').trim().toLowerCase().replace(/[.,!?]/g, '');
    const targetSentence = currentItem.germanCorrect.trim().toLowerCase().replace(/[.,!?]/g, '');

    const isCorrect = assembledSentence === targetSentence;

    if (isCorrect) {
      soundEffects.playCorrect();
      setValidationState('correct');
      srsService.addXP(20);
      srsService.unlockBadge('syntax_builder');

      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      soundEffects.playIncorrect();
      setValidationState('incorrect');

      mistakeVaultService.addMistake({
        type: 'grammar',
        german: currentItem.germanCorrect,
        english: currentItem.englishPrompt,
        level: currentItem.level,
        contextNote: `Falsche Satzstellung. Gebaut: "${assembledWords.join(' ')}". Regel: ${currentItem.grammarHint}`
      });
    }
  };

  const handleNext = () => {
    soundEffects.playTap();
    if (currentIndex + 1 < filteredData.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePlayAudio = () => {
    soundEffects.playTap();
    setIsPlayingAudio(true);
    speechService.speak(currentItem.germanCorrect, {
      rate: speechRate,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-amber-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Puzzle className="w-3.5 h-3.5" />
                Deutsche Syntax & Satzbau-Labor
              </span>
              <span className="text-xs text-slate-400">Drag-and-Drop Satzklammer & V2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Deutscher Satzbaumeister
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bringe durcheinandergewürfelte deutsche Wortblöcke in die richtige grammatische Reihenfolge. Übe Verb-Zweit-Stellung, trennbare Vorsilben am Satzende und Nebensätze mit Verb-Letzt.
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  soundEffects.playTap();
                  setSelectedLevel(lvl);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sentence Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Niveau {currentItem.level}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Aufgabe {currentIndex + 1} von {filteredData.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Tipp verbergen' : 'Grammatik-Tipp'}</span>
            </button>
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 animate-pulse ring-2 ring-amber-400/50 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Aussprache anhören"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
              <span>{isPlayingAudio ? 'Spielt...' : 'Anhören'}</span>
            </button>
          </div>
        </div>

        {/* English Prompt */}
        <div className="text-center space-y-1 py-1">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
            Bilde den korrekten deutschen Satz für:
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            „{currentItem.englishPrompt}“
          </h2>
        </div>

        {/* Grammar Hint Banner */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-start gap-2.5 animate-in fade-in">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="text-white">Syntax-Regel:</strong> {currentItem.grammarHint}
              {currentItem.caseRule && (
                <div className="mt-1 font-semibold text-indigo-300">
                  Kasus / Struktur: {currentItem.caseRule}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DROPZONE: Assembled Sentence Blocks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Dein gebauter Satz (klicke oder ziehe, um Wörter zu verschieben):</span>
            <span className="text-amber-400">{assembledWords.length} / {currentItem.scrambledWords.length} Wörter platziert</span>
          </div>

          <div
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDropOnAssembled(e)}
            className={`min-h-[100px] p-4 sm:p-6 rounded-2xl border-2 border-dashed transition-all flex flex-wrap gap-2.5 items-center content-center ${
              assembledWords.length === 0
                ? 'border-slate-800 bg-slate-950/40 justify-center'
                : validationState === 'correct'
                ? 'border-emerald-500/80 bg-emerald-950/20'
                : validationState === 'incorrect'
                ? 'border-rose-500/80 bg-rose-950/20'
                : 'border-amber-500/40 bg-slate-950/80'
            }`}
          >
            {assembledWords.length === 0 ? (
              <span className="text-xs text-slate-500 select-none">
                Ziehe Wortblöcke hierhin oder klicke auf die Bausteine unten, um den Satz zu formen...
              </span>
            ) : (
              assembledWords.map((word, idx) => (
                <div
                  key={`${word}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart('assembled', idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnAssembled(e, idx)}
                  onClick={() => handleWordClickAssembled(word, idx)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm select-none cursor-pointer transition-all transform active:scale-95 shadow-md flex items-center gap-1.5 border ${
                    validationState === 'correct'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : validationState === 'incorrect'
                      ? 'bg-rose-900/60 text-rose-200 border-rose-500'
                      : 'bg-amber-500/20 text-amber-200 hover:bg-rose-900/40 hover:text-rose-200 border-amber-500/50'
                  }`}
                  title="Klicken, um dieses Wort zu entfernen"
                >
                  <span>{word}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AVAILABLE WORD BANK */}
        <div
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDropOnAvailable(e)}
          className="space-y-2 pt-2"
        >
          <span className="text-xs font-bold text-slate-400 block">
            Verfügbare Wort-Bausteine:
          </span>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-wrap gap-2.5 items-center min-h-[70px]">
            {availableWords.length === 0 ? (
              <span className="text-xs text-slate-500 italic select-none">
                Alle Wörter wurden in das Baufeld platziert!
              </span>
            ) : (
              availableWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  draggable
                  onDragStart={() => handleDragStart('available', idx)}
                  onClick={() => handleWordClickAvailable(word, idx)}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-800 text-slate-200 hover:bg-amber-600 hover:text-slate-950 border border-slate-700/80 shadow-md transition-all transform active:scale-95 cursor-grab"
                  title="Ziehen oder klicken zum Platzieren"
                >
                  {word}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Validation Result Notifications */}
        {validationState === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 space-y-1 animate-in zoom-in-95">
            <div className="font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Exzellente deutsche Satzstellung! (+20 XP)</span>
            </div>
            <p className="text-xs text-slate-300">
              {currentItem.grammarHint}
            </p>
          </div>
        )}

        {validationState === 'incorrect' && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-2 animate-in zoom-in-95">
            <div className="font-bold text-sm flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Satzstellung noch fehlerhaft</span>
            </div>
            <div className="text-xs text-slate-300">
              Korrekte Reihenfolge: <strong className="text-white underline">{currentItem.germanCorrect}</strong>
            </div>
            <div className="text-xs text-rose-300 flex items-center justify-between gap-1.5 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Diese Grammatik-Aufgabe wurde im Mistake Vault zur Wiederholung abgelegt.</span>
              </span>
              <button
                type="button"
                onClick={onNavigateToVault}
                className="text-xs text-rose-300 hover:text-white underline font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Zum Vault</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Zurücksetzen</span>
          </button>

          <div className="flex items-center gap-2">
            {validationState !== 'correct' ? (
              <button
                type="button"
                disabled={assembledWords.length === 0}
                onClick={handleValidate}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-600/30"
              >
                Syntax Prüfen
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
              >
                <span>Nächster Satz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
