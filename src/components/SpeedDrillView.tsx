import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Zap,
  Timer,
  Trophy,
  Flame,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw
} from 'lucide-react';
import type { VocabularyItem, CEFRLevel } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { srsService } from '../services/srsService';
import { mistakeVaultService } from '../services/mistakeVaultService';

interface SpeedDrillViewProps {
  speechRate: number;
  onNavigateToVault: () => void;
}

interface DrillQuestion {
  vocab: VocabularyItem;
  promptText: string;
  isGenderQuestion: boolean;
  options: string[];
  correctAnswer: string;
}

export const SpeedDrillView: React.FC<SpeedDrillViewProps> = ({
  speechRate,
  onNavigateToVault
}) => {
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'ALL'>('ALL');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredState, setAnsweredState] = useState<'correct' | 'incorrect' | null>(null);
  const [failedVocabs, setFailedVocabs] = useState<VocabularyItem[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gutenapp_speed_drill_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const getVocabPool = (): VocabularyItem[] => {
    const all = CURRICULUM_DATA.flatMap(l => l.vocabulary);
    if (levelFilter === 'ALL') return all;
    return all.filter(v => v.level === levelFilter);
  };

  const generateQuestion = (pool: VocabularyItem[]): DrillQuestion => {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const target = pool[randomIndex];

    // 40% chance of an article gender question if the target is a noun with an article
    const isGender = Boolean(target.article && Math.random() < 0.4);

    if (isGender && target.article) {
      return {
        vocab: target,
        promptText: `Welcher Artikel gehört zu: „${target.baseWord}“?`,
        isGenderQuestion: true,
        options: ['der', 'die', 'das'],
        correctAnswer: target.article
      };
    }

    // Otherwise translation question
    const otherVocabs = pool.filter(v => v.id !== target.id);
    const shuffledOthers = [...otherVocabs].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map(v => v.english);
    const options = [target.english, ...distractors].sort(() => 0.5 - Math.random());

    return {
      vocab: target,
      promptText: target.german,
      isGenderQuestion: false,
      options,
      correctAnswer: target.english
    };
  };

  const startDrill = () => {
    soundEffects.playTap();
    const pool = getVocabPool();
    if (pool.length < 4) return;

    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setFailedVocabs([]);
    setIsGameOver(false);
    setSelectedAnswer(null);
    setAnsweredState(null);

    const firstQ = generateQuestion(pool);
    setCurrentQuestion(firstQ);
    setIsPlaying(true);

    speechService.speak(firstQ.vocab.german, { rate: speechRate });
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      finishDrill();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const finishDrill = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    soundEffects.playVictory();

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('gutenapp_speed_drill_highscore', String(score));
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }

    if (maxCombo >= 8) {
      srsService.unlockBadge('speed_drill_ace');
    }

    const earnedXP = Math.round(score * 2.5);
    if (earnedXP > 0) {
      srsService.addXP(earnedXP);
    }
  };

  const handleSelectOption = (option: string) => {
    if (!currentQuestion || answeredState !== null) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      soundEffects.playCorrect();
      setAnsweredState('correct');
      const newScore = score + (10 * Math.max(1, Math.min(combo + 1, 4)));
      setScore(newScore);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
    } else {
      soundEffects.playIncorrect();
      setAnsweredState('incorrect');
      setCombo(0);
      setFailedVocabs(prev => [...prev, currentQuestion.vocab]);

      if (currentQuestion.isGenderQuestion) {
        mistakeVaultService.addMistake({
          type: 'gender',
          german: `${currentQuestion.correctAnswer} ${currentQuestion.vocab.baseWord}`,
          english: currentQuestion.vocab.english,
          level: currentQuestion.vocab.level,
          contextNote: `Speed Drill Fehler: gewählt "${option}" anstelle von "${currentQuestion.correctAnswer}".`
        });
      } else {
        mistakeVaultService.addMistake({
          type: 'vocab',
          german: currentQuestion.vocab.german,
          english: currentQuestion.vocab.english,
          level: currentQuestion.vocab.level,
          contextNote: `Speed Drill Fehler: gewählt "${option}" anstelle von "${currentQuestion.correctAnswer}".`
        });
      }
      srsService.queueFailedItem(currentQuestion.vocab);
    }

    setTimeout(() => {
      if (timeLeft > 0 && isPlaying) {
        const pool = getVocabPool();
        const nextQ = generateQuestion(pool);
        setCurrentQuestion(nextQ);
        setSelectedAnswer(null);
        setAnsweredState(null);
        speechService.speak(nextQ.vocab.german, { rate: speechRate });
      }
    }, 220);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Mini-Spiel : 30-Sekunden Blitz-Drill
              </span>
              <span className="text-xs text-slate-400">Reaktionsschnelligkeit & Vokabel-Reflexe</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Speed Drill Deutsch
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              30 Sekunden gegen die Uhr! Ordne rasch Bedeutungen zu und errate die korrekten Nomen-Artikel (der/die/das). Combos vervielfachen deine XP.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-end gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Rekord
              </div>
              <div className="text-lg font-black text-amber-400">{highScore} Pkt</div>
            </div>
          </div>
        </div>
      </div>

      {/* Start / Configuration Screen */}
      {!isPlaying && !isGameOver && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Timer className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bereit für den 30-Sekunden-Sprint?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Wähle dein Sprachniveau und knacke deinen Highscore!
            </p>
          </div>

          {/* Level Filter Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  soundEffects.playTap();
                  setLevelFilter(lvl);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  levelFilter === lvl
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'Alle Niveaus' : lvl}
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={startDrill}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 text-base font-black shadow-xl shadow-orange-500/25 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Blitz-Drill Starten (30s)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Game Screen */}
      {isPlaying && currentQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Top Bar: Timer, Score, Combo */}
          <div className="flex items-center justify-between">
            {/* Live Timer */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-black border ${
                timeLeft <= 5
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-slate-950 text-amber-400 border-slate-800'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Combo Meter */}
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
              {combo > 1 && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 animate-bounce">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  Combo x{Math.min(combo, 4)}!
                </span>
              )}
            </div>

            {/* Live Score */}
            <div className="text-right">
              <span className="text-xs uppercase font-bold text-slate-400">Punkte</span>
              <div className="text-2xl font-black text-white">{score} Pkt</div>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Flashcard Word Showcase */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold">
              <span>Niveau {currentQuestion.vocab.level}</span>
              <span>•</span>
              <span>{currentQuestion.isGenderQuestion ? 'Artikel-Frage' : currentQuestion.vocab.category}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {currentQuestion.promptText}
              </h2>
              <button
                type="button"
                onClick={() => speechService.speak(currentQuestion.vocab.german, { rate: speechRate })}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Anhören"
              >
                <Volume2 className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {currentQuestion.vocab.plural && currentQuestion.isGenderQuestion && (
              <p className="text-xs font-mono text-slate-400">
                Plural: {currentQuestion.vocab.plural}
              </p>
            )}
          </div>

          {/* Options */}
          <div className={`grid gap-3 ${currentQuestion.isGenderQuestion ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              let btnClass = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

              if (answeredState !== null) {
                if (option === currentQuestion.correctAnswer) {
                  btnClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold scale-[1.01]';
                } else if (isSelected) {
                  btnClass = 'bg-rose-950/70 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answeredState !== null}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 sm:p-5 rounded-2xl border text-sm sm:text-base font-bold transition-all duration-100 flex items-center justify-center ${btnClass}`}
                >
                  <span className={currentQuestion.isGenderQuestion ? 'text-2xl uppercase' : ''}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Summary */}
      {isGameOver && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Zeit Abgelaufen!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {score >= 200
                ? 'Spektakuläre Leistung! Deine deutschen Reflexe sind auf Muttersprachler-Niveau.'
                : score >= 100
                ? 'Klasse Rhythmus! Dein Sprachgedächtnis reagiert blitzschnell.'
                : 'Gutes Training! Starte eine weitere Runde, um deine Reaktionszeit zu steigern.'}
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div>
              <div className="text-2xl font-black text-amber-400">{score}</div>
              <div className="text-[11px] text-slate-400 font-medium">Endpunkte</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-2xl font-black text-indigo-400">+{Math.round(score * 2.5)}</div>
              <div className="text-[11px] text-slate-400 font-medium">XP Erhalten</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">{maxCombo}</div>
              <div className="text-[11px] text-slate-400 font-medium">Max Combo</div>
            </div>
          </div>

          {/* Failed Items Banner */}
          {failedVocabs.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  {failedVocabs.length} Begriff(e) im Mistake Vault gespeichert
                </span>
                <button
                  type="button"
                  onClick={onNavigateToVault}
                  className="text-xs text-rose-300 hover:text-white underline font-semibold flex items-center gap-1"
                >
                  <span>Zum Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {failedVocabs.map((v, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-300"
                  >
                    {v.german} ({v.english})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={startDrill}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-colors shadow-md shadow-amber-600/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Erneut Spielen (30s)</span>
            </button>

            {failedVocabs.length > 0 && (
              <button
                type="button"
                onClick={onNavigateToVault}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Im Mistake Vault üben</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
