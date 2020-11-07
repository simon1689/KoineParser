import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordModel} from '../models/word.model';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {WordPart} from '../models/word-part';
import * as  __ from 'lodash-es';
import {StateService} from '../state.service';
import {allTenses} from '../etc/word-type-constants';

@Component({
  selector: 'app-parse-answer-dialog',
  templateUrl: './parse-answer-dialog.component.html',
  styleUrls: ['./parse-answer-dialog.component.css']
})
export class ParseAnswerDialogComponent {

  currentWord: WordModel;
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

  constructor(private dialogRef: MatDialogRef<ParseAnswerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private state: StateService) {
    this.data = data;
    this.currentWord = data.currentWord;
    this.givenAnswer = data.givenAnswer;
    this.answerIsRight = data.answerIsRight;
    this.nextWordMethod = data.nextWordMethod;
    this.hasNextWord = data.hasNextWord;
    this.correctedAnswer = data.correctedAnswer;

    let partOfTheRightAnswer: WordPart[] = null;
    let wrongPartsOfGivenAnswer: WordPart[] = null;
    if (!this.answerIsRight) {
      if (this.state.getSecondaryTensesEnabled()) {
        partOfTheRightAnswer = this.currentWord.partsOfSpeech.filter(x => {
          return !this.givenAnswer.map(y => y.name).includes(x.headCategory !== undefined && !allTenses.includes(x)
            ? x.headCategory.name
            : x.name);
        });
      } else {
        partOfTheRightAnswer = this.currentWord.partsOfSpeech.filter(x => {
          return !this.givenAnswer.map(y => y.name).includes(x.headCategory !== undefined
            ? x.headCategory.name
            : x.name);
        });
      }

      if (partOfTheRightAnswer.length === 0) {
        wrongPartsOfGivenAnswer = __.differenceWith(this.givenAnswer, this.currentWord.partsOfSpeech, __.isEqual);
        this.hintWrongPartOfAnswer = __.sample(wrongPartsOfGivenAnswer);
      } else {
        this.hintRightPartOfAnswer = __.sample(partOfTheRightAnswer);
      }
    }
  }

  goToNextWord(): any {
    this.dialogRef.close();
    this.nextWordMethod();
  }
}
