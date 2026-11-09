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
  ShieldAlert,
  LogIn,
  LogOut,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import type { UserStats } from '../types';
import type { AuthUser } from '../types/auth';
import { speechService, type GermanVoiceOption } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export type NavigationTab = 'curriculum' | 'tests' | 'speed' | 'builder' | 'voice' | 'vault' | 'srs' | 'profile';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  stats: UserStats;
  speechRate: number;
  onSetSpeechRate: (rate: number) => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onOpenReport: () => void;
  onLogout: () => void;
  onOpenAddContent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  stats,
  speechRate,
  onSetSpeechRate,
  currentUser,
  onOpenLogin,
  onOpenReport,
  onLogout,
  onOpenAddContent
}) => {
  const [germanVoices, setGermanVoices] = useState<GermanVoiceOption[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(speechService.getIsSpeaking());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    const unsubVoice = speechService.onVoiceChange(updateVoices);
    const unsubSpeak = speechService.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubVoice();
      unsubSpeak();
    };
  }, []);

  const handleToggleSound = () => {
    const newState = soundEffects.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      soundEffects.playTap();
    }
  };

  const handleSelectTabAndCloseMobile = (tab: NavigationTab) => {
    soundEffects.playTap();
    onSelectTab(tab);
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-40 bg-[#042419]/95 backdrop-blur-md border-b border-emerald-900/50 transition-all text-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <div
            onClick={() => handleSelectTabAndCloseMobile('curriculum')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-600 to-slate-900 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  GA
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Guten App
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>🇩🇪</span> <span className="hidden xs:inline">DEUTSCH</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Deutsche Akademie &amp; Sprachtraining</p>
            </div>
          </div>

          {/* Quick Stats Pill (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
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

          {/* Desktop Right Side Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Active TTS Playback Indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold animate-pulse shadow-sm shadow-amber-500/20">
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span className="hidden sm:inline">Audio aktiv...</span>
              </div>
            )}

            {/* Speed Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  const nextRate = speechRate === 1.0 ? 0.75 : speechRate === 0.75 ? 1.2 : 1.0;
                  onSetSpeechRate(nextRate);
                  soundEffects.playTap();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-200"
                title="Change audio playback speed"
              >
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Speed: {speechRate}x</span>
              </button>
            </div>

            {/* German Voice Picker Button */}
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all duration-200"
              title="Select German Native TTS Voice"
            >
              <span className="text-sm">🗣️</span>
              <span className="hidden lg:inline max-w-[110px] truncate">
                {selectedVoiceName ? selectedVoiceName.replace(/Google|Microsoft/gi, '').trim() : 'German Voice'}
              </span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'SFX On' : 'Muted'}</span>
            </button>

            {/* Auth Controls & Status */}
            <div className="h-5 w-px bg-emerald-900/60 hidden sm:block" />

            {currentUser ? (
              <div className="flex items-center gap-1.5">
                {/* User Status Badge */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm ${
                    currentUser.role === 'admin'
                      ? 'bg-slate-950 text-amber-300 border-amber-400/60'
                      : 'bg-slate-950 text-emerald-300 border-emerald-400/60'
                  }`}
                  title={`Angemeldet als ${currentUser.displayName} (Universal Add & Edit)`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.displayName}</span>
                </div>

                {/* Universal Add Content Button for All Authorized Users */}
                <button
                  type="button"
                  onClick={onOpenAddContent}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 border border-emerald-400 transition-all transform hover:-translate-y-0.5 active:scale-95"
                  title="Neuen Inhalt hinzufügen (Lektion, Wortschatz, Quiz)"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">+ Neuer Inhalt</span>
                  <span className="sm:hidden">+ Inhalt</span>
                </button>

                {/* Evaluation Report Trigger Button */}
                <button
                  type="button"
                  onClick={onOpenReport}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
                  title="Evaluationsbericht an anand.com@gmail.com senden"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Bericht</span>
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-all text-xs"
                  title="Abmelden"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5 active:scale-95"
                title="Anmelden (Admin, Sreegovind oder Gayathri)"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Anmelden</span>
              </button>
            )}
          </div>

          {/* Mobile Right Side Controls: SFX, Quick Add/Login, & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Active TTS Playback Indicator on Mobile */}
            {isSpeaking && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold animate-pulse">
                <Volume2 className="w-3 h-3 text-amber-400 animate-bounce" />
              </div>
            )}

            {/* Quick SFX Toggle on Mobile */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-amber-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={soundEnabled ? 'SFX On' : 'SFX Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Add Content button on Mobile if Logged In */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenAddContent}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 border border-emerald-400 active:scale-95"
                title="Neuen Inhalt hinzufügen"
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>+ Inhalt</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-300 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                title="Anmelden"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Login</span>
              </button>
            )}

            {/* Responsive Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playTap();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Navigation Menü umschalten"
              className={`p-2 rounded-xl border transition-all ${
                mobileMenuOpen
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-600 text-slate-200'
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-950/80 bg-slate-950/98 backdrop-blur-xl px-3 py-4 space-y-4 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            {/* Account & User Action Panel */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              {currentUser ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {currentUser.role === 'admin' ? (
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{currentUser.displayName}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          {currentUser.role === 'admin' ? 'Administrator • Vollzugriff' : 'Autorisierter Benutzer • Vollzugriff'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 active:scale-95"
                      title="Abmelden"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Abmelden</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAddContent?.();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 border border-emerald-400 active:scale-95"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Neuer Inhalt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenReport();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bericht senden</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-300">
                    Melden Sie sich an als <strong className="text-amber-300">Admin</strong>, <strong className="text-emerald-300">Sreegovind</strong> oder <strong className="text-emerald-300">Gayathri</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-slate-950" />
                    <span>Anmelden (Vollzugriff)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Audio & Pronunciation Settings Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Audio &amp; Aussprache-Optionen
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Speed Controls */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Tempo:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[0.75, 1.0, 1.2].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          onSetSpeechRate(rate);
                          soundEffects.playTap();
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          speechRate === rate
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* German Voice Modal Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setShowVoiceModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between truncate"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>🗣️</span>
                    <span className="truncate text-[11px]">
                      {selectedVoiceName ? selectedVoiceName.replace(/Google|Microsoft/gi, '').trim() : 'Stimme'}
                    </span>
                  </span>
                  <span className="text-amber-400 text-[10px] shrink-0 font-bold">Ändern</span>
                </button>
              </div>
            </div>

            {/* Mobile Stats Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
                  <span>{stats.streak} {stats.streak === 1 ? 'Tag' : 'Tage'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Daily Streak</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-amber-300 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{stats.xp} XP</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Punkte</div>
              </div>
              <div
                onClick={() => handleSelectTabAndCloseMobile('profile')}
                className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-0.5 cursor-pointer hover:bg-slate-800"
              >
                <div className="text-white text-xs font-bold truncate">
                  {stats.levelRank.split(' ')[0]}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">Rang &amp; Profil</div>
              </div>
            </div>

            {/* Full Modules Navigation */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Lernmodule &amp; Trainingsbereiche
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTabAndCloseMobile(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                          : 'bg-slate-900/70 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40">
                          Aktiv
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Quick Horizontal Swipe Tab Strip (when mobile drawer is closed) */}
        {!mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-900/40 bg-[#021710]/95 px-2 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
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
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                      : 'bg-slate-900/70 text-slate-300 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop Tab Navigation Bar */}
        <nav className="hidden md:flex md:flex-wrap md:items-center gap-1.5 sm:gap-2 py-2.5 border-t border-emerald-900/50">
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
                className={`flex items-center justify-start gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none transform hover:-translate-y-0.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10 font-bold'
                    : 'bg-slate-900/50 text-slate-300 border border-slate-800/70 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Voice Selection Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🇩🇪</span> Deutsche Aussprache-Stimme
                </h3>
                <p className="text-xs text-slate-300">Wählen Sie die native Sprachsynthese-Stimme</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {germanVoices.length === 0 ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 text-center">
                  Standard-Browser-Stimme wird automatisch verwendet.
                </div>
              ) : (
                germanVoices.map(v => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => {
                      speechService.setSelectedVoice(v.name);
                      setSelectedVoiceName(v.name);
                      speechService.speak('Guten Tag! Ich bin deine deutsche Aussprachehilfe.');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      selectedVoiceName === v.name
                        ? 'bg-slate-950 border-amber-500/60 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{v.name}</div>
                      <div className="text-[11px] text-slate-400">{v.lang} {v.isPreferred ? '• Empfohlen' : ''}</div>
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
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20"
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
