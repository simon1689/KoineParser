import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../models/part-of-speech-objects';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WordModel} from '../models/word.model';
import {StateService} from '../state.service';
import {faExclamationCircle, faForward, faThumbsDown, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {WordPart} from '../models/word-part';
import {
  adjective,
  adverb,
  allWordParts,
  article,
  conditionalType,
  conjunction,
  infinitiveMood,
  noStatedTense,
  noun,
  participleMood,
  particleType,
  personalPronoun,
  possessivePronoun,
  preposition,
  reflexivePronoun,
  verb
} from '../etc/word-type-constants';
import {KoineParserService} from '../koine-parser.service';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {MatStepper} from '@angular/material/stepper';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ReportErrorOnPageDialogComponent} from '../report-error-on-page/report-error-on-page-dialog.component';
import {LocalStorageSession} from '../models/local-storage-session';
import {Score} from '../models/score';
import {AnswerChecked, Comparable} from '../comparable';

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

  // view children
  @ViewChild('mainContent') mainContent: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;
  @ViewChild('answerExpansionPanel') answerExpansionPanel: MatExpansionPanel;

  // stepper stuff
  tenseStep;
  voiceStep;
  moodStep;
  personStep;
  caseGenderNumberStep;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService,
              private service: KoineParserService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initForm();

    if (this.state.getCurrentSession()) {
      this.setCurrentSession();
    } else {
      this.startRoute();
      // this.testRoute();
    }

    this.determineSecondaryTenses();
    this.determineUsingAllPronouns();
  }

  startRoute(): void {
    this.words = this.state.getWordsForParsing();
    this.goToNextWord(this.usedWords);

    if (this.word == null) {
      this.router.navigate(['']);
    }
  }

  // for testing cases received from the report form
  testRoute(): void {
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
    this.state.bibleReference = data.range;
    this.state.setSecondaryTensesEnabled(data.secondaryTensesEnabled);
    this.state.setUseAllPronouns(data.useAllPronouns);
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
      const answerParts = this.formulateAnswerParts().filter(x => x !== noStatedTense);

      if (answerParts === undefined || answerParts.length > 0) {
        this.currentWordIsUnanswered = false;
        const comparable = new Comparable(this.dialog, this.state, this.service);
        comparable.secondaryTenses = this.state.getSecondaryTensesEnabled();
        comparable.useAllPronouns = this.state.getUseAllPronouns();

        const answer: AnswerChecked = await comparable.checkAnswer(this.word, answerParts, this);
        comparable.openDialog(answer);

        if (this.wordIndex === this.words.length) {
          this.registerScores();
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
        answerParts.push(allWordParts.find(x => x.abbreviation === control.value && x.type.toLowerCase() === part.toLowerCase()));
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

  determineAvailableControlsWhenTypeIsSelected(): void {
    this.parsingForm.enable();
    this.initializeStepsVariables();

    switch (this.parsingForm.controls.type.value) {
      case verb.abbreviation:
        this.parsingForm.controls.case.disable();
        this.parsingForm.controls.gender.disable();
        this.goToStep(this.tenseStep);
        break;
      case noun.abbreviation:
      case article.abbreviation:
      case adjective.abbreviation:
        this.parsingForm.controls.tense.disable();
        this.parsingForm.controls.voice.disable();
        this.parsingForm.controls.mood.disable();
        this.parsingForm.controls.person.disable();
        this.goToStep(this.caseGenderNumberStep);
        break;

      case conjunction.abbreviation:
      case adverb.abbreviation:
      case preposition.abbreviation:
      case conditionalType.abbreviation:
      case particleType.abbreviation:
        this.parsingForm.disable();
        this.parsingForm.controls.type.enable();
        break;

      default:
        if (this.state.getUseAllPronouns() === true) {
          const value = this.parsingForm.controls.type.value;
          if (value === possessivePronoun.abbreviation
            || value === reflexivePronoun.abbreviation
            || value === personalPronoun.abbreviation) {
            this.parsingForm.controls.tense.disable();
            this.parsingForm.controls.voice.disable();
            this.parsingForm.controls.mood.disable();
            this.goToStep(this.personStep);
          } else { // no person is needed
            this.parsingForm.controls.tense.disable();
            this.parsingForm.controls.voice.disable();
            this.parsingForm.controls.mood.disable();
            this.parsingForm.controls.person.disable();
            this.goToStep(this.caseGenderNumberStep);
          }
        } else {
          this.parsingForm.controls.tense.disable();
          this.parsingForm.controls.voice.disable();
          this.parsingForm.controls.mood.disable();
          this.goToStep(this.personStep);
        }

        break;
    }
  }

  determineAvailableControlsWhenMoodIsSelected(): void {
    this.initializeStepsVariables();

    if (this.parsingForm.controls.mood.value === participleMood.abbreviation) {
      this.parsingForm.controls.person.disable();
      this.parsingForm.controls.case.enable();
      this.parsingForm.controls.gender.enable();
      this.parsingForm.controls.number.enable();
      this.goToStep(this.caseGenderNumberStep);
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
      this.goToStep(this.personStep);
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
      this.verbTenses = this.verbTenses.filter(x => !x.secondary);
    }
  }

  determineUsingAllPronouns(): void {
    if (this.state.getUseAllPronouns()) {
      this.types = Types.filter(x => x.wordPart === personalPronoun ? x.name = 'Personal pronoun' : x);
    } else {
      this.types = Types.filter(x => !x.secondary);
    }
  }

  saveSession(): void {
    const session: LocalStorageSession = {
      words: this.words,
      wordIndex: this.wordIndex,
      currentWord: this.word,
      date: new Date().toDateString(),
      range: this.state.getBibleReference().toString(),
      goodAnswers: this.goodAnswers,
      wrongAnswers: this.wrongAnswers,
      skippedWords: this.skippedWords,
      usedWords: this.usedWords,
      key: this.state.getBibleReference().toString() + ' ' + new Date().toDateString(),
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

  registerScores(): void {
    const score: Score = {
      date: new Date(),
      wrongAnswers: this.wrongAnswers.length,
      range: this.state.getBibleReference().toString(),
      numberOfWords: this.words.length,
      goodAnswers: this.goodAnswers.length,
      skippedWords: this.skippedWords.length
    };

    if ('scores' in localStorage) {
      const scoresFromLocalStorage: Score[] = JSON.parse(localStorage.getItem('scores'));
      scoresFromLocalStorage.push(score);
      localStorage.setItem('scores', JSON.stringify(scoresFromLocalStorage));
    } else {
      const scores: Score[] = [score];
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }

  initializeStepsVariables(): void {
    this.tenseStep = this.stepper.steps.find(x => x.label === 'Tense');
    this.voiceStep = this.stepper.steps.find(x => x.label === 'Voice');
    this.moodStep = this.stepper.steps.find(x => x.label === 'Mood');
    this.personStep = this.stepper.steps.find(x => x.label === 'Person');
    this.caseGenderNumberStep = this.stepper.steps.find(x => x.label === 'Case, gender, number');
  }

  goToStep(tenseStep: any): void {
    this.stepper.selectedIndex = this.stepper.steps.toArray().indexOf(tenseStep);
  }
}
