import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Navbar, type NavigationTab } from './components/Navbar';
import { CurriculumView } from './components/CurriculumView';
import type { Lesson, VocabularyItem, UserStats } from './types';
import { srsService } from './services/srsService';
import { CURRICULUM_DATA } from './data/curriculumData';

const VocabTestView = lazy(() =>
  import('./components/VocabTestView').then(m => ({ default: m.VocabTestView }))
);
const SpeedDrillView = lazy(() =>
  import('./components/SpeedDrillView').then(m => ({ default: m.SpeedDrillView }))
);
const SentenceBuilderView = lazy(() =>
  import('./components/SentenceBuilderView').then(m => ({ default: m.SentenceBuilderView }))
);
const VoiceStudioView = lazy(() =>
  import('./components/VoiceStudioView').then(m => ({ default: m.VoiceStudioView }))
);
const MistakeVaultView = lazy(() =>
  import('./components/MistakeVaultView').then(m => ({ default: m.MistakeVaultView }))
);
const SRSReviewView = lazy(() =>
  import('./components/SRSReviewView').then(m => ({ default: m.SRSReviewView }))
);
const ProfileProgressView = lazy(() =>
  import('./components/ProfileProgressView').then(m => ({ default: m.ProfileProgressView }))
);

function ViewLoadingFallback() {
  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-700/80 p-8 sm:p-12 shadow-xl text-center space-y-4 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 mx-auto" />
      <div className="h-5 w-48 bg-slate-800 rounded-lg mx-auto" />
      <div className="h-3 w-72 max-w-full bg-slate-800/70 rounded-lg mx-auto" />
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('curriculum');
  const [stats, setStats] = useState<UserStats>(() => srsService.getStats());
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [testLesson, setTestLesson] = useState<Lesson | null>(null);
  const [voiceVocab, setVoiceVocab] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    const unsub = srsService.subscribe(() => {
      setStats({ ...srsService.getStats() });
    });
    return () => unsub();
  }, []);

  const handleSelectTab = useCallback((tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartTest = useCallback((lesson: Lesson) => {
    setTestLesson(lesson);
    setActiveTab('tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartVoicePractice = useCallback((vocab: VocabularyItem) => {
    setVoiceVocab(vocab);
    setActiveTab('voice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToSRS = useCallback(() => {
    setActiveTab('srs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToVault = useCallback(() => {
    setActiveTab('vault');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleVoiceFromVault = useCallback((germanText: string) => {
    const allVocabs = CURRICULUM_DATA.flatMap(l => l.vocabulary);
    const found = allVocabs.find(v => v.german.toLowerCase() === germanText.toLowerCase() || v.baseWord.toLowerCase() === germanText.toLowerCase());
    if (found) {
      setVoiceVocab(found);
    } else {
      setVoiceVocab({
        id: `custom-${Date.now()}`,
        german: germanText,
        baseWord: germanText,
        english: 'Übung aus dem Fehler-Tresor',
        partOfSpeech: 'phrase',
        exampleGerman: germanText,
        exampleEnglish: '',
        level: 'B1',
        category: 'Tresor-Eintrag'
      });
    }
    setActiveTab('voice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#063826] via-[#042419] to-[#021710] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        stats={stats}
        speechRate={speechRate}
        onSetSpeechRate={setSpeechRate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'curriculum' && (
          <CurriculumView
            speechRate={speechRate}
            onStartTest={handleStartTest}
            onStartVoicePractice={handleStartVoicePractice}
          />
        )}

        {activeTab !== 'curriculum' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeTab === 'tests' && (
              <VocabTestView
                initialLesson={testLesson}
                speechRate={speechRate}
                onNavigateToSRS={handleNavigateToSRS}
              />
            )}

            {activeTab === 'speed' && (
              <SpeedDrillView
                speechRate={speechRate}
                onNavigateToVault={handleNavigateToVault}
              />
            )}

            {activeTab === 'builder' && (
              <SentenceBuilderView
                speechRate={speechRate}
                onNavigateToVault={handleNavigateToVault}
              />
            )}

            {activeTab === 'voice' && (
              <VoiceStudioView
                initialVocab={voiceVocab}
                speechRate={speechRate}
              />
            )}

            {activeTab === 'vault' && (
              <MistakeVaultView
                speechRate={speechRate}
                onNavigateToVoice={handleVoiceFromVault}
              />
            )}

            {activeTab === 'srs' && (
              <SRSReviewView
                speechRate={speechRate}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileProgressView
                stats={stats}
              />
            )}
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-950/80 bg-[#021710]/95 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Guten App: Deutsche Akademie</span>
            <span>•</span>
            <span className="text-slate-400">Autonome Plattform für deutsches Sprachtraining</span>
          </div>

          {/* Creator & Tester Credits */}
          <div className="flex items-center gap-2 text-slate-300">
            <span>Created by <strong className="font-bold text-slate-200">ANAND MOHANDAS</strong></span>
            <span className="text-slate-500">|</span>
            <span>Tester: <strong className="font-bold text-slate-200">Gayathri</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>CEFR A1 – C1</span>
            <span>•</span>
            <span>Web Speech API (TTS & STT de-DE)</span>
            <span>•</span>
            <span>Leitner SRS Deck & Fehler-Tresor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
