import {WordPart} from './wordPart';
import * as __ from 'lodash-es';

const type = 'Type';
const tense = 'Tense';
const voice = 'Voice';
const mood = 'Mood';
const person = 'Person';
const gender = 'Gender';
const wordNumber = 'Number';
const nominalCase = 'Case';
const suffix = 'Suffix';

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
export const preposition: WordPart = {name: 'Preposition', abbreviation: 'PREP', type};
export const disjunctiveParticiple: WordPart = {name: 'Disjunctive participle', abbreviation: 'PRT', type: suffix};
export const allWordTypes: WordPart[] = [verb, noun, adverb, adjective, article, conjunction,
  personalPronoun, relativePronoun, reciprocalPronoun, demonstrativePronoun, possessivePronoun, correlativePronoun, preposition, disjunctiveParticiple];
export const allTypesOfPronouns: WordPart[] = [personalPronoun, relativePronoun, reciprocalPronoun, possessivePronoun, correlativePronoun, demonstrativePronoun];

// tense
export const presentTense: WordPart = {name: 'Present', abbreviation: 'P', type: tense};
export const futureTense: WordPart = {name: 'Future', abbreviation: 'F', type: tense};
export const aoristTense: WordPart = {name: 'Aorist', abbreviation: 'A', type: tense};
export const secondAoristTense: WordPart = {name: 'Second Aorist', abbreviation: '2A', headCategory: aoristTense, type: tense};
export const imperfectTense: WordPart = {name: 'Imperfect', abbreviation: 'I', type: tense};
export const perfectTense: WordPart = {name: 'Perfect', abbreviation: 'R', type: tense};
export const firstPerfectTense: WordPart = {name: 'First Perfect', abbreviation: '1R', headCategory: perfectTense, type: tense};
export const secondPerfectTense: WordPart = {name: 'Second Perfect', abbreviation: '2R', headCategory: perfectTense, type: tense};
export const pluperfectTense: WordPart = {name: 'Pluperfect', abbreviation: 'L', type: tense};
export const secondPluperfectTense: WordPart = {name: 'Second Pluperfect', abbreviation: '2L', headCategory: pluperfectTense, type: tense};
export const allTenses: WordPart[] = [presentTense, futureTense, aoristTense, secondAoristTense,
  imperfectTense, perfectTense, firstPerfectTense, secondPerfectTense, pluperfectTense, secondPluperfectTense];

// voice
export const activeVoice: WordPart = {name: 'Active', abbreviation: 'A', type: voice};
export const middleVoice: WordPart = {name: 'Middle', abbreviation: 'M', type: voice};
export const passiveVoice: WordPart = {name: 'Passive', abbreviation: 'P', type: voice};
export const deponentVoice: WordPart = {name: 'Deponent', abbreviation: 'D', type: voice};
export const middlePassiveDeponentVoice: WordPart = {
  name: 'Middle or passive deponent',
  abbreviation: 'N',
  headCategory: deponentVoice,
  type: voice
};
export const middlePassiveVoice: WordPart = {name: 'Middle or passive', abbreviation: 'E', type: voice};
export const passiveDeponentVoice: WordPart = {name: 'Passive deponent', abbreviation: 'O', headCategory: passiveVoice, type: voice};
export const noVoice: WordPart = {name: 'No voice', abbreviation: 'X', type: voice};
export const allVoices: WordPart[] = [activeVoice, middleVoice, passiveVoice, deponentVoice,
  middlePassiveDeponentVoice, middlePassiveVoice, passiveDeponentVoice, noVoice];

// mood
export const indicativeMood: WordPart = {name: 'Indicative', abbreviation: 'I', type: mood};
export const participleMood: WordPart = {name: 'Participle', abbreviation: 'P', type: mood};
export const imperativeMood: WordPart = {name: 'Imperative', abbreviation: 'M', type: mood};
export const subjunctiveMood: WordPart = {name: 'Subjunctive', abbreviation: 'S', type: mood};
export const optativeMood: WordPart = {name: 'Optative', abbreviation: 'O', type: mood};
export const infinitiveMood: WordPart = {name: 'Infinitive', abbreviation: 'N', type: mood};
export const allMoods: WordPart[] = [indicativeMood, participleMood, imperativeMood, subjunctiveMood, optativeMood, infinitiveMood];

// person
export const firstPerson: WordPart = {name: '1st', abbreviation: '1', type: person};
export const secondPerson: WordPart = {name: '2nd', abbreviation: '2', type: person};
export const thirdPerson: WordPart = {name: '3rd', abbreviation: '3', type: person};
export const allPersons: WordPart[] = [firstPerson, secondPerson, thirdPerson];

// number
export const singularNumber: WordPart = {name: 'Singular', abbreviation: 'S', type: wordNumber};
export const pluralNumber: WordPart = {name: 'Plural', abbreviation: 'P', type: wordNumber};
export const allNumbers: WordPart[] = [singularNumber, pluralNumber];

// case
export const nominativeCase: WordPart = {name: 'Nominative', abbreviation: 'N', type: nominalCase};
export const genitiveCase: WordPart = {name: 'Genitive', abbreviation: 'G', type: nominalCase};
export const dativeCase: WordPart = {name: 'Dative', abbreviation: 'D', type: nominalCase};
export const accusativeCase: WordPart = {name: 'Accusative', abbreviation: 'A', type: nominalCase};
export const vocativeCase: WordPart = {name: 'Vocative', abbreviation: 'V', type: nominalCase};
export const allCases: WordPart[] = [nominativeCase, genitiveCase, dativeCase, accusativeCase, vocativeCase];

// gender
export const masculineGender: WordPart = {name: 'Masculine', abbreviation: 'M', type: gender};
export const feminineGender: WordPart = {name: 'Feminine', abbreviation: 'F', type: gender};
export const neuterGender: WordPart = {name: 'Neuter', abbreviation: 'N', type: gender};
export const allGenders: WordPart[] = [masculineGender, feminineGender, neuterGender];

// etc
export const attic: WordPart = {name: 'Attic word', abbreviation: 'A', type: suffix};
export const negativeSuffix: WordPart = {name: 'Negative', abbreviation: 'N', type: suffix};
export const indeclinable: WordPart = {name: 'Indeclinable', abbreviation: 'PRI', type: suffix};
export const indeclinableNounOrOtherPart: WordPart = {name: 'Indeclinable noun or other part', abbreviation: 'OI', type: suffix};
export const allSuffixes: WordPart[] = [attic, negativeSuffix, indeclinable, indeclinableNounOrOtherPart];

let allParts: WordPart[] = __.merge(allSuffixes, allGenders);
allParts = __.union(allParts, allCases);
allParts = __.union(allParts, allNumbers);
allParts = __.union(allParts, allPersons);
allParts = __.union(allParts, allMoods);
allParts = __.union(allParts, allVoices);
allParts = __.union(allParts, allTenses);
allParts = __.union(allParts, allWordTypes);

export const allPartsOfSpeech = allParts;
