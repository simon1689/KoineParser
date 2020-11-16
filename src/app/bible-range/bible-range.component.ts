import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BibleBooks, Book} from '../etc/bible';
import {Moods, PartOfSpeech, Types, VerbTenses} from '../models/part-of-speech-objects';
import {KoineParserService} from '../koine-parser.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../state.service';
import {Subscription} from 'rxjs';
import {WordPart} from '../models/word-part';
import {
  adjective,
  adverb, allMoods,
  allTypesOfPronouns,
  article,
  conditionalType,
  conjunction, imperativeMood,
  indeclinable, indicativeMood,
  infinitiveMood,
  noun, optativeMood,
  participleMood,
  particleType,
  preposition, presentTense, subjunctiveMood,
  verb
} from '../etc/word-type-constants';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {Chapter} from '../etc/chapters';

@Component({
  selector: 'app-bible-range',
  templateUrl: './bible-range.component.html',
  styleUrls: ['./bible-range.component.css'],
})

export class BibleRangeComponent implements OnInit {
  bibleRangeForm: FormGroup;

  bibleBooks = BibleBooks;
  types = Types.filter(x => x.wordPart !== conditionalType);
  moods = Moods.filter(x => !x.secondary);

  selectedBook: Book;
  amountOfWordsForRange?: number = null;
  typesFormGroup: FormGroup;
  moodsFormGroup: FormGroup;
  zoomIcon = faSearch;
  verbSecondaryTenses = false;
  beginningChapter: Chapter = null;
  endingChapter: Chapter = null;

  constructor(private service: KoineParserService,
              private state: StateService,
              private ngxLoader: NgxUiLoaderService,
              private route: ActivatedRoute,
              private router: Router) {
    this.state = state;

    this.selectedBook = BibleBooks[0];
    this.beginningChapter = this.endingChapter = this.selectedBook.chapters[0];
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.typesFormGroup = this.createFormGroup(this.types, Validators.required);
    this.moodsFormGroup = this.createFormGroup(this.moods);

    this.bibleRangeForm = new FormGroup({
      bibleBook: new FormControl('', Validators.required),
      bibleBookFromChapter: new FormControl('', Validators.required),
      bibleBookFromVerse: new FormControl('', Validators.required),
      bibleBookToChapter: new FormControl(''),
      bibleBookToVerse: new FormControl(''),
      verbSecondaryTenses: new FormControl(''),
      types: this.typesFormGroup,
      moods: this.moodsFormGroup,
      randomizeWords: new FormControl({value: true}),
      amountOfWords: new FormControl(null),
    });

    this.bibleRangeForm.controls.bibleBook.setValue(this.selectedBook.number);
    this.bibleRangeForm.controls.bibleBookFromChapter.setValue(this.beginningChapter.chapter);
    this.bibleRangeForm.controls.bibleBookFromVerse.setValue(1);

    this.bibleRangeForm.controls.bibleBookToChapter.setValue(this.endingChapter.chapter);
    this.bibleRangeForm.controls.bibleBookToVerse.setValue(this.endingChapter.verses);

    this.setAmountOfWords();
  }

  createFormGroup(parts: PartOfSpeech[], validators = null): FormGroup {
    if (parts == null) {
      return null;
    }

    const group = new FormGroup({}, validators);
    for (const part of parts) {
      group.addControl(part.controlId, new FormControl(''));
    }

    return group;
  }

  bookSelected(): void {
    if (this.bibleRangeForm.value.bibleBook === undefined) {
      return;
    }

    this.selectedBook = BibleBooks.find(x => x.number === this.bibleRangeForm.value.bibleBook);
    this.beginningChapterSelected('1');
  }

  beginningChapterSelected(startChapter?: string): void {
    if (startChapter === undefined) {
      this.beginningChapter = this.selectedBook.chapters.find(x => x.chapter === this.bibleRangeForm.value.bibleBookFromChapter);
      this.bibleRangeForm.controls.bibleBookToChapter.setValue(this.beginningChapter.chapter);
    } else {
      this.beginningChapter = this.selectedBook.chapters.find(x => x.chapter === Number(startChapter));
      this.bibleRangeForm.controls.bibleBookFromChapter.setValue(this.beginningChapter.chapter);
      this.bibleRangeForm.controls.bibleBookToChapter.setValue(this.beginningChapter.chapter);
    }

    this.bibleRangeForm.controls.bibleBookFromVerse.setValue(1);
    this.endingChapterSelected();
  }

  endingChapterSelected(chapterNr?: string): void {
    if (chapterNr === undefined) {
      this.endingChapter = this.selectedBook.chapters.find(x =>
        x.chapter === this.bibleRangeForm.value.bibleBookToChapter);
    } else {
      this.endingChapter = this.selectedBook.chapters.find(x =>
        x.chapter === Number(chapterNr));
    }

    if (this.beginningChapter === this.endingChapter) {
      this.bibleRangeForm.controls.bibleBookToVerse.setValue(this.endingChapter.verses);
    } else {
      this.bibleRangeForm.controls.bibleBookToChapter.setValue(this.endingChapter.chapter);
      this.bibleRangeForm.controls.bibleBookToVerse.setValue(this.endingChapter.verses);
    }

    this.setAmountOfWords();
  }

  setAmountOfWords(): void {
    this.ngxLoader.startLoader('smallLoader');
    this.service.getWordsCount(this.determineFilters(),
      this.bibleRangeForm.value.bibleBook,
      this.bibleRangeForm.value.bibleBookFromChapter,
      this.bibleRangeForm.value.bibleBookFromVerse,
      this.bibleRangeForm.value.bibleBookToChapter,
      this.bibleRangeForm.value.bibleBookToVerse)
      .subscribe(res => {
        this.amountOfWordsForRange = res.count;
        this.bibleRangeForm.controls.amountOfWords.setValue(res.count);
      });
    this.ngxLoader.stopLoader('smallLoader');
  }

  submit(): void {
    if (!this.bibleRangeForm.valid) {
      return;
    }

    this.getAllWords(this.selectedBook.number,
      this.bibleRangeForm.value.bibleBookFromChapter,
      this.bibleRangeForm.value.bibleBookFromVerse,
      this.bibleRangeForm.value.bibleBookToChapter,
      this.bibleRangeForm.value.bibleBookToVerse);
  }

  getAllWords(book = null, startChapter = null, startVerse = null, endChapter = null, endVerse = null): Subscription {
    this.ngxLoader.start();
    const filters = this.determineFilters();
    return this.service.getAllWords(filters, book, startChapter, startVerse, endChapter, endVerse)
      .subscribe(
        (response) => {
          this.router.navigate(['parsing'], {
            relativeTo: this.route.parent
          });

          // exclude indeclinable words
          const words = response.filter(x => !x.partsOfSpeech.includes(indeclinable));

          this.state.setSecondaryTensesEnabled(this.verbSecondaryTenses);
          this.state.setWordsForParsing(words, this.bibleRangeForm.value.amountOfWords, this.bibleRangeForm.value.randomizeWords);
          this.state.setBibleRange(this.selectedBook,
            this.bibleRangeForm.value.bibleBookFromChapter,
            this.bibleRangeForm.value.bibleBookFromVerse,
            this.bibleRangeForm.value.bibleBookToChapter,
            this.bibleRangeForm.value.bibleBookToVerse);
          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
          console.error('error', error);
        }
      );
  }

  determineFilters(): WordPart[] {
    const result: WordPart[] = [];

    Object.keys(this.typesFormGroup.controls).forEach(key => {
      if (this.typesFormGroup.controls[key] !== undefined && this.typesFormGroup.controls[key].value === true) {
        result.push(Types.find(x => x.controlId === key).wordPart);
      }
    });

    Object.keys(this.moodsFormGroup.controls).forEach(key => {
      if (this.moodsFormGroup.controls[key] !== undefined && this.moodsFormGroup.controls[key].value === true) {
        result.push(Moods.find(x => x.controlId === key).wordPart);
      }
    });

    return result.filter(x => x !== undefined);
  }

  counter(i: number): Array<number> {
    return new Array(i);
  }

  giveMeVerseNumbers(endingChapter: Chapter): Array<number> {
    const result: Array<number> = new Array<number>();

    if (this.bibleRangeForm.value.bibleBookFromChapter === this.bibleRangeForm.value.bibleBookToChapter) {
      for (let i = this.bibleRangeForm.value.bibleBookFromVerse + 1; i <= endingChapter.verses; i++) {
        result.push(i);
      }
    } else {
      for (let i = 1; i <= endingChapter.verses; i++) {
        result.push(i);
      }
    }

    return result;
  }
}
