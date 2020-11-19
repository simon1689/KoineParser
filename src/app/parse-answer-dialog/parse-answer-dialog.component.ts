import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WordModel} from '../models/word.model';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {WordPart} from '../models/word-part';
import * as  __ from 'lodash-es';
import {StateService} from '../state.service';
import {allSuffixes, allTenses, allTypesOfPronouns, WordParts} from '../etc/word-type-constants';

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
  useAllPronouns: boolean;

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
    this.useAllPronouns = data.useAllPronouns;

    this.generateHints();
  }

  goToNextWord(): any {
    this.dialogRef.close();
    this.nextWordMethod();
  }

  private generateHints(): void {
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

      partOfTheRightAnswer = partOfTheRightAnswer.filter(x => !allSuffixes.includes(x));
      if (partOfTheRightAnswer.length === 0) {
        wrongPartsOfGivenAnswer = __.differenceWith(this.givenAnswer, this.currentWord.partsOfSpeech, __.isEqual);
        if (this.useAllPronouns) {
          const foundType = wrongPartsOfGivenAnswer.find(x => x.type === WordParts.type);
          // pronoun is found as part of wrong answer
          if (foundType !== undefined && allTypesOfPronouns.find(x => __.isEqual(x, foundType)) !== undefined) {
            const type = this.currentWord.partsOfSpeech.find(x => x.type === WordParts.type);
            type.headCategory = undefined;
            this.hintRightPartOfAnswer = type;
          }
        } else {
          this.hintWrongPartOfAnswer = __.sample(wrongPartsOfGivenAnswer);
        }
      } else {
        if (partOfTheRightAnswer.find(x => x.type === WordParts.type) !== undefined) {
          this.hintRightPartOfAnswer = partOfTheRightAnswer.find(x => x.type === WordParts.type);
        } else {
          this.hintRightPartOfAnswer = __.sample(partOfTheRightAnswer);
        }
      }
    }
  }
}
