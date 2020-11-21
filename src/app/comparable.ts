import {WordPart} from './models/word-part';
import * as __ from 'lodash-es';
import {allSuffixes, noStatedTense, WordParts} from './etc/word-type-constants';
import {WordModel} from './models/word.model';
import {ParseComponent} from './parse/parse.component';
import {MorphologyGenerator} from './etc/morphology-generator';
import {ParseAnswerDialogComponent} from './parse-answer-dialog/parse-answer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {StateService} from './state.service';
import {KoineParserService} from './koine-parser.service';
import {Paradigm} from './paradigms/paradigm';

export class AnswerChecked {
  answer: boolean;
  correctedAnswer: boolean;
  answerParts: WordPart[];

  constructor(answer: boolean, answerParts: WordPart[], correctedAnswer: boolean = false) {
    this.answer = answer;
    this.answerParts = answerParts;
    this.correctedAnswer = correctedAnswer;
  }
}

export class Comparable {
  public secondaryTenses = false;
  public useAllPronouns = false;

  private component: ParseComponent;

  constructor(private dialog: MatDialog,
              private state: StateService,
              private service: KoineParserService) {
  }

  public async checkAnswer(word: WordModel, answerParts: WordPart[], component: ParseComponent): Promise<AnswerChecked> {
    this.component = component;
    const wordPartsOfSpeech = word.partsOfSpeech.filter(x => !allSuffixes.includes(x) && x !== noStatedTense);
    const answerMorphologyCode = MorphologyGenerator.generateMorphologyCodeFromWordParts(answerParts);

    if (this.answerEqualsComparable(wordPartsOfSpeech, answerParts)) {
      return this.registerAnswer(word, answerParts, true);
    } else {
      // first check if answer is found in the multiple word endings
      const multipleWordEndings = Paradigm.alternateParadigmsGiveWordParts(word.morphologyUpdated);
      if (multipleWordEndings !== null) {
        for (const wordParts of multipleWordEndings) {
          if (this.answerEqualsComparable(wordParts, answerParts) === true) {
            return this.registerAnswer(word, answerParts, true);
          }
        }
      }

      // check if the word has multiple morphologies
      const multipleMorphologies = await this.getMultipleMorphologiesForWord(word).then(x => x);
      if (multipleMorphologies.find(x => x === word.morphology) !== undefined) {
        if (multipleMorphologies.includes(answerMorphologyCode)) {
          return this.registerAnswer(word, answerParts, true);
        } else { // if the answer is wrong after checking multiple morphologies
          component.wrongAnswerObject = {word, given_answer: answerMorphologyCode};
          return this.registerAnswer(word, answerParts, false);
        }
      } else {
        // if the last given answer is the same as the current, then do nothing
        if (__.last(component.wrongAnswers) !== undefined
          && __.last(component.wrongAnswers).given_answer === answerMorphologyCode
          && __.isEqual(__.last(component.wrongAnswers).word, word)) {
          return new AnswerChecked(false, answerParts);
        }

        component.wrongAnswerObject = {word, given_answer: answerMorphologyCode};
        return this.registerAnswer(word, answerParts, false);
      }
    }
  }

  private answerEqualsComparable(wordPartsOfSpeech: WordPart[], givenAnswer: WordPart[]): boolean {
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
      // first check whether they're the same
      if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {

        // if they are not the same, then check the headCategories
        if (wordPartsOfSpeech[i].headCategory !== undefined) {
          try {
            if (this.secondaryTenses && wordPartsOfSpeech[i].type === WordParts.tense) {
              if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {
                return false;
              }
            } else if (this.useAllPronouns && wordPartsOfSpeech[i].type === WordParts.type) {
              if (!__.isEqual(wordPartsOfSpeech[i], givenAnswer[i])) {
                return false;
              }
            } else {
              if (!__.isEqual(wordPartsOfSpeech[i].headCategory, givenAnswer[i])) {
                return false;
              }
            }
          } catch (e) {
            return false;
          }
        } else { // if the objects are not equal and the partsOfSpeech of the word doesn't have a category, then it's a wrong answer
          return false;
        }
      }
    }

    return true;
  }

  private getMultipleMorphologiesForWord(word: WordModel): Promise<string[]> {
    let result: string[] = [];
    return this.service.multipleMorphologiesForWord()
      .then(response => {
        const wordsWithMultipleMorphologies = __.filter(response, x =>
          x.word.toLowerCase() === word.word.toLowerCase() && word.strongsNr === x.strongs);

        return result = wordsWithMultipleMorphologies.map(x => x.morphology);
      });
  }

  private registerAnswer(word: WordModel, answerParts: WordPart[], answer: boolean): AnswerChecked {
    if (answer) {
      // if answer is given for the first time
      if (this.component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined
        && this.component.goodAnswers.find(w => __.isEqual(w, word)) === undefined) {
        this.component.goodAnswers.push(word);
        return new AnswerChecked(true, answerParts);
      } else if (this.component.wrongAnswers.find(x => __.isEqual(x.word, word)) !== undefined) {
        return new AnswerChecked(true, answerParts, true);
      }
    } else {
      if (this.component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined) {
        this.component.wrongAnswers.push(this.component.wrongAnswerObject);
        return new AnswerChecked(false, answerParts);
      }   // if the answer is wrong and given for the first time, then register it
      else if (this.component.goodAnswers.find(x => __.isEqual(x, word)) === undefined &&
        this.component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined) {
        this.component.wrongAnswers.push(this.component.wrongAnswerObject);
        return new AnswerChecked(false, answerParts);
      } else {
        return new AnswerChecked(false, answerParts);
      }
    }
  }

  openDialog(answer: AnswerChecked): void {
    this.dialog.open(ParseAnswerDialogComponent, {
      data: {
        givenAnswer: answer.answerParts,
        currentWord: this.component.word,
        answerIsRight: answer.answer,
        nextWordMethod: () => this.component.nextWord(),
        hasNextWord: this.component.wordIndex >= this.component.words.length,
        correctedAnswer: answer.correctedAnswer,
        useAllPronouns: this.useAllPronouns,
        secondaryTenses: this.secondaryTenses
      },
    });
  }
}
