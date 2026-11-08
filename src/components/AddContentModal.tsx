import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  BookOpen,
  Sparkles,
  Volume2,
  CheckCircle2,
  Cloud,
  Puzzle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import type { Lesson, VocabularyItem, CEFRLevel, GermanGender } from '../types';
import { curriculumOverrideService } from '../services/curriculumOverrideService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

type ContentCreationTab = 'vocab' | 'lesson' | 'quiz';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLessons: Lesson[];
  defaultLessonId?: string;
  defaultLevel?: CEFRLevel;
  onSuccess?: (type: ContentCreationTab, id: string) => void;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  availableLessons,
  defaultLessonId,
  defaultLevel = 'A1',
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<ContentCreationTab>('vocab');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tab 1: Vocabulary State
  const [vocabLessonId, setVocabLessonId] = useState<string>(
    defaultLessonId || availableLessons[0]?.id || ''
  );
  const [vocabGerman, setVocabGerman] = useState<string>('');
  const [vocabEnglish, setVocabEnglish] = useState<string>('');
  const [vocabIpa, setVocabIpa] = useState<string>('');
  const [vocabGender, setVocabGender] = useState<GermanGender>('none');
  const [vocabPlural, setVocabPlural] = useState<string>('');
  const [vocabLevel, setVocabLevel] = useState<CEFRLevel>(defaultLevel);
  const [vocabCategory, setVocabCategory] = useState<string>('Grundwortschatz');
  const [vocabExampleDe, setVocabExampleDe] = useState<string>('');
  const [vocabExampleEn, setVocabExampleEn] = useState<string>('');
  const [vocabTip, setVocabTip] = useState<string>('');
  const [vocabCaseHint, setVocabCaseHint] = useState<string>('');

  // Tab 2: Full Lesson State
  const [lessonLevel, setLessonLevel] = useState<CEFRLevel>(defaultLevel);
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [lessonSubtitle, setLessonSubtitle] = useState<string>('');
  const [lessonTheme, setLessonTheme] = useState<string>('');
  const [lessonDesc, setLessonDesc] = useState<string>('');
  const [grammarRule, setGrammarRule] = useState<string>('');
  const [grammarExp, setGrammarExp] = useState<string>('');
  const [grammarExDe, setGrammarExDe] = useState<string>('');
  const [grammarExEn, setGrammarExEn] = useState<string>('');
  const [culturalNote, setCulturalNote] = useState<string>('');
  const [idiomDe, setIdiomDe] = useState<string>('');
  const [idiomEn, setIdiomEn] = useState<string>('');
  const [dialogueScenario, setDialogueScenario] = useState<string>('Alltägliche Konversation');
  const [dialogueADe, setDialogueADe] = useState<string>('');
  const [dialogueAEn, setDialogueAEn] = useState<string>('');
  const [dialogueBDe, setDialogueBDe] = useState<string>('');
  const [dialogueBEn, setDialogueBEn] = useState<string>('');

  // Tab 3: Sentence & Quiz State
  const [quizLessonId, setQuizLessonId] = useState<string>(
    defaultLessonId || availableLessons[0]?.id || ''
  );
  const [quizLevel, setQuizLevel] = useState<CEFRLevel>(defaultLevel);
  const [quizType, setQuizType] = useState<'quiz' | 'sentence'>('quiz');
  const [quizPromptDe, setQuizPromptDe] = useState<string>('');
  const [quizAnswerEn, setQuizAnswerEn] = useState<string>('');
  const [quizDistractors, setQuizDistractors] = useState<string>('');
  const [quizExplanation, setQuizExplanation] = useState<string>('');

  if (!isOpen) return null;

  const handlePreviewAudio = (text: string) => {
    if (!text.trim()) return;
    soundEffects.playTap();
    speechService.speak(text);
  };

  const handleCreateVocabulary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocabGerman.trim() || !vocabEnglish.trim() || !vocabLessonId) return;

    setIsSubmitting(true);
    const cleanWord = vocabGerman.trim();
    const cleanBase = cleanWord.replace(/^(der|die|das)\s+/i, '').trim();

    const newItem: VocabularyItem = {
      id: `custom-voc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      german: cleanWord,
      baseWord: cleanBase || cleanWord,
      article: vocabGender === 'der' || vocabGender === 'die' || vocabGender === 'das' ? vocabGender : undefined,
      plural: vocabPlural.trim() || undefined,
      english: vocabEnglish.trim(),
      ipa: vocabIpa.trim() || undefined,
      gender: vocabGender,
      partOfSpeech: vocabGender === 'none' ? 'phrase' : 'noun',
      exampleGerman: vocabExampleDe.trim() || cleanWord,
      exampleEnglish: vocabExampleEn.trim() || vocabEnglish.trim(),
      pronunciationTip: vocabTip.trim() || undefined,
      caseHint: vocabCaseHint.trim() || undefined,
      level: vocabLevel,
      category: vocabCategory.trim() || 'Wortschatz'
    };

    curriculumOverrideService.addVocabularyItem(vocabLessonId, newItem);
    soundEffects.playCorrect();
    setSuccessMessage(`Wort "${newItem.german}" erfolgreich hinzugefügt und mit der Cloud synchronisiert!`);
    setIsSubmitting(false);

    setTimeout(() => {
      onSuccess?.('vocab', newItem.id);
      onClose();
    }, 700);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    setIsSubmitting(true);
    const newLessonId = `custom-lesson-${lessonLevel.toLowerCase()}-${Date.now()}`;
    const newLesson: Lesson = {
      id: newLessonId,
      level: lessonLevel,
      title: lessonTitle.trim(),
      subtitle: lessonSubtitle.trim() || `Thematisches Modul ${lessonLevel}`,
      theme: lessonTheme.trim() || 'Kommunikation & Alltag',
      description: lessonDesc.trim() || 'Neues Lernmodul der Guten App.',
      grammarFocus: {
        ruleName: grammarRule.trim() || 'Satzbau und Struktur',
        explanation: grammarExp.trim() || 'Anwendung deutscher Grammatikregeln im praktischen Kontext.',
        examples: grammarExDe.trim()
          ? [{ de: grammarExDe.trim(), en: grammarExEn.trim() }]
          : [{ de: 'Das ist ein praktisches Beispiel.', en: 'This is a practical example.' }]
      },
      culturalNote: culturalNote.trim() || undefined,
      idiomSpotlight: idiomDe.trim()
        ? {
            german: idiomDe.trim(),
            literal: idiomDe.trim(),
            meaning: idiomEn.trim() || 'Deutsche Redewendung',
            example: `« ${idiomDe.trim()} » : ${idiomEn.trim() || 'Gebräuchlicher Ausdruck'}.`
          }
        : undefined,
      dialogue: dialogueADe.trim()
        ? {
            id: `dlg-${newLessonId}`,
            title: `Dialog : ${lessonTitle.trim()}`,
            scenario: dialogueScenario.trim(),
            lines: [
              {
                speaker: 'Sprecher A',
                german: dialogueADe.trim(),
                english: dialogueAEn.trim()
              },
              {
                speaker: 'Sprecher B',
                german: dialogueBDe.trim() || 'Sehr gut, vielen Dank für das Gespräch!',
                english: dialogueBEn.trim() || 'Very well, thank you for the conversation!'
              }
            ]
          }
        : undefined,
      vocabulary: [
        {
          id: `voc-${newLessonId}-1`,
          german: lessonTitle.trim(),
          baseWord: lessonTitle.trim(),
          english: lessonSubtitle.trim() || 'Modultitel',
          partOfSpeech: 'phrase',
          exampleGerman: `Wir lernen heute : ${lessonTitle.trim()}.`,
          exampleEnglish: `Today we learn: ${lessonSubtitle.trim() || lessonTitle.trim()}.`,
          level: lessonLevel,
          category: lessonTheme.trim() || 'Allgemein'
        }
      ]
    };

    curriculumOverrideService.addCustomLesson(newLesson);
    soundEffects.playCorrect();
    setSuccessMessage(`Lektion "${newLesson.title}" (${lessonLevel}) erstellt und mit der Cloud synchronisiert!`);
    setIsSubmitting(false);

    setTimeout(() => {
      onSuccess?.('lesson', newLesson.id);
      onClose();
    }, 700);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizPromptDe.trim() || !quizAnswerEn.trim()) return;

    setIsSubmitting(true);
    const optionsArray = quizDistractors
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    const newQuizItem = {
      id: `custom-quiz-${Date.now()}`,
      lessonId: quizLessonId,
      level: quizLevel,
      type: quizType,
      questionDe: quizPromptDe.trim(),
      answerEn: quizAnswerEn.trim(),
      options: optionsArray.length > 0 ? [quizAnswerEn.trim(), ...optionsArray] : undefined,
      germanTokens: quizType === 'sentence' ? quizPromptDe.trim().split(/\s+/) : undefined,
      explanation: quizExplanation.trim() || undefined,
      createdAt: Date.now()
    };

    curriculumOverrideService.addCustomQuizItem(newQuizItem);
    soundEffects.playCorrect();
    setSuccessMessage(`Übung (${quizType === 'quiz' ? 'Quiz' : 'Satzbau'}) erfolgreich gespeichert und synchronisiert!`);
    setIsSubmitting(false);

    setTimeout(() => {
      onSuccess?.('quiz', newQuizItem.id);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <PlusCircle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-black text-white">
                Neuen Inhalt Hinzufügen (Guten App)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <Cloud className="w-3 h-3" />
                Vercel Cloud Sync Aktiv
              </span>
              <span className="text-slate-400 hidden sm:inline">• Alle 3 Benutzer (Admin &amp; Tester) berechtigt</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playTap();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 pb-2 bg-slate-900/90 border-b border-slate-800 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playTap();
              setActiveTab('vocab');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'vocab'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Neuer Wortschatz</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playTap();
              setActiveTab('lesson');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'lesson'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neue Lektion / Modul</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playTap();
              setActiveTab('quiz');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Satz &amp; Quiz</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: ADD VOCABULARY */}
          {activeTab === 'vocab' && (
            <form onSubmit={handleCreateVocabulary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Zugehöriges Modul</label>
                  <select
                    value={vocabLessonId}
                    onChange={(e) => setVocabLessonId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  >
                    {availableLessons.map(l => (
                      <option key={l.id} value={l.id}>
                        [{l.level}] {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">CEFR Niveau</label>
                    <select
                      value={vocabLevel}
                      onChange={(e) => setVocabLevel(e.target.value as CEFRLevel)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="A1">A1 Anfänger</option>
                      <option value="A2">A2 Grundlegend</option>
                      <option value="B1">B1 Mittelstufe</option>
                      <option value="B2">B2 Fortgeschritten</option>
                      <option value="C1">C1 Fachkundig</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Artikel / Genus</label>
                    <select
                      value={vocabGender}
                      onChange={(e) => setVocabGender(e.target.value as GermanGender)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="none">Kein / Phrase</option>
                      <option value="der">der (Maskulinum)</option>
                      <option value="die">die (Femininum)</option>
                      <option value="das">das (Neutrum)</option>
                      <option value="pl">Plural (die)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* German Word + Listen Preview */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Deutsches Wort / Ausdruck *</span>
                  {vocabGerman.trim() && (
                    <button
                      type="button"
                      onClick={() => handlePreviewAudio(vocabGerman)}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Deutsche Aussprache anhören</span>
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  value={vocabGerman}
                  onChange={(e) => setVocabGerman(e.target.value)}
                  placeholder="z.B. der Bahnhof, das Frühstück, Guten Morgen..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* English Translation & IPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Englische Bedeutung *</label>
                  <input
                    type="text"
                    value={vocabEnglish}
                    onChange={(e) => setVocabEnglish(e.target.value)}
                    placeholder="z.B. the train station, breakfast..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">IPA Lautschrift (Optional)</label>
                  <input
                    type="text"
                    value={vocabIpa}
                    onChange={(e) => setVocabIpa(e.target.value)}
                    placeholder="z.B. [deːɐ̯ ˈbaːnˌhoːf]"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Plural & Case Hint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Pluralform (Optional)</label>
                  <input
                    type="text"
                    value={vocabPlural}
                    onChange={(e) => setVocabPlural(e.target.value)}
                    placeholder="z.B. die Bahnhöfe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Fall / Grammatik-Hinweis</label>
                  <input
                    type="text"
                    value={vocabCaseHint}
                    onChange={(e) => setVocabCaseHint(e.target.value)}
                    placeholder="z.B. + Dativ, Akkusativ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Example Sentences */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Beispielsatz im Kontext</span>
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={vocabExampleDe}
                    onChange={(e) => setVocabExampleDe(e.target.value)}
                    placeholder="Satz auf Deutsch (z.B. Wo ist der nächste Bahnhof?)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={vocabExampleEn}
                    onChange={(e) => setVocabExampleEn(e.target.value)}
                    placeholder="Englische Übersetzung (z.B. Where is the nearest train station?)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Pronunciation Tip & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Aussprache-Tipp</label>
                  <input
                    type="text"
                    value={vocabTip}
                    onChange={(e) => setVocabTip(e.target.value)}
                    placeholder="z.B. 'h' dehnt das 'a'"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kategorie</label>
                  <input
                    type="text"
                    value={vocabCategory}
                    onChange={(e) => setVocabCategory(e.target.value)}
                    placeholder="z.B. Reisen, Essen, Alltag..."
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Wort speichern &amp; synchronisieren</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ADD FULL LESSON */}
          {activeTab === 'lesson' && (
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">CEFR Niveau *</label>
                  <select
                    value={lessonLevel}
                    onChange={(e) => setLessonLevel(e.target.value as CEFRLevel)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="A1">A1 Anfänger</option>
                    <option value="A2">A2 Grundlegend</option>
                    <option value="B1">B1 Mittelstufe</option>
                    <option value="B2">B2 Fortgeschritten</option>
                    <option value="C1">C1 Fachkundig</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lektionstitel auf Deutsch *</label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="z.B. Unterwegs in Berlin &amp; Öffentliche Verkehrsmittel"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Untertitel / Lernziel</label>
                  <input
                    type="text"
                    value={lessonSubtitle}
                    onChange={(e) => setLessonSubtitle(e.target.value)}
                    placeholder="z.B. Fahrkarten kaufen und nach dem Weg fragen"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Themenbereich</label>
                  <input
                    type="text"
                    value={lessonTheme}
                    onChange={(e) => setLessonTheme(e.target.value)}
                    placeholder="z.B. Mobilität, Stadtleben"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Beschreibung der Lektion</label>
                <textarea
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  placeholder="Beschreiben Sie die praktischen Kompetenzen dieses Moduls..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Grammar Spotlight */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Grammatik &amp; Fälle</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={grammarRule}
                    onChange={(e) => setGrammarRule(e.target.value)}
                    placeholder="Regel (z.B. Wechselpräpositionen mit Dativ/Akkusativ)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={grammarExp}
                    onChange={(e) => setGrammarExp(e.target.value)}
                    placeholder="Erklärung der Regel"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={grammarExDe}
                    onChange={(e) => setGrammarExDe(e.target.value)}
                    placeholder="Beispiel Deutsch (z.B. Ich gehe in die Stadt.)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={grammarExEn}
                    onChange={(e) => setGrammarExEn(e.target.value)}
                    placeholder="Beispiel Englisch (z.B. I am going into the city.)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cultural & Idiom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kultureller Hinweis (Optional)</label>
                  <input
                    type="text"
                    value={culturalNote}
                    onChange={(e) => setCulturalNote(e.target.value)}
                    placeholder="z.B. Pünktlichkeit bei der Bahn, Ticketentwerter"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Redewendung (Idiom)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={idiomDe}
                      onChange={(e) => setIdiomDe(e.target.value)}
                      placeholder="z.B. Ich verstehe nur Bahnhof"
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-[11px] focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      value={idiomEn}
                      onChange={(e) => setIdiomEn(e.target.value)}
                      placeholder="Englische Bedeutung"
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-[11px] focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dialogue */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Interaktiver Dialog</span>
                </div>
                <input
                  type="text"
                  value={dialogueScenario}
                  onChange={(e) => setDialogueScenario(e.target.value)}
                  placeholder="Szenario (z.B. Am Fahrkartenschalter)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={dialogueADe}
                    onChange={(e) => setDialogueADe(e.target.value)}
                    placeholder="Sprecher A (Deutsch)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={dialogueAEn}
                    onChange={(e) => setDialogueAEn(e.target.value)}
                    placeholder="Sprecher A (Englisch)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={dialogueBDe}
                    onChange={(e) => setDialogueBDe(e.target.value)}
                    placeholder="Sprecher B (Deutsch)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={dialogueBEn}
                    onChange={(e) => setDialogueBEn(e.target.value)}
                    placeholder="Sprecher B (Englisch)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Lektion auf Cloud veröffentlichen</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ADD QUIZ & SENTENCE ITEM */}
          {activeTab === 'quiz' && (
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Übungsformat</label>
                  <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="quiz">Multiple-Choice Quizfrage</option>
                    <option value="sentence">Satzbau-Übung (Wortkarten)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">CEFR Niveau</label>
                  <select
                    value={quizLevel}
                    onChange={(e) => setQuizLevel(e.target.value as CEFRLevel)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="A1">A1 Anfänger</option>
                    <option value="A2">A2 Grundlegend</option>
                    <option value="B1">B1 Mittelstufe</option>
                    <option value="B2">B2 Fortgeschritten</option>
                    <option value="C1">C1 Fachkundig</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Zugehöriges Modul</label>
                  <select
                    value={quizLessonId}
                    onChange={(e) => setQuizLessonId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {availableLessons.map(l => (
                      <option key={l.id} value={l.id}>
                        [{l.level}] {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Satz oder Frage auf Deutsch *</span>
                  {quizPromptDe.trim() && (
                    <button
                      type="button"
                      onClick={() => handlePreviewAudio(quizPromptDe)}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Anhören</span>
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  value={quizPromptDe}
                  onChange={(e) => setQuizPromptDe(e.target.value)}
                  placeholder="z.B. Wir fahren morgen mit dem Zug nach München."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Korrekte Antwort (Englische Bedeutung) *</label>
                <input
                  type="text"
                  value={quizAnswerEn}
                  onChange={(e) => setQuizAnswerEn(e.target.value)}
                  placeholder="z.B. We are taking the train to Munich tomorrow."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {quizType === 'quiz' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Falsche Antwortoptionen (1 pro Zeile)
                  </label>
                  <textarea
                    value={quizDistractors}
                    onChange={(e) => setQuizDistractors(e.target.value)}
                    placeholder="We went by bus yesterday.&#10;They will fly to Berlin next week.&#10;I like traveling by bike."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Grammatik-Hinweis / Erklärung</label>
                <input
                  type="text"
                  value={quizExplanation}
                  onChange={(e) => setQuizExplanation(e.target.value)}
                  placeholder="z.B. 'mit' verlangt immer den Dativ (mit dem Zug)"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Übung speichern &amp; synchronisieren</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
