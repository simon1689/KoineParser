import {WordPart} from '../models/word-part';
import {multipleWordEndings} from './multiple-word-endings';
import {MorphologyGenerator} from '../etc/morphology-generator';

export class Paradigm {

  public static alternateParadigmsGiveWordParts(morphology: string): [WordPart[]] {
    const result: [WordPart[]] = [[]];
    const search: string[] = multipleWordEndings[morphology];
    if (search !== undefined) {
      for (const morph of search) {
        result.push(MorphologyGenerator.generateWordPartsFromMorphologyCode(morph));
      }

      // @ts-ignore
      return result.filter(x => x.length !== 0);
    }

    return null;
  }

  public static alternateParadigms(morphology: string): any[] {
    const search: string[] = multipleWordEndings[morphology];
    if (search !== undefined) {
      return search;
    }

    return null;
  }
}
