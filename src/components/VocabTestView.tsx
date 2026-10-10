import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Trophy,
  ArrowRight,
  Brain,
  Sparkles,
  Layers,
  Keyboard,
  Shuffle,
  ShieldAlert
} from 'lucide-react';
import type { Lesson, VocabularyItem, TestType, TestQuestion } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { srsService } from '../services/srsService';
import { mistakeVaultService } from '../services/mistakeVaultService';
import { GermanKeyboardHelper } from './GermanKeyboardHelper';

interface VocabTestViewProps {
  initialLesson?: Lesson | null;
  speechRate: number;
  onNavigateToSRS: () => void;
}

export const VocabTestView: React.FC<VocabTestViewProps> = ({
  initialLesson,
  speechRate,
  onNavigateToSRS
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialLesson?.id || CURRICULUM_DATA[0].id
  );
  const [selectedTestType, setSelectedTestType] = useState<TestType | 'mixed'>('multiple-choice');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedSpelling, setTypedSpelling] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [testSummary, setTestSummary] = useState<{
    total: number;
    correct: number;
    percentage: number;
    xpEarned: number;
    failedItems: VocabularyItem[];
  } | null>(null);

  // Matching game state
  const [matchingCards, setMatchingCards] = useState<{
    id: string;
    text: string;
    type: 'german' | 'english';
    vocabId: string;
    isMatched: boolean;
  }[]>([]);
  const [selectedMatchingCard, setSelectedMatchingCard] = useState<{
    id: string;
    type: 'german' | 'english';
    vocabId: string;
  } | null>(null);
  const [matchingPairsLeft, setMatchingPairsLeft] = useState<number>(0);

  const currentLesson = CURRICULUM_DATA.find(l => l.id === selectedLessonId) || CURRICULUM_DATA[0];

  useEffect(() => {
    if (initialLesson) {
      setSelectedLessonId(initialLesson.id);
    }
  }, [initialLesson]);

  // Generate Questions for the chosen lesson and test type
  const startTest = () => {
    soundEffects.playTap();
    const vocabPool = [...currentLesson.vocabulary];
    if (vocabPool.length === 0) return;

    const shuffledVocab = [...vocabPool].sort(() => 0.5 - Math.random());

    if (selectedTestType === 'matching') {
      const selectedSubset = shuffledVocab.slice(0, 6);
      const cards: {
        id: string;
        text: string;
        type: 'german' | 'english';
        vocabId: string;
        isMatched: boolean;
      }[] = [];

      selectedSubset.forEach((item, index) => {
        cards.push({
          id: `de-${index}`,
          text: item.german,
          type: 'german',
          vocabId: item.id,
          isMatched: false
        });
        cards.push({
          id: `en-${index}`,
          text: item.english,
          type: 'english',
          vocabId: item.id,
          isMatched: false
        });
      });

      setMatchingCards(cards.sort(() => 0.5 - Math.random()));
      setMatchingPairsLeft(selectedSubset.length);
      setIsTestActive(true);
      setTestSummary(null);
      setCurrentQuestionIndex(0);
      setScore(0);
      return;
    }

    // Generate QCM, Gender-Picker, or Spelling questions
    const generated: TestQuestion[] = shuffledVocab.map((item, index) => {
      let qType: TestType = 'multiple-choice';

      if (selectedTestType === 'gender-picker') {
        // If the item doesn't have an article, default to QCM
        qType = item.article ? 'gender-picker' : 'multiple-choice';
      } else if (selectedTestType === 'mixed') {
        if (item.article && index % 3 === 1) {
          qType = 'gender-picker';
        } else if (index % 3 === 2) {
          qType = 'spelling';
        } else {
          qType = 'multiple-choice';
        }
      } else {
        qType = selectedTestType;
      }

      if (qType === 'gender-picker' && item.article) {
        return {
          id: `q-${item.id}-${index}`,
          type: 'gender-picker',
          prompt: item.baseWord,
          subPrompt: `Bedeutung: ${item.english}${item.plural ? ` | Plural: ${item.plural}` : ''}`,
          targetVocab: item,
          options: ['der', 'die', 'das'],
          correctAnswer: item.article
        };
      }

      if (qType === 'multiple-choice') {
        const allOtherVocabs = CURRICULUM_DATA.flatMap(l => l.vocabulary).filter(v => v.id !== item.id);
        const distractors = allOtherVocabs
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(v => v.english);

        const options = [item.english, ...distractors].sort(() => 0.5 - Math.random());

        return {
          id: `q-${item.id}-${index}`,
          type: 'multiple-choice',
          prompt: item.german,
          subPrompt: item.gender && item.gender !== 'none' ? `Geschlecht: ${item.gender}` : undefined,
          targetVocab: item,
          options,
          correctAnswer: item.english
        };
      }

      // Spelling / Dictation question
      return {
        id: `q-${item.id}-${index}`,
        type: 'spelling',
        prompt: `Höre zu und schreibe das deutsche Wort für: „${item.english}“`,
        subPrompt: item.plural ? `Tipp (Plural): ${item.plural}` : undefined,
        targetVocab: item,
        correctAnswer: item.german
      };
    });

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTypedSpelling('');
    setIsAnswerSubmitted(false);
    setScore(0);
    setTestSummary(null);
    setIsTestActive(true);

    if (generated[0]?.type === 'spelling') {
      setTimeout(() => {
        speechService.speak(generated[0].targetVocab.german, { rate: speechRate });
      }, 300);
    }
  };

  const handleMultipleChoiceSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (isAnswerSubmitted) return;
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'multiple-choice' || currentQ.type === 'gender-picker') {
      if (!selectedAnswer) return;
      isCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    } else if (currentQ.type === 'spelling') {
      if (!typedSpelling.trim()) return;
      const cleanTyped = typedSpelling.trim().toLowerCase().replace(/[.,!?]/g, '');
      const cleanTarget = currentQ.correctAnswer.trim().toLowerCase().replace(/[.,!?]/g, '');
      isCorrect = cleanTyped === cleanTarget;
    }

    currentQ.isCorrect = isCorrect;
    currentQ.userAnswer = currentQ.type === 'spelling' ? typedSpelling : selectedAnswer || '';

    if (isCorrect) {
      soundEffects.playCorrect();
      setScore(prev => prev + 1);
      srsService.recordResult(currentQ.targetVocab.id, true, currentQ.targetVocab);
    } else {
      soundEffects.playIncorrect();
      srsService.queueFailedItem(currentQ.targetVocab);

      // Route mistake into the Mistake Vault
      if (currentQ.type === 'gender-picker') {
        mistakeVaultService.addMistake({
          type: 'gender',
          german: `${currentQ.correctAnswer} ${currentQ.targetVocab.baseWord}`,
          english: currentQ.targetVocab.english,
          level: currentQ.targetVocab.level,
          contextNote: `Artikel-Fehler: gewählt "${selectedAnswer}" anstelle von "${currentQ.correctAnswer}". Plural: ${currentQ.targetVocab.plural || 'k.A.'}`
        });
      } else {
        mistakeVaultService.addMistake({
          type: 'vocab',
          german: currentQ.targetVocab.german,
          english: currentQ.targetVocab.english,
          level: currentQ.targetVocab.level,
          contextNote: currentQ.type === 'multiple-choice'
            ? `QCM-Fehler: gewählt "${selectedAnswer}", richtig war "${currentQ.correctAnswer}".`
            : `Diktat-Fehler: geschrieben "${typedSpelling}", richtig war "${currentQ.correctAnswer}".`,
          phoneticTip: currentQ.targetVocab.pronunciationTip
        });
      }
    }

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    soundEffects.playTap();
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setTypedSpelling('');
      setIsAnswerSubmitted(false);

      if (questions[nextIndex]?.type === 'spelling') {
        setTimeout(() => {
          speechService.speak(questions[nextIndex].targetVocab.german, { rate: speechRate });
        }, 200);
      }
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    const total = questions.length;
    const correct = score + (questions[currentQuestionIndex]?.isCorrect ? 1 : 0);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const failedItems = questions.filter(q => !q.isCorrect).map(q => q.targetVocab);

    const xpEarned = 30 + Math.round((percentage / 100) * 20);
    srsService.recordTestCompleted(percentage);

    setTestSummary({
      total,
      correct,
      percentage,
      xpEarned,
      failedItems
    });
    setIsTestActive(false);

    if (percentage >= 70) {
      soundEffects.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  // Matching game handler
  const handleSelectMatchingCard = (card: {
    id: string;
    type: 'german' | 'english';
    vocabId: string;
  }) => {
    if (card.id === selectedMatchingCard?.id) {
      setSelectedMatchingCard(null);
      return;
    }

    soundEffects.playTap();

    if (!selectedMatchingCard) {
      setSelectedMatchingCard(card);
      if (card.type === 'german') {
        const found = matchingCards.find(c => c.id === card.id);
        if (found) speechService.speak(found.text, { rate: speechRate });
      }
      return;
    }

    if (selectedMatchingCard.type === card.type) {
      setSelectedMatchingCard(card);
      return;
    }

    if (selectedMatchingCard.vocabId === card.vocabId) {
      soundEffects.playCorrect();
      setMatchingCards(prev =>
        prev.map(c =>
          c.vocabId === card.vocabId ? { ...c, isMatched: true } : c
        )
      );
      setSelectedMatchingCard(null);
      const remaining = matchingPairsLeft - 1;
      setMatchingPairsLeft(remaining);
      setScore(prev => prev + 1);

      if (remaining === 0) {
        soundEffects.playVictory();
        srsService.recordTestCompleted(100);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        setTestSummary({
          total: 6,
          correct: 6,
          percentage: 100,
          xpEarned: 50,
          failedItems: []
        });
        setIsTestActive(false);
      }
    } else {
      soundEffects.playIncorrect();
      const failedVocab = currentLesson.vocabulary.find(v => v.id === card.vocabId);
      if (failedVocab) {
        srsService.queueFailedItem(failedVocab);
        mistakeVaultService.addMistake({
          type: 'vocab',
          german: failedVocab.german,
          english: failedVocab.english,
          level: failedVocab.level,
          contextNote: 'Fehlerhafte Zuordnung im Paare-Suchspiel.'
        });
      }
      setSelectedMatchingCard(null);
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Automatisierter Test-Generator
            </span>
            <span className="text-xs text-slate-400">Prüfen & Fehleranalyse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Vokabel- & Grammatik-Testlabor
          </h1>
        </div>

        {/* Test Type Selectors */}
        {!isTestActive && !testSummary && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setSelectedTestType('multiple-choice');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTestType === 'multiple-choice'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>QCM</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setSelectedTestType('gender-picker');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTestType === 'gender-picker'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>der / die / das</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setSelectedTestType('matching');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTestType === 'matching'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Paare</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setSelectedTestType('spelling');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTestType === 'spelling'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Diktat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setSelectedTestType('mixed');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTestType === 'mixed'
                  ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Mix</span>
            </button>
          </div>
        )}
      </div>

      {/* Configuration Screen */}
      {!isTestActive && !testSummary && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wähle die Lektion für den Test:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CURRICULUM_DATA.map(lesson => {
                const isSelected = lesson.id === selectedLessonId;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      soundEffects.playTap();
                      setSelectedLessonId(lesson.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                        {lesson.level}
                      </span>
                      <span className="text-slate-400">{lesson.vocabulary.length} Vokabeln</span>
                    </div>
                    <div className="mt-2 font-bold text-sm text-white">{lesson.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{lesson.theme}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30 flex items-start gap-3">
            <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Intelligente Leitner-Spaced-Repetition & Fehler-Tresor:</strong> Falsch beantwortete Vokabeln und verwechselte Artikel (der/die/das) werden sofort automatisch in den Mistake Vault und in Leitner Box 1 übertragen!
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={startTest}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-600/30 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <span>Test Starten ({currentLesson.title})</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* Active Matching Pairs Test Mode */}
      {isTestActive && selectedTestType === 'matching' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Paare-Suchspiel (Matching Game)
              </span>
              <h2 className="text-xl font-bold text-white">Verbinde die deutschen Wörter mit ihrer englischen Übersetzung</h2>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300">
              Verbleibende Paare: {matchingPairsLeft}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {matchingCards.map(card => {
              const isSelected = selectedMatchingCard?.id === card.id;
              if (card.isMatched) {
                return (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-center opacity-40 select-none text-xs sm:text-sm font-semibold"
                  >
                    <span>✓ {card.text}</span>
                  </div>
                );
              }

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectMatchingCard(card)}
                  className={`p-4 sm:p-5 rounded-2xl border text-center transition-all duration-150 transform active:scale-95 select-none font-bold text-xs sm:text-sm flex flex-col items-center justify-center min-h-[90px] ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400 font-black'
                      : card.type === 'german'
                      ? 'bg-slate-950/70 border-slate-800 text-white hover:border-amber-500/60'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/60'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                    {card.type === 'german' ? '🇩🇪 Deutsch' : '🇬🇧 Englisch'}
                  </span>
                  <span>{card.text}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <span>Klicke zuerst eine deutsche oder englische Karte an und wähle dann den Partner.</span>
            <button
              type="button"
              onClick={() => setIsTestActive(false)}
              className="text-rose-400 hover:text-rose-300"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Active QCM, Gender Picker, or Spelling Test Question */}
      {isTestActive && selectedTestType !== 'matching' && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Progress Bar & Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2 text-amber-400">
                <span>Frage {currentQuestionIndex + 1} von {questions.length}</span>
                <span>•</span>
                <span className="capitalize">
                  {currentQ.type === 'gender-picker'
                    ? 'Artikel-Trainer (der / die / das)'
                    : currentQ.type === 'multiple-choice'
                    ? 'Multiple-Choice (QCM)'
                    : 'Diktat & Rechtschreibung'}
                </span>
              </span>
              <span>Punkte: {score} / {questions.length}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  {currentQ.type === 'gender-picker'
                    ? 'Welcher Artikel gehört zu diesem Nomen?'
                    : currentQ.type === 'multiple-choice'
                    ? 'Was bedeutet dieser Begriff?'
                    : 'Höre zu und tippe das Wort auf Deutsch:'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {currentQ.prompt}
                </h3>
                {currentQ.subPrompt && (
                  <p className="text-xs text-amber-400 font-mono mt-1">{currentQ.subPrompt}</p>
                )}
              </div>

              {/* Native Voice Audio Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playTap();
                  speechService.speak(currentQ.targetVocab.german, { rate: speechRate });
                }}
                className="p-3.5 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600 hover:text-slate-950 transition-all shadow-md shrink-0"
                title="Aussprache anhören"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Question Body: Gender Picker (der / die / das) */}
          {currentQ.type === 'gender-picker' && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { article: 'der', label: 'der (Maskulinum)', color: 'border-sky-500/60 text-sky-300 bg-sky-950/30' },
                { article: 'die', label: 'die (Femininum)', color: 'border-rose-500/60 text-rose-300 bg-rose-950/30' },
                { article: 'das', label: 'das (Neutrum)', color: 'border-amber-500/60 text-amber-300 bg-amber-950/30' }
              ].map(({ article, label }) => {
                const isSelected = selectedAnswer === article;
                let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800';

                if (isAnswerSubmitted) {
                  if (article === currentQ.correctAnswer) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500 font-black';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                  } else {
                    btnStyle = 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-40';
                  }
                } else if (isSelected) {
                  btnStyle = article === 'der'
                    ? 'bg-sky-600 text-white border-sky-400 font-black ring-2 ring-sky-400'
                    : article === 'die'
                    ? 'bg-rose-600 text-white border-rose-400 font-black ring-2 ring-rose-400'
                    : 'bg-amber-500 text-slate-950 border-amber-400 font-black ring-2 ring-amber-400';
                }

                return (
                  <button
                    key={article}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleMultipleChoiceSelect(article)}
                    className={`p-5 rounded-2xl border text-center transition-all duration-150 flex flex-col items-center justify-center ${btnStyle}`}
                  >
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{article}</span>
                    <span className="text-[11px] font-semibold mt-1 opacity-80">{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Body: Multiple Choice Options */}
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (option === currentQ.correctAnswer) {
                    optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40 font-bold';
                  } else if (isSelected && option !== currentQ.correctAnswer) {
                    optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 ring-1 ring-rose-500/40';
                  } else {
                    optionStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-50';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-amber-500/30 border-amber-500 text-white ring-1 ring-amber-500/50 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleMultipleChoiceSelect(option)}
                    className={`p-4 rounded-2xl border text-left text-sm transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && option === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && option !== currentQ.correctAnswer && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Body: Spelling / Dictation Input */}
          {currentQ.type === 'spelling' && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={typedSpelling}
                  disabled={isAnswerSubmitted}
                  onChange={(e) => setTypedSpelling(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!isAnswerSubmitted) {
                        handleSubmitAnswer();
                      } else {
                        handleNextQuestion();
                      }
                    }
                  }}
                  placeholder="Tippe das deutsche Wort (Groß-/Kleinschreibung tolerant)..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
              </div>

              {/* German Keyboard Helper */}
              {!isAnswerSubmitted && (
                <GermanKeyboardHelper
                  onInsertChar={(char) => setTypedSpelling(prev => prev + char)}
                />
              )}

              {/* Instant feedback on answer */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-2xl border text-sm ${
                  currentQ.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-2">
                    {currentQ.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{currentQ.isCorrect ? 'Perfekte Rechtschreibung!' : 'Falsch geschrieben'}</span>
                  </div>
                  {!currentQ.isCorrect && (
                    <div className="mt-1 text-xs">
                      Richtige Schreibweise: <strong className="text-white underline">{currentQ.correctAnswer}</strong> (Eingegeben: "{typedSpelling}")
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsTestActive(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Test Beenden
            </button>

            {!isAnswerSubmitted ? (
              <button
                type="button"
                disabled={currentQ.type === 'spelling' ? !typedSpelling.trim() : !selectedAnswer}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-600/30"
              >
                Prüfen
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
              >
                <span>{currentQuestionIndex + 1 < questions.length ? 'Nächste Frage' : 'Ergebnisse Anzeigen'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Test Summary Modal / Screen */}
      {testSummary && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Test Abgeschlossen!
            </h2>
            <p className="text-sm text-slate-300">
              {testSummary.percentage >= 80
                ? 'Hervorragende Leistung! Du beherrschst dieses Vokabular und die Grammatik souverän.'
                : testSummary.percentage >= 50
                ? 'Guter Einsatz! Einige Wörter und Artikel benötigen noch gezielte Wiederholung.'
                : 'Weiter üben! Alle nicht gewussten Vokabeln wurden zur Festigung in deinen Mistake Vault verschoben.'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{testSummary.percentage}%</div>
              <div className="text-[11px] text-slate-400 font-medium">Genauigkeit</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-amber-400">+{testSummary.xpEarned}</div>
              <div className="text-[11px] text-slate-400 font-medium">XP Gewonnen</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{testSummary.correct}/{testSummary.total}</div>
              <div className="text-[11px] text-slate-400 font-medium">Richtig</div>
            </div>
          </div>

          {/* Failed Items Notification & Leitner Loopback */}
          {testSummary.failedItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Brain className="w-4 h-4" />
                <span>Im Spaced-Repetition-System gespeichert: {testSummary.failedItems.length} Element(e)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {testSummary.failedItems.map(item => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-300"
                  >
                    {item.german} ({item.english})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setTestSummary(null);
                startTest();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Test Wiederholen
            </button>

            <button
              type="button"
              onClick={onNavigateToSRS}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all"
            >
              <span>Zum Leitner SRS Deck</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
