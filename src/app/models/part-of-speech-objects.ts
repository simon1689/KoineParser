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
  dativeCase,
  deponentVoice,
  feminineGender,
  firstPerfectTense,
  firstPerson,
  futureTense,
  genitiveCase,
  imperativeMood,
  imperfectTense,
  impersonalActiveVoice,
  indicativeMood,
  infinitiveMood,
  masculineGender,
  middlePassiveVoice,
  middleVoice,
  neuterGender,
  nominativeCase,
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
  preposition,
  presentTense,
  secondAoristTense,
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
  {name: 'Impersonal active', abbreviation: 'Q', secondary: true, controlId: 'ImpersonalActiveVoiceCtrl', wordPart: impersonalActiveVoice},
  {name: 'Middle', abbreviation: 'M', secondary: false, controlId: 'MiddleVoiceCtrl', wordPart: middleVoice},
  {name: 'Passive', abbreviation: 'P', secondary: false, controlId: 'PassiveVoiceCtrl', wordPart: passiveVoice},
  {name: 'Deponent', abbreviation: 'D', secondary: false, controlId: 'DeponentVoiceCtrl', wordPart: deponentVoice},
  {name: 'No voice', abbreviation: 'X', secondary: false, controlId: 'NoVoiceCtrl', wordPart: noVoice},

  {name: 'Passive deponent', abbreviation: 'O', secondary: true, controlId: 'PassiveDeponentVoiceCtrl', wordPart: passiveDeponentVoice},
  {name: 'Middle or passive', abbreviation: 'E', secondary: true, controlId: 'MiddleOrPassiveVoiceCtrl', wordPart: middlePassiveVoice},
  {
    name: 'Middle or passive deponent',
    abbreviation: 'N',
    secondary: true,
    controlId: 'MiddleOrPassiveDeponentVoiceCtrl',
    wordPart: middlePassiveVoice
  },
];

export const Moods: PartOfSpeech[] = [
  {name: 'Indicative', abbreviation: 'I', controlId: 'IndicativeMoodCtrl', wordPart: indicativeMood},
  {name: 'Imperative', abbreviation: 'M', controlId: 'ImperativeMoodCtrl', wordPart: imperativeMood},
  {name: 'Subjunctive', abbreviation: 'S', controlId: 'SubjunctiveMoodCtrl', wordPart: subjunctiveMood},
  {name: 'Optative', abbreviation: 'O', controlId: 'OptativeMoodCtrl', wordPart: optativeMood},
  {name: 'Infinitive', abbreviation: 'N', controlId: 'InfinitiveMoodCtrl', wordPart: infinitiveMood},
  {name: 'Participle', abbreviation: 'P', controlId: 'controlIdMoodCtrl', wordPart: participleMood},
];

export const VerbTenses: PartOfSpeech[] = [
  {name: 'Present', abbreviation: 'P', secondary: false, controlId: 'PresentTenseCtrl', wordPart: presentTense},
  {name: 'Imperfect', abbreviation: 'I', secondary: false, controlId: 'ImperfectTenseCtrl', wordPart: imperfectTense},
  {name: 'Future', abbreviation: 'F', secondary: false, controlId: 'FutureTenseCtrl', wordPart: futureTense},
  {name: 'Aorist', abbreviation: 'A', secondary: false, controlId: 'AoristTenseCtrl', wordPart: aoristTense},
  {
    name: '2nd Aorist', abbreviation: '2A', secondary: true, controlId: 'SecondAoristTenseCtrl', wordPart: secondAoristTense
  },
  {name: 'Perfect', abbreviation: 'R', secondary: false, controlId: 'PerfectTenseCtrl', wordPart: perfectTense},
  {
    name: '1st Perfect',
    abbreviation: '1R',
    secondary: true,
    controlId: 'FirstPerfectTenseCtrl',
    wordPart: firstPerfectTense
  },
  {
    name: '2nd Perfect',
    abbreviation: '2R',
    secondary: true,
    controlId: 'SecondPerfectTenseCtrl',
    wordPart: secondPerfectTense
  },
  {
    name: 'Pluperfect',
    abbreviation: 'L',
    secondary: false,
    controlId: 'PluperfectTenseCtrl',
    wordPart: pluperfectTense
  },
  {
    name: '2nd Pluperfect',
    abbreviation: '2Pf',
    secondary: true,
    controlId: 'SecondPluperfectTenseCtrl',
    wordPart: secondPluperfectTense
  },
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
  {name: 'Preposition', abbreviation: 'PREP', controlId: 'PrepositionCtrl', wordPart: preposition},
  {name: 'Article', abbreviation: 'T', controlId: 'ArticlesCtrl', wordPart: article},
  {name: 'Adjective', abbreviation: 'A', controlId: 'AdjectivesCtrl', wordPart: adjective},
  {name: 'Adverb', abbreviation: 'ADV', controlId: 'AdverbsCtrl', wordPart: adverb},
  {name: 'Conjunction', abbreviation: 'CONJ', controlId: 'ConjunctionCtrl', wordPart: conjunction},
  // {name: 'Participle', abbreviation: 'Ptc', controlId: 'ParticiplesCtrl', wordPart: participleMood},
  // {name: 'Infinitive', abbreviation: 'Inf', controlId: 'InfinitivesCtrl', wordPart: infinitiveMood},
  {name: 'Particle', abbreviation: 'PRT', controlId: 'ParticleCtrl', wordPart: particleType},
  {name: 'Conditional particle/conjunction', abbreviation: 'COND', controlId: 'ConditionalCtrl', wordPart: conditionalType},
];
