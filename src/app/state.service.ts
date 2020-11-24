import {Injectable} from '@angular/core';
import {Word} from './models/word';
import * as __ from 'lodash-es';
import {LocalStorageSession} from './models/local-storage-session';
import {BibleReference} from './models/bible-reference';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  wordsForParsing: Word[] = [];
  bibleReference: BibleReference;
  verbSecondaryTensesEnabled = false;
  usingAllPronouns = false;
  localStorageSession: LocalStorageSession;

  constructor() {
  }

  setWordsForParsing(words: Word[], amountOfWords: number, shuffle: boolean = true): void {
    if (shuffle) {
      this.wordsForParsing = __.shuffle(words);
    } else {
      this.wordsForParsing = words;
    }

    this.wordsForParsing = __.slice(this.wordsForParsing, 0, amountOfWords);
  }

  getWordsForParsing(): Word[] {
    return this.wordsForParsing;
  }

  setSecondaryTensesEnabled(verbSecondaryTenses: boolean): void {
    this.verbSecondaryTensesEnabled = verbSecondaryTenses;
  }

  getSecondaryTensesEnabled(): boolean {
    return this.verbSecondaryTensesEnabled;
  }

  setUseAllPronouns(usingAllPronouns: boolean): void {
    this.usingAllPronouns = usingAllPronouns;
  }

  getUseAllPronouns(): boolean {
    return this.usingAllPronouns;
  }

  setCurrentSession(localStorageSession: LocalStorageSession): void {
    this.localStorageSession = localStorageSession;
  }

  getCurrentSession(): LocalStorageSession {
    return this.localStorageSession;
  }

  setBibleReference(bibleReference: BibleReference): void {
    this.bibleReference = bibleReference;
  }

  getBibleReference(): BibleReference {
    return this.bibleReference;
  }
}
