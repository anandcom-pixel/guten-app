import type { SentenceBuilderItem } from '../types';

export const SENTENCE_BUILDER_DATA: SentenceBuilderItem[] = [
  // ==================== LEVEL A1 ====================
  {
    id: 'sb-a1-1',
    level: 'A1',
    englishPrompt: 'I would like a black coffee, please.',
    germanCorrect: 'Ich möchte bitte einen schwarzen Kaffee',
    scrambledWords: ['schwarzen', 'Kaffee', 'möchte', 'einen', 'Ich', 'bitte'],
    grammarHint: 'Polite modal form "Ich möchte", adverb "bitte", followed by masculine Accusative object "einen schwarzen Kaffee".',
    caseRule: 'Akkusativ (der Kaffee -> einen schwarzen Kaffee)'
  },
  {
    id: 'sb-a1-2',
    level: 'A1',
    englishPrompt: 'Where is the central train station located?',
    germanCorrect: 'Wo liegt der Hauptbahnhof hier',
    scrambledWords: ['Hauptbahnhof', 'der', 'hier', 'Wo', 'liegt'],
    grammarHint: 'W-question word "Wo" occupies position 1; conjugated verb "liegt" must be in position 2.',
    caseRule: 'Nominativ (der Hauptbahnhof)'
  },
  {
    id: 'sb-a1-3',
    level: 'A1',
    englishPrompt: 'My name is Lukas and I come from Berlin.',
    germanCorrect: 'Ich heiße Lukas und komme aus Berlin',
    scrambledWords: ['Lukas', 'aus', 'komme', 'Ich', 'heiße', 'Berlin', 'und'],
    grammarHint: 'Conjugated verb "heiße" in position 2, coordinating conjunction "und" joining the second predicate.',
    caseRule: 'Dativ with preposition "aus"'
  },

  // ==================== LEVEL A2 ====================
  {
    id: 'sb-a2-1',
    level: 'A2',
    englishPrompt: 'I get up at seven o’clock every morning.',
    germanCorrect: 'Ich stehe jeden Morgen um sieben Uhr auf',
    scrambledWords: ['auf', 'Uhr', 'stehe', 'Morgen', 'sieben', 'jeden', 'um', 'Ich'],
    grammarHint: 'Separable verb "aufstehen": conjugated root "stehe" stays in position 2, while prefix "auf" jumps to the very end!',
    caseRule: 'Akkusativ for temporal expression ("jeden Morgen")'
  },
  {
    id: 'sb-a2-2',
    level: 'A2',
    englishPrompt: 'We must do our homework this evening.',
    germanCorrect: 'Wir müssen heute Abend unsere Hausaufgaben machen',
    scrambledWords: ['Hausaufgaben', 'machen', 'unsere', 'müssen', 'Abend', 'Wir', 'heute'],
    grammarHint: 'Satzklammer (verbal bracket): Modal verb "müssen" in position 2; infinitive action verb "machen" at the very end.',
    caseRule: 'Akkusativ (unsere Hausaufgaben)'
  },
  {
    id: 'sb-a2-3',
    level: 'A2',
    englishPrompt: 'The food tastes great to the guest.',
    germanCorrect: 'Das Essen schmeckt dem Gast sehr gut',
    scrambledWords: ['sehr', 'Gast', 'schmeckt', 'dem', 'Das', 'Essen', 'gut'],
    grammarHint: 'The verb "schmecken" takes the Dative case for the recipient/experiencer: "dem Gast".',
    caseRule: 'Dativ (der Gast -> dem Gast)'
  },

  // ==================== LEVEL B1 ====================
  {
    id: 'sb-b1-1',
    level: 'B1',
    englishPrompt: 'I am staying home today because I am sick.',
    germanCorrect: 'Ich bleibe heute zu Hause weil ich krank bin',
    scrambledWords: ['weil', 'Hause', 'Ich', 'bin', 'bleibe', 'krank', 'zu', 'ich', 'heute'],
    grammarHint: 'Subordinating conjunction "weil" kicks the conjugated verb "bin" to the absolute end of the subordinate clause.',
    caseRule: 'Verb-final word order in subordinate clauses'
  },
  {
    id: 'sb-b1-2',
    level: 'B1',
    englishPrompt: 'She places the book onto the large wooden desk.',
    germanCorrect: 'Sie legt das Buch auf den großen Schreibtisch',
    scrambledWords: ['den', 'das', 'auf', 'Buch', 'großen', 'legt', 'Sie', 'Schreibtisch'],
    grammarHint: 'Two-way preposition "auf" with movement/placement ("Wohin?") demands the Accusative case: "den großen Schreibtisch".',
    caseRule: 'Wechselpräposition with Akkusativ'
  },
  {
    id: 'sb-b1-3',
    level: 'B1',
    englishPrompt: 'Although the exam was difficult, he passed it.',
    germanCorrect: 'Obwohl die Prüfung schwer war hat er sie bestanden',
    scrambledWords: ['war', 'hat', 'sie', 'Obwohl', 'bestanden', 'Prüfung', 'schwer', 'die', 'er'],
    grammarHint: '"Obwohl" puts "war" at the end of clause 1. Because the subordinate clause is position 1, the main clause immediately starts with the conjugated verb "hat" (V2 rule)!',
    caseRule: 'Verb-second rule with introductory clause'
  },

  // ==================== LEVEL B2 ====================
  {
    id: 'sb-b2-1',
    level: 'B2',
    englishPrompt: 'If I had more time, I would travel more often.',
    germanCorrect: 'Wenn ich mehr Zeit hätte würde ich öfter reisen',
    scrambledWords: ['Zeit', 'öfter', 'hätte', 'ich', 'würde', 'reisen', 'Wenn', 'mehr', 'ich'],
    grammarHint: 'Unreal conditional with Konjunktiv II: "hätte" at end of the if-clause; "würde ... reisen" forms the bracket in the main clause.',
    caseRule: 'Konjunktiv II Conditional Clause'
  },
  {
    id: 'sb-b2-2',
    level: 'B2',
    englishPrompt: 'The documents are checked carefully by the team leader.',
    germanCorrect: 'Die Unterlagen werden vom Teamleiter sorgfältig geprüft',
    scrambledWords: ['sorgfältig', 'Unterlagen', 'werden', 'Die', 'vom', 'geprüft', 'Teamleiter'],
    grammarHint: 'Passive voice (Passiv): auxiliary "werden" in position 2, agent introduced with "von + Dativ" ("vom"), Partizip II ("geprüft") at sentence end.',
    caseRule: 'Vorgangspassiv (werden + Partizip II)'
  },
  {
    id: 'sb-b2-3',
    level: 'B2',
    englishPrompt: 'In my opinion, we should take all factors into consideration.',
    germanCorrect: 'Meiner Meinung nach sollten wir alle Faktoren in Betracht ziehen',
    scrambledWords: ['Betracht', 'nach', 'wir', 'alle', 'sollten', 'in', 'Meiner', 'ziehen', 'Meinung', 'Faktoren'],
    grammarHint: 'Noun-verb collocation: "in Betracht ziehen". Modal verb "sollten" in position 2, infinitive collocation at the end.',
    caseRule: 'Nomen-Verb-Verbindung (Funktionsverbgefüge)'
  },

  // ==================== LEVEL C1 ====================
  {
    id: 'sb-c1-1',
    level: 'C1',
    englishPrompt: 'For further inquiries, I am gladly at your disposal at any time.',
    germanCorrect: 'Für Rückfragen stehe ich Ihnen jederzeit gerne zur Verfügung',
    scrambledWords: ['gerne', 'Ihnen', 'Für', 'zur', 'stehe', 'jederzeit', 'Rückfragen', 'Verfügung', 'ich'],
    grammarHint: 'Elevated formal business register: "zur Verfügung stehen" with Dative polite pronoun "Ihnen".',
    caseRule: 'Formal Dativ Collocation'
  },
  {
    id: 'sb-c1-2',
    level: 'C1',
    englishPrompt: 'By no means may the socio-economic dimension be disregarded.',
    germanCorrect: 'Keineswegs darf die sozioökonomische Dimension außer Acht gelassen werden',
    scrambledWords: ['außer', 'Dimension', 'Keineswegs', 'werden', 'gelassen', 'darf', 'die', 'Acht', 'sozioökonomische'],
    grammarHint: 'Passive with modal verb in elevated register: "darf" in position 2, compound idiom "außer Acht gelassen werden" closing the verbal bracket.',
    caseRule: 'Passiv mit Modalverb & Idiomatische Redewendung'
  }
];
