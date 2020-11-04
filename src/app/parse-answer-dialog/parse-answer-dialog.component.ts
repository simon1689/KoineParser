import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordModel} from '../word.model';
import {MorphologyGenerator} from '../morphologyGenerator';
import {WordPart} from '../wordPart';
import * as  __ from 'lodash-es';

@Component({
  selector: 'app-parse-answer-dialog',
  templateUrl: './parse-answer-dialog.component.html',
  styleUrls: ['./parse-answer-dialog.component.css']
})
export class ParseAnswerDialogComponent {

  dialog: MatDialogRef<ParseAnswerDialogComponent> = null;
  currentWord: WordModel;
  givenAnswer: WordPart[];
  answerIsRight: boolean;
  morphologyGenerator = MorphologyGenerator;
  dontShowTheAnswer = true;
  dontShowTheHint = true;
  nextWordMethod: () => void;
  hasNextWord: boolean;
  hint: WordPart;
  correctedAnswer: boolean;

  constructor(dialogRef: MatDialogRef<ParseAnswerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
    this.currentWord = data.currentWord;
    this.givenAnswer = data.givenAnswer;
    this.answerIsRight = data.answerIsRight;
    this.dialog = dialogRef;
    this.nextWordMethod = data.nextWordMethod;
    this.hasNextWord = data.hasNextWord;
    this.correctedAnswer = data.correctedAnswer;
    this.hint = __.sample(this.currentWord.partsOfSpeech.filter(x => !this.givenAnswer.includes(x)));
  }

  goToNextWord(): any {
    this.dialog.close();
    this.nextWordMethod();
  }
}
