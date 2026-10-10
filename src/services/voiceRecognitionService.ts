import type { VoiceComparisonResult, WordMatchComparison } from '../types';

interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SpeechRecognition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webkitSpeechRecognition?: any;
}

export type RecognitionState = 'idle' | 'listening' | 'processing' | 'error';

export interface VoiceRecognitionCallbacks {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (result: VoiceComparisonResult) => void;
  onError?: (errorMessage: string) => void;
  onStateChange?: (state: RecognitionState) => void;
}

class VoiceRecognitionService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isSupported: boolean = false;
  private state: RecognitionState = 'idle';
  private targetPhrase: string = '';
  private currentCallbacks: VoiceRecognitionCallbacks = {};
  private finalTranscript: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRec) {
        this.isSupported = true;
        try {
          this.recognition = new SpeechRec();
          this.recognition.lang = 'de-DE';
          this.recognition.interimResults = true;
          this.recognition.continuous = false;
          this.recognition.maxAlternatives = 3;

          this.setupEventListeners();
        } catch (err) {
          console.warn('Could not initialize SpeechRecognition:', err);
          this.isSupported = false;
        }
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  private setState(newState: RecognitionState) {
    this.state = newState;
    this.currentCallbacks.onStateChange?.(newState);
  }

  public getState(): RecognitionState {
    return this.state;
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.setState('listening');
      this.finalTranscript = '';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      const currentLive = this.finalTranscript || interim;
      this.currentCallbacks.onInterimResult?.(currentLive);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      this.setState('error');

      let errorMsg = 'Microphone error occurred.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone access denied. Please allow microphone permissions in your browser.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No German speech detected. Try speaking closer to the microphone.';
      } else if (event.error === 'network') {
        errorMsg = 'Speech service network error. Check your internet connection.';
      }

      this.currentCallbacks.onError?.(errorMsg);
    };

    this.recognition.onend = () => {
      if (this.state === 'listening') {
        this.setState('processing');
        const spoken = this.finalTranscript.trim();
        const comparison = this.compareTexts(this.targetPhrase, spoken);
        this.currentCallbacks.onFinalResult?.(comparison);
        this.setState('idle');
      } else if (this.state !== 'error') {
        this.setState('idle');
      }
    };
  }

  public startListening(targetPhrase: string, callbacks: VoiceRecognitionCallbacks) {
    this.targetPhrase = targetPhrase;
    this.currentCallbacks = callbacks;
    this.finalTranscript = '';

    if (!this.isSupported || !this.recognition) {
      callbacks.onError?.('Web Speech Recognition is not natively supported in this browser. You can still test with simulated speech!');
      return;
    }

    try {
      this.recognition.abort();
      this.recognition.start();
    } catch {
      try {
        this.recognition.stop();
        setTimeout(() => {
          this.recognition.start();
        }, 150);
      } catch (err2) {
        callbacks.onError?.('Could not activate microphone: ' + String(err2));
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.state === 'listening') {
      try {
        this.recognition.stop();
      } catch {
        this.setState('idle');
      }
    }
  }

  public abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
    }
    this.setState('idle');
  }

  // Helper: Normalize German text for comparison
  public normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[.,!?;:«»"()\-–„“]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Normalize German umlauts and sharp s for lenient matching
  public normalizeGermanSpelling(str: string): string {
    return str
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  // Levenshtein distance calculation
  public levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            )
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  // Similarity ratio 0.0 to 1.0
  public stringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    if (!str1.length || !str2.length) return 0.0;
    const distance = this.levenshtein(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return Math.max(0, 1 - distance / maxLen);
  }

  // Deep comparison of target German phrase vs spoken transcription
  public compareTexts(target: string, spoken: string): VoiceComparisonResult {
    const normTarget = this.normalizeText(target);
    const normSpoken = this.normalizeText(spoken);

    if (!normSpoken) {
      return {
        targetText: target,
        spokenText: spoken,
        accuracyScore: 0,
        passed: false,
        wordAnalysis: normTarget.split(' ').filter(Boolean).map(w => ({
          word: w,
          status: 'missing',
          expectedWord: w,
          similarity: 0
        })),
        feedbackNotes: ['Keine Sprache erkannt. Bitte sprich deutlich ins Mikrofon! (No speech detected. Please speak clearly into the microphone).']
      };
    }

    const targetWords = normTarget.split(' ').filter(Boolean);
    const spokenWords = normSpoken.split(' ').filter(Boolean);

    const wordAnalysis: WordMatchComparison[] = [];
    let matchedScoreSum = 0;
    const feedbackNotes: string[] = [];

    const usedSpokenIndices = new Set<number>();

    targetWords.forEach((expectedWord) => {
      let bestMatchIndex = -1;
      let highestSimilarity = -1;

      spokenWords.forEach((sWord, sIndex) => {
        if (usedSpokenIndices.has(sIndex)) return;

        // Exact match
        if (sWord === expectedWord) {
          if (highestSimilarity < 1) {
            highestSimilarity = 1;
            bestMatchIndex = sIndex;
          }
        } else if (this.normalizeGermanSpelling(sWord) === this.normalizeGermanSpelling(expectedWord)) {
          // Umlaut or ß/ss variant match
          if (highestSimilarity < 0.95) {
            highestSimilarity = 0.95;
            bestMatchIndex = sIndex;
          }
        } else {
          const sim = this.stringSimilarity(expectedWord, sWord);
          if (sim > highestSimilarity && sim > 0.55) {
            highestSimilarity = sim;
            bestMatchIndex = sIndex;
          }
        }
      });

      if (bestMatchIndex !== -1) {
        usedSpokenIndices.add(bestMatchIndex);
        const spokenWord = spokenWords[bestMatchIndex];

        if (spokenWord === expectedWord) {
          wordAnalysis.push({
            word: expectedWord,
            status: 'correct',
            expectedWord,
            similarity: 1.0
          });
          matchedScoreSum += 1.0;
        } else if (highestSimilarity >= 0.8 || this.normalizeGermanSpelling(spokenWord) === this.normalizeGermanSpelling(expectedWord)) {
          wordAnalysis.push({
            word: spokenWord,
            status: 'partial',
            expectedWord,
            similarity: highestSimilarity
          });
          matchedScoreSum += 0.88;

          if (this.normalizeGermanSpelling(spokenWord) === this.normalizeGermanSpelling(expectedWord)) {
            feedbackNotes.push(`Achte auf den Umlaut/ß bei "${expectedWord}" (erkannt als "${spokenWord}").`);
          } else {
            feedbackNotes.push(`Leichte Abweichung bei "${expectedWord}" (gehört: "${spokenWord}").`);
          }
        } else {
          wordAnalysis.push({
            word: spokenWord,
            status: 'partial',
            expectedWord,
            similarity: highestSimilarity
          });
          matchedScoreSum += 0.5;
          feedbackNotes.push(`Aussprache-Unterschied bei "${expectedWord}" (gehört: "${spokenWord}").`);
        }
      } else {
        wordAnalysis.push({
          word: expectedWord,
          status: 'missing',
          expectedWord,
          similarity: 0
        });
        feedbackNotes.push(`Das Wort "${expectedWord}" wurde weggelassen oder undeutlich ausgesprochen.`);
      }
    });

    spokenWords.forEach((sWord, sIndex) => {
      if (!usedSpokenIndices.has(sIndex)) {
        wordAnalysis.push({
          word: sWord,
          status: 'unexpected',
          similarity: 0
        });
      }
    });

    const baseAccuracy = targetWords.length > 0 ? (matchedScoreSum / targetWords.length) * 100 : 0;
    const extraWordsCount = spokenWords.length - usedSpokenIndices.size;
    const penalty = Math.min(extraWordsCount * 5, 20);
    const finalScore = Math.max(0, Math.round(baseAccuracy - penalty));

    // Construct tailored pronunciation guidance
    if (finalScore >= 85) {
      feedbackNotes.unshift('Ausgezeichnete Aussprache! Klare Artikulation und natürlicher deutscher Sprachrhythmus.');
    } else if (finalScore >= 65) {
      feedbackNotes.unshift('Gut gemacht! Schöner Sprachfluss. Achte auf scharfe Endkonsonanten und Umlaute.');
    } else {
      feedbackNotes.unshift('Noch etwas üben. Höre dir zuerst das native Audio bei 0.75x an und sprich es laut nach.');
    }

    // Specific German phonetic tips
    const targetLower = target.toLowerCase();
    if (targetLower.includes('ich') || targetLower.includes('nicht') || targetLower.includes('möchte') || targetLower.includes('sprechen')) {
      feedbackNotes.push('Aussprache-Tipp (ich-Laut /ç/): Nach hellen Vokalen (e, i, ä, ö, ü) wird "ch" weich wie das Zischen einer Katze gehaucht.');
    }
    if (targetLower.includes('auch') || targetLower.includes('buch') || targetLower.includes('nacht') || targetLower.includes('noch')) {
      feedbackNotes.push('Aussprache-Tipp (ach-Laut /x/): Nach dunklen Vokalen (a, o, u, au) wird "ch" tiefer im Rachen gerieben.');
    }
    if (/\b(sp|st)/.test(targetLower)) {
      feedbackNotes.push('Aussprache-Tipp (sp/st): Am Wort- oder Silbenanfang wird "sp" als [ʃp] ("schp") und "st" als [ʃt] ("scht") gesprochen.');
    }
    if (targetLower.includes('ä') || targetLower.includes('ö') || targetLower.includes('ü')) {
      feedbackNotes.push('Umlaut-Tipp: Bei "ü" und "ö" runde die Lippen weit nach vorne, während deine Zunge in der "i"-Position bleibt.');
    }

    return {
      targetText: target,
      spokenText: spoken,
      accuracyScore: finalScore,
      passed: finalScore >= 70,
      wordAnalysis,
      feedbackNotes: Array.from(new Set(feedbackNotes))
    };
  }

  // Simulation mode for testing or when mic is disabled
  public simulateSpokenInput(target: string, simulatedSpoken: string): VoiceComparisonResult {
    return this.compareTexts(target, simulatedSpoken);
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
