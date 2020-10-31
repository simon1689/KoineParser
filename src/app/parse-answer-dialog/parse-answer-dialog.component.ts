import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordModel} from '../word.model';
import {MorphologyGenerator} from '../morphologyGenerator';

@Component({
  selector: 'app-parse-answer-dialog',
  templateUrl: './parse-answer-dialog.component.html',
  styleUrls: ['./parse-answer-dialog.component.css']
})
export class ParseAnswerDialogComponent {

  dialog: MatDialogRef<ParseAnswerDialogComponent> = null;
  currentWord: WordModel;
  givenAnswer: string;
  answerIsRight: boolean;
  morphologyGenerator = MorphologyGenerator;
  dontShowTheAnswer = true;
  nextWordMethod: () => void;
  hasNextWord: boolean;

  constructor(dialogRef: MatDialogRef<ParseAnswerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
    this.currentWord = data.currentWord;
    this.givenAnswer = data.givenAnswer;
    this.answerIsRight = data.answerIsRight;
    this.dialog = dialogRef;
    this.nextWordMethod = data.nextWordMethod;
    this.hasNextWord = data.hasNextWord;

    console.log(data);
  }

  goToNextWord(): any {
    this.dialog.close();
    this.nextWordMethod();
  }
}
