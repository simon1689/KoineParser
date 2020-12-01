import {allTenses, allTypesOfPronouns, personalPronoun, WordParts} from './word-type-constants';
import {WordPart} from '../models/word-part';
import {Word} from '../models/word';
import * as __ from 'lodash-es';
import {MorphologyGenerator} from './morphology-generator';
import {closest} from 'fastest-levenshtein';
import {MorphologyTag} from '../models/morphology-tag';

export class HintsHelper {

  public static giveMeWrongPartHint(word: Word, givenAnswer: WordPart[]): WordPart {
    const focusMorphology = this.closestWordPartsCollectionToAnswer(word.morphologyTags, givenAnswer);
    const doesNotHave = __.differenceWith(givenAnswer.map(x => x.type), focusMorphology.map(x => x.type), __.isEqual);

    return givenAnswer.find(x => x.type === doesNotHave[0]);
  }

  public static giveMeRightPartHint(word: Word, givenAnswer: WordPart[], secondaryTenses: boolean, useAllPronouns: boolean): WordPart {
    const focusMorphology = (word.morphologyTags.length > 1) ?
      this.closestWordPartsCollectionToAnswer(word.morphologyTags, givenAnswer) : word.primaryMorphologyTag.partsOfSpeech;
    let partOfTheRightAnswer: WordPart[] = __.differenceWith(focusMorphology, givenAnswer, __.isEqual);

    if (secondaryTenses) {
      partOfTheRightAnswer = focusMorphology.filter(x => {
        return !givenAnswer.map(y => y.name).includes(x.headCategory !== undefined && !allTenses.includes(x)
          ? x.headCategory.name
          : x.name);
      });

      partOfTheRightAnswer.forEach(x => x.type === WordParts.tense ? x.headCategory = undefined : x);
    }

    if (useAllPronouns) {
      partOfTheRightAnswer.filter(x => x.type === WordParts.type).forEach(x => {
        if (allTypesOfPronouns.includes(x)) {
          x.headCategory = undefined;
        }
        return x;
      });

      partOfTheRightAnswer.forEach(x => __.isEqual(x, personalPronoun) ? x.name = 'Personal pronoun' : x);
    }

    if (!useAllPronouns && !secondaryTenses) {
      partOfTheRightAnswer = focusMorphology.filter(x => {
        return !givenAnswer.map(y => y.name).includes(x.headCategory !== undefined
          ? x.headCategory.name
          : x.name);
      });
    }

    return this.giveMePriorityWordPart(partOfTheRightAnswer);
  }

  private static closestWordPartsCollectionToAnswer(morphologyTags: MorphologyTag[], givenAnswer: WordPart[]): WordPart[] {
    const givenAnswerCode = MorphologyGenerator.generateMorphologyCodeFromWordParts(givenAnswer);
    const rightAnswers = morphologyTags.map(x => x.code);

    return MorphologyGenerator.generateWordPartsFromMorphologyCode(closest(givenAnswerCode, rightAnswers));
  }

  private static giveMePriorityWordPart(parts: WordPart[]): WordPart {
    // 1 - type
    if (parts.find(x => x.type === WordParts.type)) {
      return parts.find(x => x.type === WordParts.type);
    }
    // 2 - tense
    else if (parts.find(x => x.type === WordParts.tense)) {
      return parts.find(x => x.type === WordParts.tense);
    }
    // 3 - voice
    else if (parts.find(x => x.type === WordParts.voice)) {
      return parts.find(x => x.type === WordParts.voice);
    }
    // 4 - mood
    else if (parts.find(x => x.type === WordParts.mood)) {
      return parts.find(x => x.type === WordParts.mood);
    } else {
      return __.sample(parts);
    }
  }
}
