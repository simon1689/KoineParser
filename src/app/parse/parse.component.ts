import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../models/part-of-speech-objects';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WordModel} from '../models/word.model';
import {StateService} from '../state.service';
import * as  __ from 'lodash-es';
import {faExclamationCircle, faForward, faThumbsDown, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {WordPart} from '../models/word-part';
import {
  adjective,
  adverb, allPartsOfSpeech,
  allSuffixes,
  allTenses,
  article,
  conditionalType,
  conjunction,
  infinitiveMood,
  noun,
  participleMood,
  particleType,
  personalPronoun,
  preposition,
  verb
} from '../etc/word-type-constants';
import {KoineParserService} from '../koine-parser.service';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {MatStepper} from '@angular/material/stepper';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ParseAnswerDialogComponent} from '../parse-answer-dialog/parse-answer-dialog.component';
import {ReportErrorOnPageDialogComponent} from '../report-error-on-page/report-error-on-page-dialog.component';
import {LocalStorageSession} from '../models/local-storage-session';
import {Subscription} from 'rxjs';

export interface WrongAnswer {
  word: WordModel;
  given_answer: string;
}

@Component({
  selector: 'app-parse',
  templateUrl: './parse.component.html',
  styleUrls: ['./parse.component.css']
})
export class ParseComponent implements OnInit {
  // words and answers
  wordIndex = 0;
  word: WordModel = null;
  words: WordModel[] = [];
  usedWords: WordModel[] = [];
  goodAnswers: WordModel[] = [];
  skippedWords: WordModel[] = [];
  wrongAnswers: WrongAnswer[] = [];
  wrongAnswerObject: WrongAnswer;
  partsOfSpeech: string[] = ['type', 'tense', 'voice', 'mood', 'person', 'case', 'number', 'gender'];
  answer: string;
  currentWordIsUnanswered = true;
  sessionSaved: boolean;

  // form stuff
  types = Types;
  parsingForm: FormGroup;
  verbTenses = VerbTenses;
  persons = Persons;
  moods = Moods;
  numbers = Numbers;
  cases = NounCases;
  genders = Genders;
  voices = Voices.filter(x => !x.secondary);
  defaultControlValue = 'None';

  // icons
  thumbsUp = faThumbsUp;
  thumbsDown = faThumbsDown;
  skip = faForward;
  exclamation = faExclamationCircle;
  morphologyGenerator = MorphologyGenerator;
  @ViewChild('mainContent') mainContent: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;
  @ViewChild('answerExpansionPanel') answerExpansionPanel: MatExpansionPanel;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService,
              private service: KoineParserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initForm();
    if (this.state.getCurrentSession()) {
      this.setCurrentSession();
    } else {
      this.startRoute();
      // this.plannedRoute();
    }

    this.determineSecondaryTenses();
    console.log(this.word);
  }

  startRoute(): void {
    this.words = this.state.getWordsForParsing();
    this.goToNextWord(this.usedWords);

    if (this.word == null) {
      this.router.navigate(['']);
    }
  }

  // for testing cases received from the report form
  plannedRoute(): void {
    this.service.getEmailedReportInformation().subscribe(
      result => {
        this.setData(result);
      }
    );
  }

  setCurrentSession(): void {
    const session = this.state.getCurrentSession();
    this.setData(session);
  }

  // sets data from LocalStorageSession and also from reported email data
  setData(data: any): void {
    this.words = data.words;
    this.wordIndex = data.wordIndex;
    this.word = data.words[data.wordIndex - 1];
    this.state.bibleRange = data.range;
    this.state.setSecondaryTensesEnabled(data.secondaryTensesEnabled);
    this.skippedWords = (data.skippedWords === undefined) ? [] : data.skippedWords;
    this.goodAnswers = (data.goodAnswers === undefined) ? [] : data.goodAnswers;
    this.wrongAnswers = (data.wrongAnswers === undefined) ? [] : data.wrongAnswers;
    this.usedWords = (data.usedWords === undefined) ? [] : data.usedWords;
    this.determineSecondaryTenses();
  }

  nextWord(): void {
    if (this.wordIndex < this.words.length && !this.currentWordIsUnanswered) {
      this.goToNextWord(this.usedWords, true);
    }
  }

  skipWord(): void {
    if (this.wordIndex < this.words.length) {
      if (this.goodAnswers.find(x => x === this.word) === undefined
        && this.wrongAnswers.find(x => x.word === this.word) === undefined) {
        this.goToNextWord(this.skippedWords, true);
      } else {
        this.goToNextWord(this.usedWords, true);
      }
    }
  }

  private goToNextWord(wordShouldBeAddedHere: WordModel[], reset: boolean = false): void {
    if (this.wordIndex < this.words.length) {
      this.word = this.words[this.wordIndex];
      wordShouldBeAddedHere.push(this.word);
      this.wordIndex++;

      if (reset) {
        this.resetForm();
        this.currentWordIsUnanswered = true;
        this.stepper.reset();
        this.expansionPanel.expanded = false;
        this.answerExpansionPanel.expanded = false;
      }

      console.clear();
      console.log(this.word);
    }
  }

  initForm(): void {
    this.parsingForm = new FormGroup({
      type: new FormControl(this.defaultControlValue),
      tense: new FormControl(this.defaultControlValue),
      voice: new FormControl(this.defaultControlValue),
      mood: new FormControl(this.defaultControlValue),
      person: new FormControl(this.defaultControlValue),
      case: new FormControl(this.defaultControlValue),
      gender: new FormControl(this.defaultControlValue),
      number: new FormControl(this.defaultControlValue),
    });

    this.parsingForm.enable();
  }

  resetForm(): void {
    Object.keys(this.parsingForm.controls).forEach(key => {
      this.parsingForm.controls[key].reset(this.defaultControlValue);
      this.parsingForm.controls[key].enable();
    });
  }

  async submit(): Promise<void> {
    if (this.parsingForm.valid) {
      const answerParts = this.formulateAnswerParts();
      const answerMorphologyCode = this.morphologyGenerator.generateMorphologyFromWordParts(answerParts);

      if (answerParts === undefined || answerParts.length > 0) {
        this.currentWordIsUnanswered = false;

        let answerIsRight: boolean;
        const wordPartsOfSpeech = this.word.partsOfSpeech.filter(x => !allSuffixes.includes(x));
        if (this.state.getSecondaryTensesEnabled()) {
          answerIsRight = __.isEqualWith(wordPartsOfSpeech, answerParts, this.customEqualsComparableWithSecondaryTenses);
        } else {
          answerIsRight = __.isEqualWith(wordPartsOfSpeech, answerParts, this.customEqualsComparable);
        }

        if (answerIsRight) {
          // if answer is given for the first time
          if (this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) === undefined
            && this.goodAnswers.find(word => __.isEqual(word, this.word)) === undefined) {
            this.goodAnswers.push(this.word);
            this.openDialog(true, answerParts, false);
          } else {
            this.openDialog(true, answerParts, true);
          }
        } else {

          // check if the word has multiple morphologies
          const multipleMorphologies = await this.getMultipleMorphologiesForWord(this.word).then(x => x);
          if (multipleMorphologies.find(x => x === this.word.morphology) !== undefined) {

            // do not accept the right answer after a wrong answer
            if (this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) !== undefined) {
              this.openDialog(true, answerParts, true);
              return;
            }
            // accept right answer if the word has not been answered
            else if (this.goodAnswers.find(x => __.isEqual(x, this.word)) === undefined
              && this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) === undefined) {
              this.goodAnswers.push(this.word);
              this.openDialog(true, answerParts);
              return;
            }
          } else {
            // if the last given answer is the same as the current, then do nothing
            if (__.last(this.wrongAnswers) !== undefined
              && __.last(this.wrongAnswers).given_answer === answerMorphologyCode
              && __.isEqual(__.last(this.wrongAnswers).word, this.word)) {
              return;
            }

            // if the answer is wrong and given for the first time, then register it
            if (this.goodAnswers.find(x => __.isEqual(x, this.word)) === undefined &&
              this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) === undefined) {

              this.wrongAnswerObject = {word: this.word, given_answer: answerMorphologyCode};
              this.wrongAnswers.push(this.wrongAnswerObject);
              this.openDialog(false, answerParts);
            } else {
              this.openDialog(false, answerParts);
            }
          }
        }
      }
    }
  }

  formulateAnswerParts(): WordPart[] {
    this.answer = '';
    const answerParts: WordPart[] = [];
    for (const part of this.partsOfSpeech) {
      const control = this.parsingForm.get(part);
      if (control.dirty && control.value !== this.defaultControlValue && !control.disabled) {
        answerParts.push(allPartsOfSpeech.find(x => x.abbreviation === control.value && x.type.toLowerCase() === part.toLowerCase()));
      }
    }

    return answerParts.filter(x => x !== undefined);
  }

  openErrorDialog(parseComponent: ParseComponent): void {
    this.dialog.open(ReportErrorOnPageDialogComponent, {
      data: {
        component: parseComponent
      }
    });
  }

  openDialog(answer: boolean, givenAnswerParts: WordPart[], correctedAnswer = false): void {
    this.dialog.open(ParseAnswerDialogComponent, {
      data: {
        givenAnswer: givenAnswerParts,
        currentWord: this.word,
        answerIsRight: answer,
        nextWordMethod: () => this.nextWord(),
        hasNextWord: this.wordIndex >= this.words.length,
        correctedAnswer
      },
    });
  }

  getMultipleMorphologiesForWord(word: WordModel): Promise<string[]> {
    let result: string[] = [];
    return this.service.multipleMorphologiesForWord()
      .then(response => {
        const wordsWithMultipleMorphologies = __.filter(response, x =>
          x.word.toLowerCase() === word.word.toLowerCase() && word.strongsNr === x.strongs); // &&  x.morphology !== word.morphology

        return result = wordsWithMultipleMorphologies.map(x => x.morphology);
      });
  }

  customEqualsComparable(wordPartsOfSpeech: WordPart[], givenAnswer: WordPart[]): boolean {
    if (wordPartsOfSpeech === undefined || givenAnswer === undefined || wordPartsOfSpeech === null || givenAnswer === null) {
      return false;
    }

    if (wordPartsOfSpeech.length !== givenAnswer.length) {
      return false;
    }

    if (__.isEqual(__.sortBy(wordPartsOfSpeech), __.sortBy(givenAnswer)) === true) {
      return true;
    }

    for (let i = 0; i <= wordPartsOfSpeech.length; i++) {
      // first check whether they're the same
      if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {

        // if they are not the same, then check the headCategories
        if (wordPartsOfSpeech[i].headCategory !== undefined) {

          if (!__.isEqual(wordPartsOfSpeech[i].headCategory, givenAnswer[i])) {
            return false;
          }
        } else { // if the objects are not equal and the partsOfSpeech of the word doesn't have a category, then it's a wrong answer
          return false;
        }
      }
    }

    return true;
  }

  customEqualsComparableWithSecondaryTenses(wordPartsOfSpeech: WordPart[], givenAnswer: WordPart[]): boolean {
    if (wordPartsOfSpeech === undefined || givenAnswer === undefined || wordPartsOfSpeech === null || givenAnswer === null) {
      return false;
    }

    if (wordPartsOfSpeech.length !== givenAnswer.length) {
      return false;
    }

    if (__.isEqual(__.sortBy(wordPartsOfSpeech), __.sortBy(givenAnswer)) === true) {
      return true;
    }

    for (let i = 0; i < wordPartsOfSpeech.length; i++) {
      // first check whether they're the same
      if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {

        // if they are not the same, then check the headCategories
        if (wordPartsOfSpeech[i].headCategory !== undefined && !allTenses.includes(wordPartsOfSpeech[i])) {
          if (!__.isEqual(wordPartsOfSpeech[i].headCategory, givenAnswer[i])) {
            return false;
          }
        } else { // if the objects are not equal and the partsOfSpeech of the word doesn't have a category, then it's a wrong answer
          return false;
        }
      }
    }

    return true;
  }

  determineAvailableControlsWhenTypeIsSelected($event: Event): void {
    this.parsingForm.enable();

    switch (this.parsingForm.controls.type.value) {
      case verb.abbreviation:
        this.parsingForm.controls.case.disable();
        this.parsingForm.controls.gender.disable();
        break;
      case noun.abbreviation:
      case article.abbreviation:
      case adjective.abbreviation:
        this.parsingForm.controls.tense.disable();
        this.parsingForm.controls.voice.disable();
        this.parsingForm.controls.mood.disable();
        this.parsingForm.controls.person.disable();
        break;
      case preposition.abbreviation:
        this.parsingForm.disable();
        this.parsingForm.controls.type.enable();
        break;
      case personalPronoun.abbreviation: // this includes all types of pronouns
        this.parsingForm.controls.tense.disable();
        this.parsingForm.controls.voice.disable();
        this.parsingForm.controls.mood.disable();
        break;
      case conjunction.abbreviation:
      case adverb.abbreviation:
        this.parsingForm.disable();
        this.parsingForm.controls.type.enable();
        break;

      case conditionalType.abbreviation:
      case particleType.abbreviation:
        this.parsingForm.disable();
        this.parsingForm.controls.type.enable();
        break;
      default:
        break;
    }
  }

  determineAvailableControlsWhenMoodIsSelected(): void {
    if (this.parsingForm.controls.mood.value === participleMood.abbreviation) {
      this.parsingForm.controls.person.disable();
      this.parsingForm.controls.case.enable();
      this.parsingForm.controls.gender.enable();
      this.parsingForm.controls.number.enable();
    } else if (this.parsingForm.controls.mood.value === infinitiveMood.abbreviation) {
      this.parsingForm.controls.case.disable();
      this.parsingForm.controls.gender.disable();
      this.parsingForm.controls.number.disable();
      this.parsingForm.controls.person.disable();
    } else {
      this.parsingForm.controls.person.enable();
      this.parsingForm.controls.number.enable();
      this.parsingForm.controls.case.disable();
      this.parsingForm.controls.gender.disable();
    }
  }

  @HostListener('window:keyup', ['$event'])
  nextWordThroughKeyboard($event: KeyboardEvent): void {
    if ($event.code === 'ArrowRight') {
      this.nextWord();
    }
  }

  determineSecondaryTenses(): void {
    if (this.state.getSecondaryTensesEnabled()) {
      this.verbTenses = VerbTenses;
    } else {
      this.verbTenses = this.verbTenses.filter(x => x.secondary === false);
    }
  }

  saveSession(): void {
    const session: LocalStorageSession = {
      words: this.words,
      wordIndex: this.wordIndex,
      currentWord: this.word,
      date: new Date().toDateString(),
      range: this.state.getBibleRange(),
      goodAnswers: this.goodAnswers,
      wrongAnswers: this.wrongAnswers,
      skippedWords: this.skippedWords,
      usedWords: this.usedWords,
      key: this.state.getBibleRange() + ' ' + new Date().toDateString(),
      secondaryTensesEnabled: this.state.getSecondaryTensesEnabled()
    };

    let sessionKeys: string[] = [];
    if ('session_keys' in localStorage) {
      sessionKeys = JSON.parse(localStorage.getItem('session_keys'));
    }

    if (session.key in localStorage) { // if session exists, then remove it first
      sessionKeys = sessionKeys.filter(x => x !== session.key); // remove the key
      localStorage.removeItem(session.key);
    }

    sessionKeys.push(session.key);
    localStorage.setItem(session.key, JSON.stringify(session));
    localStorage.setItem('session_keys', JSON.stringify(sessionKeys));

    this.parsingForm.disable();
    this.sessionSaved = true;
  }
}
