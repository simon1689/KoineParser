// export interface Word {
//   strongsNr: string;
//   form: string;
//   lemma: Word;
//   transliteration: string;
//   partOfSpeech: PartOfSpeech;
//   number: WordNumber;
//   person: WordPerson;
//   voice: VerbVoice;
//   mood: VerbMood;
//   tense: VerbTense;
//   case: WordCase;
// }

export interface PartOfSpeech {
  name: string;
  abbreviation: any;
  enum: WordGender | WordPerson | WordNumber | WordCase | WordCase | VerbTense | VerbVoice | VerbMood | TypeOfWords;
  controlId?: string;
  secondary?: boolean;
  isChecked?: boolean;
}

export interface Word {
  word: string;
  morphology: string;
  book: number;
  chapter: number;
  verse: number;
  strongsNr: string;
}

export enum VerbVoice {
  Active,
  Middle,
  Passive,
  EitherMiddleOrPassive,
  MiddleDeponent,
  PassiveDeponent,
  MiddleOrPassive,
  Deponent,
  None
}

export const Voices: PartOfSpeech[] = [
  {name: 'Active', abbreviation: 'A', enum: VerbVoice.Active, secondary: false, controlId: 'ActiveVoiceCtrl'},
  {name: 'Middle', abbreviation: 'M', enum: VerbVoice.Middle, secondary: false, controlId: 'MiddleVoiceCtrl'},
  {name: 'Passive', abbreviation: 'P', enum: VerbVoice.Passive, secondary: false, controlId: 'PassiveVoiceCtrl'},
  {name: 'Deponent', abbreviation: 'D', enum: VerbVoice.Deponent, secondary: false, controlId: 'DeponentVoiceCtrl'},
  {name: 'None', abbreviation: 'X', enum: VerbVoice.None, secondary: false, controlId: 'NoneVoiceCtrl'},
];

export enum VerbMood {
  Indicative,
  Participle,
  Imperative,
  Subjunctive,
  Optative,
  Infinitive,
}

export const Moods: PartOfSpeech[] = [
  {name: 'Indicative', abbreviation: 'I', enum: VerbMood.Indicative, controlId: 'IndicativeMoodCtrl'},
  {name: 'Imperative', abbreviation: 'Imp', enum: VerbMood.Imperative, controlId: 'ImperativeMoodCtrl'},
  {name: 'Subjunctive', abbreviation: 'S', enum: VerbMood.Subjunctive, controlId: 'SubjunctiveMoodCtrl'},
  {name: 'Optative', abbreviation: 'Op', enum: VerbMood.Optative, controlId: 'OptativeMoodCtrl'},
  {name: 'Infinitive', abbreviation: 'Inf', enum: VerbMood.Infinitive, controlId: 'InfinitiveMoodCtrl'},
  {name: 'Participle', abbreviation: 'P', enum: VerbMood.Participle, controlId: 'controlIdMoodCtrl'},
];

export enum VerbTense {
  Present,
  Imperfect,
  Future,
  Aorist,
  SecondAorist = 'Second Aorist',
  Perfect = 'Perfect',
  FirstPerfect = 'First Perfect',
  SecondPerfect = 'Second Perfect',
  Pluperfect = 'Pluperfect',
  SecondPluperfect = 'Second Pluperfect'
}

export const VerbTenses: PartOfSpeech[] = [
  {name: 'Present', abbreviation: 'P', enum: VerbTense.Present, secondary: false, controlId: 'PresentTenseCtrl'},
  {name: 'Imperfect', abbreviation: 'I', enum: VerbTense.Imperfect, secondary: false, controlId: 'ImperfectTenseCtrl'},
  {name: 'Future', abbreviation: 'F', enum: VerbTense.Future, secondary: false, controlId: 'FutureTenseCtrl'},
  {name: 'Aorist', abbreviation: 'A', enum: VerbTense.Aorist, secondary: false, controlId: 'AoristTenseCtrl'},
  {name: '2nd Aorist', abbreviation: '2A', enum: VerbTense.SecondAorist, secondary: true, controlId: 'SecondAoristTenseCtrl'},
  {name: 'Perfect', abbreviation: 'R', enum: VerbTense.Perfect, secondary: false, controlId: 'PerfectTenseCtrl'},
  {name: '1st Perfect', abbreviation: '1R', enum: VerbTense.FirstPerfect, secondary: true, controlId: 'FirstPerfectTenseCtrl'},
  {name: '2nd Perfect', abbreviation: '2R', enum: VerbTense.SecondPerfect, secondary: true, controlId: 'SecondPerfectTenseCtrl'},
  {name: 'Pluperfect', abbreviation: 'Pf', enum: VerbTense.Pluperfect, secondary: false, controlId: 'PluperfectTenseCtrl'},
  {name: '2nd Pluperfect', abbreviation: '2Pf', enum: VerbTense.SecondPluperfect, secondary: true, controlId: 'SecondPluperfectTenseCtrl'},
];

export enum WordPerson {
  First,
  Second,
  Third
}

export const Persons: PartOfSpeech[] = [
  {name: 'First', abbreviation: 1, enum: WordPerson.First, controlId: 'FirstPersonCtrl'},
  {name: 'Second', abbreviation: 2, enum: WordPerson.Second, controlId: 'SecondPersonCtrl'},
  {name: 'Third', abbreviation: 3, enum: WordPerson.Third, controlId: 'ThirdPersonCtrl'},
];

export enum WordNumber {
  Singular,
  Plural,
  Both
}

export const Numbers: PartOfSpeech[] = [
  {name: 'Singular', abbreviation: 'S', enum: WordNumber.Singular, controlId: 'SingularNumberCtrl'},
  {name: 'Plural', abbreviation: 'P', enum: WordNumber.Plural, controlId: 'PluralNumberCtrl'},
];

export enum WordCase {
  Nominative,
  Genitive,
  Dative,
  Accusative,
  Vocative
}

export const NounCases: PartOfSpeech[] = [
  {name: 'Nominative', abbreviation: 'N', enum: WordCase.Nominative, controlId: 'NominativeCaseCtrl'},
  {name: 'Genitive', abbreviation: 'G', enum: WordCase.Genitive, controlId: 'GenitiveCaseCtrl'},
  {name: 'Dative', abbreviation: 'D', enum: WordCase.Dative, controlId: 'DativeCaseCtrl'},
  {name: 'Accusative', abbreviation: 'A', enum: WordCase.Accusative, controlId: 'AccusativeCaseCtrl'},
  {name: 'Vocative', abbreviation: 'V', enum: WordCase.Vocative, controlId: 'VocativeCaseCtrl'},
];


export enum WordGender {
  Masculine,
  Feminine,
  Neuter
}

export const Genders: PartOfSpeech[] = [
  {name: 'Masculine', abbreviation: 'M', enum: WordGender.Masculine, controlId: 'MasculineGenderCtrl'},
  {name: 'Feminine', abbreviation: 'F', enum: WordGender.Feminine, controlId: 'FeminineGenderCtrl'},
  {name: 'Neuter', abbreviation: 'N', enum: WordGender.Neuter, controlId: 'NeuterGenderCtrl'},
];

export enum TypeOfWords {
  All,
  Nouns,
  Pronouns,
  Articles,
  Adjectives,
  Verbs,
  Participles,
  Infinitives,
  Conjunction,
  Preposition,

}

export const Types: PartOfSpeech[] = [
  {name: 'Verb', abbreviation: 'V', enum: TypeOfWords.Verbs, controlId: 'VerbsCtrl'},
  {name: 'Noun', abbreviation: 'N', enum: TypeOfWords.Nouns, controlId: 'NounsCtrl'},
  {name: 'Pronoun', abbreviation: 'P', enum: TypeOfWords.Pronouns, controlId: 'PronounsCtrl'},
  {name: 'Preposition', abbreviation: 'PREP', enum: TypeOfWords.Preposition, controlId: 'PrepositionCtrl'},
  {name: 'Article', abbreviation: 'T', enum: TypeOfWords.Articles, controlId: 'ArticlesCtrl'},
  {name: 'Adjective', abbreviation: 'A', enum: TypeOfWords.Adjectives, controlId: 'AdjectivesCtrl'},
  {name: 'Conjunction', abbreviation: 'CONJ', enum: TypeOfWords.Conjunction, controlId: 'ConjunctionCtrl'},
  {name: 'Participle', abbreviation: 'P', enum: TypeOfWords.Participles, controlId: 'ParticiplesCtrl'},
  {name: 'Infinitive', abbreviation: 'Inf', enum: TypeOfWords.Infinitives, controlId: 'InfinitivesCtrl'},
];
