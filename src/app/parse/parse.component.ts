import {AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../interfaces/word';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WordModel} from '../word.model';
import {StateService} from '../state.service';
import * as  __ from 'lodash-es';
import {faThumbsDown, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {WordPart} from '../wordPart';
import {
  adjective,
  adverb,
  allPartsOfSpeech,
  article,
  conjunction,
  infinitiveMood,
  noun,
  participleMood,
  personalPronoun,
  preposition,
  verb
} from '../wordTypeConstants';
import {KoineParserService} from '../koine-parser.service';
import {MorphologyGenerator} from '../morphologyGenerator';
import {MatStepper} from '@angular/material/stepper';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ParseAnswerDialogComponent} from '../parse-answer-dialog/parse-answer-dialog.component';

interface WrongAnswer {
  word: WordModel;
  given_answer: string;
}

@Component({
  selector: 'app-parse',
  templateUrl: './parse.component.html',
  styleUrls: ['./parse.component.css']
})
export class ParseComponent implements OnInit, AfterViewChecked {
  word: WordModel = null;
  words: WordModel[] = [];
  wordIndex = 0;

  usedWords: WordModel[] = [];
  goodAnswers: WordModel[] = [];
  wrongAnswers: WrongAnswer[] = [];
  partsOfSpeech: string[] = ['type', 'tense', 'voice', 'mood', 'person', 'case', 'number', 'gender'];
  answer: string;
  currentWordIsUnanswered = true;

  // form stuff
  types = Types;
  parsingForm: FormGroup;
  verbTenses = VerbTenses.filter(x => x.secondary === false);
  persons = Persons;
  moods = Moods;
  numbers = Numbers;
  cases = NounCases;
  genders = Genders;
  voices = Voices;
  // defaultControlValue = 'Choose...';
  defaultControlValue = 'None';
  wrongAnswerObject: WrongAnswer;
  thumbsUp = faThumbsUp;
  thumbsDown = faThumbsDown;
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
    this.words = this.state.getWordsForParsing();
    this.word = this.words[this.wordIndex];
    this.usedWords.push(this.word);
    this.wordIndex++;

    if (this.word == null) {
      this.router.navigate(['bible']);
    }
  }

  nextWord(): void {
    if (this.wordIndex < this.words.length) {
      this.word = this.words[this.wordIndex];
      this.usedWords.push(this.word);
      this.wordIndex++;
      this.resetForm();
      this.currentWordIsUnanswered = true;
      this.stepper.reset();
      this.expansionPanel.expanded = false;

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

  openDialog(answer: boolean, answerMorphologyCode: string): void {
    this.dialog.open(ParseAnswerDialogComponent, {
      data: {
        givenAnswer: answerMorphologyCode,
        currentWord: this.word,
        answerIsRight: answer,
        nextWordMethod: () => this.nextWord(),
        hasNextWord: this.wordIndex >= this.words.length
      },
    });
  }

  submit($event: Event): void {
    if (this.parsingForm.valid) {
      const answerParts = this.formulateAnswerParts();
      const answerMorphologyCode = this.morphologyGenerator.generateMorphologyFromWordParts(answerParts);
      if (answerParts === undefined || answerParts.length > 0) {
        this.currentWordIsUnanswered = false;
        const answerIsRight: boolean = __.isEqualWith(this.word.partsOfSpeech, answerParts, this.customEqualsComparable);

        if (answerIsRight) { // answer.toUpperCase() === this.word.morphology.toUpperCase()
          this.goodAnswers.push(this.word);
          this.openDialog(true, answerMorphologyCode);
        } else {
          // check if the word has multiple morphologies
          const multipleMorphologies = this.getMultipleMorphologiesForWord(this.word);
          if (multipleMorphologies.find(x => x === this.word.morphology) !== undefined) {
            if (this.wrongAnswers.find(x => x.word === this.word) === undefined) { // do not accept the right answer after a wrong answer
              this.goodAnswers.push(this.word);
            } else {
              // give a feedback
            }
          } else {
            if (__.last(this.wrongAnswers) !== undefined && __.last(this.wrongAnswers).given_answer === answerMorphologyCode) {
              return;
            }

            this.openDialog(false, answerMorphologyCode);

            if (this.goodAnswers.find(x => x === this.word) === undefined) {
              this.wrongAnswerObject = {word: this.word, given_answer: answerMorphologyCode};
              this.wrongAnswers.push(this.wrongAnswerObject);
            } else { // when changing the good answer for the bad

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

    if (wordPartsOfSpeech.length !== givenAnswer.length) {
      return false;
    }

    if (__.isEqual(__.sortBy(wordPartsOfSpeech), __.sortBy(givenAnswer)) === true) {
      return true;
    }

    for (let i = 0; i <= wordPartsOfSpeech.length; i++) {
      if (wordPartsOfSpeech[i] !== givenAnswer[i]) { // if they are not the same, then check the headCategories
        if (wordPartsOfSpeech[i].headCategory !== undefined) {
          if (wordPartsOfSpeech[i].headCategory !== givenAnswer[i]) {
            return false;
          }
        } else { // if the objects are not equal and the partsOfSpeech of the word doesn't have a category, then it's a wrong answer
          return false;
        }
      }
    }

    return true;
  }

  determineAvailableControlsWhenOptionIsSelected($event: Event): void {
    this.parsingForm.enable();

    if (this.parsingForm.controls.mood.value === participleMood.abbreviation) {
      this.parsingForm.controls.person.disable();
      this.parsingForm.controls.case.enable();
      this.parsingForm.controls.gender.enable();
    } else if (this.parsingForm.controls.mood.value === infinitiveMood.abbreviation) {
      this.parsingForm.controls.case.disable();
      this.parsingForm.controls.gender.disable();
      this.parsingForm.controls.number.disable();
      this.parsingForm.controls.person.disable();
    } else {
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
          // this.parsingForm.controls.gender.disable();
          break;
        case conjunction.abbreviation:
        case adverb.abbreviation:
          this.parsingForm.disable();
          this.parsingForm.controls.type.enable();
          break;
        // case participleMood.abbreviation:
        //   this.parsingForm.controls.type.setValue('Verbs');
        //   this.parsingForm.controls.mood.setValue('Participle');
        //   break;
        default:
          break;
      }
    }
  }

  ngAfterViewChecked(): void {
    // document.querySelector('#mainContent').scrollIntoView(true);
  }

  @HostListener('window:keyup', ['$event'])
  nextWordThroughKeyboard($event: KeyboardEvent): void {
    if ($event.code === 'ArrowRight') {
      this.nextWord();
    }
  }
}
