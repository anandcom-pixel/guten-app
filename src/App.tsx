import { useState, useEffect } from 'react';
import { Navbar, type NavigationTab } from './components/Navbar';
import { CurriculumView } from './components/CurriculumView';
import { VocabTestView } from './components/VocabTestView';
import { SpeedDrillView } from './components/SpeedDrillView';
import { SentenceBuilderView } from './components/SentenceBuilderView';
import { VoiceStudioView } from './components/VoiceStudioView';
import { MistakeVaultView } from './components/MistakeVaultView';
import { SRSReviewView } from './components/SRSReviewView';
import { ProfileProgressView } from './components/ProfileProgressView';
import type { Lesson, VocabularyItem, UserStats } from './types';
import { srsService } from './services/srsService';
import { CURRICULUM_DATA } from './data/curriculumData';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('curriculum');
  const [stats, setStats] = useState<UserStats>(srsService.getStats());
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [testLesson, setTestLesson] = useState<Lesson | null>(null);
  const [voiceVocab, setVoiceVocab] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    const unsub = srsService.subscribe(() => {
      setStats({ ...srsService.getStats() });
    });
    return () => unsub();
  }, []);

  const handleStartTest = (lesson: Lesson) => {
    setTestLesson(lesson);
    setActiveTab('tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartVoicePractice = (vocab: VocabularyItem) => {
    setVoiceVocab(vocab);
    setActiveTab('voice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSRS = () => {
    setActiveTab('srs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToVault = () => {
    setActiveTab('vault');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceFromVault = (germanText: string) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#063826] via-[#042419] to-[#021710] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-950/80 bg-[#021710]/95 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Guten App: Deutsche Akademie</span>
            <span>•</span>
            <span className="text-slate-400">Autonome Plattform für deutsches Sprachtraining</span>
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
