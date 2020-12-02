import {Word} from './word';
import {WrongAnswer} from '../parse/parse.component';
import {BibleReference} from './bible-reference';

export interface LocalStorageSession {
  key: string;
  range: BibleReference;
  date: string;
  currentWord: Word;
  wordIndex: number;
  words: Word[];
  wrongAnswers: WrongAnswer[];
  goodAnswers: Word[];
  skippedWords: Word[];
  usedWords: Word[];
  secondaryTensesEnabled: boolean;
}
