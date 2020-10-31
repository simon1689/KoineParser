import {Word} from './interfaces/word';
import {LexiconEntry} from './lexicon.entry';
import {
  adjective,
  allCases,
  allGenders,
  allMoods,
  allNumbers,
  allPersons,
  allTenses,
  allVoices,
  allWordTypes,
  article,
  attic,
  correlativePronoun,
  disjunctiveParticiple,
  indeclinable,
  infinitiveMood,
  negativeSuffix,
  noun,
  possessivePronoun,
  personalPronoun,
  reciprocalPronoun,
  relativePronoun, verb
} from './wordTypeConstants';
import {WordPart} from './wordPart';

export class WordModel implements Word {
  book: number;
  chapter: number;
  morphology: string;
  strongsNr: string;
  verse: number;
  word: string;
  occurrencesInRange: number;
  lexiconEntry: LexiconEntry;
  wordComplete: string;
  partsOfSpeech: WordPart[];
}

export interface MultipleMorphologyWord {
  strongs: string;
  morphology: string;
  word: string;
}
