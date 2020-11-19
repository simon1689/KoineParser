import {WordPart} from './models/word-part';
import * as __ from 'lodash-es';
import {allSuffixes, allTenses, noStatedTense, WordParts} from './etc/word-type-constants';
import {WordModel} from './models/word.model';
import {ParseComponent} from './parse/parse.component';
import {MorphologyGenerator} from './etc/morphology-generator';
import {ParseAnswerDialogComponent} from './parse-answer-dialog/parse-answer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {StateService} from './state.service';
import {KoineParserService} from './koine-parser.service';

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
      // if answer is given for the first time
      if (component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined
        && component.goodAnswers.find(w => __.isEqual(w, word)) === undefined) {
        component.goodAnswers.push(word);
        return new AnswerChecked(true, answerParts);
      } else {
        return new AnswerChecked(true, answerParts, true);
      }
    } else {
      // check if the word has multiple morphologies
      const multipleMorphologies = await this.getMultipleMorphologiesForWord(word).then(x => x);
      if (multipleMorphologies.find(x => x === word.morphology) !== undefined) {
        if (multipleMorphologies.includes(answerMorphologyCode)) {
          // do not accept the right answer after a wrong answer
          if (component.wrongAnswers.find(x => __.isEqual(x.word, word)) !== undefined) {
            return new AnswerChecked(true, answerParts, true);
          }

          // accept right answer if the word has not been answered
          else if (component.goodAnswers.find(x => __.isEqual(x, word)) === undefined
            && component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined) {
            component.goodAnswers.push(word);
            return new AnswerChecked(true, answerParts);
          }
        } else { // if the answer is wrong after checking multiple morphologies
          component.wrongAnswerObject = {word, given_answer: answerMorphologyCode};
          if (component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined) {
            component.wrongAnswers.push(component.wrongAnswerObject);
            return new AnswerChecked(false, answerParts);
          } else { // if another wrong answer is given
            return new AnswerChecked(false, answerParts);
          }
        }
      } else {
        // if the last given answer is the same as the current, then do nothing
        if (__.last(component.wrongAnswers) !== undefined
          && __.last(component.wrongAnswers).given_answer === answerMorphologyCode
          && __.isEqual(__.last(component.wrongAnswers).word, word)) {
          return;
        }

        // if the answer is wrong and given for the first time, then register it
        if (component.goodAnswers.find(x => __.isEqual(x, word)) === undefined &&
          component.wrongAnswers.find(x => __.isEqual(x.word, word)) === undefined) {

          component.wrongAnswerObject = {word, given_answer: answerMorphologyCode};
          component.wrongAnswers.push(component.wrongAnswerObject);
          return new AnswerChecked(false, answerParts);
        } else {
          return new AnswerChecked(false, answerParts);
        }
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
            if (this.secondaryTenses && wordPartsOfSpeech[i].type === 'Verb') {
              if (wordPartsOfSpeech[i].headCategory !== undefined && !allTenses.includes(wordPartsOfSpeech[i])) {
                if (!__.isEqual(wordPartsOfSpeech[i].headCategory, givenAnswer[i])) {
                  return false;
                }
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

  openDialog(answer: AnswerChecked): void {
    this.dialog.open(ParseAnswerDialogComponent, {
      data: {
        givenAnswer: answer.answerParts,
        currentWord: this.component.word,
        answerIsRight: answer.answer,
        nextWordMethod: () => this.component.nextWord(),
        hasNextWord: this.component.wordIndex >= this.component.words.length,
        correctedAnswer: answer.correctedAnswer,
        useAllPronouns: this.state.getUseAllPronouns()
      },
    });
  }
}
