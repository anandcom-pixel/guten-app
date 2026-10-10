import type { MistakeEntry, MistakeType, CEFRLevel } from '../types';

const MISTAKE_VAULT_KEY = 'gutenapp_mistake_vault_v1';

class MistakeVaultService {
  private mistakes: MistakeEntry[] = [];
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

  private loadState() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(MISTAKE_VAULT_KEY);
      if (saved) {
        this.mistakes = JSON.parse(saved);
      } else {
        // Pre-populate with realistic German learning mistakes
        this.mistakes = [
          {
            id: 'mv-seed-1',
            type: 'gender',
            german: 'das Mädchen',
            english: 'the girl',
            level: 'A1',
            failedAt: new Date().toISOString(),
            contextNote: 'Mistakenly used "die". In German, all nouns ending in diminutive "-chen" are strictly neuter (das)!',
            consecutiveCorrect: 0,
            status: 'unresolved'
          },
          {
            id: 'mv-seed-2',
            type: 'pronunciation',
            german: 'ich möchte',
            english: 'I would like',
            level: 'A1',
            failedAt: new Date().toISOString(),
            contextNote: 'The "ch" in "ich" is the soft ich-Laut (/ç/), not a hard "k" or back-throat "ch".',
            consecutiveCorrect: 0,
            status: 'unresolved',
            phoneticTip: 'Keep your tongue against your bottom front teeth and gently blow air.'
          },
          {
            id: 'mv-seed-3',
            type: 'grammar',
            german: 'Ich bleibe zu Hause, weil ich krank bin.',
            english: 'I am staying home because I am sick.',
            level: 'B1',
            failedAt: new Date().toISOString(),
            contextNote: 'Verb placement error: In subordinate clauses introduced by "weil", the conjugated verb (bin) must stand at the very end.',
            consecutiveCorrect: 0,
            status: 'unresolved'
          }
        ];
        this.saveState();
      }
    } catch {
      this.mistakes = [];
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MISTAKE_VAULT_KEY, JSON.stringify(this.mistakes));
    this.notify();
  }

  public addMistake(data: {
    type: MistakeType;
    german: string;
    english: string;
    level: CEFRLevel;
    contextNote: string;
    phoneticTip?: string;
  }): void {
    const cleanGerman = data.german.trim().toLowerCase();
    const existing = this.mistakes.find(
      m => m.german.trim().toLowerCase() === cleanGerman && m.type === data.type
    );

    if (existing) {
      existing.failedAt = new Date().toISOString();
      existing.contextNote = data.contextNote;
      existing.consecutiveCorrect = 0;
      existing.status = 'unresolved';
      if (data.phoneticTip) existing.phoneticTip = data.phoneticTip;
    } else {
      const newEntry: MistakeEntry = {
        id: `mv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: data.type,
        german: data.german,
        english: data.english,
        level: data.level,
        failedAt: new Date().toISOString(),
        contextNote: data.contextNote,
        consecutiveCorrect: 0,
        status: 'unresolved',
        phoneticTip: data.phoneticTip
      };
      this.mistakes.unshift(newEntry);
    }

    this.saveState();
  }

  public recordMistakeReview(id: string, isCorrect: boolean): void {
    const entry = this.mistakes.find(m => m.id === id);
    if (!entry) return;

    if (isCorrect) {
      entry.consecutiveCorrect += 1;
      if (entry.consecutiveCorrect >= 2) {
        entry.status = 'mastered';
      } else {
        entry.status = 'practicing';
      }
    } else {
      entry.consecutiveCorrect = 0;
      entry.status = 'unresolved';
      entry.failedAt = new Date().toISOString();
    }

    this.saveState();
  }

  public getMistakes(): MistakeEntry[] {
    return this.mistakes;
  }

  public getUnresolvedMistakes(): MistakeEntry[] {
    return this.mistakes.filter(m => m.status !== 'mastered');
  }

  public getStats() {
    const total = this.mistakes.length;
    const mastered = this.mistakes.filter(m => m.status === 'mastered').length;
    const unresolved = total - mastered;
    const vocabCount = this.mistakes.filter(m => m.type === 'vocab').length;
    const genderCount = this.mistakes.filter(m => m.type === 'gender').length;
    const pronunciationCount = this.mistakes.filter(m => m.type === 'pronunciation').length;
    const grammarCount = this.mistakes.filter(m => m.type === 'grammar').length;

    return {
      total,
      mastered,
      unresolved,
      vocabCount,
      genderCount,
      pronunciationCount,
      grammarCount
    };
  }

  public removeMistake(id: string): void {
    this.mistakes = this.mistakes.filter(m => m.id !== id);
    this.saveState();
  }

  public clearMastered(): void {
    this.mistakes = this.mistakes.filter(m => m.status !== 'mastered');
    this.saveState();
  }
}

export const mistakeVaultService = new MistakeVaultService();
