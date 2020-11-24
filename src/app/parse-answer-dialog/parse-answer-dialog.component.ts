import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Word} from '../models/word';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {WordPart} from '../models/word-part';
import {StateService} from '../state.service';
import {HintsHelper} from '../etc/hints-helper';

@Component({
  selector: 'app-parse-answer-dialog',
  templateUrl: './parse-answer-dialog.component.html',
  styleUrls: ['./parse-answer-dialog.component.css']
})
export class ParseAnswerDialogComponent {

  currentWord: Word;
  givenAnswer: WordPart[];
  answerIsRight: boolean;
  morphologyGenerator = MorphologyGenerator;
  dontShowTheAnswer = true;
  dontShowTheHint = true;
  nextWordMethod: () => void;
  hasNextWord: boolean;
  hintRightPartOfAnswer: WordPart;
  hintWrongPartOfAnswer: WordPart;

  correctedAnswer: boolean;
  useAllPronouns: boolean;
  secondaryTenses: boolean;

  constructor(private dialogRef: MatDialogRef<ParseAnswerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
    this.currentWord = data.currentWord;
    this.givenAnswer = data.givenAnswer;
    this.answerIsRight = data.answerIsRight;
    this.nextWordMethod = data.nextWordMethod;
    this.hasNextWord = data.hasNextWord;
    this.correctedAnswer = data.correctedAnswer;
    this.useAllPronouns = data.useAllPronouns;
    this.secondaryTenses = data.secondaryTenses;

    this.generateHints();
  }

  goToNextWord(): any {
    this.dialogRef.close();
    this.nextWordMethod();
  }

  private generateHints(): void {
    if (!this.answerIsRight) {
      this.hintRightPartOfAnswer = HintsHelper.giveMeRightPartHint(this.currentWord, this.givenAnswer, this.secondaryTenses, this.useAllPronouns);
      if (this.hintRightPartOfAnswer === undefined) { // the word does not have X type
        this.hintWrongPartOfAnswer = HintsHelper.giveMeWrongPartHint(this.currentWord, this.givenAnswer);
      }
    }
  }
}
