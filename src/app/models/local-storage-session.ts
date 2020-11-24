import {Word} from './word';
import {WrongAnswer} from '../parse/parse.component';

export interface LocalStorageSession {
  key: string;
  range: string;
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
