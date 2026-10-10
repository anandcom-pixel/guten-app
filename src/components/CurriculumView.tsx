import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  MessageSquare,
  CheckCircle,
  CheckCircle2,
  Mic,
  ArrowRight,
  Info,
  Lightbulb,
  Play,
  Square,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import type { Lesson, CEFRLevel, VocabularyItem } from '../types';
import { CURRICULUM_DATA, CEFR_METADATA } from '../data/curriculumData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { srsService } from '../services/srsService';

const CASE_EXPLANATIONS: Record<string, { question: string; role: string; articles: string }> = {
  Nominativ: {
    question: 'Wer oder was?',
    role: 'Grundform & Subjekt des Satzes (die handelnde Person oder Sache).',
    articles: 'der (mask.) • die (fem.) • das (neut.) • die (Plural)'
  },
  Akkusativ: {
    question: 'Wen oder was?',
    role: 'Direktes Objekt & Richtung (wohin?). Wichtig: Nur maskulin „der“ wird zu „den“!',
    articles: 'den (mask.) • die (fem.) • das (neut.) • die (Plural)'
  },
  Dativ: {
    question: 'Wem oder wo?',
    role: 'Indirektes Objekt (Empfänger) oder feste Ortsangabe (mit in, an, auf, bei, mit, nach, zu).',
    articles: 'dem (mask.) • der (fem.) • dem (neut.) • den + -n (Plural)'
  },
  Genitiv: {
    question: 'Wessen?',
    role: 'Zeigt Besitz oder Zugehörigkeit an (sowie nach Präpositionen wie trotz, während, wegen).',
    articles: 'des + -s/-es (mask./neut.) • der (fem./Plural)'
  }
};

interface CurriculumViewProps {
  speechRate: number;
  onStartTest: (lesson: Lesson) => void;
  onStartVoicePractice: (vocab: VocabularyItem) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  speechRate,
  onStartTest,
  onStartVoicePractice
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [activeLessonId, setActiveLessonId] = useState<string>(
    CURRICULUM_DATA.find(l => l.level === 'A1')?.id || CURRICULUM_DATA[0].id
  );
  const [currentlyPlayingWord, setCurrentlyPlayingWord] = useState<string | null>(null);
  const [isPlayingDialogue, setIsPlayingDialogue] = useState<boolean>(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number>(-1);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    srsService.getCompletedLessonIds()
  );
  const [showQuickGrammarTips, setShowQuickGrammarTips] = useState<boolean>(false);
  const [showCaseTooltip, setShowCaseTooltip] = useState<boolean>(false);

  useEffect(() => {
    const unsub = srsService.subscribe(() => {
      setCompletedLessonIds(srsService.getCompletedLessonIds());
    });
    return () => unsub();
  }, []);

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const lessonsForLevel = CURRICULUM_DATA.filter(l => l.level === selectedLevel);
  const currentLesson = CURRICULUM_DATA.find(l => l.id === activeLessonId) || lessonsForLevel[0];

  const completedInLevelCount = lessonsForLevel.filter(l => completedLessonIds.includes(l.id)).length;
  const levelProgressPct = lessonsForLevel.length > 0
    ? Math.round((completedInLevelCount / lessonsForLevel.length) * 100)
    : 0;
  const totalCompletedCount = CURRICULUM_DATA.filter(l => completedLessonIds.includes(l.id)).length;
  const totalLessonsCount = CURRICULUM_DATA.length;

  const handleToggleComplete = (lessonId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nowCompleted = srsService.toggleLessonCompleted(lessonId);
    if (nowCompleted) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playTap();
    }
    setCompletedLessonIds(srsService.getCompletedLessonIds());
  };

  const handleLevelChange = (lvl: CEFRLevel) => {
    setSelectedLevel(lvl);
    setShowCaseTooltip(false);
    soundEffects.playTap();
    const firstLesson = CURRICULUM_DATA.find(l => l.level === lvl);
    if (firstLesson) {
      setActiveLessonId(firstLesson.id);
    }
  };

  const handlePlayAudio = (text: string, id: string) => {
    soundEffects.playTap();
    setCurrentlyPlayingWord(id);
    speechService.speak(text, {
      rate: speechRate,
      onEnd: () => setCurrentlyPlayingWord(null)
    });
  };

  // Play full dialogue turn by turn
  const handlePlayDialogue = async () => {
    if (!currentLesson?.dialogue) return;
    if (isPlayingDialogue) {
      speechService.stop();
      setIsPlayingDialogue(false);
      setActiveDialogueIndex(-1);
      return;
    }

    setIsPlayingDialogue(true);
    const lines = currentLesson.dialogue.lines;

    for (let i = 0; i < lines.length; i++) {
      setActiveDialogueIndex(i);
      await speechService.speak(lines[i].german, { rate: speechRate });
      await new Promise(r => setTimeout(r, 600));
    }

    setIsPlayingDialogue(false);
    setActiveDialogueIndex(-1);
  };

  const renderGenderBadge = (gender?: string) => {
    if (!gender || gender === 'none') return null;
    if (gender === 'der') {
      return (
        <span
          title="Maskulinum (der): Typisch bei Endungen -er, -en, -ig, -ling, -ismus sowie Tagen & Monaten"
          className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 cursor-help flex items-center gap-1"
        >
          <span>der (mask.)</span>
          <Info className="w-2.5 h-2.5 opacity-70" />
        </span>
      );
    }
    if (gender === 'die') {
      return (
        <span
          title="Femininum (die): Typisch bei Endungen -ung, -heit, -keit, -schaft, -tät, -ion, -e"
          className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-help flex items-center gap-1"
        >
          <span>die (fem.)</span>
          <Info className="w-2.5 h-2.5 opacity-70" />
        </span>
      );
    }
    if (gender === 'das') {
      return (
        <span
          title="Neutrum (das): Typisch bei Endungen -chen, -lein, -um, -ment sowie substantivierten Verben"
          className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-help flex items-center gap-1"
        >
          <span>das (neut.)</span>
          <Info className="w-2.5 h-2.5 opacity-70" />
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
        {gender}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemeinsamer Europäischer Referenzrahmen (CEFR)
              </span>
              <span className="text-xs text-slate-400 font-medium">A1 → C1 Autonom</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {totalCompletedCount}/{totalLessonsCount} Module erledigt
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Deutsches Curriculum & Interaktive Lektionen
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Lerne authentisches Deutsch, grammatische Artikel (der/die/das), vier Fälle (Kasus) und syntaktische Satzklammern. Jeder Satz verfügt über native Sprachausgabe per Web Speech API.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onStartTest(currentLesson)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4 text-slate-950" />
              <span>Lektion Prüfen</span>
            </button>
          </div>
        </div>
      </div>

      {/* CEFR Modular Level Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sprachniveau / Proficiency Level
          </span>
          <span className="text-xs text-amber-400 font-semibold">
            {CEFR_METADATA[selectedLevel]?.name}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {levels.map(lvl => {
            const isSelected = selectedLevel === lvl;
            const meta = CEFR_METADATA[lvl];
            const lvlLessons = CURRICULUM_DATA.filter(l => l.level === lvl);
            const lvlCompleted = lvlLessons.filter(l => completedLessonIds.includes(l.id)).length;
            const isLvlAllDone = lvlLessons.length > 0 && lvlCompleted === lvlLessons.length;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleLevelChange(lvl)}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-base font-black flex items-center gap-1.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    <span>{lvl}</span>
                    {isLvlAllDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}>
                    {lvl === 'A1' ? 'Anfänger' : lvl === 'A2' ? 'Grundstufe' : lvl === 'B1' ? 'Mittelstufe' : lvl === 'B2' ? 'Fortgeschritten' : 'Oberstufe'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span className="line-clamp-1">{meta.subtitle}</span>
                  <span className={`text-[10px] font-bold shrink-0 ml-1 ${lvlCompleted > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {lvlCompleted}/{lvlLessons.length} ✓
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Lessons Navigation & Current Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Lesson Selection Cards & Visual Progress Tracker */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Lektionen ({selectedLevel})
            </h2>
            <span className="text-xs font-bold text-emerald-400">
              {completedInLevelCount} / {lessonsForLevel.length} erledigt ({levelProgressPct}%)
            </span>
          </div>

          {/* Visual Level Progress Bar */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Lernfortschritt Stufe {selectedLevel}</span>
              <span className="text-emerald-400 font-bold">{levelProgressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {lessonsForLevel.map((lesson, idx) => {
              const isSelected = lesson.id === activeLessonId;
              const isCompleted = completedLessonIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    soundEffects.playTap();
                    setActiveLessonId(lesson.id);
                    setShowCaseTooltip(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70 shadow-md ring-1 ring-amber-500/40'
                      : isCompleted
                      ? 'bg-slate-900/70 border-emerald-500/40 hover:bg-slate-900 hover:border-emerald-500/60'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300">
                        Modul {idx + 1}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Erledigt
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {lesson.vocabulary.length} Vokabeln
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleToggleComplete(lesson.id, e)}
                        title={isCompleted ? 'Als unerledigt markieren' : 'Modul als abgeschlossen markieren (+25 XP)'}
                        className={`p-1 rounded-lg border transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-emerald-300 hover:border-emerald-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className={`mt-2 font-bold text-sm sm:text-base leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Level Summary Box */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Didaktisches Ziel {selectedLevel}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {CEFR_METADATA[selectedLevel]?.subtitle}. Trainiere das Vokabular mit den Farbcodes für Nomen-Artikel (der = blau, die = rot, das = gelb) und teste dein Wissen im Test-Labor.
            </p>
          </div>
        </div>

        {/* Right Side: Active Lesson Comprehensive Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentLesson.level} • {currentLesson.theme}
                </span>
                <span className="text-xs text-slate-400">
                  {currentLesson.subtitle}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(currentLesson.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${completedLessonIds.includes(currentLesson.id) ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>
                    {completedLessonIds.includes(currentLesson.id) ? 'Lektion erledigt ✓' : 'Als erledigt markieren'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onStartTest(currentLesson)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Test Starten</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentLesson.title}
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                {currentLesson.description}
              </p>
            </div>

            {/* Grammar Spotlight */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider flex-wrap">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span>Grammatik-Fokus: {currentLesson.grammarFocus.ruleName}</span>
                  {currentLesson.grammarFocus.caseFocus && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playTap();
                        setShowCaseTooltip(!showCaseTooltip);
                      }}
                      title="Klicken für Kasus-Erklärung"
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 flex items-center gap-1 transition-colors normal-case"
                    >
                      <span>Kasus: {currentLesson.grammarFocus.caseFocus}</span>
                      <HelpCircle className="w-3 h-3 text-indigo-300" />
                    </button>
                  )}
                </div>

                {/* Toggle Quick Grammar Cheat Sheet */}
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playTap();
                    setShowQuickGrammarTips(!showQuickGrammarTips);
                  }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showQuickGrammarTips ? 'Kurz-Tipps ausblenden' : 'Grammatik-Spickzettel'}</span>
                  {showQuickGrammarTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Collapsible Case Info Tooltip Box */}
              {showCaseTooltip && currentLesson.grammarFocus.caseFocus && CASE_EXPLANATIONS[currentLesson.grammarFocus.caseFocus] && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-indigo-200 font-bold">
                    <span>🔍 Kasus-Hilfe: {currentLesson.grammarFocus.caseFocus} ({CASE_EXPLANATIONS[currentLesson.grammarFocus.caseFocus].question})</span>
                    <button
                      type="button"
                      onClick={() => setShowCaseTooltip(false)}
                      className="text-indigo-400 hover:text-white text-[11px]"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-300">{CASE_EXPLANATIONS[currentLesson.grammarFocus.caseFocus].role}</p>
                  <div className="text-[11px] font-mono text-amber-300 pt-0.5">
                    Artikel: {CASE_EXPLANATIONS[currentLesson.grammarFocus.caseFocus].articles}
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentLesson.grammarFocus.explanation}
              </p>

              {/* Collapsible Beginner Grammar Cheat Sheet (Articles, Cases & Word Order) */}
              {showQuickGrammarTips && (
                <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Schnellhilfe für Einsteiger: Artikel, Fälle & Wortstellung
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQuickGrammarTips(false)}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Schließen ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-bold text-sky-300">1. Artikel-Endungen (der/die/das)</div>
                      <p className="text-slate-300"><strong className="text-sky-400">der:</strong> -er, -en, -ig, -ling, Tage/Monate</p>
                      <p className="text-slate-300"><strong className="text-rose-400">die:</strong> -ung, -heit, -keit, -schaft, -ion, -e</p>
                      <p className="text-slate-300"><strong className="text-amber-400">das:</strong> -chen, -lein, -um, -ment, Infinitive</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-bold text-indigo-300">2. Die 4 Fälle (Kasus-Kompass)</div>
                      <p className="text-slate-300"><strong>Nom (Wer?):</strong> der / die / das</p>
                      <p className="text-slate-300"><strong>Akk (Wen?):</strong> <span className="text-amber-300 font-bold">den</span> / die / das</p>
                      <p className="text-slate-300"><strong>Dat (Wem?):</strong> <span className="text-amber-300 font-bold">dem / der / dem</span></p>
                      <p className="text-slate-300"><strong>Gen (Wessen?):</strong> des / der / des</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-bold text-emerald-300">3. Satzbau (V2 & Nebensatz)</div>
                      <p className="text-slate-300"><strong>Hauptsatz (V2):</strong> Verb steht immer an <strong>Position 2</strong> (<em>Heute <u>gehe</u> ich...</em>).</p>
                      <p className="text-slate-300"><strong>Nebensatz:</strong> Nach <em>weil, dass, wenn</em> steht das Verb am <strong>Ende</strong>.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentLesson.grammarFocus.examples.map((ex, i) => {
                  const isExPlaying = currentlyPlayingWord === `ex-${i}`;
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                        isExPlaying
                          ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500/40'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-amber-200 font-semibold gap-2">
                        <span>{ex.de}</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(ex.de, `ex-${i}`)}
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all shrink-0 ${
                            isExPlaying
                              ? 'bg-amber-500 text-slate-950 font-bold animate-pulse shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                          title="Anhören"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isExPlaying ? 'animate-bounce' : ''}`} />
                          {isExPlaying && <span className="text-[10px]">Spielt...</span>}
                        </button>
                      </div>
                      <div className="text-slate-400 text-[11px]">{ex.en}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cultural & Idiom Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentLesson.culturalNote && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🏰</span> Landeskunde & Kultur
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentLesson.culturalNote}
                  </p>
                </div>
              )}

              {currentLesson.idiomSpotlight && (
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 text-xs space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <span>💡</span> Deutsche Redewendung
                  </div>
                  <div className="font-semibold text-white">„{currentLesson.idiomSpotlight.german}“</div>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Bedeutung:</span> {currentLesson.idiomSpotlight.meaning}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Vocabulary Bank */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📖</span> Kernvokabular ({currentLesson.vocabulary.length} Einträge)
              </h3>
              <span className="text-xs text-slate-400">
                Klicke auf <Volume2 className="inline w-3 h-3 text-amber-400" /> für Audio • Hover über Artikel für Tipps
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentLesson.vocabulary.map((vocab) => {
                const isPlaying = currentlyPlayingWord === vocab.id;
                const isSentencePlaying = currentlyPlayingWord === `ex-${vocab.id}`;
                return (
                  <div
                    key={vocab.id}
                    className={`p-4 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between group space-y-3 ${
                      isPlaying || isSentencePlaying
                        ? 'border-amber-500/70 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Row: Word & Listen Button */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                              {vocab.german}
                            </h4>
                            {renderGenderBadge(vocab.gender)}
                            {vocab.plural && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Pl: {vocab.plural}
                              </span>
                            )}
                          </div>
                          {vocab.caseHint && (
                            <span className="text-[10px] text-indigo-400 font-medium block mt-0.5">
                              {vocab.caseHint}
                            </span>
                          )}
                        </div>

                        {/* Speaker Button with Active Playback Feedback */}
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(vocab.german, vocab.id)}
                          className={`px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
                            isPlaying
                              ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-md shadow-amber-500/30 font-bold animate-pulse ring-2 ring-amber-400/50'
                              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-amber-600/20 border-slate-700/60'
                          }`}
                          title="Deutsche Aussprache anhören"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                          {isPlaying && <span className="text-[10px] font-black">Spielt...</span>}
                        </button>
                      </div>

                      <div className="mt-2 text-xs font-medium text-slate-300">
                        {vocab.english}
                      </div>

                      {/* Example sentence */}
                      <div
                        className={`mt-3 p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                          isSentencePlaying
                            ? 'bg-amber-950/40 border-amber-500/60'
                            : 'bg-slate-950/60 border-slate-800/70'
                        }`}
                      >
                        <div className="text-amber-200 flex items-center justify-between gap-2">
                          <span>{vocab.exampleGerman}</span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(vocab.exampleGerman, `ex-${vocab.id}`)}
                            className={`px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0 transition-all ${
                              isSentencePlaying
                                ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Beispielsatz anhören"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isSentencePlaying ? 'animate-bounce' : ''}`} />
                            {isSentencePlaying && <span className="text-[10px]">Spielt...</span>}
                          </button>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {vocab.exampleEnglish}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Practice in Voice Studio */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      {vocab.pronunciationTip ? (
                        <span className="text-[10px] text-amber-300/80 line-clamp-1 flex items-center gap-1" title={vocab.pronunciationTip}>
                          <span>💡</span> {vocab.pronunciationTip}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">{vocab.category}</span>
                      )}

                      <button
                        type="button"
                        onClick={() => onStartVoicePractice(vocab)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Sprechen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Dialogue Section */}
          {currentLesson.dialogue && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300">
                      Praxis-Dialog
                    </span>
                    <span className="text-xs text-slate-400">{currentLesson.dialogue.scenario}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    {currentLesson.dialogue.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handlePlayDialogue}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isPlayingDialogue
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-600/30'
                  }`}
                >
                  {isPlayingDialogue ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>Dialog läuft... (Stopp)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Gesamten Dialog Anhören</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dialogue Transcript Turns */}
              <div className="space-y-3 pt-2">
                {currentLesson.dialogue.lines.map((line, idx) => {
                  const isActive = activeDialogueIndex === idx || currentlyPlayingWord === `dlg-${idx}`;
                  const isFirstSpeaker = idx % 2 === 0;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                          : isFirstSpeaker
                          ? 'bg-slate-950/60 border-slate-800/80'
                          : 'bg-slate-900/80 border-slate-800/80 ml-4 sm:ml-8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className={`text-xs font-bold ${isFirstSpeaker ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {line.speaker}
                          </span>
                          <p className="text-sm font-semibold text-white">
                            {line.german}
                          </p>
                          <p className="text-xs text-slate-400">
                            {line.english}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePlayAudio(line.german, `dlg-${idx}`)}
                          className={`px-2.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-bold animate-pulse shadow-sm'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-600 hover:text-slate-950'
                          }`}
                          title="Diese Replik anhören"
                        >
                          <Volume2 className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                          {isActive && <span className="text-[10px]">Spielt...</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
