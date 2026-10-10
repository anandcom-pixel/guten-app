import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';
import type { VocabularyItem, VoiceComparisonResult } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { voiceRecognitionService, type RecognitionState } from '../services/voiceRecognitionService';
import { srsService } from '../services/srsService';
import { mistakeVaultService } from '../services/mistakeVaultService';
import { GermanKeyboardHelper } from './GermanKeyboardHelper';

interface VoiceStudioViewProps {
  initialVocab?: VocabularyItem | null;
  speechRate: number;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  initialVocab,
  speechRate
}) => {
  const allVocabularies = CURRICULUM_DATA.flatMap(l => l.vocabulary);
  const [selectedVocab, setSelectedVocab] = useState<VocabularyItem>(
    initialVocab || allVocabularies[0]
  );
  const [micState, setMicState] = useState<RecognitionState>('idle');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<VoiceComparisonResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSimulateMode, setIsSimulateMode] = useState<boolean>(!voiceRecognitionService.checkSupport());
  const [simulatedInput, setSimulatedInput] = useState<string>('');

  useEffect(() => {
    if (initialVocab) {
      setSelectedVocab(initialVocab);
      setComparisonResult(null);
      setLiveTranscript('');
      setErrorMessage(null);
    }
  }, [initialVocab]);

  const handlePlayTargetAudio = (rateMultiplier: number = speechRate) => {
    soundEffects.playTap();
    speechService.speak(selectedVocab.german, { rate: rateMultiplier });
  };

  const handleStartListening = () => {
    soundEffects.playMicTone(true);
    setErrorMessage(null);
    setLiveTranscript('');
    setComparisonResult(null);

    voiceRecognitionService.startListening(selectedVocab.german, {
      onStateChange: (state) => setMicState(state),
      onInterimResult: (transcript) => setLiveTranscript(transcript),
      onFinalResult: (result) => {
        setComparisonResult(result);
        if (result.passed) {
          soundEffects.playCorrect();
          srsService.recordVoicePassed();
          if (result.accuracyScore >= 90) {
            try {
              confetti({ particleCount: 50, spread: 50 });
            } catch {
              // ignore
            }
          }
        } else {
          soundEffects.playIncorrect();
          srsService.queueFailedItem(selectedVocab);
          mistakeVaultService.addMistake({
            type: 'pronunciation',
            german: selectedVocab.german,
            english: selectedVocab.english,
            level: selectedVocab.level,
            contextNote: `Aussprache-Abweichung (${result.accuracyScore}%). Erkannt: "${result.spokenText}".`,
            phoneticTip: selectedVocab.pronunciationTip
          });
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        soundEffects.playIncorrect();
      }
    });
  };

  const handleStopListening = () => {
    soundEffects.playMicTone(false);
    voiceRecognitionService.stopListening();
  };

  const handleSimulatedSubmit = () => {
    if (!simulatedInput.trim()) return;
    const result = voiceRecognitionService.simulateSpokenInput(selectedVocab.german, simulatedInput.trim());
    setComparisonResult(result);
    setLiveTranscript(simulatedInput.trim());

    if (result.passed) {
      soundEffects.playCorrect();
      srsService.recordVoicePassed();
    } else {
      soundEffects.playIncorrect();
      srsService.queueFailedItem(selectedVocab);
      mistakeVaultService.addMistake({
        type: 'pronunciation',
        german: selectedVocab.german,
        english: selectedVocab.english,
        level: selectedVocab.level,
        contextNote: `Simulierte Aussprache mit Abweichungen (${result.accuracyScore}%).`,
        phoneticTip: selectedVocab.pronunciationTip
      });
    }
  };

  const handleSelectRandomPhrase = () => {
    soundEffects.playTap();
    const randomIndex = Math.floor(Math.random() * allVocabularies.length);
    setSelectedVocab(allVocabularies[randomIndex]);
    setComparisonResult(null);
    setLiveTranscript('');
    setSimulatedInput('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-4xl mx-auto">
      {/* Studio Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Intelligentes Sprachstudio
              </span>
              <span className="text-xs text-slate-400">Spracherkennung & Deutsche Phonetik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Aussprache- & Intonations-Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aktiviere das Mikrofon, sprich den deutschen Satz laut und erhalte eine Wort-für-Wort-Phonetik-Analyse in Echtzeit mit individuellen Tipps zu Umlauten und ch-Lauten.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSelectRandomPhrase}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Zufälliger Ausdruck</span>
          </button>
        </div>
      </div>

      {/* Target Phrase Display Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Niveau {selectedVocab.level}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {selectedVocab.category}
            </span>
            {selectedVocab.article && (
              <span className="text-xs font-mono text-indigo-300">
                Artikel: {selectedVocab.article}
              </span>
            )}
          </div>

          {/* Quick Audio Modeling Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePlayTargetAudio(speechRate)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Normaltempo anhören"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Anhören (1.0x)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlayTargetAudio(0.7)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="In Zeitlupe für klare Silbentrennung"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Zeitlupe (0.7x)</span>
            </button>
          </div>
        </div>

        {/* Phrase Showcase */}
        <div className="text-center space-y-3 py-2">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            „{selectedVocab.german}“
          </div>
          {selectedVocab.plural && (
            <div className="text-xs font-mono text-slate-400">
              Plural: {selectedVocab.plural}
            </div>
          )}
          <div className="text-sm font-medium text-slate-400">
            Bedeutung: {selectedVocab.english}
          </div>

          {selectedVocab.pronunciationTip && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Aussprache-Tipp: {selectedVocab.pronunciationTip}</span>
            </div>
          )}
        </div>

        {/* Big Interactive Microphone Hub */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="relative flex items-center justify-center">
            {micState === 'listening' && (
              <div className="absolute w-28 h-28 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
            )}

            <button
              type="button"
              onClick={micState === 'listening' ? handleStopListening : handleStartListening}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
                micState === 'listening'
                  ? 'bg-rose-600 text-white animate-mic-pulse ring-4 ring-rose-500/50 shadow-rose-600/50'
                  : 'bg-gradient-to-tr from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-amber-600/30'
              }`}
              title={micState === 'listening' ? 'Aufnahme stoppen' : 'Klicken zum Sprechen'}
            >
              {micState === 'listening' ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          {/* Real-time Visualizer Audio Waves */}
          {micState === 'listening' ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-1.5 h-8">
                <span className="w-1.5 bg-rose-500 rounded-full animate-wave-1" />
                <span className="w-1.5 bg-rose-400 rounded-full animate-wave-2" />
                <span className="w-1.5 bg-rose-500 rounded-full animate-wave-3" />
                <span className="w-1.5 bg-rose-400 rounded-full animate-wave-4" />
                <span className="w-1.5 bg-rose-500 rounded-full animate-wave-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 animate-pulse">
                Live-Mikrofon aktiv (Sprich jetzt auf Deutsch)...
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Klicke auf das Mikrofon und sprich den Satz deutlich aus
            </span>
          )}

          {/* Live speech transcription display */}
          {(liveTranscript || micState === 'listening') && (
            <div className="w-full max-w-lg p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center text-sm font-medium text-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Live-Transkription
              </span>
              <span>„{liveTranscript || '...'}“</span>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Mikrofon-Hinweis</span>
            </div>
            <p>{errorMessage}</p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsSimulateMode(true)}
                className="text-xs underline font-semibold text-rose-200 hover:text-white"
              >
                Simulationsmodus aktivieren, um den Text-Phonetik-Scanner manuell zu testen
              </button>
            </div>
          </div>
        )}

        {/* Simulation / Manual Input Mode Accordion */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsSimulateMode(!isSimulateMode)}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <span>⌨️ Tastatur-Eingabe / Test ohne Mikrofon</span>
            </button>
            <span className="text-[11px] text-slate-500">
              {voiceRecognitionService.checkSupport() ? 'SpeechRecognition de-DE Aktiv' : 'SpeechRecognition manueller Fallback'}
            </span>
          </div>

          {isSimulateMode && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300">
                Tippe hier einen Satz ein (z. B. mit kleinen Tipp- oder Aussprachefehlern), um die Auswertung zu prüfen:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={simulatedInput}
                  onChange={(e) => setSimulatedInput(e.target.value)}
                  placeholder={`Z. B.: ${selectedVocab.german}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSimulatedSubmit}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors shrink-0"
                >
                  Analysieren
                </button>
              </div>
              <GermanKeyboardHelper onInsertChar={(c) => setSimulatedInput(prev => prev + c)} />
            </div>
          )}
        </div>
      </div>

      {/* Visual Pronunciation & Acoustic Feedback Card */}
      {comparisonResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  comparisonResult.passed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {comparisonResult.passed ? 'Aussprache Bestanden ✓' : 'Übungsbedarf ✗'}
                </span>
                <span className="text-xs text-slate-400">Phonetischer Übereinstimmungsgrad</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Aussprache-Diagnostik</h3>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-3xl font-black ${
                  comparisonResult.accuracyScore >= 80
                    ? 'text-emerald-400'
                    : comparisonResult.accuracyScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {comparisonResult.accuracyScore}%
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Gesamtgenauigkeit</div>
              </div>
            </div>
          </div>

          {/* Word-by-Word Color-Coded Alignment Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Wort-für-Wort-Analyse:
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Exakt
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Leichte Nuance / Umlaut
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Undeutlich / Ausgelassen
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap gap-2 items-center">
              {comparisonResult.wordAnalysis.map((item, idx) => {
                let badgeClass = '';
                if (item.status === 'correct') {
                  badgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
                } else if (item.status === 'partial') {
                  badgeClass = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
                } else {
                  badgeClass = 'bg-rose-950/60 text-rose-300 border-rose-500/40 line-through';
                }

                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border flex items-center gap-1.5 shadow-sm ${badgeClass}`}
                  >
                    <span>{item.word}</span>
                    {item.expectedWord && item.expectedWord !== item.word && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({item.expectedWord})
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Feedback Notes & Pronunciation Guidance Tips */}
          {comparisonResult.feedbackNotes.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Hinweise des Sprachassistenten:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {comparisonResult.feedbackNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartListening}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Diesen Satz wiederholen</span>
            </button>

            <button
              type="button"
              onClick={handleSelectRandomPhrase}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/30"
            >
              <span>Nächste Übung</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
