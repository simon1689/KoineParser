import {WordPart} from './models/word-part';
import * as __ from 'lodash-es';
import {allTenses, allTypesOfPronouns} from './etc/word-type-constants';

export class Comparable {
  public secondaryTenses = false;
  public useAllPronouns = false;

  constructor() {
  }

  public customEqualsComparable(wordPartsOfSpeech: WordPart[], givenAnswer: WordPart[]): boolean {
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
            if (this.secondaryTenses === true && wordPartsOfSpeech[i].type === 'Verb') {
              if (wordPartsOfSpeech[i].headCategory !== undefined && !allTenses.includes(wordPartsOfSpeech[i])) {
                if (!__.isEqual(wordPartsOfSpeech[i].headCategory, givenAnswer[i])) {
                  return false;
                }
              }
            } else if (this.useAllPronouns === true && wordPartsOfSpeech[i].type === 'Type') {
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
}
