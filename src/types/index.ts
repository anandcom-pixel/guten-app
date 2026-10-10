export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type GermanGender = 'der' | 'die' | 'das' | 'none' | 'pl';
export type GermanCase = 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv';

export interface VocabularyItem {
  id: string;
  german: string;
  article?: 'der' | 'die' | 'das';
  baseWord: string;
  plural?: string;
  english: string;
  ipa?: string;
  gender?: GermanGender;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'adverb' | 'conjunction';
  exampleGerman: string;
  exampleEnglish: string;
  pronunciationTip?: string;
  caseHint?: string;
  level: CEFRLevel;
  category: string;
}

export interface DialogueLine {
  speaker: string;
  german: string;
  english: string;
  audioRate?: number;
}

export interface Dialogue {
  id: string;
  title: string;
  scenario: string;
  lines: DialogueLine[];
}

export interface Lesson {
  id: string;
  level: CEFRLevel;
  title: string;
  subtitle: string;
  theme: string;
  description: string;
  grammarFocus: {
    ruleName: string;
    explanation: string;
    caseFocus?: GermanCase;
    examples: { de: string; en: string }[];
  };
  culturalNote?: string;
  idiomSpotlight?: {
    german: string;
    literal: string;
    meaning: string;
    example: string;
  };
  vocabulary: VocabularyItem[];
  dialogue?: Dialogue;
}

export interface LeitnerCard {
  vocabId: string;
  german: string;
  article?: 'der' | 'die' | 'das';
  english: string;
  level: CEFRLevel;
  box: 1 | 2 | 3 | 4 | 5; // 1: Täglich, 2: 2 Tage, 3: 4 Tage, 4: 7 Tage, 5: 14 Tage
  lastReviewed: string; // ISO date
  nextReviewDate: string; // ISO date
  consecutiveCorrect: number;
  timesReviewed: number;
  timesFailed: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  wordsMastered: number;
  testsCompleted: number;
  voiceDrillsPassed: number;
  levelRank: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface WordMatchComparison {
  word: string;
  status: 'correct' | 'partial' | 'missing' | 'unexpected';
  expectedWord?: string;
  similarity: number;
}

export interface VoiceComparisonResult {
  targetText: string;
  spokenText: string;
  accuracyScore: number; // 0 - 100
  passed: boolean;
  wordAnalysis: WordMatchComparison[];
  feedbackNotes: string[];
}

export type TestType = 'multiple-choice' | 'matching' | 'spelling' | 'gender-picker';

export interface TestQuestion {
  id: string;
  type: TestType;
  prompt: string;
  subPrompt?: string;
  targetVocab: VocabularyItem;
  options?: string[]; // for multiple-choice or gender
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

// ==========================================
// MISTAKE VAULT TYPES
// ==========================================
export type MistakeType = 'vocab' | 'gender' | 'pronunciation' | 'grammar';
export type MistakeStatus = 'unresolved' | 'practicing' | 'mastered';

export interface MistakeEntry {
  id: string;
  type: MistakeType;
  german: string;
  english: string;
  level: CEFRLevel;
  failedAt: string; // ISO date
  contextNote: string;
  consecutiveCorrect: number;
  status: MistakeStatus;
  phoneticTip?: string;
}

// ==========================================
// SENTENCE BUILDER TYPES
// ==========================================
export interface SentenceBuilderItem {
  id: string;
  level: CEFRLevel;
  englishPrompt: string;
  germanCorrect: string;
  scrambledWords: string[];
  grammarHint: string;
  caseRule?: string;
  culturalNote?: string;
}

// ==========================================
// SPEED DRILL TYPES
// ==========================================
export interface SpeedDrillQuestion {
  id: string;
  type: 'pick_translation' | 'pick_gender' | 'true_false';
  promptGerman: string;
  promptEnglish: string;
  options?: string[];
  correctAnswer: string;
  level: CEFRLevel;
}
