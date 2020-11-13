import {LexiconEntry} from './lexicon.entry';
import {WordPart} from './word-part';

export interface Word {
  word: string;
  morphology: string;
  book: number;
  chapter: number;
  verse: number;
  strongsNr: string;
}

export class WordModel implements Word {
  book: number;
  chapter: number;
  morphology: string;
  morphologyUpdated: string;
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
