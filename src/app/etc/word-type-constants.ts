import {WordPart} from '../models/word-part';

export enum WordParts {
  type = 'Type',
  tense = 'Tense',
  voice = 'Voice',
  mood = 'Mood',
  person = 'Person',
  gender = 'Gender',
  number = 'Number',
  case = 'Case',
  suffix = 'Suffix'
}

// type
export const verb: WordPart = {name: 'Verb', abbreviation: 'V', type: WordParts.type};
export const noun: WordPart = {name: 'Noun', abbreviation: 'N', type: WordParts.type};
export const adverb: WordPart = {name: 'Adverb', abbreviation: 'ADV', type: WordParts.type};
export const adjective: WordPart = {name: 'Adjective', abbreviation: 'A', type: WordParts.type};
export const article: WordPart = {name: 'Definite article', abbreviation: 'T', type: WordParts.type};
export const personalPronoun: WordPart = {name: 'Personal pronoun', abbreviation: 'P', type: WordParts.type};
export const conjunction: WordPart = {name: 'Conjunction', abbreviation: 'CONJ', type: WordParts.type};
export const relativePronoun: WordPart = {name: 'Relative pronoun', abbreviation: 'R', headCategory: personalPronoun, type: WordParts.type};
export const reciprocalPronoun: WordPart = {name: 'Reciprocal pronoun', abbreviation: 'C', headCategory: personalPronoun, type: WordParts.type};
export const possessivePronoun: WordPart = {name: 'Possessive pronoun', abbreviation: 'S', headCategory: personalPronoun, type: WordParts.type};
export const correlativePronoun: WordPart = {name: 'Correlative pronoun', abbreviation: 'K', headCategory: personalPronoun, type: WordParts.type};
export const demonstrativePronoun: WordPart = {name: 'Demonstrative pronoun', abbreviation: 'D', headCategory: personalPronoun, type: WordParts.type};
export const reflexivePronoun: WordPart = {name: 'Reflexive pronoun', abbreviation: 'F', headCategory: personalPronoun, type: WordParts.type};
export const interrogativePronoun: WordPart = {name: 'Interrogative pronoun', abbreviation: 'I', headCategory: personalPronoun, type: WordParts.type};
export const correlativeOrInterrogativePronoun: WordPart = {
  name: 'Correlative or Interrogative pronoun',
  abbreviation: 'Q',
  headCategory: personalPronoun,
  type: WordParts.type
};
export const indefinitePronoun: WordPart = {name: 'Indefinite pronoun', abbreviation: 'X', headCategory: personalPronoun, type: WordParts.type};
export const preposition: WordPart = {name: 'Preposition', abbreviation: 'PREP', type: WordParts.type};
export const conditionalType: WordPart = {name: 'Conditional particle/conjunction', abbreviation: 'COND', type: WordParts.type};
// export const disjunctiveParticiple: WordPart = {name: 'Disjunctive participle', abbreviation: 'PRT', type: WordParts.type};
export const particleType: WordPart = {name: 'Particle', abbreviation: 'PRT', type: WordParts.type};

export const allTypesOfPronouns: WordPart[] = [personalPronoun, relativePronoun, reciprocalPronoun, possessivePronoun, correlativePronoun,
  demonstrativePronoun, reflexivePronoun, interrogativePronoun, correlativeOrInterrogativePronoun, indefinitePronoun];

export const allWordTypes: WordPart[] = [verb, noun, adverb, adjective, article, conjunction,
  personalPronoun, relativePronoun, reciprocalPronoun, demonstrativePronoun, possessivePronoun,
  correlativePronoun, preposition, reflexivePronoun, interrogativePronoun,
  correlativeOrInterrogativePronoun, indefinitePronoun, conditionalType, particleType]; // disjunctiveParticiple,

// tense
export const presentTense: WordPart = {name: 'Present', abbreviation: 'P', type: WordParts.tense};
export const futureTense: WordPart = {name: 'Future', abbreviation: 'F', type: WordParts.tense};
export const secondFutureTense: WordPart = {name: 'Second future', abbreviation: '2F', type: WordParts.tense, headCategory: futureTense};
export const aoristTense: WordPart = {name: 'Aorist', abbreviation: 'A', type: WordParts.tense};
export const secondAoristTense: WordPart = {name: 'Second Aorist', abbreviation: '2A', headCategory: aoristTense, type: WordParts.tense};
export const imperfectTense: WordPart = {name: 'Imperfect', abbreviation: 'I', type: WordParts.tense};
export const perfectTense: WordPart = {name: 'Perfect', abbreviation: 'R', type: WordParts.tense};
export const firstPerfectTense: WordPart = {name: 'First Perfect', abbreviation: '1R', headCategory: perfectTense, type: WordParts.tense};
export const secondPerfectTense: WordPart = {name: 'Second Perfect', abbreviation: '2R', headCategory: perfectTense, type: WordParts.tense};
export const pluperfectTense: WordPart = {name: 'Pluperfect', abbreviation: 'L', type: WordParts.tense};
export const secondPluperfectTense: WordPart = {name: 'Second Pluperfect', abbreviation: '2L', headCategory: pluperfectTense, type: WordParts.tense};
export const noStatedTense: WordPart = {name: 'No stated tense', abbreviation: 'X', type: WordParts.tense};
export const allTenses: WordPart[] = [presentTense, futureTense, secondFutureTense, aoristTense, secondAoristTense,
  imperfectTense, perfectTense, firstPerfectTense, secondPerfectTense, pluperfectTense, secondPluperfectTense, noStatedTense];

// voice
export const activeVoice: WordPart = {name: 'Active', abbreviation: 'A', type: WordParts.voice};
export const middleVoice: WordPart = {name: 'Middle', abbreviation: 'M', type: WordParts.voice};
export const passiveVoice: WordPart = {name: 'Passive', abbreviation: 'P', type: WordParts.voice};
export const noVoice: WordPart = {name: 'No voice', abbreviation: 'X', type: WordParts.voice};
export const eitherMiddleOrPassiveVoice: WordPart = {name: 'Middle or passive', abbreviation: 'E', type: WordParts.voice};

///// deponents
export const deponentVoice: WordPart = {name: 'Deponent', abbreviation: 'D', type: WordParts.voice, headCategory: middleVoice};
export const passiveDeponentVoice: WordPart = {name: 'Passive deponent', abbreviation: 'O', headCategory: passiveVoice, type: WordParts.voice};
// export const eitherMiddleOrPassiveVoice: WordPart = {name: 'Middle or passive', abbreviation: 'E', headCategory: deponentVoice, type: WordParts.voice};
export const middlePassiveDeponentVoice: WordPart = {name: 'Middle or passive deponent', abbreviation: 'N', headCategory: eitherMiddleOrPassiveVoice, type: WordParts.voice};

export const impersonalActiveVoice: WordPart = {name: 'Impersonal active', abbreviation: 'Q', type: WordParts.voice, headCategory: activeVoice};

export const allVoices: WordPart[] = [activeVoice, middleVoice, passiveVoice, deponentVoice,
  middlePassiveDeponentVoice, eitherMiddleOrPassiveVoice, passiveDeponentVoice, noVoice, impersonalActiveVoice];

// mood
export const indicativeMood: WordPart = {name: 'Indicative', abbreviation: 'I', type: WordParts.mood};
export const participleMood: WordPart = {name: 'Participle', abbreviation: 'P', type: WordParts.mood};
export const imperativeMood: WordPart = {name: 'Imperative', abbreviation: 'M', type: WordParts.mood};
export const subjunctiveMood: WordPart = {name: 'Subjunctive', abbreviation: 'S', type: WordParts.mood};
export const optativeMood: WordPart = {name: 'Optative', abbreviation: 'O', type: WordParts.mood};
export const infinitiveMood: WordPart = {name: 'Infinitive', abbreviation: 'N', type: WordParts.mood};
export const allMoods: WordPart[] = [indicativeMood, participleMood, imperativeMood, subjunctiveMood, optativeMood, infinitiveMood];

// person
export const firstPerson: WordPart = {name: '1st', abbreviation: '1', type: WordParts.person};
export const secondPerson: WordPart = {name: '2nd', abbreviation: '2', type: WordParts.person};
export const thirdPerson: WordPart = {name: '3rd', abbreviation: '3', type: WordParts.person};
export const allPersons: WordPart[] = [firstPerson, secondPerson, thirdPerson];

// number
export const singularNumber: WordPart = {name: 'Singular', abbreviation: 'S', type: WordParts.number};
export const pluralNumber: WordPart = {name: 'Plural', abbreviation: 'P', type: WordParts.number};
export const allNumbers: WordPart[] = [singularNumber, pluralNumber];

// case
export const nominativeCase: WordPart = {name: 'Nominative', abbreviation: 'N', type: WordParts.case};
export const genitiveCase: WordPart = {name: 'Genitive', abbreviation: 'G', type: WordParts.case};
export const dativeCase: WordPart = {name: 'Dative', abbreviation: 'D', type: WordParts.case};
export const accusativeCase: WordPart = {name: 'Accusative', abbreviation: 'A', type: WordParts.case};
export const vocativeCase: WordPart = {name: 'Vocative', abbreviation: 'V', type: WordParts.case};
export const allCases: WordPart[] = [nominativeCase, genitiveCase, dativeCase, accusativeCase, vocativeCase];

// gender
export const masculineGender: WordPart = {name: 'Masculine', abbreviation: 'M', type: WordParts.gender};
export const feminineGender: WordPart = {name: 'Feminine', abbreviation: 'F', type: WordParts.gender};
export const neuterGender: WordPart = {name: 'Neuter', abbreviation: 'N', type: WordParts.gender};
export const allGenders: WordPart[] = [masculineGender, feminineGender, neuterGender];

// etc
export const atticSuffix: WordPart = {name: 'Attic word', abbreviation: 'ATT', type: WordParts.suffix};
export const negativeSuffix: WordPart = {name: 'Negative', abbreviation: 'N', type: WordParts.suffix};
export const indeclinable: WordPart = {name: 'Indeclinable', abbreviation: 'PRI', type: WordParts.suffix};
export const participleAttachedSuffix: WordPart = {name: 'Participle attached', abbreviation: 'P', type: WordParts.suffix};
export const interrogativeSuffix: WordPart = {name: 'Interrogative', abbreviation: 'I', type: WordParts.suffix};
export const contractedOrComparativeFormSuffix: WordPart = {name: 'Contracted/Comparative form', abbreviation: 'C', type: WordParts.suffix};
export const indeclinableNounOrOtherPartSuffix: WordPart = {name: 'Indeclinable noun or other part', abbreviation: 'OI', type: WordParts.suffix};
export const indeclinableNumeralSuffix: WordPart = {name: 'Indeclinable numeral', abbreviation: 'NUI', type: WordParts.suffix};
export const middleSignificance: WordPart = {name: 'Middle significance', abbreviation: 'M', type: WordParts.suffix};
export const allSuffixes: WordPart[] = [atticSuffix, negativeSuffix, indeclinable, indeclinableNumeralSuffix,
  indeclinableNounOrOtherPartSuffix, contractedOrComparativeFormSuffix, participleAttachedSuffix, interrogativeSuffix,
  middleSignificance];

export const allWordParts = [...allSuffixes, ...allGenders, ...allCases, ...allNumbers,
  ...allPersons, ...allMoods, ...allVoices, ...allTenses, ...allWordTypes];
