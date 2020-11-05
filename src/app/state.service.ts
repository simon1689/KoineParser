import {Injectable} from '@angular/core';
import {WordModel} from './models/word.model';
import {Book} from './bible';
import * as __ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  wordsForParsing: WordModel[] = [];
  bibleRange = '';
  verbSecondaryTensesEnabled = false;

  constructor() {
  }

  setWordsForParsing(words: WordModel[], amountOfWords: number, shuffle: boolean = true): void {
    if (shuffle) {
      this.wordsForParsing = __.shuffle(words);
    } else {
      this.wordsForParsing = words;
    }

    this.wordsForParsing = __.slice(this.wordsForParsing, 0, amountOfWords);
  }

  getWordsForParsing(): WordModel[] {
    return this.wordsForParsing;
  }

  setBibleRange(book: Book, beginningChapter: string, endingChapter: string): void {
    if (endingChapter) {
      this.bibleRange = book.name + ' ' + beginningChapter + '-' + endingChapter;
    } else {
      this.bibleRange = book.name + ' ' + beginningChapter;
    }
  }

  getBibleRange(): string {
    return this.bibleRange;
  }

  setSecondaryTensesEnabled(verbSecondaryTenses: boolean): void {
    this.verbSecondaryTensesEnabled = verbSecondaryTenses;
  }

  getSecondaryTensesEnabled(): boolean {
    return this.verbSecondaryTensesEnabled;
  }
}
