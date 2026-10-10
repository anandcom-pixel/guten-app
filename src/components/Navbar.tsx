import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Mic,
  Brain,
  Award,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  Gauge,
  Puzzle,
  ShieldAlert
} from 'lucide-react';
import type { UserStats } from '../types';
import { speechService, type GermanVoiceOption } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export type NavigationTab = 'curriculum' | 'tests' | 'speed' | 'builder' | 'voice' | 'vault' | 'srs' | 'profile';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  stats: UserStats;
  speechRate: number;
  onSetSpeechRate: (rate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  stats,
  speechRate,
  onSetSpeechRate
}) => {
  const [germanVoices, setGermanVoices] = useState<GermanVoiceOption[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  useEffect(() => {
    const updateVoices = () => {
      const voices = speechService.getGermanVoices();
      setGermanVoices(voices);
      const current = speechService.getSelectedVoice();
      if (current) {
        setSelectedVoiceName(current.name);
      }
    };

    updateVoices();
    const unsub = speechService.onVoiceChange(updateVoices);
    return () => unsub();
  }, []);

  const handleToggleSound = () => {
    const newState = soundEffects.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      soundEffects.playTap();
    }
  };

  const navItems = [
    { id: 'curriculum', label: 'Curriculum & Lessons', icon: BookOpen },
    { id: 'tests', label: 'Vocab Test Lab', icon: CheckCircle2 },
    { id: 'speed', label: 'Speed Drill (30s)', icon: Zap },
    { id: 'builder', label: 'Sentence Builder', icon: Puzzle },
    { id: 'voice', label: 'Voice Studio', icon: Mic },
    { id: 'vault', label: 'Mistake Vault', icon: ShieldAlert },
    { id: 'srs', label: 'Leitner SRS Deck', icon: Brain },
    { id: 'profile', label: 'Progress & Badges', icon: Award }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div
            onClick={() => onSelectTab('curriculum')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-600 to-slate-900 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  GA
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Guten App
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>🇩🇪</span> DEUTSCH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Deutsche Akademie & Sprachtraining</p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400" title="Daily Streak">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{stats.streak} {stats.streak === 1 ? 'Tag' : 'Tage'}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300" title="XP Points">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{stats.xp} XP</span>
            </div>
            <div className="w-px h-3.5 bg-slate-800" />
            <div
              onClick={() => onSelectTab('profile')}
              className="text-[11px] font-medium text-slate-300 hover:text-white cursor-pointer px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              {stats.levelRank.split(' ')[0]}
            </div>
          </div>

          {/* Audio & Settings Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  const nextRate = speechRate === 1.0 ? 0.75 : speechRate === 0.75 ? 1.2 : 1.0;
                  onSetSpeechRate(nextRate);
                  soundEffects.playTap();
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Audio playback speed"
              >
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>{speechRate}x</span>
              </button>
            </div>

            {/* German Voice Picker Button */}
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Select German Native TTS Voice"
            >
              <span className="text-sm">🗣️</span>
              <span className="hidden lg:inline max-w-[100px] truncate">
                {selectedVoiceName ? selectedVoiceName.replace(/Google|Microsoft/gi, '').trim() : 'Stimme DE'}
              </span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-900">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEffects.playTap();
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Voice Selection Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🇩🇪</span> Deutsche Aussprache-Stimme
                </h3>
                <p className="text-xs text-slate-400">Wähle eine native deutsche TTS-Stimme</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {germanVoices.length === 0 ? (
                <div className="p-4 bg-slate-950/60 rounded-xl text-xs text-slate-400 text-center">
                  Standard-Browserstimme für Deutsch (de-DE) wird automatisch verwendet.
                </div>
              ) : (
                germanVoices.map(v => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => {
                      speechService.setSelectedVoice(v.name);
                      setSelectedVoiceName(v.name);
                      speechService.speak('Guten Tag! Ich bin Ihre Aussprache-Assistentin für Deutsch.');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      selectedVoiceName === v.name
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{v.name}</div>
                      <div className="text-[11px] text-slate-500">{v.lang} {v.isPreferred ? '• Empfohlen' : ''}</div>
                    </div>
                    {selectedVoiceName === v.name && (
                      <span className="text-amber-400 text-xs font-bold">Aktiv ✓</span>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/30"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
