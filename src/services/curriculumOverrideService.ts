import type { Lesson, VocabularyItem, CEFRLevel } from '../types';

const CURRICULUM_OVERRIDES_KEY = 'guten_curriculum_overrides_v1';
const CLOUD_SYNC_CHANNEL = 'guten_cloud_sync_v1';

export interface CustomQuizItem {
  id: string;
  lessonId: string;
  level: CEFRLevel;
  type: 'quiz' | 'sentence';
  questionDe: string;
  answerEn: string;
  options?: string[];
  germanTokens?: string[];
  explanation?: string;
  createdAt: number;
}

export interface GermanQuote {
  id: string;
  german: string;
  english: string;
  author: string;
  category?: string;
  updatedAt: number;
  updatedBy?: string;
}

export const DEFAULT_GERMAN_QUOTE: GermanQuote = {
  id: 'daily-quote-slot',
  german: "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
  english: "Knowing is not enough, we must apply; willing is not enough, we must do.",
  author: "Johann Wolfgang von Goethe",
  category: "Klassiker & Philosophie",
  updatedAt: 1700000000000,
  updatedBy: 'system'
};

export interface CurriculumOverrides {
  lessons: Record<string, Partial<Lesson>>;
  vocabulary: Record<string, Partial<VocabularyItem>>;
  newVocabulary: Record<string, VocabularyItem[]>; // lessonId -> new items
  customLessons: Lesson[];
  customQuizItems: CustomQuizItem[];
  dailyQuote?: GermanQuote | null; // designated single daily quote slot
  lastSyncedAt?: number;
}

class CurriculumOverrideService {
  private overrides: CurriculumOverrides = {
    lessons: {},
    vocabulary: {},
    newVocabulary: {},
    customLessons: [],
    customQuizItems: [],
    dailyQuote: null,
    lastSyncedAt: Date.now()
  };
  private listeners: Set<() => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private isSyncing: boolean = false;

  constructor() {
    this.loadOverrides();
    this.initBroadcastChannel();
    this.initCloudSync();
  }

  private loadOverrides() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(CURRICULUM_OVERRIDES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.overrides = {
          lessons: parsed.lessons || {},
          vocabulary: parsed.vocabulary || {},
          newVocabulary: parsed.newVocabulary || {},
          customLessons: Array.isArray(parsed.customLessons) ? parsed.customLessons : [],
          customQuizItems: Array.isArray(parsed.customQuizItems) ? parsed.customQuizItems : [],
          dailyQuote: parsed.dailyQuote || null,
          lastSyncedAt: parsed.lastSyncedAt || Date.now()
        };
      }
    } catch (e) {
      console.warn('Failed to parse Guten curriculum overrides:', e);
    }
  }

  private initBroadcastChannel() {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    try {
      this.broadcastChannel = new BroadcastChannel(CLOUD_SYNC_CHANNEL);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_OVERWRITE') {
          this.loadOverrides();
          this.notify();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel initialization error:', e);
    }
  }

  private initCloudSync() {
    if (typeof window === 'undefined') return;

    // Initial sync
    setTimeout(() => {
      this.syncWithCloud();
    }, 400);

    // Re-sync on window focus for cross-session/cross-user consistency
    window.addEventListener('focus', () => {
      this.syncWithCloud();
    });
  }

  private async saveOverrides(syncToCloud: boolean = true) {
    if (typeof window === 'undefined') return;
    this.overrides.lastSyncedAt = Date.now();
    localStorage.setItem(CURRICULUM_OVERRIDES_KEY, JSON.stringify(this.overrides));
    this.notify();

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'SYNC_OVERWRITE', timestamp: Date.now() });
      } catch (e) {
        console.warn('BroadcastChannel post error:', e);
      }
    }

    if (syncToCloud) {
      this.pushToCloud();
    }
  }

  public async syncWithCloud(): Promise<boolean> {
    if (typeof window === 'undefined' || this.isSyncing) return false;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/content', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.data) {
          const cloudData = result.data;

          const localCustomLessonMap = new Map(this.overrides.customLessons.map(l => [l.id, l]));
          (cloudData.customLessons || []).forEach((cl: Lesson) => {
            localCustomLessonMap.set(cl.id, cl);
          });

          const localQuizItemMap = new Map(this.overrides.customQuizItems.map(q => [q.id, q]));
          (cloudData.customQuizItems || []).forEach((q: CustomQuizItem) => {
            localQuizItemMap.set(q.id, q);
          });

          const mergedNewVocab: Record<string, VocabularyItem[]> = { ...this.overrides.newVocabulary };
          if (cloudData.newVocabulary) {
            Object.entries(cloudData.newVocabulary).forEach(([lessonId, list]) => {
              const existing = mergedNewVocab[lessonId] || [];
              const existingIds = new Set(existing.map(v => v.id));
              const additions = (list as VocabularyItem[]).filter(v => !existingIds.has(v.id));
              mergedNewVocab[lessonId] = [...existing, ...additions];
            });
          }

          // Single designated daily quote slot: merge newer or cloud if updated
          let mergedDailyQuote = this.overrides.dailyQuote;
          if (cloudData.dailyQuote) {
            if (!mergedDailyQuote || (cloudData.dailyQuote.updatedAt >= (mergedDailyQuote.updatedAt || 0))) {
              mergedDailyQuote = cloudData.dailyQuote;
            }
          }

          this.overrides = {
            lessons: { ...(cloudData.lessons || {}), ...this.overrides.lessons },
            vocabulary: { ...(cloudData.vocabulary || {}), ...this.overrides.vocabulary },
            newVocabulary: mergedNewVocab,
            customLessons: Array.from(localCustomLessonMap.values()),
            customQuizItems: Array.from(localQuizItemMap.values()),
            dailyQuote: mergedDailyQuote,
            lastSyncedAt: Date.now()
          };

          localStorage.setItem(CURRICULUM_OVERRIDES_KEY, JSON.stringify(this.overrides));
          this.notify();
          this.isSyncing = false;
          return true;
        }
      }
    } catch (e) {
      console.warn('Guten cloud sync error, using local storage:', e);
    }
    this.isSyncing = false;
    return false;
  }

  public async pushToCloud(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.overrides)
      });
      return res.ok;
    } catch (e) {
      console.warn('Failed to push Guten overrides to Vercel cloud:', e);
      return false;
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getOverrides(): CurriculumOverrides {
    return this.overrides;
  }

  public hasOverrides(): boolean {
    const hasLessonOverrides = Object.keys(this.overrides.lessons).length > 0;
    const hasVocabOverrides = Object.keys(this.overrides.vocabulary).length > 0;
    const hasNewVocab = Object.values(this.overrides.newVocabulary).some(list => list.length > 0);
    const hasCustomLessons = this.overrides.customLessons.length > 0;
    const hasCustomQuiz = this.overrides.customQuizItems.length > 0;
    return hasLessonOverrides || hasVocabOverrides || hasNewVocab || hasCustomLessons || hasCustomQuiz;
  }

  public applyOverrides(lessons: Lesson[]): Lesson[] {
    const existingIds = new Set(lessons.map(l => l.id));

    // 1. Merge overrides on existing base curriculum lessons
    const updatedLessons = lessons.map(lesson => {
      const lessonOverride = this.overrides.lessons[lesson.id] || {};
      const newItems = this.overrides.newVocabulary[lesson.id] || [];

      const updatedVocabulary = lesson.vocabulary.map(v => {
        const vocabOverride = this.overrides.vocabulary[v.id];
        return vocabOverride ? { ...v, ...vocabOverride } : v;
      });

      return {
        ...lesson,
        ...lessonOverride,
        grammarFocus: {
          ...lesson.grammarFocus,
          ...(lessonOverride.grammarFocus || {})
        },
        vocabulary: [...updatedVocabulary, ...newItems]
      };
    });

    // 2. Append custom lessons created dynamically by users
    const customLessonsToAdd = (this.overrides.customLessons || []).filter(
      cl => !existingIds.has(cl.id)
    ).map(cl => {
      const newItems = this.overrides.newVocabulary[cl.id] || [];
      const lessonOverride = this.overrides.lessons[cl.id] || {};
      return {
        ...cl,
        ...lessonOverride,
        grammarFocus: {
          ...cl.grammarFocus,
          ...(lessonOverride.grammarFocus || {})
        },
        vocabulary: [...cl.vocabulary, ...newItems]
      };
    });

    return [...updatedLessons, ...customLessonsToAdd];
  }

  public saveLessonOverride(lessonId: string, partial: Partial<Lesson>) {
    this.overrides.lessons[lessonId] = {
      ...(this.overrides.lessons[lessonId] || {}),
      ...partial
    };
    this.saveOverrides(true);
  }

  public saveVocabOverride(vocabId: string, partial: Partial<VocabularyItem>) {
    this.overrides.vocabulary[vocabId] = {
      ...(this.overrides.vocabulary[vocabId] || {}),
      ...partial
    };
    this.saveOverrides(true);
  }

  public addVocabularyItem(lessonId: string, item: VocabularyItem) {
    if (!this.overrides.newVocabulary[lessonId]) {
      this.overrides.newVocabulary[lessonId] = [];
    }
    const existing = this.overrides.newVocabulary[lessonId];
    if (!existing.some(v => v.id === item.id)) {
      this.overrides.newVocabulary[lessonId].push(item);
    }
    this.saveOverrides(true);
  }

  public addCustomLesson(lesson: Lesson) {
    const existingIdx = this.overrides.customLessons.findIndex(l => l.id === lesson.id);
    if (existingIdx >= 0) {
      this.overrides.customLessons[existingIdx] = lesson;
    } else {
      this.overrides.customLessons.push(lesson);
    }
    this.saveOverrides(true);
  }

  public addCustomQuizItem(item: CustomQuizItem) {
    const existingIdx = this.overrides.customQuizItems.findIndex(q => q.id === item.id);
    if (existingIdx >= 0) {
      this.overrides.customQuizItems[existingIdx] = item;
    } else {
      this.overrides.customQuizItems.push(item);
    }
    this.saveOverrides(true);
  }

  public getCustomLessons(): Lesson[] {
    return this.overrides.customLessons || [];
  }

  public getCustomQuizItems(): CustomQuizItem[] {
    return this.overrides.customQuizItems || [];
  }

  public getDailyQuote(): GermanQuote {
    return this.overrides.dailyQuote || DEFAULT_GERMAN_QUOTE;
  }

  // Adding a new quote replaces the existing one in the single designated slot!
  public setDailyQuote(
    german: string,
    english: string,
    author?: string,
    category?: string,
    updatedBy?: string
  ): GermanQuote {
    const quote: GermanQuote = {
      id: 'daily-quote-slot',
      german: german.trim(),
      english: english.trim(),
      author: (author && author.trim()) || 'Deutsches Sprichwort',
      category: (category && category.trim()) || 'Motivation & Weisheit',
      updatedAt: Date.now(),
      updatedBy: updatedBy || 'Benutzer'
    };
    // Replaces previous daily quote slot
    this.overrides.dailyQuote = quote;
    this.saveOverrides(true);
    return quote;
  }

  public resetAllOverrides() {
    this.overrides = {
      lessons: {},
      vocabulary: {},
      newVocabulary: {},
      customLessons: [],
      customQuizItems: [],
      dailyQuote: null,
      lastSyncedAt: Date.now()
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRICULUM_OVERRIDES_KEY);
    }
    this.saveOverrides(true);
  }
}

export const curriculumOverrideService = new CurriculumOverrideService();
