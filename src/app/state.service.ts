import {Injectable} from '@angular/core';
import {WordModel} from './word.model';
import {Book} from '../assets/bible';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  wordsForParsing: WordModel[] = [];
  bibleRange = '';

  constructor() {
  }

  setWordsForParsing(words: WordModel[]): void {
    this.wordsForParsing = words;
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
}
