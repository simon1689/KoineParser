import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Genders, Moods, NounCases, Numbers, Persons, Types, VerbTenses, Voices} from '../models/part-of-speech-objects';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Word} from '../models/word';
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
import {AnswerChecked, Comparable} from '../comparable';
import {Helper} from '../etc/helper';
import {SessionsComponent} from '../sessions/sessions.component';
import {Title} from '@angular/platform-browser';
import {BibleReference} from '../models/bible-reference';

export interface WrongAnswer {
  word: Word;
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
  word: Word = null;
  words: Word[] = [];
  usedWords: Word[] = [];
  goodAnswers: Word[] = [];
  skippedWords: Word[] = [];
  wrongAnswers: WrongAnswer[] = [];
  wrongAnswerObject: WrongAnswer;
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

  helper = Helper;
  sessions = SessionsComponent;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              public state: StateService,
              private service: KoineParserService,
              private dialog: MatDialog,
              private titleService: Title) {
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
    if (this.state.getBibleReference() === undefined) {
      this.titleService.setTitle('KoineParser');
    } else {
      this.titleService.setTitle(this.state.getBibleReference().toString() + ' - KoineParser');
    }
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
    this.words = [];
    data.words.forEach(x => {
      const model = new Word();
      this.words.push(Object.assign(model, x));
    });

    this.wordIndex = data.wordIndex;
    this.word = this.words[data.wordIndex - 1];

    const bibleReference = JSON.parse(data.range) as BibleReference;
    this.state.setBibleReference(new BibleReference(bibleReference.bibleBook.number, bibleReference.beginningChapter,
      bibleReference.beginningVerse, bibleReference.endingChapter, bibleReference.endingVerse));
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

  private goToNextWord(wordShouldBeAddedHere: Word[], reset: boolean = false): void {
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
        const comparable = new Comparable(this.dialog, this.state.getSecondaryTensesEnabled(), this.state.getUseAllPronouns());
        const answer: AnswerChecked = await comparable.checkAnswer(this.word, answerParts, this);
        if (answer !== undefined) {
          comparable.openDialog(answer);
        }

        if (this.wordIndex === this.words.length) {
          this.helper.registerScores(this);
        }
      }
    }
  }

  formulateAnswerParts(): WordPart[] {
    this.answer = '';
    const partsOfSpeech: string[] = ['type', 'tense', 'voice', 'mood', 'person', 'case', 'number', 'gender'];
    const answerParts: WordPart[] = [];
    for (const part of partsOfSpeech) {
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

  linkToParadigm(morphology: string): string {
    if (morphology.startsWith('V-')) {
      let result;
      if (morphology.match(/-/g).length > 1) {
        let shortenedMorph;

        let encounteredDash = 0;
        for (let i = 0; i < morphology.length; i++) {
          if (morphology[i] === '-' && encounteredDash === 1) {
            shortenedMorph = morphology.slice(0, i);
          } else if (morphology[i] === '-') {
            encounteredDash++;
          }
        }

        result = shortenedMorph;
      } else {
        if (morphology[morphology.length - 1] === infinitiveMood.abbreviation) {
          result = 'inf';
        } else {
          result = morphology;
        }
      }

      return '<a href=\'/paradigms#' + result + '\' target=\'_blank\' title="See the full paradigm">' + morphology + '</a>';
    } else if (morphology.startsWith('N-')) {
      return '<a href=\'/paradigms#' + 'nouns' + '\' target=\'_blank\' title="See the full paradigm">' + morphology + '</a>';
    } else {
      return morphology;
    }
  }
}
