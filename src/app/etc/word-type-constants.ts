import {WordPart} from '../models/word-part';

const type = 'Type';
const tenseType = 'Tense';
const voiceType = 'Voice';
const moodType = 'Mood';
const personType = 'Person';
export const genderType = 'Gender';
const wordNumberType = 'Number';
const nominalCaseType = 'Case';
const suffixType = 'Suffix';

// type
export const verb: WordPart = {name: 'Verb', abbreviation: 'V', type};
export const noun: WordPart = {name: 'Noun', abbreviation: 'N', type};
export const adverb: WordPart = {name: 'Adverb', abbreviation: 'ADV', type};
export const adjective: WordPart = {name: 'Adjective', abbreviation: 'A', type};
export const article: WordPart = {name: 'Definite article', abbreviation: 'T', type};
export const personalPronoun: WordPart = {name: 'Personal pronoun', abbreviation: 'P', type};
export const conjunction: WordPart = {name: 'Conjunction', abbreviation: 'CONJ', type};
export const relativePronoun: WordPart = {name: 'Relative pronoun', abbreviation: 'R', headCategory: personalPronoun, type};
export const reciprocalPronoun: WordPart = {name: 'Reciprocal pronoun', abbreviation: 'C', headCategory: personalPronoun, type};
export const possessivePronoun: WordPart = {name: 'Possessive pronoun', abbreviation: 'S', headCategory: personalPronoun, type};
export const correlativePronoun: WordPart = {name: 'Correlative pronoun', abbreviation: 'K', headCategory: personalPronoun, type};
export const demonstrativePronoun: WordPart = {name: 'Demonstrative pronoun', abbreviation: 'D', headCategory: personalPronoun, type};
export const reflexivePronoun: WordPart = {name: 'Reflexive pronoun', abbreviation: 'F', headCategory: personalPronoun, type};
export const interrogativePronoun: WordPart = {name: 'Interrogative pronoun', abbreviation: 'I', headCategory: personalPronoun, type};
export const correlativeOrInterrogativePronoun: WordPart = {
  name: 'Correlative or Interrogative pronoun',
  abbreviation: 'Q',
  headCategory: personalPronoun,
  type
};
export const indefinitePronoun: WordPart = {name: 'Indefinite pronoun', abbreviation: 'X', headCategory: personalPronoun, type};
export const preposition: WordPart = {name: 'Preposition', abbreviation: 'PREP', type};
export const disjunctiveParticiple: WordPart = {name: 'Disjunctive participle', abbreviation: 'PRT', type};
export const conditionalType: WordPart = {name: 'Conditional particle/conjunction', abbreviation: 'COND', type};
export const particleType: WordPart = {name: 'Particle', abbreviation: 'PRT', type};

export const allTypesOfPronouns: WordPart[] = [personalPronoun, relativePronoun, reciprocalPronoun, possessivePronoun, correlativePronoun,
  demonstrativePronoun, reflexivePronoun, interrogativePronoun, correlativeOrInterrogativePronoun, indefinitePronoun];

export const allWordTypes: WordPart[] = [verb, noun, adverb, adjective, article, conjunction,
  personalPronoun, relativePronoun, reciprocalPronoun, demonstrativePronoun, possessivePronoun,
  correlativePronoun, preposition, disjunctiveParticiple, reflexivePronoun, interrogativePronoun,
  correlativeOrInterrogativePronoun, indefinitePronoun, conditionalType, particleType];

// tense
export const presentTense: WordPart = {name: 'Present', abbreviation: 'P', type: tenseType};
export const futureTense: WordPart = {name: 'Future', abbreviation: 'F', type: tenseType};
export const secondFutureTense: WordPart = {name: 'Second future', abbreviation: '2F', type: tenseType, headCategory: futureTense};
export const aoristTense: WordPart = {name: 'Aorist', abbreviation: 'A', type: tenseType};
export const secondAoristTense: WordPart = {name: 'Second Aorist', abbreviation: '2A', headCategory: aoristTense, type: tenseType};
export const imperfectTense: WordPart = {name: 'Imperfect', abbreviation: 'I', type: tenseType};
export const perfectTense: WordPart = {name: 'Perfect', abbreviation: 'R', type: tenseType};
export const firstPerfectTense: WordPart = {name: 'First Perfect', abbreviation: '1R', headCategory: perfectTense, type: tenseType};
export const secondPerfectTense: WordPart = {name: 'Second Perfect', abbreviation: '2R', headCategory: perfectTense, type: tenseType};
export const pluperfectTense: WordPart = {name: 'Pluperfect', abbreviation: 'L', type: tenseType};
export const secondPluperfectTense: WordPart = {
  name: 'Second Pluperfect',
  abbreviation: '2L',
  headCategory: pluperfectTense,
  type: tenseType
};
export const allTenses: WordPart[] = [presentTense, futureTense, secondFutureTense, aoristTense, secondAoristTense,
  imperfectTense, perfectTense, firstPerfectTense, secondPerfectTense, pluperfectTense, secondPluperfectTense];

// voice
export const activeVoice: WordPart = {name: 'Active', abbreviation: 'A', type: voiceType};
export const impersonalActiveVoice: WordPart = {name: 'Impersonal active', abbreviation: 'Q', type: voiceType, headCategory: activeVoice};
export const middleVoice: WordPart = {name: 'Middle', abbreviation: 'M', type: voiceType};
export const passiveVoice: WordPart = {name: 'Passive', abbreviation: 'P', type: voiceType};
export const deponentVoice: WordPart = {name: 'Deponent', abbreviation: 'D', type: voiceType};
export const noVoice: WordPart = {name: 'No voice', abbreviation: 'X', type: voiceType};

export const middlePassiveDeponentVoice: WordPart = {
  name: 'Middle or passive deponent',
  abbreviation: 'N',
  headCategory: deponentVoice,
  type: voiceType
};
export const middlePassiveVoice: WordPart = {name: 'Middle or passive', abbreviation: 'E', headCategory: deponentVoice, type: voiceType};
export const passiveDeponentVoice: WordPart = {name: 'Passive deponent', abbreviation: 'O', headCategory: deponentVoice, type: voiceType};
export const allVoices: WordPart[] = [activeVoice, middleVoice, passiveVoice, deponentVoice,
  middlePassiveDeponentVoice, middlePassiveVoice, passiveDeponentVoice, noVoice, impersonalActiveVoice];

// mood
export const indicativeMood: WordPart = {name: 'Indicative', abbreviation: 'I', type: moodType};
export const participleMood: WordPart = {name: 'Participle', abbreviation: 'P', type: moodType};
export const imperativeMood: WordPart = {name: 'Imperative', abbreviation: 'M', type: moodType};
export const subjunctiveMood: WordPart = {name: 'Subjunctive', abbreviation: 'S', type: moodType};
export const optativeMood: WordPart = {name: 'Optative', abbreviation: 'O', type: moodType};
export const infinitiveMood: WordPart = {name: 'Infinitive', abbreviation: 'N', type: moodType};
export const allMoods: WordPart[] = [indicativeMood, participleMood, imperativeMood, subjunctiveMood, optativeMood, infinitiveMood];

// person
export const firstPerson: WordPart = {name: '1st', abbreviation: '1', type: personType};
export const secondPerson: WordPart = {name: '2nd', abbreviation: '2', type: personType};
export const thirdPerson: WordPart = {name: '3rd', abbreviation: '3', type: personType};
export const allPersons: WordPart[] = [firstPerson, secondPerson, thirdPerson];

// number
export const singularNumber: WordPart = {name: 'Singular', abbreviation: 'S', type: wordNumberType};
export const pluralNumber: WordPart = {name: 'Plural', abbreviation: 'P', type: wordNumberType};
export const allNumbers: WordPart[] = [singularNumber, pluralNumber];

// case
export const nominativeCase: WordPart = {name: 'Nominative', abbreviation: 'N', type: nominalCaseType};
export const genitiveCase: WordPart = {name: 'Genitive', abbreviation: 'G', type: nominalCaseType};
export const dativeCase: WordPart = {name: 'Dative', abbreviation: 'D', type: nominalCaseType};
export const accusativeCase: WordPart = {name: 'Accusative', abbreviation: 'A', type: nominalCaseType};
export const vocativeCase: WordPart = {name: 'Vocative', abbreviation: 'V', type: nominalCaseType};
export const allCases: WordPart[] = [nominativeCase, genitiveCase, dativeCase, accusativeCase, vocativeCase];

// gender
export const masculineGender: WordPart = {name: 'Masculine', abbreviation: 'M', type: genderType};
export const feminineGender: WordPart = {name: 'Feminine', abbreviation: 'F', type: genderType};
export const neuterGender: WordPart = {name: 'Neuter', abbreviation: 'N', type: genderType};
export const allGenders: WordPart[] = [masculineGender, feminineGender, neuterGender];

// etc
export const atticSuffix: WordPart = {name: 'Attic word', abbreviation: 'ATT', type: suffixType};
export const negativeSuffix: WordPart = {name: 'Negative', abbreviation: 'N', type: suffixType};
export const indeclinable: WordPart = {name: 'Indeclinable', abbreviation: 'PRI', type: suffixType};
export const participleAttachedSuffix: WordPart = {name: 'Participle attached', abbreviation: 'P', type: suffixType};
export const contractedOrComparativeFormSuffix: WordPart = {name: 'Contracted/Comparative form', abbreviation: 'C', type: suffixType};
export const indeclinableNounOrOtherPartSuffix: WordPart = {name: 'Indeclinable noun or other part', abbreviation: 'OI', type: suffixType};
export const indeclinableNumeralSuffix: WordPart = {name: 'Indeclinable numeral', abbreviation: 'NUI', type: suffixType};
export const allSuffixes: WordPart[] = [atticSuffix, negativeSuffix, indeclinable, indeclinableNumeralSuffix,
  indeclinableNounOrOtherPartSuffix, contractedOrComparativeFormSuffix, participleAttachedSuffix];

export const allPartsOfSpeech = [...allSuffixes, ...allGenders, ...allCases, ...allNumbers,
  ...allPersons, ...allMoods, ...allVoices, ...allTenses, ...allWordTypes];
