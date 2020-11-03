import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BibleBooks, Book} from '../bible';
import {Genders, Moods, NounCases, Numbers, PartOfSpeech, Persons, Types, VerbTenses, Voices} from '../interfaces/word';
import {KoineParserService} from '../koine-parser.service';
import {NgxUiLoaderConfig, NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../state.service';
import {Subscription} from 'rxjs';
import {WordPart} from '../wordPart';
import {
  adjective, adverb,
  allTypesOfPronouns,
  article, conditionalType,
  conjunction,
  indeclinable,
  infinitiveMood,
  noun,
  participleMood,
  preposition,
  verb
} from '../wordTypeConstants';
import {faSearch} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-bible-range',
  templateUrl: './bible-range.component.html',
  styleUrls: ['./bible-range.component.css'],
})

export class BibleRangeComponent implements OnInit {
  bibleRangeForm: FormGroup;

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

  amountOfWordsForRange?: number = null;
  typesFormGroup: FormGroup;
  zoomIcon = faSearch;

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
    this.typesFormGroup = this.createFormGroup(this.types, Validators.required);
    this.bibleRangeForm = new FormGroup({
      bibleBook: new FormControl('', Validators.required),
      bibleBookChapterFrom: new FormControl('', Validators.required),
      bibleBookChapterTo: new FormControl(''),

      types: this.typesFormGroup,
      persons: this.createFormGroup(this.persons),
      numbers: this.createFormGroup(this.numbers),
      cases: this.createFormGroup(NounCases),
      tenses: this.createFormGroup(VerbTenses),
      moods: this.createFormGroup(Moods),
      voices: this.createFormGroup(Voices),
      genders: this.createFormGroup(this.genders),

      randomizeWords: new FormControl({value: true}),
      amountOfWords: new FormControl(null),
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

    this.currentlySelectedBook = BibleBooks.find(x => x.number === this.bibleRangeForm.value.bibleBook);
    this.amountOfChaptersArray = [];
    for (let i = 1; i <= this.currentlySelectedBook.amountOfChapters; i++) {
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
    } else if (startChapter === 1) {
      this.bibleRangeForm.controls.bibleBookChapterFrom.setValue(1);
    }

    this.amountOfChaptersToRangeArray = [];
    for (let i = startChapter; i < this.currentlySelectedBook.amountOfChapters + 1; i++) {
      this.amountOfChaptersToRangeArray.push(i);
    }

    this.setAmountOfWords();
  }

  endingChapterSelected(): void {
    this.setAmountOfWords();
  }

  setAmountOfWords(): void {
    this.ngxLoader.startLoader('smallLoader');
    this.service.getWordsCount(this.determineFilters(),
      this.bibleRangeForm.value.bibleBook,
      this.bibleRangeForm.value.bibleBookChapterFrom,
      this.bibleRangeForm.value.bibleBookChapterTo)
      .subscribe(res => {
        this.amountOfWordsForRange = res.count;
        this.bibleRangeForm.controls.amountOfWords.setValue(res.count);
      });
    this.ngxLoader.stopLoader('smallLoader');
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

    this.setAmountOfWords();
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
      return;
    }

    this.getAllWords(this.currentlySelectedBook.number,
      this.bibleRangeForm.value.bibleBookChapterFrom,
      this.bibleRangeForm.value.bibleBookChapterTo);
  }

  getAllWords(book = null, startChapter = null, endChapter = null): Subscription {
    this.ngxLoader.start();
    const filters = this.determineFilters();
    return this.service.getAllWords(filters, book, startChapter, endChapter)
      .subscribe(
        (response) => {
          this.router.navigate(['parsing'], {
            relativeTo: this.route.parent
          });

          // exclude indeclinable words
          const words = response.filter(x => !x.partsOfSpeech.includes(indeclinable));

          // let result: WordModel[] = [];
          // const filters = this.determineTypesOfWords();
          // if (filters.length > 0) {
          //   for (const f of filters) {
          //     const filterResults = response.filter(x => x.partsOfSpeech.includes(f));
          //     result = result.concat(filterResults);
          //   }
          //
          //   words = result;
          // }

          // console.log(words);
          this.state.setWordsForParsing(words, this.bibleRangeForm.value.amountOfWords, this.bibleRangeForm.value.randomizeWords);
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

  determineFilters(): WordPart[] {
    const result: WordPart[] = [];

    Object.keys(this.typesFormGroup.controls).forEach(key => {
      if (this.typesFormGroup.controls[key] !== undefined && this.typesFormGroup.controls[key].value === true) {
        switch (key) {
          case 'VerbsCtrl':
            result.push(verb);
            break;
          case 'NounsCtrl':
            result.push(noun);
            break;
          case 'AdjectivesCtrl':
            result.push(adjective);
            break;
          case 'ArticlesCtrl':
            result.push(article);
            break;
          case 'ConjunctionCtrl':
            result.push(conjunction);
            break;
          case 'ParticiplesCtrl':
            result.push(participleMood);
            break;
          case 'PronounsCtrl':
            allTypesOfPronouns.forEach(x => result.push(x));
            break;
          case 'PrepositionCtrl':
            result.push(preposition);
            break;
          case 'InfinitivesCtrl':
            result.push(infinitiveMood);
            break;
          case 'AdverbsCtrl':
            result.push(adverb);
            break;
          case 'ConditionalCtrl':
            result.push(conditionalType);
            break;
          default:
            break;
        }
      }
    });

    return result;
  }
}
