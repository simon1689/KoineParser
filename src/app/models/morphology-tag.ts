import {WordPart} from './word-part';
import {MorphologyGenerator} from '../etc/morphology-generator';

export class MorphologyTag {
  partsOfSpeech: WordPart[];
  code: string;

  constructor(parts: WordPart[]) {
    this.partsOfSpeech = parts;
    this.code = MorphologyGenerator.generateMorphologyCodeFromWordParts(parts);
  }
}
