import type { LeitnerCard, UserStats, Badge, VocabularyItem } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';

const SRS_CARDS_KEY = 'gutenapp_srs_cards_v1';
const USER_STATS_KEY = 'gutenapp_user_stats_v1';
const COMPLETED_LESSONS_KEY = 'gutenapp_completed_lessons_v1';

const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_word',
    title: 'Erste Worte',
    description: 'Practiced your first German pronunciation drill in Voice Studio',
    icon: '🎙️'
  },
  {
    id: 'perfect_score',
    title: 'Meisterprüfung',
    description: 'Scored 100% in a German vocabulary assessment test',
    icon: '🎯'
  },
  {
    id: 'streak_3',
    title: 'Eiserner Wille',
    description: 'Maintained a 3-day German learning streak',
    icon: '🔥'
  },
  {
    id: 'box_5_master',
    title: 'Elefantengedächtnis',
    description: 'Advanced a German vocabulary item to Leitner Box 5',
    icon: '🧠'
  },
  {
    id: 'voice_master',
    title: 'Goldene Stimme',
    description: 'Successfully passed 5 voice pronunciation tests',
    icon: '🏆'
  },
  {
    id: 'polyglot_500',
    title: 'Goethe-Orden',
    description: 'Earned 500+ XP in Guten App',
    icon: '⚡'
  },
  {
    id: 'speed_drill_ace',
    title: 'Blitzschnell',
    description: 'Achieved a high combo in Speed Drill 30s challenge',
    icon: '⏱️'
  },
  {
    id: 'syntax_builder',
    title: 'Satzbaumeister',
    description: 'Assembled correct German word order in Sentence Builder',
    icon: '🏗️'
  }
];

class SRSService {
  private cards: LeitnerCard[] = [];
  private completedLessons: Set<string> = new Set();
  private stats: UserStats = {
    xp: 60,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    wordsMastered: 0,
    testsCompleted: 0,
    voiceDrillsPassed: 0,
    levelRank: 'Anfänger (Stufe 1)',
    badges: INITIAL_BADGES
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private loadState() {
    if (typeof window === 'undefined') return;

    try {
      const savedCards = localStorage.getItem(SRS_CARDS_KEY);
      if (savedCards) {
        this.cards = JSON.parse(savedCards);
      } else {
        this.seedInitialCards();
      }

      const savedStats = localStorage.getItem(USER_STATS_KEY);
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
        this.checkStreak();
      } else {
        this.saveStats();
      }

      const savedCompleted = localStorage.getItem(COMPLETED_LESSONS_KEY);
      if (savedCompleted) {
        const parsed: string[] = JSON.parse(savedCompleted);
        this.completedLessons = new Set(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse local storage state:', e);
      this.seedInitialCards();
    }
  }

  private seedInitialCards() {
    const seedVocabs = CURRICULUM_DATA.flatMap(l => l.vocabulary).slice(0, 12);
    const today = new Date().toISOString();

    this.cards = seedVocabs.map((vocab, index) => {
      const box = index < 3 ? 1 : index < 6 ? 2 : index < 9 ? 3 : 4;
      return {
        vocabId: vocab.id,
        german: vocab.german,
        article: vocab.article,
        english: vocab.english,
        level: vocab.level,
        box: box as 1 | 2 | 3 | 4 | 5,
        lastReviewed: today,
        nextReviewDate: today,
        consecutiveCorrect: box,
        timesReviewed: box,
        timesFailed: 0
      };
    });
    this.saveCards();
  }

  private saveCards() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SRS_CARDS_KEY, JSON.stringify(this.cards));
    this.notify();
  }

  private saveStats() {
    if (typeof window === 'undefined') return;
    this.updateRank();
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(this.stats));
    this.notify();
  }

  private checkStreak() {
    const today = this.getTodayString();
    const lastActive = this.stats.lastActiveDate;

    if (lastActive === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
      this.stats.streak += 1;
      this.stats.lastActiveDate = today;
      if (this.stats.streak >= 3) {
        this.unlockBadge('streak_3');
      }
    } else {
      this.stats.streak = 1;
      this.stats.lastActiveDate = today;
    }
    this.saveStats();
  }

  private updateRank() {
    const xp = this.stats.xp;
    if (xp < 150) {
      this.stats.levelRank = 'Anfänger (Stufe 1)';
    } else if (xp < 400) {
      this.stats.levelRank = 'Lernender (Stufe 2)';
    } else if (xp < 800) {
      this.stats.levelRank = 'Sprachreisender (Stufe 3)';
    } else if (xp < 1500) {
      this.stats.levelRank = 'Deutschkenner (Stufe 4)';
    } else if (xp < 2500) {
      this.stats.levelRank = 'Wortgewandter (Stufe 5)';
    } else {
      this.stats.levelRank = 'Meister der Akademie (Stufe 6)';
    }

    if (xp >= 500) {
      this.unlockBadge('polyglot_500');
    }
  }

  public unlockBadge(badgeId: string): boolean {
    const badge = this.stats.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = new Date().toISOString();
      this.stats.xp += 40;
      this.saveStats();
      return true;
    }
    return false;
  }

  public addXP(amount: number) {
    this.stats.xp += amount;
    this.stats.lastActiveDate = this.getTodayString();
    this.saveStats();
  }

  public getCards(): LeitnerCard[] {
    return this.cards;
  }

  public getStats(): UserStats {
    return this.stats;
  }

  public getDueCards(): LeitnerCard[] {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return this.cards.filter(c => new Date(c.nextReviewDate) <= now);
  }

  public getBoxCounts(): Record<1 | 2 | 3 | 4 | 5, number> {
    const counts: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.cards.forEach(c => {
      counts[c.box] = (counts[c.box] || 0) + 1;
    });
    return counts;
  }

  public recordResult(vocabId: string, isCorrect: boolean, vocabItem?: VocabularyItem) {
    let card = this.cards.find(c => c.vocabId === vocabId);

    const now = new Date();
    const nowIso = now.toISOString();

    if (!card) {
      const vocab = vocabItem || CURRICULUM_DATA.flatMap(l => l.vocabulary).find(v => v.id === vocabId);
      if (!vocab) return;

      card = {
        vocabId: vocab.id,
        german: vocab.german,
        article: vocab.article,
        english: vocab.english,
        level: vocab.level,
        box: 1,
        lastReviewed: nowIso,
        nextReviewDate: nowIso,
        consecutiveCorrect: 0,
        timesReviewed: 0,
        timesFailed: 0
      };
      this.cards.push(card);
    }

    card.timesReviewed += 1;
    card.lastReviewed = nowIso;

    if (isCorrect) {
      card.consecutiveCorrect += 1;
      const nextBox = Math.min(card.box + 1, 5) as 1 | 2 | 3 | 4 | 5;
      card.box = nextBox;

      if (nextBox === 5) {
        this.unlockBadge('box_5_master');
      }

      const intervals = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 };
      const daysToAdd = intervals[nextBox];
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      card.nextReviewDate = nextDate.toISOString();

      this.addXP(10);
    } else {
      card.timesFailed += 1;
      card.consecutiveCorrect = 0;
      card.box = 1;

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      card.nextReviewDate = nextDate.toISOString();

      this.addXP(2);
    }

    this.stats.wordsMastered = this.cards.filter(c => c.box >= 4).length;

    this.saveCards();
    this.saveStats();
  }

  public queueFailedItem(vocab: VocabularyItem) {
    this.recordResult(vocab.id, false, vocab);
  }

  public recordTestCompleted(scorePercentage: number) {
    this.stats.testsCompleted += 1;
    const baseXP = 30;
    const accuracyXP = Math.round((scorePercentage / 100) * 20);
    this.addXP(baseXP + accuracyXP);

    if (scorePercentage === 100) {
      this.unlockBadge('perfect_score');
    }
    this.saveStats();
  }

  public recordVoicePassed() {
    this.stats.voiceDrillsPassed += 1;
    this.unlockBadge('first_word');
    if (this.stats.voiceDrillsPassed >= 5) {
      this.unlockBadge('voice_master');
    }
    this.addXP(25);
    this.saveStats();
  }

  private saveCompletedLessons() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(Array.from(this.completedLessons)));
    this.notify();
  }

  public isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons.has(lessonId);
  }

  public getCompletedLessonIds(): string[] {
    return Array.from(this.completedLessons);
  }

  public markLessonCompleted(lessonId: string): boolean {
    if (!this.completedLessons.has(lessonId)) {
      this.completedLessons.add(lessonId);
      this.addXP(25);
      this.saveCompletedLessons();
      return true;
    }
    return false;
  }

  public toggleLessonCompleted(lessonId: string): boolean {
    if (this.completedLessons.has(lessonId)) {
      this.completedLessons.delete(lessonId);
      this.saveCompletedLessons();
      return false;
    } else {
      this.completedLessons.add(lessonId);
      this.addXP(25);
      this.saveCompletedLessons();
      return true;
    }
  }

  public resetAllProgress() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SRS_CARDS_KEY);
    localStorage.removeItem(USER_STATS_KEY);
    localStorage.removeItem(COMPLETED_LESSONS_KEY);
    this.completedLessons.clear();
    this.seedInitialCards();
    this.stats = {
      xp: 60,
      streak: 1,
      lastActiveDate: this.getTodayString(),
      wordsMastered: 0,
      testsCompleted: 0,
      voiceDrillsPassed: 0,
      levelRank: 'Anfänger (Stufe 1)',
      badges: INITIAL_BADGES
    };
    this.saveStats();
  }
}

export const srsService = new SRSService();
