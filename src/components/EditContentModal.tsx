import React, { useState } from 'react';
import { X, Save, Edit3, CheckCircle2 } from 'lucide-react';
import type { Lesson, VocabularyItem, GermanGender } from '../types';
import { curriculumOverrideService } from '../services/curriculumOverrideService';
import { soundEffects } from '../services/soundEffects';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLesson?: Lesson;
  targetVocab?: VocabularyItem;
  onSaved?: () => void;
}

export const EditContentModal: React.FC<EditContentModalProps> = ({
  isOpen,
  onClose,
  targetLesson,
  targetVocab,
  onSaved
}) => {
  // Vocabulary state
  const [german, setGerman] = useState<string>(targetVocab?.german || '');
  const [english, setEnglish] = useState<string>(targetVocab?.english || '');
  const [ipa, setIpa] = useState<string>(targetVocab?.ipa || '');
  const [gender, setGender] = useState<GermanGender>(targetVocab?.gender || 'none');
  const [article, setArticle] = useState<'der' | 'die' | 'das' | undefined>(targetVocab?.article);
  const [plural, setPlural] = useState<string>(targetVocab?.plural || '');
  const [exampleGerman, setExampleGerman] = useState<string>(targetVocab?.exampleGerman || '');
  const [exampleEnglish, setExampleEnglish] = useState<string>(targetVocab?.exampleEnglish || '');
  const [pronunciationTip, setPronunciationTip] = useState<string>(targetVocab?.pronunciationTip || '');
  const [caseHint, setCaseHint] = useState<string>(targetVocab?.caseHint || '');

  // Lesson state
  const [lessonTitle, setLessonTitle] = useState<string>(targetLesson?.title || '');
  const [lessonSubtitle, setLessonSubtitle] = useState<string>(targetLesson?.subtitle || '');
  const [lessonDescription, setLessonDescription] = useState<string>(targetLesson?.description || '');
  const [ruleName, setRuleName] = useState<string>(targetLesson?.grammarFocus.ruleName || '');
  const [ruleExplanation, setRuleExplanation] = useState<string>(targetLesson?.grammarFocus.explanation || '');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetVocab) {
      curriculumOverrideService.saveVocabOverride(targetVocab.id, {
        german: german.trim(),
        baseWord: german.replace(/^(der|die|das)\s+/i, '').trim(),
        english: english.trim(),
        ipa: ipa.trim(),
        gender,
        article: gender === 'der' || gender === 'die' || gender === 'das' ? gender : article,
        plural: plural.trim() || undefined,
        exampleGerman: exampleGerman.trim(),
        exampleEnglish: exampleEnglish.trim(),
        pronunciationTip: pronunciationTip.trim() || undefined,
        caseHint: caseHint.trim() || undefined
      });
    } else if (targetLesson) {
      curriculumOverrideService.saveLessonOverride(targetLesson.id, {
        title: lessonTitle.trim(),
        subtitle: lessonSubtitle.trim(),
        description: lessonDescription.trim(),
        grammarFocus: {
          ...targetLesson.grammarFocus,
          ruleName: ruleName.trim(),
          explanation: ruleExplanation.trim()
        }
      });
    }

    soundEffects.playCorrect();
    setSavedSuccess(true);
    setTimeout(() => {
      onSaved?.();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Edit3 className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {targetVocab ? `Wortschatz bearbeiten : "${targetVocab.german}"` : `Lektion bearbeiten : "${targetLesson?.title}"`}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Änderungen werden sofort lokal gespeichert und mit der Vercel-Cloud synchronisiert.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Erfolgreich gespeichert und synchronisiert!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {targetVocab && (
            <>
              {/* German Word & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Deutsches Wort / Ausdruck *</label>
                  <input
                    type="text"
                    value={german}
                    onChange={(e) => setGerman(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Artikel / Genus</label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      const val = e.target.value as GermanGender;
                      setGender(val);
                      if (val === 'der' || val === 'die' || val === 'das') {
                        setArticle(val);
                      } else {
                        setArticle(undefined);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">Kein / Phrase</option>
                    <option value="der">der (mask.)</option>
                    <option value="die">die (fem.)</option>
                    <option value="das">das (neut.)</option>
                    <option value="pl">Plural (die)</option>
                  </select>
                </div>
              </div>

              {/* English Meaning & IPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Englische Übersetzung *</label>
                  <input
                    type="text"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">IPA Lautschrift</label>
                  <input
                    type="text"
                    value={ipa}
                    onChange={(e) => setIpa(e.target.value)}
                    placeholder="z.B. [ˈɡuːtn̩ ˈtaːk]"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Plural Form & Case Hint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Pluralform (Optional)</label>
                  <input
                    type="text"
                    value={plural}
                    onChange={(e) => setPlural(e.target.value)}
                    placeholder="z.B. die Äpfel"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Fall-Hinweis (Case Hint)</label>
                  <input
                    type="text"
                    value={caseHint}
                    onChange={(e) => setCaseHint(e.target.value)}
                    placeholder="z.B. + Dativ, Akkusativ-Objekt"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Example Sentences */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-amber-300">Beispielsatz</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={exampleGerman}
                    onChange={(e) => setExampleGerman(e.target.value)}
                    placeholder="Satz auf Deutsch"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={exampleEnglish}
                    onChange={(e) => setExampleEnglish(e.target.value)}
                    placeholder="Englische Übersetzung des Satzes"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Pronunciation Tip */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Aussprache-Tipp</label>
                <input
                  type="text"
                  value={pronunciationTip}
                  onChange={(e) => setPronunciationTip(e.target.value)}
                  placeholder="z.B. Kurzes 'a', weiches 'ch'..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {targetLesson && (
            <>
              {/* Lesson Title & Subtitle */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Titel der Lektion *</label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Untertitel / Thema</label>
                  <input
                    type="text"
                    value={lessonSubtitle}
                    onChange={(e) => setLessonSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Beschreibung</label>
                  <textarea
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Grammar Focus */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-amber-300">Grammatik-Schwerpunkt</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      placeholder="Name der Regel (z.B. Trennbare Verben)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                    <textarea
                      value={ruleExplanation}
                      onChange={(e) => setRuleExplanation(e.target.value)}
                      placeholder="Erklärung der Grammatikregel..."
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Save className="w-3.5 h-3.5 text-slate-950" />
              <span>Änderungen speichern &amp; synchronisieren</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
