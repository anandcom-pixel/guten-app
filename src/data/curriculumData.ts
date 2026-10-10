import type { Lesson } from '../types';

export const CURRICULUM_DATA: Lesson[] = [
  // ==========================================
  // LEVEL A1 - BEGINNER (GRUNDSTUFE)
  // ==========================================
  {
    id: 'a1-1',
    level: 'A1',
    title: 'Begrüßung & Erste Kontakte',
    subtitle: 'Greetings, introductions, and essential courtesies',
    theme: 'Everyday Basics',
    description: 'Master formal vs. informal greetings, introducing yourself with "heißen" and "sein", and basic polite phrases in German.',
    grammarFocus: {
      ruleName: 'Personal Pronouns & Verb Conjugation (Präsens)',
      explanation: 'In German, verbs change their endings based on the subject. Regular verbs take: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Capitalized "Sie" is the formal "you".',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Ich heiße Lukas und komme aus Berlin.', en: 'My name is Lukas and I come from Berlin.' },
        { de: 'Wie geht es Ihnen, Frau Schmidt?', en: 'How are you, Mrs. Schmidt? (formal)' },
        { de: 'Freut mich, Sie kennenzulernen!', en: 'Pleased to meet you!' }
      ]
    },
    culturalNote: 'In German-speaking countries, people value distinct boundaries between informal ("du") and formal ("Sie"). In professional or service settings, always start with "Sie" until invited to use "du".',
    idiomSpotlight: {
      german: 'Alles in Butter',
      literal: 'Everything in butter',
      meaning: 'Everything is fine / under control',
      example: 'Keine Sorge, alles in Butter!'
    },
    vocabulary: [
      {
        id: 'v-a1-1',
        german: 'Guten Tag',
        baseWord: 'Guten Tag',
        english: 'Good day / Hello (polite)',
        partOfSpeech: 'phrase',
        exampleGerman: 'Guten Tag, wie kann ich Ihnen helfen?',
        exampleEnglish: 'Good day, how can I help you?',
        pronunciationTip: 'Say "Goo-ten Tahk" with a crisp terminal "g" sounding almost like "k" (Auslautverhärtung).',
        level: 'A1',
        category: 'Greetings'
      },
      {
        id: 'v-a1-2',
        german: 'der Name',
        article: 'der',
        baseWord: 'Name',
        plural: 'die Namen',
        english: 'the name',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Mein Name ist Florian Müller.',
        exampleEnglish: 'My name is Florian Müller.',
        pronunciationTip: 'Stress the first syllable: "NAH-meh".',
        caseHint: 'Weak masculine noun (N-Deklination in other cases)',
        level: 'A1',
        category: 'Basics'
      },
      {
        id: 'v-a1-3',
        german: 'die Begrüßung',
        article: 'die',
        baseWord: 'Begrüßung',
        plural: 'die Begrüßungen',
        english: 'the greeting / welcome',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Eine herzliche Begrüßung an alle Gäste!',
        exampleEnglish: 'A warm welcome to all guests!',
        pronunciationTip: 'Umlaut ü requires rounded lips with an "ee" tongue position.',
        level: 'A1',
        category: 'Basics'
      },
      {
        id: 'v-a1-4',
        german: 'das Wiedersehen',
        article: 'das',
        baseWord: 'Wiedersehen',
        plural: 'die Wiedersehen',
        english: 'the reunion / seeing again',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Auf Wiedersehen und einen schönen Tag!',
        exampleEnglish: 'Goodbye and have a nice day!',
        pronunciationTip: 'The "W" sounds like English "V": "Auf Vee-der-zay-en".',
        level: 'A1',
        category: 'Basics'
      },
      {
        id: 'v-a1-5',
        german: 'Bitte',
        baseWord: 'bitte',
        english: 'Please / You’re welcome',
        partOfSpeech: 'phrase',
        exampleGerman: 'Ein Glas Wasser, bitte.',
        exampleEnglish: 'A glass of water, please.',
        pronunciationTip: 'Short crisp "i" sound: "BIT-teh".',
        level: 'A1',
        category: 'Politeness'
      },
      {
        id: 'v-a1-6',
        german: 'Danke schön',
        baseWord: 'danke schön',
        english: 'Thank you very much',
        partOfSpeech: 'phrase',
        exampleGerman: 'Vielen Dank für Ihre Hilfe!',
        exampleEnglish: 'Thank you very much for your help!',
        pronunciationTip: '"ö" sound requires rounded lips: "Dahn-keh shern".',
        level: 'A1',
        category: 'Politeness'
      },
      {
        id: 'v-a1-7',
        german: 'Entschuldigung',
        baseWord: 'Entschuldigung',
        english: 'Excuse me / Sorry',
        partOfSpeech: 'phrase',
        exampleGerman: 'Entschuldigung, wo ist der Bahnhof?',
        exampleEnglish: 'Excuse me, where is the train station?',
        pronunciationTip: 'Stress on the second syllable: "ent-SHOOL-dee-goong".',
        level: 'A1',
        category: 'Politeness'
      },
      {
        id: 'v-a1-8',
        german: 'Ich heiße...',
        baseWord: 'heißen',
        english: 'My name is... / I am called...',
        partOfSpeech: 'phrase',
        exampleGerman: 'Ich heiße Sophie und lerne Deutsch.',
        exampleEnglish: 'My name is Sophie and I am learning German.',
        pronunciationTip: '"ß" is pronounced as a sharp double "s".',
        level: 'A1',
        category: 'Introductions'
      }
    ],
    dialogue: {
      id: 'd-a1-1',
      title: 'Erstes Kennenlernen in Wien',
      scenario: 'Sophie meets Herr Weber at a German academy orientation.',
      lines: [
        { speaker: 'Herr Weber', german: 'Guten Tag! Mein Name ist Herr Weber. Wie heißen Sie?', english: 'Good day! My name is Mr. Weber. What is your name?' },
        { speaker: 'Sophie', german: 'Guten Tag, Herr Weber! Ich heiße Sophie. Freut mich sehr.', english: 'Good day, Mr. Weber! My name is Sophie. Very nice to meet you.' },
        { speaker: 'Herr Weber', german: 'Herzlich willkommen! Woher kommen Sie, Sophie?', english: 'Welcome! Where do you come from, Sophie?' },
        { speaker: 'Sophie', german: 'Ich komme aus Kanada, aber jetzt wohne ich hier.', english: 'I come from Canada, but now I live here.' },
        { speaker: 'Herr Weber', german: 'Wunderbar! Auf Wiedersehen und viel Erfolg!', english: 'Wonderful! Goodbye and much success!' }
      ]
    }
  },
  {
    id: 'a1-2',
    level: 'A1',
    title: 'Im Café & Bestellen',
    subtitle: 'Ordering food & drinks, grammatical noun genders (der, die, das)',
    theme: 'Dining & Articles',
    description: 'Learn how to order in a German café with "Ich möchte" and grasp German grammatical genders: masculine (der), feminine (die), and neuter (das).',
    grammarFocus: {
      ruleName: 'Noun Genders & The Accusative Case with "möchte"',
      explanation: 'Every German noun has an inherent gender: der (masculine, blue), die (feminine, rose), or das (neuter, amber). When ordering, the direct object is in the Accusative case: "der" changes to "den / einen", while "die" and "das" stay identical ("die/eine", "das/ein").',
      caseFocus: 'Akkusativ',
      examples: [
        { de: 'Ich möchte einen Kaffee, bitte.', en: 'I would like a coffee, please. (der Kaffee -> einen Kaffee)' },
        { de: 'Ich nehme eine heiße Schokolade.', en: 'I take a hot chocolate. (die Schokolade -> eine Schokolade)' },
        { de: 'Wir möchten ein Mineralwasser.', en: 'We would like a mineral water. (das Wasser -> ein Wasser)' }
      ]
    },
    culturalNote: 'In German cafés, tap water is rarely served for free. If you want water, you order "Mineralwasser mit Gas" (sparkling) or "still" (still water). Always state whether you want to pay "zusammen" (together) or "getrennt" (separately).',
    idiomSpotlight: {
      german: 'Das ist nicht mein Bier',
      literal: 'That is not my beer',
      meaning: 'That is none of my business / not my problem',
      example: 'Was er macht, ist nicht mein Bier!'
    },
    vocabulary: [
      {
        id: 'v-a1-9',
        german: 'der Kaffee',
        article: 'der',
        baseWord: 'Kaffee',
        plural: 'die Kaffees',
        english: 'the coffee',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Ich trinke morgens einen starken Kaffee.',
        exampleEnglish: 'I drink a strong coffee in the morning.',
        pronunciationTip: 'Stress on the first syllable: "der KAH-feh".',
        caseHint: 'Akkusativ: den Kaffee / einen Kaffee',
        level: 'A1',
        category: 'Drinks'
      },
      {
        id: 'v-a1-10',
        german: 'der Tee',
        article: 'der',
        baseWord: 'Tee',
        plural: 'die Tees',
        english: 'the tea',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Möchten Sie einen grünen Tee mit Zitrone?',
        exampleEnglish: 'Would you like a green tea with lemon?',
        pronunciationTip: 'Pronounce like English "tay".',
        caseHint: 'Akkusativ: den Tee',
        level: 'A1',
        category: 'Drinks'
      },
      {
        id: 'v-a1-11',
        german: 'die Milch',
        article: 'die',
        baseWord: 'Milch',
        english: 'the milk',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Kaffee mit etwas Milch und Zucker, bitte.',
        exampleEnglish: 'Coffee with some milk and sugar, please.',
        pronunciationTip: 'Soft ich-Laut /ç/ at the end: "Milch".',
        level: 'A1',
        category: 'Drinks'
      },
      {
        id: 'v-a1-12',
        german: 'das Wasser',
        article: 'das',
        baseWord: 'Wasser',
        plural: 'die Wässer',
        english: 'the water',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Ein Glas Wasser ohne Kohlensäure, bitte.',
        exampleEnglish: 'A glass of still water, please.',
        pronunciationTip: '"W" sounds like "V": "das VAH-ser".',
        level: 'A1',
        category: 'Drinks'
      },
      {
        id: 'v-a1-13',
        german: 'das Brötchen',
        article: 'das',
        baseWord: 'Brötchen',
        plural: 'die Brötchen',
        english: 'the bread roll',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Ein frisches Brötchen mit Butter und Marmelade.',
        exampleEnglish: 'A fresh bread roll with butter and jam.',
        pronunciationTip: 'Diminutive "-chen" is always neuter (das) and pronounced with ich-Laut.',
        level: 'A1',
        category: 'Food'
      },
      {
        id: 'v-a1-14',
        german: 'die Rechnung',
        article: 'die',
        baseWord: 'Rechnung',
        plural: 'die Rechnungen',
        english: 'the bill / check',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Die Rechnung, bitte! Wir möchten zahlen.',
        exampleEnglish: 'The bill, please! We would like to pay.',
        pronunciationTip: 'Suffix "-ung" is always feminine (die).',
        level: 'A1',
        category: 'Dining'
      },
      {
        id: 'v-a1-15',
        german: 'Ich möchte...',
        baseWord: 'möchten',
        english: 'I would like...',
        partOfSpeech: 'phrase',
        exampleGerman: 'Ich möchte ein Stück Kuchen bestellen.',
        exampleEnglish: 'I would like to order a slice of cake.',
        pronunciationTip: '"ö" sound with lips rounded: "Ich MERCH-teh".',
        level: 'A1',
        category: 'Ordering'
      },
      {
        id: 'v-a1-16',
        german: 'Zusammen oder getrennt?',
        baseWord: 'zahlen',
        english: 'Together or separately? (paying)',
        partOfSpeech: 'phrase',
        exampleGerman: 'Zahlen Sie zusammen oder getrennt?',
        exampleEnglish: 'Are you paying together or separately?',
        pronunciationTip: '"Z" is pronounced as "ts": "TSU-zam-men".',
        level: 'A1',
        category: 'Dining'
      }
    ],
    dialogue: {
      id: 'd-a1-2',
      title: 'Bestellung im Kaffeehaus',
      scenario: 'Maximilian places an order with the waiter in Munich.',
      lines: [
        { speaker: 'Kellner', german: 'Guten Tag! Was darf es sein?', english: 'Good day! What can I get for you?' },
        { speaker: 'Maximilian', german: 'Guten Tag! Ich möchte bitte einen großen Cappuccino und ein Croissant.', english: 'Good day! I would like a large cappuccino and a croissant, please.' },
        { speaker: 'Kellner', german: 'Sehr gerne. Mit Zucker oder ohne?', english: 'With pleasure. With sugar or without?' },
        { speaker: 'Maximilian', german: 'Mit etwas braunem Zucker, bitte.', english: 'With some brown sugar, please.' },
        { speaker: 'Kellner', german: 'Kommt sofort! Das macht dann vier Euro fünfzig.', english: 'Coming right up! That will be four euros fifty.' }
      ]
    }
  },
  {
    id: 'a1-3',
    level: 'A1',
    title: 'Wegbeschreibung & In der Stadt',
    subtitle: 'Navigating cities, public transport, directions and landmarks',
    theme: 'City Navigation',
    description: 'Ask for directions, identify city landmarks like train stations and museums, and navigate with cardinal directions.',
    grammarFocus: {
      ruleName: 'Preposition "nach" vs "zu" and Verb Position',
      explanation: 'Directions use "nach links" (to the left), "nach rechts" (to the right), and "geradeaus" (straight ahead). When asking questions with "Wo ist...", the verb comes in position 2.',
      caseFocus: 'Dativ',
      examples: [
        { de: 'Gehen Sie geradeaus und dann nach links.', en: 'Go straight ahead and then to the left.' },
        { de: 'Der Bahnhof ist in der Nähe der Kirche.', en: 'The train station is near the church.' }
      ]
    },
    culturalNote: 'Public transport in Germany, Austria, and Switzerland (U-Bahn, S-Bahn, Tram) rarely uses turnstiles. However, you must have a validated ticket (Fahrkarte entwerten), as undercover conductors (Fahrkartenkontrolleure) perform strict random spot-checks.',
    idiomSpotlight: {
      german: 'Ich verstehe nur Bahnhof',
      literal: 'I only understand train station',
      meaning: 'It is all Greek to me / I do not understand a single word',
      example: 'Er spricht so schnell, ich verstehe nur Bahnhof!'
    },
    vocabulary: [
      {
        id: 'v-a1-17',
        german: 'der Bahnhof',
        article: 'der',
        baseWord: 'Bahnhof',
        plural: 'die Bahnhöfe',
        english: 'the train station',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Wo ist der Hauptbahnhof in Hamburg?',
        exampleEnglish: 'Where is the central station in Hamburg?',
        pronunciationTip: 'Long "ah" in Bahn: "BAHN-hof".',
        level: 'A1',
        category: 'Travel'
      },
      {
        id: 'v-a1-18',
        german: 'die Straße',
        article: 'die',
        baseWord: 'Straße',
        plural: 'die Straßen',
        english: 'the street / road',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Biegen Sie in die nächste Straße rechts ab.',
        exampleEnglish: 'Turn right into the next street.',
        pronunciationTip: '"St" at the beginning sounds like "Sht": "SHTRAH-seh".',
        level: 'A1',
        category: 'Directions'
      },
      {
        id: 'v-a1-19',
        german: 'das Hotel',
        article: 'das',
        baseWord: 'Hotel',
        plural: 'die Hotels',
        english: 'the hotel',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Das Hotel liegt direkt im Stadtzentrum.',
        exampleEnglish: 'The hotel is located directly in the city center.',
        pronunciationTip: 'Stress on the second syllable: "hoh-TEL".',
        level: 'A1',
        category: 'Travel'
      },
      {
        id: 'v-a1-20',
        german: 'die Apotheke',
        article: 'die',
        baseWord: 'Apotheke',
        plural: 'die Apotheken',
        english: 'the pharmacy',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Gibt es hier in der Nähe eine Apotheke?',
        exampleEnglish: 'Is there a pharmacy nearby?',
        pronunciationTip: '"th" is pronounced as plain "t": "ah-poh-TAY-keh".',
        level: 'A1',
        category: 'City'
      },
      {
        id: 'v-a1-21',
        german: 'geradeaus',
        baseWord: 'geradeaus',
        english: 'straight ahead',
        partOfSpeech: 'adverb',
        exampleGerman: 'Gehen Sie immer geradeaus bis zur Kreuzung.',
        exampleEnglish: 'Walk straight ahead until the crossroads.',
        pronunciationTip: 'Glottal stop between "gerade" and "aus": "geh-RAH-deh-ows".',
        level: 'A1',
        category: 'Directions'
      },
      {
        id: 'v-a1-22',
        german: 'nach links / rechts',
        baseWord: 'links/rechts',
        english: 'to the left / right',
        partOfSpeech: 'phrase',
        exampleGerman: 'An der Ampel bitte nach rechts abbiegen.',
        exampleEnglish: 'At the traffic light, please turn right.',
        pronunciationTip: '"ch" in "rechts" is the soft ich-Laut.',
        level: 'A1',
        category: 'Directions'
      }
    ],
    dialogue: {
      id: 'd-a1-3',
      title: 'Nach dem Weg fragen in Frankfurt',
      scenario: 'A tourist asks a pedestrian how to reach the museum.',
      lines: [
        { speaker: 'Tourist', german: 'Entschuldigung, wie komme ich zum Städel Museum?', english: 'Excuse me, how do I get to the Städel Museum?' },
        { speaker: 'Passant', german: 'Das ist ganz einfach! Gehen Sie geradeaus über die Brücke.', english: 'That is quite simple! Walk straight ahead across the bridge.' },
        { speaker: 'Tourist', german: 'Und dann nach links oder rechts?', english: 'And then to the left or right?' },
        { speaker: 'Passant', german: 'Danach direkt nach rechts am Mainufer entlang. Es sind nur fünf Minuten.', english: 'After that, directly to the right along the bank of the Main. It is only five minutes.' },
        { speaker: 'Tourist', german: 'Vielen Dank für Ihre Hilfe!', english: 'Thank you very much for your help!' }
      ]
    }
  },

  // ==========================================
  // LEVEL A2 - ELEMENTARY (GRUNDSTUFE 2)
  // ==========================================
  {
    id: 'a2-1',
    level: 'A2',
    title: 'Tagesablauf & Trennbare Verben',
    subtitle: 'Daily routine, time expressions, and separable prefix verbs',
    theme: 'Daily Life & Syntax',
    description: 'Learn German separable verbs (aufstehen, einkaufen, anfangen) where prefixes split off and migrate to the very end of the sentence.',
    grammarFocus: {
      ruleName: 'Separable Verbs (Trennbare Verben)',
      explanation: 'In the present tense, prefixes like auf-, an-, ein-, mit-, aus- detach from the main verb in declarative sentences and jump to position final: "Ich stehe um sieben Uhr auf." (NOT: "Ich aufstehe...").',
      caseFocus: 'Akkusativ',
      examples: [
        { de: 'Ich stehe jeden Morgen früh auf.', en: 'I get up early every morning. (aufstehen)' },
        { de: 'Er kauft am Nachmittag im Supermarkt ein.', en: 'He shops in the supermarket in the afternoon. (einkaufen)' },
        { de: 'Der Deutschkurs fängt um neun Uhr an.', en: 'The German course begins at nine o’clock. (anfangen)' }
      ]
    },
    culturalNote: 'Punctuality ("Pünktlichkeit") is deeply rooted in German culture. Arriving 5 minutes early to an appointment or class is considered respectful and standard.',
    idiomSpotlight: {
      german: 'Morgenstund hat Gold im Mund',
      literal: 'Morning hour has gold in its mouth',
      meaning: 'The early bird catches the worm',
      example: 'Ich stehe früh auf, denn Morgenstund hat Gold im Mund!'
    },
    vocabulary: [
      {
        id: 'v-a2-1',
        german: 'aufstehen',
        baseWord: 'aufstehen',
        english: 'to get up / wake up',
        partOfSpeech: 'verb',
        exampleGerman: 'Ich stehe normalerweise um sechs Uhr dreißig auf.',
        exampleEnglish: 'I usually get up at six-thirty.',
        pronunciationTip: 'Prefix "auf" is stressed: "OWF-shte-en".',
        level: 'A2',
        category: 'Daily Routine'
      },
      {
        id: 'v-a2-2',
        german: 'einkaufen',
        baseWord: 'einkaufen',
        english: 'to go shopping / buy groceries',
        partOfSpeech: 'verb',
        exampleGerman: 'Wir kaufen am Samstag frisches Gemüse ein.',
        exampleEnglish: 'We shop for fresh vegetables on Saturday.',
        pronunciationTip: 'Stress on "ein": "EYEN-kow-fen".',
        level: 'A2',
        category: 'Daily Routine'
      },
      {
        id: 'v-a2-3',
        german: 'der Wecker',
        article: 'der',
        baseWord: 'Wecker',
        plural: 'die Wecker',
        english: 'the alarm clock',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Mein Wecker klingelt um sieben Uhr.',
        exampleEnglish: 'My alarm clock rings at seven o’clock.',
        pronunciationTip: 'Crisp short "e" sound.',
        level: 'A2',
        category: 'Household'
      },
      {
        id: 'v-a2-4',
        german: 'die Gewohnheit',
        article: 'die',
        baseWord: 'Gewohnheit',
        plural: 'die Gewohnheiten',
        english: 'the habit / routine',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Gute Gewohnheiten machen das Lernen leichter.',
        exampleEnglish: 'Good habits make learning easier.',
        pronunciationTip: 'Suffix "-heit" is always feminine (die).',
        level: 'A2',
        category: 'Daily Routine'
      },
      {
        id: 'v-a2-5',
        german: 'das Frühstück',
        article: 'das',
        baseWord: 'Frühstück',
        plural: 'die Frühstücke',
        english: 'the breakfast',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Was isst du gern zum Frühstück?',
        exampleEnglish: 'What do you like to eat for breakfast?',
        pronunciationTip: '"Früh" has a long "ü" sound: "FROO-shteek".',
        level: 'A2',
        category: 'Food'
      },
      {
        id: 'v-a2-6',
        german: 'anfangen',
        baseWord: 'anfangen',
        english: 'to begin / to start',
        partOfSpeech: 'verb',
        exampleGerman: 'Wann fängt der Film heute Abend an?',
        exampleEnglish: 'When does the movie start this evening?',
        pronunciationTip: 'Vowel changes in 2nd/3rd person: du fängst an, er fängt an.',
        level: 'A2',
        category: 'Daily Routine'
      }
    ],
    dialogue: {
      id: 'd-a2-1',
      title: 'Ein gewöhnlicher Dienstag',
      scenario: 'Clara and Tim compare their daily schedules.',
      lines: [
        { speaker: 'Clara', german: 'Tim, wann stehst du unter der Woche auf?', english: 'Tim, when do you get up during the week?' },
        { speaker: 'Tim', german: 'Meistens stehe ich um sieben auf, trinke Kaffee und lese die Nachrichten.', english: 'Mostly I get up at seven, drink coffee, and read the news.' },
        { speaker: 'Clara', german: 'Und wann fängst du mit der Arbeit an?', english: 'And when do you start work?' },
        { speaker: 'Tim', german: 'Meine Arbeit fängt um Punkt acht Uhr dreißig an. Und du?', english: 'My work starts at precisely eight-thirty. And you?' },
        { speaker: 'Clara', german: 'Ich arbeite im Homeoffice und bereite mein Frühstück in Ruhe vor.', english: 'I work from home and prepare my breakfast in peace.' }
      ]
    }
  },
  {
    id: 'a2-2',
    level: 'A2',
    title: 'Im Restaurant & Der Dativ',
    subtitle: 'Indirect objects, dative case pronouns, and restaurant dining',
    theme: 'Dining & The Dative Case',
    description: 'Master the Dative case (indirect objects, verbs with dative like schmecken, gefallen, helfen) and restaurant vocabulary.',
    grammarFocus: {
      ruleName: 'The Dative Case (Dativ)',
      explanation: 'The Dative case answers "Wem?" (To whom?). Articles change as follows: der -> dem, das -> dem, die -> der, plural -> den (+n on the noun). Pronouns: mir, dir, ihm, ihr, uns, euch, ihnen/Ihnen.',
      caseFocus: 'Dativ',
      examples: [
        { de: 'Das Essen schmeckt mir hervorragend!', en: 'The food tastes excellent to me!' },
        { de: 'Der Kellner bringt dem Gast die Speisekarte.', en: 'The waiter brings the menu to the guest. (dem Gast = Dativ)' },
        { de: 'Können Sie mir bitte helfen?', en: 'Could you please help me? (helfen + Dativ)' }
      ]
    },
    culturalNote: 'In Germany, tipping ("Trinkgeld") is usually around 5% to 10%. You do not leave money on the table; instead, tell the server the total rounded amount when handing over cash or card (e.g. if the bill is 27.50€, say "Stimmt so" with 30€, or "Machen Sie bitte 30 Euro").',
    idiomSpotlight: {
      german: 'Seinen Senf dazugeben',
      literal: 'To add one’s mustard',
      meaning: 'To give an unsolicited opinion / chime in',
      example: 'Er muss immer seinen Senf dazugeben!'
    },
    vocabulary: [
      {
        id: 'v-a2-7',
        german: 'der Kellner',
        article: 'der',
        baseWord: 'Kellner',
        plural: 'die Kellner',
        english: 'the waiter',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Der Kellner empfiehlt heute den frischen Spargel.',
        exampleEnglish: 'The waiter recommends the fresh asparagus today.',
        pronunciationTip: 'Stress on first syllable: "KEL-ner".',
        caseHint: 'Dativ: dem Kellner',
        level: 'A2',
        category: 'Dining'
      },
      {
        id: 'v-a2-8',
        german: 'die Speisekarte',
        article: 'die',
        baseWord: 'Speisekarte',
        plural: 'die Speisekarten',
        english: 'the menu',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Könnten wir bitte die Speisekarte sehen?',
        exampleEnglish: 'Could we please see the menu?',
        pronunciationTip: 'Compound noun: die Speise + die Karte.',
        level: 'A2',
        category: 'Dining'
      },
      {
        id: 'v-a2-9',
        german: 'das Gericht',
        article: 'das',
        baseWord: 'Gericht',
        plural: 'die Gerichte',
        english: 'the dish / course',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Dieses Gericht ist eine Spezialität des Hauses.',
        exampleEnglish: 'This dish is a house specialty.',
        pronunciationTip: 'Ich-Laut /ç/ in "-richt".',
        level: 'A2',
        category: 'Food'
      },
      {
        id: 'v-a2-10',
        german: 'schmecken',
        baseWord: 'schmecken',
        english: 'to taste / to be flavorful',
        partOfSpeech: 'verb',
        exampleGerman: 'Wie schmeckt dir die Suppe?',
        exampleEnglish: 'How does the soup taste to you?',
        pronunciationTip: 'Takes Dative: "schmeckt mir / dir / ihm".',
        caseHint: 'Governs Dative case',
        level: 'A2',
        category: 'Dining'
      },
      {
        id: 'v-a2-11',
        german: 'die Rechnung',
        article: 'die',
        baseWord: 'Rechnung',
        plural: 'die Rechnungen',
        english: 'the bill',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Bringen Sie uns bitte die Rechnung!',
        exampleEnglish: 'Please bring us the bill!',
        pronunciationTip: 'Feminine noun ending in -ung.',
        level: 'A2',
        category: 'Dining'
      },
      {
        id: 'v-a2-12',
        german: 'das Trinkgeld',
        article: 'das',
        baseWord: 'Trinkgeld',
        plural: 'die Trinkgelder',
        english: 'the tip (gratuity)',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Das Trinkgeld ist im Service inbegriffen, aber gerne gesehen.',
        exampleEnglish: 'Tipping is included in service, but appreciated.',
        pronunciationTip: 'Compound: trinken + Geld = das Trinkgeld.',
        level: 'A2',
        category: 'Dining'
      }
    ],
    dialogue: {
      id: 'd-a2-2',
      title: 'Abendessen im Gasthaus',
      scenario: 'Hannah and Jan enjoy a traditional Bavarian dinner.',
      lines: [
        { speaker: 'Jan', german: 'Hannah, was möchtest du heute bestellen?', english: 'Hannah, what would you like to order today?' },
        { speaker: 'Hannah', german: 'Ich nehme die Käsespätzle mit Röstzwiebeln und einen kleinen Salat.', english: 'I will take the cheese spaetzle with fried onions and a small salad.' },
        { speaker: 'Kellner', german: 'Guten Abend! Haben Sie schon gewählt?', english: 'Good evening! Have you chosen already?' },
        { speaker: 'Jan', german: 'Ja, gerne! Für die Dame die Spätzle und für mich das Wiener Schnitzel.', english: 'Yes, gladly! For the lady the spaetzle and for me the Wiener Schnitzel.' },
        { speaker: 'Kellner', german: 'Sehr wohl! Schmeckt Ihnen dazu ein dunkles Bier?', english: 'Very well! Would a dark beer taste good with that?' }
      ]
    }
  },
  {
    id: 'a2-3',
    level: 'A2',
    title: 'Modalverben & Satzklammer',
    subtitle: 'Modal verbs (können, müssen, dürfen, wollen) and verbal bracket',
    theme: 'Modal Verbs & Grammar',
    description: 'Learn German modal verbs and the famous verbal bracket (Satzklammer) where the conjugated modal sits in position 2 and the infinitive closes the sentence.',
    grammarFocus: {
      ruleName: 'Satzklammer (Verbal Bracket)',
      explanation: 'With modal verbs (können, müssen, dürfen, wollen, sollen, möchten), the modal verb is conjugated in position 2, while the main action verb remains in infinitive form at the VERY END of the clause.',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Ich kann sehr gut Deutsch sprechen.', en: 'I can speak German very well. (kann ... sprechen)' },
        { de: 'Hier darf man nicht rauchen.', en: 'One is not allowed to smoke here. (darf ... rauchen)' },
        { de: 'Wir müssen heute Abend unsere Hausaufgaben machen.', en: 'We must do our homework this evening. (müssen ... machen)' }
      ]
    },
    culturalNote: 'Rules and regulations ("Ordnung") are often clearly posted in public areas in Germany (e.g., "Rasen betreten verboten" or "Ruhezeit von 22:00 bis 06:00 Uhr"). Modal verbs like "dürfen" and "müssen" are everywhere!',
    idiomSpotlight: {
      german: 'Da liegt der Hund begraben',
      literal: 'That is where the dog is buried',
      meaning: 'That is the crux of the matter / the real problem',
      example: 'Er hat keine Zeit zum Üben, da liegt der Hund begraben!'
    },
    vocabulary: [
      {
        id: 'v-a2-13',
        german: 'können',
        baseWord: 'können',
        english: 'can / to be able to',
        partOfSpeech: 'verb',
        exampleGerman: 'Kannst du mir morgen beim Umzug helfen?',
        exampleEnglish: 'Can you help me with the move tomorrow?',
        pronunciationTip: 'ich kann, du kannst, er kann, wir können.',
        level: 'A2',
        category: 'Modal Verbs'
      },
      {
        id: 'v-a2-14',
        german: 'müssen',
        baseWord: 'müssen',
        english: 'must / to have to',
        partOfSpeech: 'verb',
        exampleGerman: 'Wir müssen den Zug um acht Uhr erwischen.',
        exampleEnglish: 'We have to catch the train at eight o’clock.',
        pronunciationTip: 'ich muss, du musst, er muss, wir müssen.',
        level: 'A2',
        category: 'Modal Verbs'
      },
      {
        id: 'v-a2-15',
        german: 'dürfen',
        baseWord: 'dürfen',
        english: 'may / to be permitted to',
        partOfSpeech: 'verb',
        exampleGerman: 'Darf ich hier mein Fahrrad abstellen?',
        exampleEnglish: 'May I park my bicycle here?',
        pronunciationTip: 'ich darf, du darfst, er darf, wir dürfen.',
        level: 'A2',
        category: 'Modal Verbs'
      },
      {
        id: 'v-a2-16',
        german: 'wollen',
        baseWord: 'wollen',
        english: 'to want to',
        partOfSpeech: 'verb',
        exampleGerman: 'Sie will im Sommer nach Berlin reisen.',
        exampleEnglish: 'She wants to travel to Berlin in the summer.',
        pronunciationTip: 'ich will, du willst, er will, wir wollen.',
        level: 'A2',
        category: 'Modal Verbs'
      },
      {
        id: 'v-a2-17',
        german: 'die Erlaubnis',
        article: 'die',
        baseWord: 'Erlaubnis',
        plural: 'die Erlaubnisse',
        english: 'the permission',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Haben Sie die Erlaubnis vom Chef bekommen?',
        exampleEnglish: 'Did you get permission from the boss?',
        pronunciationTip: 'Suffix "-nis" can be neuter or feminine; here feminine: die Erlaubnis.',
        level: 'A2',
        category: 'Rules'
      },
      {
        id: 'v-a2-18',
        german: 'die Pflicht',
        article: 'die',
        baseWord: 'Pflicht',
        plural: 'die Pflichten',
        english: 'the duty / obligation',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Pünktlichkeit ist hier die oberste Pflicht.',
        exampleEnglish: 'Punctuality is the highest duty here.',
        pronunciationTip: '"Pfl-" combination: pronounce both "p" and "f" crisply.',
        level: 'A2',
        category: 'Rules'
      }
    ],
    dialogue: {
      id: 'd-a2-3',
      title: 'Regeln in der Universitätsbibliothek',
      scenario: 'Markus explains the library rules to a new exchange student.',
      lines: [
        { speaker: 'Student', german: 'Darf man hier drinnen Kaffee trinken?', english: 'Is one allowed to drink coffee in here?' },
        { speaker: 'Markus', german: 'Nein, Getränke musst du draußen vor der Tür lassen.', english: 'No, you must leave drinks outside in front of the door.' },
        { speaker: 'Student', german: 'Und kann ich mein Laptop-Ladekabel hier anschließen?', english: 'And can I plug in my laptop charger here?' },
        { speaker: 'Markus', german: 'Ja, das darfst du! An jedem Tisch gibt es Steckdosen.', english: 'Yes, you may! There are power sockets at every desk.' },
        { speaker: 'Student', german: 'Super, danke! Dann will ich gleich mit dem Lernen anfangen.', english: 'Great, thanks! Then I want to start studying right away.' }
      ]
    }
  },

  // ==========================================
  // LEVEL B1 - INTERMEDIATE (MITTELSTUFE 1)
  // ==========================================
  {
    id: 'b1-1',
    level: 'B1',
    title: 'Reisen & Das Perfekt',
    subtitle: 'Narrating past events with conversational past (Perfekt: haben/sein + Partizip II)',
    theme: 'Past Tense & Travel',
    description: 'Master the spoken past tense in German: choose correctly between auxiliary verbs "haben" and "sein", and form regular and irregular past participles (Partizip II).',
    grammarFocus: {
      ruleName: 'Das Perfekt (haben vs. sein)',
      explanation: 'Use "sein" with verbs of movement (gehen, fahren, reisen) or change of state (aufwachen, sterben), plus "bleiben" and "sein". Use "haben" for all transitive verbs and stationary actions. The participle sits at the end of the clause.',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Ich bin letztes Jahr nach Österreich gefahren.', en: 'I traveled to Austria last year. (sein + gefahren)' },
        { de: 'Wir haben ein traditionelles Museum besucht.', en: 'We visited a traditional museum. (haben + besucht)' },
        { de: 'Was hast du gestern Abend gemacht?', en: 'What did you do yesterday evening?' }
      ]
    },
    culturalNote: 'Germans love to travel ("Reiselust" & "Fernweh"). Germany is regularly among the countries with the highest international travel expenditures per capita.',
    idiomSpotlight: {
      german: 'Fernweh haben',
      literal: 'To have distance-pain',
      meaning: 'Craving for travel / longing for far-off places (opposite of homesickness)',
      example: 'Nach dem kalten Winter habe ich großes Fernweh!'
    },
    vocabulary: [
      {
        id: 'v-b1-1',
        german: 'das Reiseziel',
        article: 'das',
        baseWord: 'Reiseziel',
        plural: 'die Reiseziele',
        english: 'the travel destination',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Die Schweizer Alpen sind mein liebstes Reiseziel.',
        exampleEnglish: 'The Swiss Alps are my favorite travel destination.',
        pronunciationTip: 'Compound: die Reise + das Ziel = das Reiseziel.',
        level: 'B1',
        category: 'Travel'
      },
      {
        id: 'v-b1-2',
        german: 'der Koffer',
        article: 'der',
        baseWord: 'Koffer',
        plural: 'die Koffer',
        english: 'the suitcase',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Hast du deinen Koffer schon gepackt?',
        exampleEnglish: 'Have you packed your suitcase already?',
        pronunciationTip: 'Double "f" keeps the preceding "o" short.',
        level: 'B1',
        category: 'Travel'
      },
      {
        id: 'v-b1-3',
        german: 'die Sehenswürdigkeit',
        article: 'die',
        baseWord: 'Sehenswürdigkeit',
        plural: 'die Sehenswürdigkeiten',
        english: 'the sight / landmark / tourist attraction',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Das Brandenburger Tor ist eine berühmte Sehenswürdigkeit.',
        exampleEnglish: 'The Brandenburg Gate is a famous landmark.',
        pronunciationTip: 'Suffix "-keit" is always feminine (die).',
        level: 'B1',
        category: 'Travel'
      },
      {
        id: 'v-b1-4',
        german: 'verreisen',
        baseWord: 'verreisen',
        english: 'to go on a trip / travel away',
        partOfSpeech: 'verb',
        exampleGerman: 'Wir sind über die Feiertage in die Berge verreist.',
        exampleEnglish: 'We traveled away to the mountains over the holidays.',
        pronunciationTip: 'Forms Perfekt with "sein": "Wir sind verreist".',
        level: 'B1',
        category: 'Travel'
      },
      {
        id: 'v-b1-5',
        german: 'die Erfahrung',
        article: 'die',
        baseWord: 'Erfahrung',
        plural: 'die Erfahrungen',
        english: 'the experience / background',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Diese Reise war eine unvergessliche Erfahrung.',
        exampleEnglish: 'This journey was an unforgettable experience.',
        pronunciationTip: 'Suffix "-ung" is feminine (die).',
        level: 'B1',
        category: 'Travel'
      },
      {
        id: 'v-b1-6',
        german: 'ankommen',
        baseWord: 'ankommen',
        english: 'to arrive',
        partOfSpeech: 'verb',
        exampleGerman: 'Der Zug ist mit zehn Minuten Verspätung angekommen.',
        exampleEnglish: 'The train arrived with a ten-minute delay.',
        pronunciationTip: 'Perfekt with sein: "ist angekommen".',
        level: 'B1',
        category: 'Travel'
      }
    ],
    dialogue: {
      id: 'd-b1-1',
      title: 'Urlaubserinnerungen austauschen',
      scenario: 'Lea tells Julian about her vacation in the Black Forest.',
      lines: [
        { speaker: 'Julian', german: 'Lea, wie war dein Urlaub im Schwarzwald?', english: 'Lea, how was your vacation in the Black Forest?' },
        { speaker: 'Lea', german: 'Es war herrlich! Wir sind jeden Tag gewandert und haben tolle Natur gesehen.', english: 'It was wonderful! We hiked every day and saw amazing nature.' },
        { speaker: 'Julian', german: 'Habt ihr in einem Hotel oder einer Hütte übernachtet?', english: 'Did you stay overnight in a hotel or a mountain hut?' },
        { speaker: 'Lea', german: 'Wir haben in einer gemütlichen Pension gewohnt und echte Schwarzwälder Kirschtorte gegessen!', english: 'We stayed in a cozy guesthouse and ate genuine Black Forest cake!' },
        { speaker: 'Julian', german: 'Das klingt nach einer perfekten Auszeit!', english: 'That sounds like a perfect getaway!' }
      ]
    }
  },
  {
    id: 'b1-2',
    level: 'B1',
    title: 'Meinung & Subjunktionen (weil, dass, obwohl)',
    subtitle: 'Expressing viewpoints and subordinate clauses with verb-final word order',
    theme: 'Subordinate Clauses & Debate',
    description: 'Master German subordinate clauses introduced by conjunctions (weil, dass, obwohl, wenn) where the conjugated verb moves to the very end of the clause.',
    grammarFocus: {
      ruleName: 'Nebensatz (Subordinate Clause) Word Order',
      explanation: 'In German subordinate clauses introduced by subordinating conjunctions ("weil", "dass", "obwohl", "wenn"), the conjugated verb ALWAYS moves to the very last position in the clause.',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Ich lerne Deutsch, weil ich in Berlin studieren möchte.', en: 'I am learning German because I want to study in Berlin. (möchte at the end)' },
        { de: 'Ich glaube, dass diese Stadt sehr lebendig ist.', en: 'I believe that this city is very vibrant. (ist at the end)' },
        { de: 'Obwohl es regnet, gehen wir spazieren.', en: 'Although it is raining, we go for a walk. (regnet at the end; main clause inverts)' }
      ]
    },
    culturalNote: 'In German discourse, facts, well-reasoned arguments ("sachliche Argumente"), and direct constructive feedback are prized over superficial agreement.',
    idiomSpotlight: {
      german: 'Den Nagel auf den Kopf treffen',
      literal: 'To hit the nail on the head',
      meaning: 'To describe exactly the truth or core issue',
      example: 'Mit deiner Analyse hast du den Nagel auf den Kopf getroffen!'
    },
    vocabulary: [
      {
        id: 'v-b1-7',
        german: 'die Meinung',
        article: 'die',
        baseWord: 'Meinung',
        plural: 'die Meinungen',
        english: 'the opinion / viewpoint',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Meiner Meinung nach sollten wir mehr erneuerbare Energien nutzen.',
        exampleEnglish: 'In my opinion, we should use more renewable energy.',
        pronunciationTip: 'Dative preposition: "Meiner Meinung nach".',
        level: 'B1',
        category: 'Debate'
      },
      {
        id: 'v-b1-8',
        german: 'der Grund',
        article: 'der',
        baseWord: 'Grund',
        plural: 'die Gründe',
        english: 'the reason / cause',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Aus diesem Grund habe ich mich anders entschieden.',
        exampleEnglish: 'For this reason, I decided differently.',
        pronunciationTip: 'Short "u" vowel: "groont".',
        level: 'B1',
        category: 'Debate'
      },
      {
        id: 'v-b1-9',
        german: 'obwohl',
        baseWord: 'obwohl',
        english: 'although / even though',
        partOfSpeech: 'conjunction',
        exampleGerman: 'Obwohl die Prüfung schwierig war, hat er sie bestanden.',
        exampleEnglish: 'Although the exam was difficult, he passed it.',
        pronunciationTip: 'Conjunction pushing verb to the end: "ob-VOHL".',
        level: 'B1',
        category: 'Grammar'
      },
      {
        id: 'v-b1-10',
        german: 'überzeugt sein',
        baseWord: 'überzeugt sein',
        english: 'to be convinced',
        partOfSpeech: 'phrase',
        exampleGerman: 'Ich bin fest davon überzeugt, dass diese Idee funktioniert.',
        exampleEnglish: 'I am firmly convinced that this idea works.',
        pronunciationTip: 'Umlaut ü with rounded lips: "ew-ber-TSOYKT".',
        level: 'B1',
        category: 'Debate'
      },
      {
        id: 'v-b1-11',
        german: 'das Argument',
        article: 'das',
        baseWord: 'Argument',
        plural: 'die Argumente',
        english: 'the argument / point',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Das ist ein überzeugendes Argument in dieser Debatte.',
        exampleEnglish: 'That is a convincing argument in this debate.',
        pronunciationTip: 'Stress on the last syllable: "ar-goo-MENT".',
        level: 'B1',
        category: 'Debate'
      },
      {
        id: 'v-b1-12',
        german: 'zustimmen',
        baseWord: 'zustimmen',
        english: 'to agree (with someone)',
        partOfSpeech: 'verb',
        exampleGerman: 'Ich stimme dir in diesem Punkt vollkommen zu.',
        exampleEnglish: 'I completely agree with you on this point.',
        pronunciationTip: 'Separable verb taking Dative: "Ich stimme dir zu".',
        caseHint: 'Governs Dative case',
        level: 'B1',
        category: 'Debate'
      }
    ],
    dialogue: {
      id: 'd-b1-2',
      title: 'Diskussion über Homeoffice',
      scenario: 'Two colleagues discuss the benefits and downsides of remote work.',
      lines: [
        { speaker: 'Felix', german: 'Glaubst du, dass Homeoffice die Produktivität steigert?', english: 'Do you believe that home office increases productivity?' },
        { speaker: 'Sarah', german: 'Ja, weil man viel ungestörter arbeiten kann und der Pendelweg wegfällt.', english: 'Yes, because one can work much more undisturbed and the commute is eliminated.' },
        { speaker: 'Felix', german: 'Obwohl das stimmt, fehlt mir manchmal der direkte persönliche Austausch.', english: 'Although that is true, I sometimes miss the direct personal exchange.' },
        { speaker: 'Sarah', german: 'Da stimme ich dir zu. Ein hybrides Modell ist wahrscheinlich die beste Lösung.', english: 'I agree with you there. A hybrid model is probably the best solution.' }
      ]
    }
  },
  {
    id: 'b1-3',
    level: 'B1',
    title: 'Wohnen & Wechselpräpositionen',
    subtitle: 'Two-way prepositions (an, auf, in, über, unter, vor, hinter, neben, zwischen)',
    theme: 'Housing & Two-Way Prepositions',
    description: 'Master the two-way prepositions: Accusative for movement/destination ("Wohin?"), and Dative for static location ("Wo?").',
    grammarFocus: {
      ruleName: 'Wechselpräpositionen (Akkusativ vs. Dativ)',
      explanation: 'Nine German prepositions change case depending on meaning: Akkusativ for direction/motion into a place ("Wohin?"), Dativ for fixed position/location ("Wo?").\n• Ich stelle die Lampe auf den Tisch (Akkusativ, motion).\n• Die Lampe steht auf dem Tisch (Dativ, location).',
      caseFocus: 'Dativ',
      examples: [
        { de: 'Er legt das Buch auf den Schreibtisch.', en: 'He places the book onto the desk. (Akkusativ - Wohin?)' },
        { de: 'Das Buch liegt auf dem Schreibtisch.', en: 'The book lies on the desk. (Dativ - Wo?)' },
        { de: 'Wir hängen das Bild an die Wand.', en: 'We hang the picture on the wall. (Akkusativ - Wohin?)' }
      ]
    },
    culturalNote: 'In Germany, apartment rentals are typically rented without a kitchen ("ohne Einbauküche"). Tenants often buy and bring their own fitted kitchen, including cabinets and sink!',
    idiomSpotlight: {
      german: 'Auf der Leitung stehen',
      literal: 'To stand on the line',
      meaning: 'To be slow on the uptake / slow to comprehend',
      example: 'Entschuldige, ich stand gerade auf der Leitung!'
    },
    vocabulary: [
      {
        id: 'v-b1-13',
        german: 'die Wohnung',
        article: 'die',
        baseWord: 'Wohnung',
        plural: 'die Wohnungen',
        english: 'the apartment / flat',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Die Wohnung hat drei helle Zimmer und einen Balkon.',
        exampleEnglish: 'The apartment has three bright rooms and a balcony.',
        pronunciationTip: 'Feminine ending in -ung.',
        level: 'B1',
        category: 'Housing'
      },
      {
        id: 'v-b1-14',
        german: 'der Schreibtisch',
        article: 'der',
        baseWord: 'Schreibtisch',
        plural: 'die Schreibtische',
        english: 'the desk',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Mein Laptop steht auf dem großen Schreibtisch.',
        exampleEnglish: 'My laptop is on the large desk.',
        pronunciationTip: 'Compound: schreiben + Tisch = der Schreibtisch.',
        level: 'B1',
        category: 'Furniture'
      },
      {
        id: 'v-b1-15',
        german: 'das Regal',
        article: 'das',
        baseWord: 'Regal',
        plural: 'die Regale',
        english: 'the shelf / bookcase',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Ich stelle die Bücher in das neue Holzregal.',
        exampleEnglish: 'I place the books into the new wooden shelf.',
        pronunciationTip: 'Stress on the second syllable: "reh-GAHL".',
        level: 'B1',
        category: 'Furniture'
      },
      {
        id: 'v-b1-16',
        german: 'die Miete',
        article: 'die',
        baseWord: 'Miete',
        plural: 'die Mieten',
        english: 'the rent',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Wie hoch ist die Warmmiete inklusive Nebenkosten?',
        exampleEnglish: 'How high is the warm rent including utilities?',
        pronunciationTip: 'Long "ie" vowel: "MEE-teh".',
        level: 'B1',
        category: 'Housing'
      },
      {
        id: 'v-b1-17',
        german: 'stellen',
        baseWord: 'stellen',
        english: 'to put / place upright (motion)',
        partOfSpeech: 'verb',
        exampleGerman: 'Bitte stelle die Gläser in den Schrank!',
        exampleEnglish: 'Please put the glasses into the cupboard! (Akkusativ)',
        pronunciationTip: 'Action verb requiring Akkusativ destination.',
        caseHint: 'Takes Akkusativ with two-way prepositions',
        level: 'B1',
        category: 'Verbs'
      },
      {
        id: 'v-b1-18',
        german: 'stehen',
        baseWord: 'stehen',
        english: 'to stand / be located (position)',
        partOfSpeech: 'verb',
        exampleGerman: 'Die Gläser stehen schon im Schrank.',
        exampleEnglish: 'The glasses are already in the cupboard. (Dativ)',
        pronunciationTip: 'Position verb requiring Dativ location.',
        caseHint: 'Takes Dativ with two-way prepositions',
        level: 'B1',
        category: 'Verbs'
      }
    ],
    dialogue: {
      id: 'd-b1-3',
      title: 'Einzug in die neue WG',
      scenario: 'Lina and Jonas arrange furniture in their shared flat (Wohngemeinschaft).',
      lines: [
        { speaker: 'Lina', german: 'Jonas, wohin stellen wir das Sofa?', english: 'Jonas, where shall we place the sofa?' },
        { speaker: 'Jonas', german: 'Stellen wir es an die Wand gegenüber vom Fenster.', english: 'Let’s place it against the wall opposite the window.' },
        { speaker: 'Lina', german: 'Gute Idee! Und die Stehlampe steht dann perfekt daneben.', english: 'Good idea! And the floor lamp will then stand perfectly next to it.' },
        { speaker: 'Jonas', german: 'Perfekt. Ich lege noch den Teppich unter den Tisch.', english: 'Perfect. I will also lay the rug under the table.' }
      ]
    }
  },

  // ==========================================
  // LEVEL B2 - UPPER INTERMEDIATE (MITTELSTUFE 2)
  // ==========================================
  {
    id: 'b2-1',
    level: 'B2',
    title: 'Berufswelt & Das Vorstellungsgespräch',
    subtitle: 'Professional careers, job interviews, and resume terminology',
    theme: 'Professional German',
    description: 'Learn sophisticated German workplace communication, competencies, career paths, and formal email terminology.',
    grammarFocus: {
      ruleName: 'Passiv (Passive Voice) in Professional German',
      explanation: 'The German Vorgangspassiv is formed with "werden" + Partizip II. In professional contexts, it emphasizes processes rather than agents: "Die Bewerbungsunterlagen werden sorgfältig geprüft."',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Das Protokoll wird vom Teamleiter erstellt.', en: 'The minutes are created by the team leader.' },
        { de: 'Die neuen Richtlinien wurden gestern beschlossen.', en: 'The new guidelines were decided yesterday.' }
      ]
    },
    culturalNote: 'German CVs ("Lebenslauf") are strictly structured in tabular reverse-chronological order and traditionally include professional contact details, dates without gaps ("lückenlos"), and specific technical certificates.',
    idiomSpotlight: {
      german: 'Zwei Fliegen mit einer Klappe schlagen',
      literal: 'To kill two flies with one swatter',
      meaning: 'To kill two birds with one stone',
      example: 'Mit diesem Projekt schlagen wir zwei Fliegen mit einer Klappe!'
    },
    vocabulary: [
      {
        id: 'v-b2-1',
        german: 'die Bewerbung',
        article: 'die',
        baseWord: 'Bewerbung',
        plural: 'die Bewerbungen',
        english: 'the job application',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Ich habe meine Bewerbung für die Stelle als Softwareentwickler eingereicht.',
        exampleEnglish: 'I submitted my job application for the software developer position.',
        pronunciationTip: 'Feminine noun ending in -ung.',
        level: 'B2',
        category: 'Business'
      },
      {
        id: 'v-b2-2',
        german: 'das Vorstellungsgespräch',
        article: 'das',
        baseWord: 'Vorstellungsgespräch',
        plural: 'die Vorstellungsgespräche',
        english: 'the job interview',
        gender: 'das',
        partOfSpeech: 'noun',
        exampleGerman: 'Das Vorstellungsgespräch verlief äußerst positiv.',
        exampleEnglish: 'The job interview went extremely positively.',
        pronunciationTip: 'Compound: die Vorstellung + das Gespräch.',
        level: 'B2',
        category: 'Business'
      },
      {
        id: 'v-b2-3',
        german: 'die Kompetenz',
        article: 'die',
        baseWord: 'Kompetenz',
        plural: 'die Kompetenzen',
        english: 'the skill / competence',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Analytische Fähigkeiten und Teamfähigkeit gehören zu ihren Kernkompetenzen.',
        exampleEnglish: 'Analytical skills and teamwork belong to her core competencies.',
        pronunciationTip: 'Suffix "-enz" is feminine (die).',
        level: 'B2',
        category: 'Business'
      },
      {
        id: 'v-b2-4',
        german: 'die Herausforderung',
        article: 'die',
        baseWord: 'Herausforderung',
        plural: 'die Herausforderungen',
        english: 'the challenge',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Ich freue mich auf neue berufliche Herausforderungen.',
        exampleEnglish: 'I look forward to new professional challenges.',
        pronunciationTip: 'Stress on "-for-": "her-OWS-for-deh-roong".',
        level: 'B2',
        category: 'Business'
      },
      {
        id: 'v-b2-5',
        german: 'die Verantwortung',
        article: 'die',
        baseWord: 'Verantwortung',
        plural: 'die Verantwortungen',
        english: 'the responsibility',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'In dieser Rolle trage ich die Verantwortung für das gesamte Budget.',
        exampleEnglish: 'In this role, I carry responsibility for the entire budget.',
        pronunciationTip: 'Verb collocation: "Verantwortung übernehmen / tragen".',
        level: 'B2',
        category: 'Business'
      },
      {
        id: 'v-b2-6',
        german: 'verhandeln',
        baseWord: 'verhandeln',
        english: 'to negotiate',
        partOfSpeech: 'verb',
        exampleGerman: 'Wir verhandeln derzeit über die Bedingungen des Vertrags.',
        exampleEnglish: 'We are currently negotiating the terms of the contract.',
        pronunciationTip: 'Inseparable prefix ver-.',
        level: 'B2',
        category: 'Business'
      }
    ],
    dialogue: {
      id: 'd-b2-1',
      title: 'Das Vorstellungsgespräch in Zürich',
      scenario: 'Frau Dr. Keller interviews an applicant for a senior project manager role.',
      lines: [
        { speaker: 'Frau Dr. Keller', german: 'Guten Tag, Herr Klein! Was motiviert Sie, für unser Unternehmen tätig zu sein?', english: 'Good day, Mr. Klein! What motivates you to work for our enterprise?' },
        { speaker: 'Herr Klein', german: 'Ihre Innovationskraft im Bereich erneuerbare Energien passt hervorragend zu meinen Qualifikationen.', english: 'Your innovative strength in renewable energy aligns outstandingly with my qualifications.' },
        { speaker: 'Frau Dr. Keller', german: 'Welche Erfahrungen bringen Sie im internationalen Projektmanagement mit?', english: 'What experience do you bring in international project management?' },
        { speaker: 'Herr Klein', german: 'Ich habe in den vergangenen fünf Jahren grenzüberschreitende Teams erfolgreich geleitet.', english: 'Over the past five years, I have successfully managed cross-border teams.' }
      ]
    }
  },
  {
    id: 'b2-2',
    level: 'B2',
    title: 'Konjunktiv II & Höfliche Wünsche',
    subtitle: 'Hypothetical situations, polite requests, and unreal conditionals',
    theme: 'Subjunctive & Hypotheticals',
    description: 'Master the Konjunktiv II (wäre, hätte, würde + Infinitiv) for polite phrasing, dreams, advice, and unreal conditional clauses.',
    grammarFocus: {
      ruleName: 'Konjunktiv II (Wünsche & Hypothetische Sätze)',
      explanation: 'Use "hätte" (would have) and "wäre" (would be) for haben/sein. For most other verbs, use "würde" + Infinitiv at sentence end. In "Wenn... dann" sentences, both verbs use Konjunktiv II.',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Wenn ich mehr Zeit hätte, würde ich mehr reisen.', en: 'If I had more time, I would travel more.' },
        { de: 'Könnten Sie mir bitte die Unterlagen zusenden?', en: 'Could you please send me the documents? (polite request)' },
        { de: 'An deiner Stelle würde ich das Angebot annehmen.', en: 'In your shoes, I would accept the offer. (giving advice)' }
      ]
    },
    culturalNote: 'High politeness in German bureaucracy and professional requests almost exclusively relies on Konjunktiv II ("Ich hätte gern...", "Dürfte ich Sie bitten...", "Könnten Sie...").',
    idiomSpotlight: {
      german: 'Ins Schwarze treffen',
      literal: 'To hit into the black (bullseye)',
      meaning: 'To hit the bullseye / be spot-on',
      example: 'Mit Ihrem Vorschlag haben Sie voll ins Schwarze getroffen!'
    },
    vocabulary: [
      {
        id: 'v-b2-7',
        german: 'hätte',
        baseWord: 'haben',
        english: 'would have (Konjunktiv II)',
        partOfSpeech: 'verb',
        exampleGerman: 'Wenn ich genug Geld hätte, würde ich eine Weltreise machen.',
        exampleEnglish: 'If I had enough money, I would take a trip around the world.',
        pronunciationTip: 'Umlaut ä sounds like open /ɛ/.',
        level: 'B2',
        category: 'Subjunctive'
      },
      {
        id: 'v-b2-8',
        german: 'wäre',
        baseWord: 'sein',
        english: 'would be (Konjunktiv II)',
        partOfSpeech: 'verb',
        exampleGerman: 'Das wäre wirklich fantastisch!',
        exampleEnglish: 'That would be truly fantastic!',
        pronunciationTip: 'Long "ä" sound: "VEH-reh".',
        level: 'B2',
        category: 'Subjunctive'
      },
      {
        id: 'v-b2-9',
        german: 'der Vorschlag',
        article: 'der',
        baseWord: 'Vorschlag',
        plural: 'die Vorschläge',
        english: 'the proposal / suggestion',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Ich hätte da einen konstruktiven Vorschlag.',
        exampleEnglish: 'I would have a constructive suggestion.',
        pronunciationTip: 'Compound: vor + schlagen = der Vorschlag.',
        level: 'B2',
        category: 'Communication'
      },
      {
        id: 'v-b2-10',
        german: 'die Gelegenheit',
        article: 'die',
        baseWord: 'Gelegenheit',
        plural: 'die Gelegenheiten',
        english: 'the opportunity / occasion',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Das wäre eine hervorragende Gelegenheit für uns.',
        exampleEnglish: 'That would be an outstanding opportunity for us.',
        pronunciationTip: 'Suffix "-heit" is feminine (die).',
        level: 'B2',
        category: 'General'
      },
      {
        id: 'v-b2-11',
        german: 'vorschlagen',
        baseWord: 'vorschlagen',
        english: 'to propose / to suggest',
        partOfSpeech: 'verb',
        exampleGerman: 'Was würdest du in dieser Situation vorschlagen?',
        exampleEnglish: 'What would you suggest in this situation?',
        pronunciationTip: 'Separable verb: "Ich schlage vor".',
        level: 'B2',
        category: 'Verbs'
      },
      {
        id: 'v-b2-12',
        german: 'die Voraussetzung',
        article: 'die',
        baseWord: 'Voraussetzung',
        plural: 'die Voraussetzungen',
        english: 'the prerequisite / condition',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Gute Sprachkenntnisse sind eine wesentliche Voraussetzung.',
        exampleEnglish: 'Good language skills are an essential prerequisite.',
        pronunciationTip: 'Feminine noun ending in -ung.',
        level: 'B2',
        category: 'Business'
      }
    ],
    dialogue: {
      id: 'd-b2-2',
      title: 'Pläne für die Zukunft',
      scenario: 'Two friends imagine ideal scenarios for their upcoming year.',
      lines: [
        { speaker: 'Simon', german: 'Wenn du frei wählen könntest, wo würdest du am liebsten leben?', english: 'If you could choose freely, where would you most like to live?' },
        { speaker: 'Elena', german: 'Ich würde ein ganzes Jahr in Wien verbringen und Kunstgeschichte studieren.', english: 'I would spend an entire year in Vienna and study art history.' },
        { speaker: 'Simon', german: 'Das wäre ein Traum! Und was würde dich daran am meisten reizen?', english: 'That would be a dream! And what would appeal to you most about that?' },
        { speaker: 'Elena', german: 'Die Kaffeehauskultur, die Architektur und die vielen Museen!', english: 'The coffeehouse culture, the architecture, and the countless museums!' }
      ]
    }
  },

  // ==========================================
  // LEVEL C1 - ADVANCED (OBERSTUFE)
  // ==========================================
  {
    id: 'c1-1',
    level: 'C1',
    title: 'Gesellschaft, Diskurs & Wissenschaftssprache',
    subtitle: 'Academic registers, complex nominal style (Nominalstil), and debate',
    theme: 'Academic & Socio-political Discourse',
    description: 'Master higher-register German, noun-verb idioms (Nomen-Verb-Verbindungen), and sophisticated structures used in scientific papers and editorial debates.',
    grammarFocus: {
      ruleName: 'Nomen-Verb-Verbindungen (Funktionsverbgefüge)',
      explanation: 'In academic and elevated registers, verbs are often replaced by noun + function verb pairings: e.g., "in Betracht ziehen" (instead of "betrachten/überlegen"), "eine Entscheidung treffen" (instead of "entscheiden"), "zur Verfügung stehen" (instead of "vorhanden sein").',
      caseFocus: 'Akkusativ',
      examples: [
        { de: 'Wir müssen alle relevanten Faktoren in Betracht ziehen.', en: 'We must take all relevant factors into consideration.' },
        { de: 'Diese Frage steht heute zur Diskussion.', en: 'This question is up for discussion today.' },
        { de: 'Er brachte seine Bedenken deutlich zum Ausdruck.', en: 'He expressed his concerns clearly.' }
      ]
    },
    culturalNote: 'Germany’s academic tradition emphasizes rigorous terminology and conceptual precision ("Begrifflichkeit"). Academic lectures (Vorlesungen) and editorial publications (wie Die Zeit oder FAZ) expect precise nominal formulations.',
    idiomSpotlight: {
      german: 'Den Teufel an die Wand malen',
      literal: 'To paint the devil on the wall',
      meaning: 'To be overly pessimistic / conjure up the worst-case scenario',
      example: 'Mal nicht gleich den Teufel an die Wand, noch ist nichts verloren!'
    },
    vocabulary: [
      {
        id: 'v-c1-1',
        german: 'in Betracht ziehen',
        baseWord: 'in Betracht ziehen',
        english: 'to take into consideration',
        partOfSpeech: 'phrase',
        exampleGerman: 'Wir sollten alternative Lösungsansätze ernsthaft in Betracht ziehen.',
        exampleEnglish: 'We should seriously take alternative solution approaches into consideration.',
        pronunciationTip: 'Idiomatic noun-verb construction.',
        level: 'C1',
        category: 'Elevated Discourse'
      },
      {
        id: 'v-c1-2',
        german: 'zur Verfügung stehen',
        baseWord: 'zur Verfügung stehen',
        english: 'to be available / at disposal',
        partOfSpeech: 'phrase',
        exampleGerman: 'Für Rückfragen stehe ich Ihnen jederzeit gerne zur Verfügung.',
        exampleEnglish: 'I am gladly at your disposal at any time for questions.',
        pronunciationTip: 'Standard business and formal closing phrase.',
        level: 'C1',
        category: 'Elevated Discourse'
      },
      {
        id: 'v-c1-3',
        german: 'die Nachhaltigkeit',
        article: 'die',
        baseWord: 'Nachhaltigkeit',
        plural: 'die Nachhaltigkeiten',
        english: 'the sustainability',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Ökologische und ökonomische Nachhaltigkeit müssen Hand in Hand gehen.',
        exampleEnglish: 'Ecological and economic sustainability must go hand in hand.',
        pronunciationTip: 'Suffix "-keit" is feminine (die).',
        level: 'C1',
        category: 'Science & Society'
      },
      {
        id: 'v-c1-4',
        german: 'der Paradigmenwechsel',
        article: 'der',
        baseWord: 'Paradigmenwechsel',
        plural: 'die Paradigmenwechsel',
        english: 'the paradigm shift',
        gender: 'der',
        partOfSpeech: 'noun',
        exampleGerman: 'Die Digitalisierung bewirkt einen fundamentalen Paradigmenwechsel.',
        exampleEnglish: 'Digitalization brings about a fundamental paradigm shift.',
        pronunciationTip: 'Greek root: "pah-rah-DIG-men-vek-sel".',
        level: 'C1',
        category: 'Science & Society'
      },
      {
        id: 'v-c1-5',
        german: 'widerspiegeln',
        baseWord: 'widerspiegeln',
        english: 'to reflect / mirror',
        partOfSpeech: 'verb',
        exampleGerman: 'Diese Entwicklung spiegelt die gesellschaftlichen Veränderungen wider.',
        exampleEnglish: 'This development reflects societal transformations.',
        pronunciationTip: 'Separable verb: "spiegelt ... wider".',
        level: 'C1',
        category: 'Elevated Verbs'
      },
      {
        id: 'v-c1-6',
        german: 'die Erkenntnis',
        article: 'die',
        baseWord: 'Erkenntnis',
        plural: 'die Erkenntnisse',
        english: 'the insight / scientific finding',
        gender: 'die',
        partOfSpeech: 'noun',
        exampleGerman: 'Die neuesten wissenschaftlichen Erkenntnisse bestätigen diese Hypothese.',
        exampleEnglish: 'The latest scientific findings corroborate this hypothesis.',
        pronunciationTip: 'Feminine noun: die Erkenntnis.',
        level: 'C1',
        category: 'Science & Society'
      }
    ],
    dialogue: {
      id: 'd-c1-1',
      title: 'Podiumsdiskussion zur Energiewende',
      scenario: 'Two researchers analyze sustainability policies at a symposium in Bonn.',
      lines: [
        { speaker: 'Prof. Dr. Braun', german: 'Herr Kollege, inwiefern halten Sie die aktuellen Maßnahmen für hinreichend?', english: 'Colleague, to what extent do you consider the current measures sufficient?' },
        { speaker: 'Dr. Weimann', german: 'Sie stellen zweifellos einen Schritt dar, doch müssen wir strukturelle Reformen zügig vorantreiben.', english: 'They undoubtedly represent a step, yet we must rapidly advance structural reforms.' },
        { speaker: 'Prof. Dr. Braun', german: 'Dabei darf die sozioökonomische Dimension keineswegs außer Acht gelassen werden.', english: 'In doing so, the socio-economic dimension must by no means be disregarded.' },
        { speaker: 'Dr. Weimann', german: 'Vollkommen richtig. Akzeptanz in der Bevölkerung ist die unabdingbare Voraussetzung für jeden dauerhaften Wandel.', english: 'Completely right. Public acceptance is the indispensable prerequisite for any lasting change.' }
      ]
    }
  },
  {
    id: 'c1-2',
    level: 'C1',
    title: 'Deutsche Redewendungen & Sprachliche Nuancen',
    subtitle: 'Vibrant idioms, modal particles (doch, mal, ja, eben), and idiomatic mastery',
    theme: 'Idiomatic Nuances & Culture',
    description: 'Master German modal particles (Abtönungspartikel) that native speakers use to convey nuance, sarcasm, certainty, and warmth, plus classic cultural idioms.',
    grammarFocus: {
      ruleName: 'Modalpartikeln (Abtönungspartikeln: ja, doch, mal, wohl, eben)',
      explanation: 'Modal particles are untranslatable tone words giving sentences emotion and context:\n• "Komm mal her!" (softens request)\n• "Das weißt du doch!" (reminds of shared knowledge)\n• "Das ist ja toll!" (signals surprise or obvious delight)\n• "Da kann man eben nichts machen." (signals resignation to fate).',
      caseFocus: 'Nominativ',
      examples: [
        { de: 'Das ist doch kein Problem!', en: 'That is really no problem at all!' },
        { de: 'Schau mal, wer da kommt!', en: 'Just look who is coming!' },
        { de: 'Das war ja eine tolle Überraschung!', en: 'That was indeed a wonderful surprise!' }
      ]
    },
    culturalNote: 'Modal particles are the true secret to sounding like a native German speaker. While grammatically optional, skipping them in spoken conversation makes speech sound overly robotic or textbook-rigid.',
    idiomSpotlight: {
      german: 'Da steppt der Bär',
      literal: 'The bear is tap-dancing there',
      meaning: 'There is a great party / lots of lively action going on',
      example: 'Komm heute Abend mit, da steppt der Bär!'
    },
    vocabulary: [
      {
        id: 'v-c1-7',
        german: 'Da steppt der Bär',
        baseWord: 'Da steppt der Bär',
        english: 'The party is raging / It’s where the action is',
        partOfSpeech: 'phrase',
        exampleGerman: 'Auf dem Sommerfest steppt heute Abend der Bär!',
        exampleEnglish: 'Tonight at the summer festival, the party will be raging!',
        pronunciationTip: 'Colloquial cultural idiom.',
        level: 'C1',
        category: 'Idioms'
      },
      {
        id: 'v-c1-8',
        german: 'Das ist mir Wurscht',
        baseWord: 'wurscht / egal',
        english: 'I don’t care / It’s all the same to me',
        partOfSpeech: 'phrase',
        exampleGerman: 'Welchen Film wir schauen, ist mir völlig wurscht.',
        exampleEnglish: 'Which movie we watch is completely all the same to me.',
        pronunciationTip: 'Bavarian/Austrian slang variant of "Wurst" meaning indifference.',
        level: 'C1',
        category: 'Idioms'
      },
      {
        id: 'v-c1-9',
        german: 'den Teufel an die Wand malen',
        baseWord: 'den Teufel an die Wand malen',
        english: 'to expect the worst / paint a gloomy picture',
        partOfSpeech: 'phrase',
        exampleGerman: 'Mal nicht gleich den Teufel an die Wand, alles wird gut!',
        exampleEnglish: 'Don’t expect the worst right away, everything will be fine!',
        pronunciationTip: 'Figurative idiom.',
        level: 'C1',
        category: 'Idioms'
      },
      {
        id: 'v-c1-10',
        german: 'die Daumen drücken',
        baseWord: 'die Daumen drücken',
        english: 'to keep one’s fingers crossed (literally: press thumbs)',
        partOfSpeech: 'phrase',
        exampleGerman: 'Ich drücke dir für die morgige Prüfung ganz fest die Daumen!',
        exampleEnglish: 'I am keeping my fingers firmly crossed for your exam tomorrow!',
        pronunciationTip: 'In German culture, one presses thumbs into fists rather than crossing fingers.',
        level: 'C1',
        category: 'Idioms'
      },
      {
        id: 'v-c1-11',
        german: 'ins Gras beißen',
        baseWord: 'ins Gras beißen',
        english: 'to bite the dust (colloquial for die/fail)',
        partOfSpeech: 'phrase',
        exampleGerman: 'Mein alter Laptop hat gestern endgültig ins Gras gebissen.',
        exampleEnglish: 'My old laptop finally bit the dust yesterday.',
        pronunciationTip: 'Humorous colloquial idiom.',
        level: 'C1',
        category: 'Idioms'
      },
      {
        id: 'v-c1-12',
        german: 'Schwein haben',
        baseWord: 'Schwein haben',
        english: 'to be very lucky / have a stroke of luck',
        partOfSpeech: 'phrase',
        exampleGerman: 'Da haben wir aber noch mal richtig Schwein gehabt!',
        exampleEnglish: 'There we really had a lucky break!',
        pronunciationTip: 'Historical cultural metaphor linking pigs to prosperity and good fortune.',
        level: 'C1',
        category: 'Idioms'
      }
    ],
    dialogue: {
      id: 'd-c1-2',
      title: 'Berliner Schnauze & Herzlicher Humor',
      scenario: 'Two Berlin friends catch up over Currywurst and discuss their chaotic week.',
      lines: [
        { speaker: 'Marlene', german: 'Na, wie lief denn dein Vorstellungsgespräch am Donnerstag?', english: 'Well, how did your job interview on Thursday go?' },
        { speaker: 'Nico', german: 'Mensch, ich hatte unglaubliches Schwein! Die Bahn hatte zwar Verspätung, aber der Personaler auch!', english: 'Man, I had incredible luck! The train was delayed, but so was the HR interviewer!' },
        { speaker: 'Marlene', german: 'Na siehst du, du malst immer gleich den Teufel an die Wand!', english: 'Well you see, you always anticipate the worst right away!' },
        { speaker: 'Nico', german: 'Stimmt wohl. Jetzt drück mir mal die Daumen, dass der Vertrag bald eintrudelt!', english: 'True indeed. Now keep your fingers crossed for me that the contract arrives soon!' }
      ]
    }
  }
];

export const CEFR_METADATA: Record<string, { name: string; subtitle: string; color: string; badge: string }> = {
  A1: {
    name: 'Anfänger (A1)',
    subtitle: 'Begrüßung, Im Café, Wegbeschreibung & Nomen-Artikel',
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  A2: {
    name: 'Grundstufe (A2)',
    subtitle: 'Tagesablauf, Trennbare Verben, Dativ & Modalverben',
    color: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  B1: {
    name: 'Mittelstufe (B1)',
    subtitle: 'Reisen & Perfekt, Meinung & weil/dass, Wechselpräpositionen',
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  B2: {
    name: 'Gute Mittelstufe (B2)',
    subtitle: 'Berufswelt, Passiv, Konjunktiv II & Höfliche Bitten',
    color: 'from-purple-500 to-violet-600',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  C1: {
    name: 'Oberstufe (C1)',
    subtitle: 'Wissenschaftssprache, Funktionsverbgefüge, Nuancen & Idiome',
    color: 'from-rose-500 to-pink-600',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  }
};

