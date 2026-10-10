import React, { useState } from 'react';
import {
  Award,
  Zap,
  Flame,
  Mic,
  Brain,
  Trash2,
  Check
} from 'lucide-react';
import type { UserStats } from '../types';
import { srsService } from '../services/srsService';
import { soundEffects } from '../services/soundEffects';

interface ProfileProgressViewProps {
  stats: UserStats;
}

export const ProfileProgressView: React.FC<ProfileProgressViewProps> = ({ stats }) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleReset = () => {
    srsService.resetAllProgress();
    setShowResetConfirm(false);
    soundEffects.playTap();
  };

  const getLevelProgress = (xp: number) => {
    const thresholds = [
      { max: 150, title: 'Anfänger (Stufe 1)', min: 0 },
      { max: 400, title: 'Lernender (Stufe 2)', min: 150 },
      { max: 800, title: 'Sprachreisender (Stufe 3)', min: 400 },
      { max: 1500, title: 'Deutschkenner (Stufe 4)', min: 800 },
      { max: 2500, title: 'Wortgewandter (Stufe 5)', min: 1500 },
      { max: 5000, title: 'Meister der Akademie (Stufe 6)', min: 2500 }
    ];

    const currentTier = thresholds.find(t => xp < t.max) || thresholds[thresholds.length - 1];
    const span = currentTier.max - currentTier.min;
    const currentProgress = xp - currentTier.min;
    const percentage = Math.min(Math.round((currentProgress / span) * 100), 100);

    return {
      title: currentTier.title,
      nextGoal: currentTier.max,
      percentage
    };
  };

  const levelInfo = getLevelProgress(stats.xp);

  return (
    <div className="space-y-8 animate-in fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Profile Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-400 p-0.5 shadow-xl shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-black">
              🇩🇪
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Lernprofil
              </span>
              <span className="text-xs text-slate-400">
                Guten App: Deutsche Akademie
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {stats.levelRank}
            </h1>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Rang-Fortschritt</span>
                <span className="text-amber-400 font-bold">{stats.xp} / {levelInfo.nextGoal} XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${levelInfo.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="flex justify-center mb-1">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">{stats.streak}</div>
          <div className="text-[11px] text-slate-400 font-medium">Tage in Folge</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="flex justify-center mb-1">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats.xp}</div>
          <div className="text-[11px] text-slate-400 font-medium">Gesamt-XP</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="flex justify-center mb-1">
            <Brain className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{stats.wordsMastered}</div>
          <div className="text-[11px] text-slate-400 font-medium">Gemeisterte Wörter (B4/B5)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
          <div className="flex justify-center mb-1">
            <Mic className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-300">{stats.voiceDrillsPassed}</div>
          <div className="text-[11px] text-slate-400 font-medium">Aussprache-Drills</div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Abzeichen & Errungenschaften
            </h2>
            <p className="text-xs text-slate-400">Belohnungen für Ausdauer, Genauigkeit und Sprachtraining</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {stats.badges.map(badge => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/70 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/30 border-slate-900 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl select-none">{badge.icon}</div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{badge.description}</p>
                    {isUnlocked && badge.unlockedAt && (
                      <span className="text-[10px] text-amber-400 font-mono block mt-1">
                        Freigeschaltet: {badge.unlockedAt.split('T')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              Daten Zurücksetzen
            </h3>
            <p className="text-xs text-slate-400">
              Löscht deinen lokalen Lernfortschritt, deine Leitner-Karten und XP, um von vorn zu beginnen.
            </p>
          </div>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-xs text-slate-300 font-medium transition-colors"
            >
              Fortschritt zurücksetzen
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                Endgültig löschen
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
