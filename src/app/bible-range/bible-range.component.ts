import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BibleBooks, Book} from '../etc/bible';
import {Moods, Types, VerbTenses} from '../models/part-of-speech-objects';
import {KoineParserService} from '../koine-parser.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../state.service';
import {Subscription} from 'rxjs';
import {WordPart} from '../models/word-part';
import {conditionalType} from '../etc/word-type-constants';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {Chapter} from '../etc/chapters';
import {BibleReference} from '../models/bible-reference';
import {Helper} from '../etc/helper';

@Component({
  selector: 'app-bible-range',
  templateUrl: './bible-range.component.html',
  styleUrls: ['./bible-range.component.css'],
})

export class BibleRangeComponent implements OnInit {
  bibleRangeForm: FormGroup;
  typesFormGroup: FormGroup;
  moodsFormGroup: FormGroup;
  tensesFormGroup: FormGroup;

  types = Types.filter(x => x.wordPart !== conditionalType && !x.secondary);
  moods = Moods.filter(x => !x.secondary);
  tenses = VerbTenses.filter(x => !x.secondary);

  zoomIcon = faSearch;

  amountOfWordsForRange?: number = null;
  verbSecondaryTenses = false;
  useAllPronouns = false;

  bibleBooks = BibleBooks;
  selectedBook: Book;
  beginningChapter: Chapter = null;
  endingChapter: Chapter = null;
  helper = Helper;

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
    this.typesFormGroup = this.helper.createFormGroup(this.types, Validators.required);
    this.moodsFormGroup = this.helper.createFormGroup(this.moods);
    this.tensesFormGroup = this.helper.createFormGroup(this.tenses);

    this.bibleRangeForm = new FormGroup({
      bibleBook: new FormControl('', Validators.required),
      bibleBookFromChapter: new FormControl('', Validators.required),
      bibleBookFromVerse: new FormControl('', Validators.required),
      bibleBookToChapter: new FormControl(''),
      bibleBookToVerse: new FormControl(''),
      verbSecondaryTenses: new FormControl(''),
      useAllPronouns: new FormControl(''),

      types: this.typesFormGroup,
      moods: this.moodsFormGroup,
      tenses: this.tensesFormGroup,

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

  createBibleReference(): BibleReference {
    return new BibleReference(
      this.bibleRangeForm.value.bibleBook,
      this.bibleRangeForm.value.bibleBookFromChapter,
      this.bibleRangeForm.value.bibleBookFromVerse,
      this.bibleRangeForm.value.bibleBookToChapter,
      this.bibleRangeForm.value.bibleBookToVerse);
  }

  setAmountOfWords(): void {
    this.ngxLoader.startLoader('smallLoader');
    this.service.getWordCount(this.determineFilters(), this.createBibleReference())
      .subscribe(res => {
        this.amountOfWordsForRange = res.count;
        this.bibleRangeForm.controls.amountOfWords.setValue(this.amountOfWordsForRange);
      });
    this.ngxLoader.stopLoader('smallLoader');
  }

  submit(): void {
    if (!this.bibleRangeForm.valid) {
      return;
    }

    this.getWords();
  }

  getWords(): Subscription {
    this.ngxLoader.start();
    const filters = this.determineFilters();
    const bibleReference = this.createBibleReference();
    return this.service.getWords(filters, bibleReference)
      .subscribe(
        (words) => {
          this.router.navigate(['parsing'], {
            relativeTo: this.route.parent
          });

          this.state.setSecondaryTensesEnabled(this.verbSecondaryTenses);
          this.state.setUseAllPronouns(this.useAllPronouns);
          this.state.setWordsForParsing(words, this.bibleRangeForm.value.amountOfWords, this.bibleRangeForm.value.randomizeWords);
          this.state.setBibleReference(bibleReference);
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

    Object.keys(this.tensesFormGroup.controls).forEach(key => {
      if (this.tensesFormGroup.controls[key] !== undefined && this.tensesFormGroup.controls[key].value === true) {
        result.push(VerbTenses.find(x => x.controlId === key).wordPart);
      }
    });

    return result.filter(x => x !== undefined);
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

  checkVerbsType($event: any): void {
    if (this.typesFormGroup.value.VerbCtrl === undefined && $event === true) {
      this.typesFormGroup.controls.VerbsCtrl.setValue($event);
    } else if (this.typesFormGroup.value.VerbCtrl && $event) {
      this.typesFormGroup.controls.VerbsCtrl.setValue($event);
    } else {
      let result = false;
      Object.keys(this.moodsFormGroup.value).forEach(key => {
        if (this.moodsFormGroup.controls[key] !== undefined && this.moodsFormGroup.controls[key].value === true) {
          result = true;
        }
      });

      Object.keys(this.tensesFormGroup.value).forEach(key => {
        if (this.tensesFormGroup.controls[key] !== undefined && this.tensesFormGroup.controls[key].value === true) {
          result = true;
        }
      });

      if (result) {
        this.typesFormGroup.controls.VerbsCtrl.setValue(true);
      } else {
        this.typesFormGroup.controls.VerbsCtrl.setValue($event);
      }

    }
  }
}
