import {BibleBooks, Book} from '../etc/bible';

export class BibleReference {
  public bibleBook: Book = BibleBooks[0];
  public beginningChapter = 1;
  public beginningVerse = 1;
  public endingChapter = 1;
  public endingVerse = this.bibleBook.chapters[0].verses;

  constructor(bibleBook, beginningChapter, beginningVerse, endingChapter, endingVerse) {
    this.bibleBook = BibleBooks.find(x => x.number === bibleBook);
    this.beginningChapter = beginningChapter;
    this.beginningVerse = beginningVerse;
    this.endingChapter = endingChapter;
    this.endingVerse = endingVerse;
  }

  public toString(): string {
    let result: string;
    if (this.beginningChapter === this.endingChapter) {
      if (this.beginningVerse === 1 && this.bibleBook.chapters[this.beginningChapter - 1].verses === this.endingVerse) {
        result = this.bibleBook.name + ' ' + this.beginningChapter;
      } else {
        result = this.bibleBook.name + ' ' + this.beginningChapter + ':' + this.beginningVerse
          + '-' + this.endingVerse;
      }
    } else {
      if (this.beginningVerse === 1 && this.bibleBook.chapters[this.endingChapter - 1].verses === this.endingVerse) {
        result = this.bibleBook.name + ' ' + this.beginningChapter + '-' + this.endingChapter;
      } else {
        result = this.bibleBook.name + ' ' + this.beginningChapter + ':' + this.beginningVerse
          + '-' + this.endingChapter + ':' + this.endingVerse;
      }
    }

    return result;
  }

  public toApiQueryString(): string {
    return `${this.bibleBook.number}/${this.beginningChapter}/${this.beginningVerse}/${this.endingChapter}/${this.endingVerse}`;
  }
}
