// Speech Synthesis (TTS) Service for authentic German pronunciation

export interface GermanVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isPreferred: boolean;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();
  private voiceChangeListeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    const germanVoices = this.getGermanVoices();
    if (germanVoices.length > 0) {
      // Restore previously chosen voice from localStorage if valid
      const savedVoiceName = localStorage.getItem('gutenapp_selected_voice');
      const savedVoice = germanVoices.find(v => v.voice.name === savedVoiceName);

      if (savedVoice) {
        this.selectedVoice = savedVoice.voice;
      } else {
        // Prefer natural / google / premium voices if available
        const preferred = germanVoices.find(v => v.isPreferred);
        this.selectedVoice = preferred ? preferred.voice : germanVoices[0].voice;
      }
    }

    this.voiceChangeListeners.forEach(listener => listener());
  }

  public getGermanVoices(): GermanVoiceOption[] {
    if (!this.synth) return [];

    const allVoices = this.synth.getVoices();
    const german = allVoices.filter(v => v.lang.toLowerCase().startsWith('de'));

    return german.map(voice => {
      const nameLower = voice.name.toLowerCase();
      const isPreferred =
        nameLower.includes('google') ||
        nameLower.includes('natural') ||
        nameLower.includes('anna') ||
        nameLower.includes('markus') ||
        nameLower.includes('stefan') ||
        nameLower.includes('marlene') ||
        nameLower.includes('hedda') ||
        nameLower.includes('katja') ||
        nameLower.includes('premium') ||
        nameLower.includes('deutsch');

      return {
        voice,
        name: voice.name,
        lang: voice.lang,
        isPreferred
      };
    });
  }

  public setSelectedVoice(voiceName: string) {
    const found = this.voices.find(v => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
      localStorage.setItem('gutenapp_selected_voice', voiceName);
      this.voiceChangeListeners.forEach(listener => listener());
    }
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  public onVoiceChange(callback: () => void): () => void {
    this.voiceChangeListeners.add(callback);
    return () => this.voiceChangeListeners.delete(callback);
  }

  public onSpeakingChange(callback: (isSpeaking: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifySpeakingState(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach(cb => cb(speaking));
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notifySpeakingState(false);
      this.currentUtterance = null;
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number; // 0.75 for slow, 1.0 for normal, 1.2 for fast
      pitch?: number;
      onEnd?: () => void;
    } = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      // Clean text: strip markdown if any
      const cleanText = text.replace(/[*_#`]/g, '').trim();
      if (!cleanText) {
        options.onEnd?.();
        resolve();
        return;
      }

      if (!this.synth) {
        console.warn('SpeechSynthesis is not supported on this device/browser.');
        this.notifySpeakingState(true);
        setTimeout(() => {
          this.notifySpeakingState(false);
          options.onEnd?.();
          resolve();
        }, 900);
        return;
      }

      // Stop any ongoing speech
      this.stop();

      const startTime = Date.now();
      const minVisualDuration = 900;
      let finished = false;

      const finishPlayback = () => {
        if (finished) return;
        finished = true;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minVisualDuration - elapsed);
        setTimeout(() => {
          this.notifySpeakingState(false);
          this.currentUtterance = null;
          options.onEnd?.();
          resolve();
        }, remaining);
      };

      // Immediately trigger speaking visual state
      this.notifySpeakingState(true);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = options.rate ?? 0.95;
      utterance.pitch = options.pitch ?? 1.0;

      utterance.onstart = () => {
        this.notifySpeakingState(true);
      };

      utterance.onend = () => {
        finishPlayback();
      };

      utterance.onerror = (e) => {
        console.warn('TTS error event:', e);
        finishPlayback();
      };

      this.currentUtterance = utterance;

      // Safety fallback timeout in case browser speech engine hangs
      const maxDuration = Math.max(4000, cleanText.length * 120);
      setTimeout(() => {
        finishPlayback();
      }, maxDuration);

      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.error('Failed to trigger speech:', err);
        finishPlayback();
      }
    });
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const speechService = new SpeechService();
