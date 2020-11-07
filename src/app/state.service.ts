import {Injectable} from '@angular/core';
import {WordModel} from './models/word.model';
import {Book} from './etc/bible';
import * as __ from 'lodash-es';
import {LocalStorageSession} from './models/local-storage-session';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  wordsForParsing: WordModel[] = [];
  bibleRange = '';
  verbSecondaryTensesEnabled = false;
  localStorageSession: LocalStorageSession;

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

  setBibleRange(book: Book, bibleBookFromChapter: string, bibleBookFromVerse: string,
                bibleBookToChapter: string, bibleBookToVerse: string): void {
    if (bibleBookFromChapter === bibleBookToChapter) {
      this.bibleRange = book.name + ' ' + bibleBookFromChapter + ':' + bibleBookFromVerse
        + '-' + bibleBookToVerse;
    } else {
      this.bibleRange = book.name + ' ' + bibleBookFromChapter + ':' + bibleBookFromVerse
        + ' - ' + bibleBookToChapter + ':' + bibleBookToVerse;
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

  setCurrentSession(localStorageSession: LocalStorageSession): void {
    this.localStorageSession = localStorageSession;
  }

  getCurrentSession(): LocalStorageSession {
    return this.localStorageSession;
  }
}
