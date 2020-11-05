import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../models/part-of-speech-objects';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WordModel} from '../models/word.model';
import {StateService} from '../state.service';
import * as  __ from 'lodash-es';
import {faForward, faThumbsDown, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {WordPart} from '../models/wordPart';
import {
  adjective,
  adverb,
  allPartsOfSpeech,
  allSuffixes,
  article,
  conditionalType,
  conjunction,
  infinitiveMood,
  noun, particleType,
  participleMood,
  personalPronoun,
  preposition,
  verb, allTenses
} from '../word-type-constants';
import {KoineParserService} from '../koine-parser.service';
import {MorphologyGenerator} from '../morphologyGenerator';
import {MatStepper} from '@angular/material/stepper';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ParseAnswerDialogComponent} from '../parse-answer-dialog/parse-answer-dialog.component';
import {ReportErrorOnPageDialogComponent} from '../report-error-on-page/report-error-on-page-dialog.component';

interface WrongAnswer {
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
  morphologyGenerator = MorphologyGenerator;
  @ViewChild('mainContent') mainContent: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService,
              private service: KoineParserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initForm();
    this.determineSecondaryTenses();
    this.words = this.state.getWordsForParsing();
    this.goToNextWord(this.usedWords);

    if (this.word == null) {
      this.router.navigate(['bible']);
    }
  }

  nextWord(): void {
    if (this.wordIndex < this.words.length) {
      this.goToNextWord(this.usedWords, true);
    }
  }

  skipWord(): void {
    if (this.wordIndex < this.words.length) {
      this.goToNextWord(this.skippedWords, true);
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

  submit(): void {
    if (this.parsingForm.valid) {
      const answerParts = this.formulateAnswerParts();
      const answerMorphologyCode = this.morphologyGenerator.generateMorphologyFromWordParts(answerParts);


      if (answerParts === undefined || answerParts.length > 0) {
        this.currentWordIsUnanswered = false;

        let answerIsRight: boolean;
        if (this.state.getSecondaryTensesEnabled()) {
          answerIsRight = __.isEqualWith(this.word.partsOfSpeech, answerParts,
            this.customEqualsComparableWithSecondaryTenses);
        } else {
          answerIsRight = __.isEqualWith(this.word.partsOfSpeech, answerParts,
            this.customEqualsComparable);
        }
        if (answerIsRight) {
          // if answer is given for the first time
          if (this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) === undefined) {
            this.goodAnswers.push(this.word);
            this.openDialog(true, answerParts, false);
          } else {
            this.openDialog(true, answerParts, true);
          }
        } else {

          // check if the word has multiple morphologies
          const multipleMorphologies = this.getMultipleMorphologiesForWord(this.word);
          if (multipleMorphologies.find(x => x === this.word.morphology) !== undefined) {
            // do not accept the right answer after a wrong answer
            if (this.wrongAnswers.find(x => __.isEqual(x.word, this.word)) !== undefined) {
              this.openDialog(true, answerParts, true);
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

    return answerParts;
  }

  getMultipleMorphologiesForWord(word: WordModel): string[] {
    const result: string[] = [];
    this.service.multipleMorphologiesForWord()
      .subscribe(response => {
        const wordsWithMultipleMorphologies = __.filter(response, x =>
          x.morphology !== word.morphology && x.word.toLowerCase() === word.word.toLowerCase() && word.strongsNr === x.strongs);
        for (const morph of wordsWithMultipleMorphologies) {
          result.push(morph.morphology);
        }
      }, error => console.error(error));

    return result;
  }

  customEqualsComparable(wordPartsOfSpeech: WordPart[], givenAnswer: WordPart[]): boolean {
    if (wordPartsOfSpeech === undefined || givenAnswer === undefined || wordPartsOfSpeech === null || givenAnswer === null) {
      return false;
    }

    wordPartsOfSpeech = wordPartsOfSpeech.filter(x => !allSuffixes.includes(x));
    if (wordPartsOfSpeech.length !== givenAnswer.length) {
      return false;
    }

    if (__.isEqual(__.sortBy(wordPartsOfSpeech), __.sortBy(givenAnswer)) === true) {
      return true;
    }

    for (let i = 0; i <= wordPartsOfSpeech.length; i++) {
      // first check whether they're the same
      if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {
        // if (JSON.stringify(wordPartsOfSpeech[i]) !== JSON.stringify(givenAnswer[i])) {

        // if they are not the same, then check the headCategories
        if (wordPartsOfSpeech[i].headCategory !== undefined) {

          // if (JSON.stringify(wordPartsOfSpeech[i].headCategory) !== JSON.stringify(givenAnswer[i])) {
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

    wordPartsOfSpeech = wordPartsOfSpeech.filter(x => !allSuffixes.includes(x));
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

  openErrorDialog(parseComponent: ParseComponent): void {
    this.dialog.open(ReportErrorOnPageDialogComponent, {
      data: {
        component: parseComponent
      }
    });
  }

  determineSecondaryTenses(): void {
    if (this.state.getSecondaryTensesEnabled()) {
      this.verbTenses = VerbTenses;
    } else {
      this.verbTenses = this.verbTenses.filter(x => x.secondary === false);
    }
  }
}
