import {WordPart} from './word-part';
import {
  accusativeCase,
  activeVoice,
  adjective,
  adverb,
  aoristTense,
  article,
  conditionalType,
  conjunction,
  correlativeOrInterrogativePronoun,
  correlativePronoun,
  dativeCase,
  demonstrativePronoun,
  deponentVoice,
  eitherMiddleOrPassiveVoice,
  feminineGender,
  firstPerson,
  futureTense,
  genitiveCase,
  imperativeMood,
  imperfectTense,
  impersonalActiveVoice,
  indefinitePronoun,
  indicativeMood,
  infinitiveMood,
  interrogativePronoun,
  masculineGender,
  middleVoice,
  neuterGender,
  nominativeCase, noStatedTense,
  noun,
  noVoice,
  optativeMood,
  participleMood,
  particleType,
  passiveDeponentVoice,
  passiveVoice,
  perfectTense,
  personalPronoun,
  pluperfectTense,
  pluralNumber,
  possessivePronoun,
  preposition,
  presentTense,
  reciprocalPronoun,
  reflexivePronoun,
  relativePronoun,
  secondAoristTense,
  secondFutureTense,
  secondPerfectTense,
  secondPerson,
  secondPluperfectTense,
  singularNumber,
  subjunctiveMood,
  thirdPerson,
  verb,
  vocativeCase
} from '../etc/word-type-constants';

export interface PartOfSpeech {
  name: string;
  abbreviation: any;
  controlId?: string;
  secondary?: boolean;
  isChecked?: boolean;
  wordPart?: WordPart;
}

export const Voices: PartOfSpeech[] = [
  {name: 'Active', abbreviation: 'A', secondary: false, controlId: 'ActiveVoiceCtrl', wordPart: activeVoice},
  {name: 'Middle', abbreviation: 'M', secondary: false, controlId: 'MiddleVoiceCtrl', wordPart: middleVoice},
  {name: 'Passive', abbreviation: 'P', secondary: false, controlId: 'PassiveVoiceCtrl', wordPart: passiveVoice},
  {name: 'Middle or passive', abbreviation: 'E', secondary: false, controlId: 'MiddleOrPassiveVoiceCtrl', wordPart: eitherMiddleOrPassiveVoice},
  {name: 'No voice', abbreviation: 'X', secondary: false, controlId: 'NoVoiceCtrl', wordPart: noVoice},

  {name: 'Impersonal active', abbreviation: 'Q', secondary: true, controlId: 'ImpersonalActiveVoiceCtrl', wordPart: impersonalActiveVoice},
  {name: 'Deponent', abbreviation: 'D', secondary: true, controlId: 'DeponentVoiceCtrl', wordPart: deponentVoice},
  {name: 'Passive deponent', abbreviation: 'O', secondary: true, controlId: 'PassiveDeponentVoiceCtrl', wordPart: passiveDeponentVoice},
  {name: 'Middle or passive deponent', abbreviation: 'N', secondary: true, controlId: 'MiddleOrPassiveDeponentVoiceCtrl', wordPart: eitherMiddleOrPassiveVoice},
];

export const Moods: PartOfSpeech[] = [
  {name: 'Indicative', abbreviation: 'I', controlId: 'IndicativeMoodCtrl', wordPart: indicativeMood},
  {name: 'Imperative', abbreviation: 'M', controlId: 'ImperativeMoodCtrl', wordPart: imperativeMood},
  {name: 'Subjunctive', abbreviation: 'S', controlId: 'SubjunctiveMoodCtrl', wordPart: subjunctiveMood},
  {name: 'Optative', abbreviation: 'O', controlId: 'OptativeMoodCtrl', wordPart: optativeMood},
  {name: 'Infinitive', abbreviation: 'N', controlId: 'InfinitiveMoodCtrl', wordPart: infinitiveMood},
  {name: 'Participle', abbreviation: 'P', controlId: 'ParticipleMoodCtrl', wordPart: participleMood},
];

export const VerbTenses: PartOfSpeech[] = [
  {name: 'Present', abbreviation: 'P', secondary: false, controlId: 'PresentTenseCtrl', wordPart: presentTense},
  {name: 'Future', abbreviation: 'F', secondary: false, controlId: 'FutureTenseCtrl', wordPart: futureTense},
  {name: '2nd Future', abbreviation: '2F', secondary: true, controlId: 'SecondFutureTenseCtrl', wordPart: secondFutureTense},
  {name: 'Imperfect', abbreviation: 'I', secondary: false, controlId: 'ImperfectTenseCtrl', wordPart: imperfectTense},
  {name: 'Aorist', abbreviation: 'A', secondary: false, controlId: 'AoristTenseCtrl', wordPart: aoristTense},
  {name: '2nd Aorist', abbreviation: '2A', secondary: true, controlId: 'SecondAoristTenseCtrl', wordPart: secondAoristTense},
  {name: 'Perfect', abbreviation: 'R', secondary: false, controlId: 'PerfectTenseCtrl', wordPart: perfectTense},
  {name: '2nd Perfect', abbreviation: '2R', secondary: true, controlId: 'SecondPerfectTenseCtrl', wordPart: secondPerfectTense},
  {name: 'Pluperfect', abbreviation: 'L', secondary: false, controlId: 'PluperfectTenseCtrl', wordPart: pluperfectTense},
  {name: '2nd Pluperfect', abbreviation: '2L', secondary: true, controlId: 'SecondPluperfectTenseCtrl', wordPart: secondPluperfectTense},
  {name: 'No stated tense', abbreviation: 'X', secondary: false, controlId: 'NoStatedTenseCtrl', wordPart: noStatedTense},
];

export const Persons: PartOfSpeech[] = [
  {name: 'First', abbreviation: 1, controlId: 'FirstPersonCtrl', wordPart: firstPerson},
  {name: 'Second', abbreviation: 2, controlId: 'SecondPersonCtrl', wordPart: secondPerson},
  {name: 'Third', abbreviation: 3, controlId: 'ThirdPersonCtrl', wordPart: thirdPerson},
];

export const Numbers: PartOfSpeech[] = [
  {name: 'Singular', abbreviation: 'S', controlId: 'SingularNumberCtrl', wordPart: singularNumber},
  {name: 'Plural', abbreviation: 'P', controlId: 'PluralNumberCtrl', wordPart: pluralNumber},
];

export const NounCases: PartOfSpeech[] = [
  {name: 'Nominative', abbreviation: 'N', controlId: 'NominativeCaseCtrl', wordPart: nominativeCase},
  {name: 'Genitive', abbreviation: 'G', controlId: 'GenitiveCaseCtrl', wordPart: genitiveCase},
  {name: 'Dative', abbreviation: 'D', controlId: 'DativeCaseCtrl', wordPart: dativeCase},
  {name: 'Accusative', abbreviation: 'A', controlId: 'AccusativeCaseCtrl', wordPart: accusativeCase},
  {name: 'Vocative', abbreviation: 'V', controlId: 'VocativeCaseCtrl', wordPart: vocativeCase},
];

export const Genders: PartOfSpeech[] = [
  {name: 'Masculine', abbreviation: 'M', controlId: 'MasculineGenderCtrl', wordPart: masculineGender},
  {name: 'Feminine', abbreviation: 'F', controlId: 'FeminineGenderCtrl', wordPart: feminineGender},
  {name: 'Neuter', abbreviation: 'N', controlId: 'NeuterGenderCtrl', wordPart: neuterGender},
];

export const Types: PartOfSpeech[] = [
  {name: 'Verb', abbreviation: 'V', controlId: 'VerbsCtrl', wordPart: verb},
  {name: 'Noun', abbreviation: 'N', controlId: 'NounsCtrl', wordPart: noun},
  {name: 'Pronoun', abbreviation: 'P', controlId: 'PronounsCtrl', wordPart: personalPronoun},
  {name: 'Relative pronoun', abbreviation: 'R', controlId: 'RelativePronounsCtrl', wordPart: relativePronoun, secondary: true},
  {name: 'Reciprocal pronoun', abbreviation: 'C', controlId: 'ReciprocalPronounsCtrl', wordPart: reciprocalPronoun, secondary: true},
  {name: 'Possessive pronoun', abbreviation: 'S', controlId: 'PossessivePronounsCtrl', wordPart: possessivePronoun, secondary: true},
  {name: 'Correlative pronoun', abbreviation: 'K', controlId: 'CorrelativePronounsCtrl', wordPart: correlativePronoun, secondary: true},
  {name: 'Demonstrative pronoun', abbreviation: 'D', controlId: 'CorrelativePronounsCtrl', wordPart: demonstrativePronoun, secondary: true},
  {name: 'Reflexive pronoun', abbreviation: 'F', controlId: 'ReflexivePronounsCtrl', wordPart: reflexivePronoun, secondary: true},
  {name: 'Interrogative pronoun', abbreviation: 'I', controlId: 'InterrogativePronounsCtrl', wordPart: interrogativePronoun, secondary: true},
  {
    name: 'Correlative or interrogative pronoun',
    abbreviation: 'Q',
    controlId: 'CorrelativeOrInterrogativePronounsCtrl',
    wordPart: correlativeOrInterrogativePronoun,
    secondary: true
  },
  {name: 'Indefinite pronoun', abbreviation: 'X', controlId: 'IndefinitePronounsCtrl', wordPart: indefinitePronoun, secondary: true},

  {name: 'Article', abbreviation: 'T', controlId: 'ArticlesCtrl', wordPart: article},
  {name: 'Adjective', abbreviation: 'A', controlId: 'AdjectivesCtrl', wordPart: adjective},
  {name: 'Adverb', abbreviation: 'ADV', controlId: 'AdverbsCtrl', wordPart: adverb},
  {name: 'Conjunction', abbreviation: 'CONJ', controlId: 'ConjunctionCtrl', wordPart: conjunction},
  {name: 'Preposition', abbreviation: 'PREP', controlId: 'PrepositionCtrl', wordPart: preposition},
  {name: 'Particle', abbreviation: 'PRT', controlId: 'ParticleCtrl', wordPart: particleType},
  {name: 'Conditional particle/conjunction', abbreviation: 'COND', controlId: 'ConditionalCtrl', wordPart: conditionalType},
];

export const allPartsOfSpeech: PartOfSpeech[] = [...Voices, ...Moods, ...VerbTenses,
  ...Persons, ...Numbers, ...NounCases, ...Genders, ...Types];
