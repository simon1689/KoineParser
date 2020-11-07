import {WordModel} from './word.model';
import {WrongAnswer} from '../parse/parse.component';

export interface LocalStorageSession {
  key: string;
  range: string;
  date: string;
  currentWord: WordModel;
  wordIndex: number;
  words: WordModel[];
  wrongAnswers: WrongAnswer[];
  goodAnswers: WordModel[];
  skippedWords: WordModel[];
  usedWords: WordModel[];
  secondaryTensesEnabled: boolean;
}
