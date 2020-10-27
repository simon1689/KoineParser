import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BibleBooks, Book} from '../../assets/bible';
import {Genders, Moods, NounCases, Numbers, PartOfSpeech, Persons, TypeOfWords, Types, VerbTenses, Voices} from '../interfaces/word';
import {KoineParserService} from '../koine-parser.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {WordModel} from '../word.model';
import {StateService} from '../state.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-bible-range',
  templateUrl: './bible-range.component.html',
  styleUrls: ['./bible-range.component.css'],
})

export class BibleRangeComponent implements OnInit {
  bibleRangeForm: FormGroup;
  words: WordModel[];

  bibleBooks = BibleBooks;
  verbTenses = VerbTenses.filter(x => x.secondary === false);
  persons = Persons;
  types = Types;
  moods = Moods;
  numbers = Numbers;
  cases = NounCases;
  genders = Genders;
  voices = Voices;

  amountOfChapters: number;
  amountOfChaptersArray: any[];
  currentlySelectedBook: Book;
  amountOfChaptersToRangeArray: any;
  showVerbsSection = false;
  showNounSection = false;
  showNumberSection = false;

  constructor(private service: KoineParserService,
              private state: StateService,
              private ngxLoader: NgxUiLoaderService,
              private route: ActivatedRoute,
              private router: Router) {
    this.state = state;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.bibleRangeForm = new FormGroup({
      bibleBook: new FormControl('', Validators.required),
      bibleBookChapterFrom: new FormControl('', Validators.required),
      bibleBookChapterTo: new FormControl(''),

      types: this.createFormGroup(this.types, Validators.required),
      persons: this.createFormGroup(this.persons),
      numbers: this.createFormGroup(this.numbers),
      cases: this.createFormGroup(NounCases),
      tenses: this.createFormGroup(VerbTenses),
      moods: this.createFormGroup(Moods),
      voices: this.createFormGroup(Voices),
      genders: this.createFormGroup(this.genders)
    });

    this.bibleRangeForm.controls.bibleBook.setValue(40);
    this.bibleRangeForm.controls.bibleBookChapterFrom.setValue(1);
    this.bookSelected();
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

    this.currentlySelectedBook = BibleBooks.find(x => x.number === Number(this.bibleRangeForm.value.bibleBook));
    this.amountOfChapters = this.currentlySelectedBook.amountOfChapters;
    this.amountOfChaptersArray = [];
    for (let i = 1; i <= this.amountOfChapters; i++) {
      this.amountOfChaptersArray.push(i);
    }

    this.beginningChapterSelected(1);
  }

  beginningChapterSelected(startChapter: number = 0): void {
    if (this.bibleRangeForm.value.bibleBookChapterFrom === undefined) {
      return;
    }

    if (startChapter === 0) {
      startChapter = this.bibleRangeForm.value.bibleBookChapterFrom;
    }

    this.amountOfChaptersToRangeArray = [];
    for (let i = startChapter; i < this.currentlySelectedBook.amountOfChapters + 1; i++) {
      this.amountOfChaptersToRangeArray.push(i);
    }
  }

  checkboxChange(object: any, event: any): void {
    if (object.name === 'Verbs' && event.target.checked) {
      this.showVerbsSection = true;
      this.showNumberSection = true;
    } else if (object.name === 'Verbs' && !event.target.checked) {
      this.showVerbsSection = false;
      this.showNumberSection = false;
    }

    if (object.name === 'Nouns' && event.target.checked) {
      this.showNounSection = true;
      this.showNumberSection = true;
    } else if (object.name === 'Nouns' && !event.target.checked) {
      this.showNounSection = false;
      this.showNumberSection = false;
    }
  }

  checkboxSecondaryChange(event: any, part: string): void {
    if (event.target.checked && part === 'tenses') {
      this.verbTenses = VerbTenses;
    } else if (!event.target.checked && part === 'tenses') {
      this.verbTenses = this.verbTenses.filter(x => x.secondary === false);
    }
  }

  checkAll(event: Event, parts: PartOfSpeech[]): void {
    // @ts-ignore
    if (event.target.checked) {
      parts.forEach(x => x.isChecked = true);
    } else {
      parts.forEach(x => x.isChecked = false);
    }
  }

  submit($event: any): void {
    if (!this.bibleRangeForm.valid) {
      console.log(this.bibleRangeForm.errors);
      return;
    }

    this.getAllWords(this.currentlySelectedBook.number,
      this.bibleRangeForm.value.bibleBookChapterFrom,
      this.bibleRangeForm.value.bibleBookChapterTo);
  }

  getAllWords(book = null, startChapter = null, endChapter = null): Subscription {
    this.ngxLoader.start();
    return this.service.getAllWords(TypeOfWords.All, book, startChapter, endChapter)
      .subscribe(
        (response) => {
          this.words = response;
          this.words = this.words.filter((v, i, a) => a.findIndex(t => (t.word === v.word)) === i);

          this.router.navigate(['parsing'], {
            relativeTo: this.route.parent
          });

          this.state.setWordsForParsing(this.words);
          this.state.setBibleRange(this.currentlySelectedBook,
            this.bibleRangeForm.controls.bibleBookChapterFrom.value,
            this.bibleRangeForm.controls.bibleBookChapterTo.value);
          this.ngxLoader.stop();
        },
        (error) => {
          this.ngxLoader.stop();
          console.error('error', error);
        }
      );
  }
}
