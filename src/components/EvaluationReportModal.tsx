import React, { useState } from 'react';
import {
  X,
  Mail,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Send
} from 'lucide-react';
import type { AuthUser, EvaluationCategory, EvaluationSeverity } from '../types/auth';
import { evaluationReportService, ROUTE_DESTINATION_EMAIL } from '../services/evaluationReportService';
import { soundEffects } from '../services/soundEffects';

interface EvaluationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  activeModuleTitle?: string;
  activeTab?: string;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeModuleTitle,
  activeTab
}) => {
  const effectiveUser: AuthUser = currentUser || {
    id: 'usr-guest',
    username: 'gast-tester',
    displayName: 'Gast-Tester',
    role: 'tester',
    avatar: '👤',
    canEdit: false,
    canCreate: false
  };

  const initialModule = activeModuleTitle || (activeTab ? `Tab: ${activeTab}` : 'Curriculum & Lektionen');
  const [category, setCategory] = useState<EvaluationCategory>('bug');
  const [severity, setSeverity] = useState<EvaluationSeverity>('medium');
  const [activeModule, setActiveModule] = useState<string>(initialModule);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stepsToReproduce, setStepsToReproduce] = useState<string>('');
  const [expectedBehavior, setExpectedBehavior] = useState<string>('');
  const [actualBehavior, setActualBehavior] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<{
    mailtoUrl: string;
    formattedText: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    soundEffects.playCorrect();

    const report = evaluationReportService.createReport(effectiveUser, {
      category,
      severity,
      activeModuleTitle: activeModule,
      title: title.trim(),
      description: description.trim(),
      stepsToReproduce: stepsToReproduce.trim() || undefined,
      expectedBehavior: expectedBehavior.trim() || undefined,
      actualBehavior: actualBehavior.trim() || undefined
    });

    const mailtoUrl = evaluationReportService.buildMailtoUrl(report);
    const formattedText = evaluationReportService.formatReportText(report);

    setSubmittedReport({
      mailtoUrl,
      formattedText
    });
  };

  const handleCopyText = async () => {
    if (!submittedReport) return;
    try {
      await navigator.clipboard.writeText(submittedReport.formattedText);
      soundEffects.playTap();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleOpenEmailClient = () => {
    if (!submittedReport) return;
    soundEffects.playTap();
    window.open(submittedReport.mailtoUrl, '_blank');
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setStepsToReproduce('');
    setExpectedBehavior('');
    setActualBehavior('');
    setSubmittedReport(null);
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
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

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Bug className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Evaluationsbericht &amp; Feedback
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Berichte werden automatisch formatiert und direkt an{' '}
            <strong className="text-amber-300 font-mono">{ROUTE_DESTINATION_EMAIL}</strong> weitergeleitet.
          </p>
        </div>

        {/* Success / Mailto View */}
        {submittedReport ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Bericht erfolgreich generiert!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Der Bericht ist bereit zur Übermittlung an{' '}
                <strong className="text-emerald-100 underline">{ROUTE_DESTINATION_EMAIL}</strong>.
              </p>
            </div>

            {/* Formatted Preview Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Vorschau des formatieren Berichts:</span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-amber-300 hover:text-amber-200 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopiert!' : 'In Zwischenablage kopieren'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {submittedReport.formattedText}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenEmailClient}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>E-Mail App öffnen ({ROUTE_DESTINATION_EMAIL})</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Weiteren Bericht erstellen
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Kategorie *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EvaluationCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="bug">🐛 Fehler / Bug</option>
                  <option value="audio">🔊 Audio &amp; Aussprache (TTS/STT)</option>
                  <option value="translation">📖 Übersetzung &amp; Vokabular</option>
                  <option value="grammar">💡 Grammatik &amp; Fälle</option>
                  <option value="ui">🎨 Layout &amp; Benutzeroberfläche</option>
                  <option value="feature">✨ Verbesserungsvorschlag</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Dringlichkeit (Severity)</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as EvaluationSeverity)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="low">🟢 Niedrig (Geringfügig)</option>
                  <option value="medium">🟡 Mittel (Normaler Befund)</option>
                  <option value="high">🟠 Hoch (Störend)</option>
                  <option value="critical">🔴 Kritisch (Blockierend)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Betroffenes Modul</label>
              <input
                type="text"
                value={activeModule}
                onChange={(e) => setActiveModule(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                placeholder="z.B. Lektion A1, Wortschatz-Test, Voice Studio..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Titel des Berichts *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Prägnante Zusammenfassung des Problems"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Detaillierte Beschreibung *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreiben Sie den Fehler oder das beobachtete Verhalten möglichst genau..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Erwartetes Verhalten</label>
                <input
                  type="text"
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  placeholder="Was sollte passieren?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tatsächliches Verhalten</label>
                <input
                  type="text"
                  value={actualBehavior}
                  onChange={(e) => setActualBehavior(e.target.value)}
                  placeholder="Was ist tatsächlich passiert?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Schritte zur Reproduktion (Optional)</label>
              <textarea
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="1. Modul öffnen&#10;2. Auf Audio klicken&#10;3. Beobachten, dass..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>

            {/* Footer Notice */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Systemdiagnosedaten (Browser, Auflösung, Web Speech Status) werden automatisch angehängt.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Bericht erstellen &amp; an {ROUTE_DESTINATION_EMAIL} routen</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
