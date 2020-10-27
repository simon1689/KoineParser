import {Component, HostListener, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../interfaces/word';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WordModel} from '../word.model';
import {StateService} from '../state.service';

interface WrongAnswer {
  word: WordModel;
  given_answer: string;
}

@Component({
  selector: 'app-parse',
  templateUrl: './parse.component.html',
  styleUrls: ['./parse.component.css']
})
export class ParseComponent implements OnInit, OnChanges {
  word: WordModel = null;
  words: WordModel[] = [];
  wordIndex = 0;

  usedWords: WordModel[] = [];
  goodAnswers: WordModel[] = [];
  wrongAnswers: WrongAnswer[] = [];
  partsOfSpeech: string[] = ['type', 'tense', 'voice', 'mood', 'person', 'case', 'number', 'gender'];
  answer: string;
  currentWordIsUnanswered = !this.goodAnswers.includes(this.word) && !this.wrongAnswers.find((value, index) => value.word === this.word);

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
  defaultControlValue = 'Choose...';
  wrongAnswerObject: WrongAnswer;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService) {
    this.initForm();
  }

  nextWord(): void {
    let rndIndex = this.randomIntFromInterval(0, this.words.length);
    while (this.usedWords.includes(this.words[rndIndex])) {
      rndIndex = this.randomIntFromInterval(0, this.words.length);
    }
    this.word = this.words[rndIndex];
    this.usedWords.push(this.word);
    this.wordIndex++;
    this.initForm();

    console.clear();
  }

  randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  submit($event: Event): void {
    if (this.parsingForm.valid) {
      const answer = this.formulateAnswer();
      if (answer !== '') {
        if (answer.toUpperCase() === this.word.morphology.toUpperCase()) {
          this.goodAnswers.push(this.word);
        } else {
          this.wrongAnswerObject = {word: this.word, given_answer: answer};
          this.wrongAnswers.push(this.wrongAnswerObject);
          console.log('the answer is wrong', this.wrongAnswers);
        }
      }
    }
  }

  formulateAnswer(): string {
    this.answer = '';
    for (const part of this.partsOfSpeech) {
      const control = this.parsingForm.get(part);
      if (control.dirty && control.value !== this.defaultControlValue && !control.disabled) {
        if (part === 'type') {
          this.answer += control.value + '-';
        } else if (part === 'tense') {
          this.answer += control.value;
        } else if (part === 'voice') {
          this.answer += control.value;
        } else if (part === 'mood') {
          this.answer += control.value + '-';
        } else if (part === 'number') {
          this.answer += control.value;
        } else if (part === 'person') {
          this.answer += control.value;
        } else if (part === 'case') {
          this.answer += control.value;
        } else if (part === 'number') {
          this.answer += control.value;
        } else if (part === 'gender') {
          this.answer += control.value;
        }
      }
    }

    console.log(this.answer);
    return this.answer;
  }

  initForm(): void {
    this.parsingForm = new FormGroup({
      tense: new FormControl(this.defaultControlValue),
      voice: new FormControl(this.defaultControlValue),
      mood: new FormControl(this.defaultControlValue),
      case: new FormControl(this.defaultControlValue),
      gender: new FormControl(this.defaultControlValue),
      type: new FormControl(this.defaultControlValue),
      person: new FormControl(this.defaultControlValue),
      number: new FormControl(this.defaultControlValue),
    });

    this.parsingForm.enable();
  }

  typeOfWordSelected($event: Event): void {
    this.parsingForm.enable();

    switch (this.parsingForm.controls.type.value) {
      case 'V' || 'T' || 'A':
        this.parsingForm.controls.case.disable();
        this.parsingForm.controls.gender.disable();
        this.parsingForm.controls.gender.disable();
        break;
      case 'N':
        this.parsingForm.controls.tense.disable();
        this.parsingForm.controls.voice.disable();
        this.parsingForm.controls.mood.disable();
        this.parsingForm.controls.person.disable();
        break;
      case 'PREP':
        this.parsingForm.disable();
        this.parsingForm.controls.type.enable();
        break;
      case 'P':
        this.parsingForm.controls.tense.disable();
        this.parsingForm.controls.voice.disable();
        this.parsingForm.controls.mood.disable();
        this.parsingForm.controls.gender.disable();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.words = this.state.getWordsForParsing();
    this.word = this.words[this.randomIntFromInterval(0, this.words.length)];
    this.usedWords.push(this.word);
    this.wordIndex++;

    if (this.word == null) {
      this.router.navigate(['']);
    }
  }

  @HostListener('window:keyup', ['$event'])
  nextWordThroughKeyboard($event: KeyboardEvent): void {
    if ($event.code === 'ArrowRight') {
      this.nextWord();
    }
  }
}
