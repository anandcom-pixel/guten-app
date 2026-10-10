import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  MessageSquare,
  CheckCircle,
  Mic,
  ArrowRight,
  Info,
  Lightbulb,
  Play,
  Square
} from 'lucide-react';
import type { Lesson, CEFRLevel, VocabularyItem } from '../types';
import { CURRICULUM_DATA, CEFR_METADATA } from '../data/curriculumData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

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

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const lessonsForLevel = CURRICULUM_DATA.filter(l => l.level === selectedLevel);
  const currentLesson = CURRICULUM_DATA.find(l => l.id === activeLessonId) || lessonsForLevel[0];

  const handleLevelChange = (lvl: CEFRLevel) => {
    setSelectedLevel(lvl);
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
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
          der (mask.)
        </span>
      );
    }
    if (gender === 'die') {
      return (
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
          die (fem.)
        </span>
      );
    }
    if (gender === 'das') {
      return (
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          das (neut.)
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
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemeinsamer Europäischer Referenzrahmen (CEFR)
              </span>
              <span className="text-xs text-slate-400 font-medium">A1 → C1 Autonom</span>
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
                  <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {lvl}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}>
                    {lvl === 'A1' ? 'Anfänger' : lvl === 'A2' ? 'Grundstufe' : lvl === 'B1' ? 'Mittelstufe' : lvl === 'B2' ? 'Fortgeschritten' : 'Oberstufe'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {meta.subtitle}
                </p>
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
        {/* Left Side: Lesson Selection Cards */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Lektionen ({selectedLevel})
          </h2>

          <div className="space-y-2.5">
            {lessonsForLevel.map((lesson, idx) => {
              const isSelected = lesson.id === activeLessonId;
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    soundEffects.playTap();
                    setActiveLessonId(lesson.id);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300">
                      Modul {idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {lesson.vocabulary.length} Vokabeln
                    </span>
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
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentLesson.level} • {currentLesson.theme}
                </span>
                <span className="text-xs text-slate-400">
                  {currentLesson.subtitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onStartTest(currentLesson)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Test Starten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Grammatik-Fokus: {currentLesson.grammarFocus.ruleName}</span>
                {currentLesson.grammarFocus.caseFocus && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/30">
                    Kasus: {currentLesson.grammarFocus.caseFocus}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentLesson.grammarFocus.explanation}
              </p>
              <div className="pt-2 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentLesson.grammarFocus.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-200 font-semibold">
                      <span>{ex.de}</span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(ex.de, `ex-${i}`)}
                        className="text-slate-400 hover:text-white p-1 rounded-md"
                        title="Anhören"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-slate-400 text-[11px]">{ex.en}</div>
                  </div>
                ))}
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
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📖</span> Kernvokabular ({currentLesson.vocabulary.length} Einträge)
              </h3>
              <span className="text-xs text-slate-400">
                Klicke auf <Volume2 className="inline w-3 h-3 text-amber-400" /> für muttersprachliches Audio
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentLesson.vocabulary.map((vocab) => {
                const isPlaying = currentlyPlayingWord === vocab.id;
                return (
                  <div
                    key={vocab.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group space-y-3"
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

                        {/* Speaker Button */}
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(vocab.german, vocab.id)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isPlaying
                              ? 'bg-amber-600 text-slate-950 border-amber-500 scale-105 shadow-md shadow-amber-600/30 font-bold'
                              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-amber-600/20 border-slate-700/60'
                          }`}
                          title="Deutsche Aussprache anhören"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                        </button>
                      </div>

                      <div className="mt-2 text-xs font-medium text-slate-300">
                        {vocab.english}
                      </div>

                      {/* Example sentence */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-1">
                        <div className="text-amber-200 flex items-center justify-between">
                          <span>{vocab.exampleGerman}</span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(vocab.exampleGerman, `ex-${vocab.id}`)}
                            className="text-slate-400 hover:text-white ml-1 shrink-0"
                            title="Beispielsatz anhören"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
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
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-600/30'
                  }`}
                >
                  {isPlayingDialogue ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>Dialog Stoppen</span>
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
                  const isActive = activeDialogueIndex === idx;
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
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-amber-600 hover:text-slate-950 transition-colors shrink-0"
                          title="Diese Replik anhören"
                        >
                          <Volume2 className="w-4 h-4" />
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
