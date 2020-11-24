import {LexiconEntry} from './lexicon.entry';
import {WordPart} from './word-part';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {Paradigm} from '../paradigms/paradigm';
import {atticSuffix} from '../etc/word-type-constants';

export class Word {
  book: string;
  chapter: number;
  // morphology: string;
  morphologies: string[];
  strongsNr: string;
  verse: number;
  word: string;
  lexiconEntry: LexiconEntry;
  wordComplete: string;
  possiblePartsOfSpeech: WordPart[][] = [];

  setAllPartsOfSpeech(mainMorphology: string): WordPart[][] {
    // main
    this.morphologies = [];
    this.possiblePartsOfSpeech.push(MorphologyGenerator.generateWordPartsFromMorphologyCode(mainMorphology));
    this.morphologies.push(MorphologyGenerator.generateMorphologyCodeFromWordParts(this.possiblePartsOfSpeech[0].filter(x => x !== atticSuffix)));

    // alternate paradigms
    const alternate: [WordPart[]] = Paradigm.alternateParadigmsGiveWordParts(this.morphologies[0]);
    if (alternate !== null) {
      alternate.forEach(x => {
        this.possiblePartsOfSpeech.push(x);
        this.morphologies.push(MorphologyGenerator.generateMorphologyCodeFromWordParts(x));
      });
    }

    return this.possiblePartsOfSpeech.filter(x => x.length !== 0);
  }

  setMultipleMorphologies(multipleMorphologies: MultipleMorphologyWord[]): void {
    if (multipleMorphologies.length > 0) {
      for (const morph of multipleMorphologies) {
        if (this.morphologies.find(x => x === morph.morphology) === undefined) {
          const parts = MorphologyGenerator.generateWordPartsFromMorphologyCode(morph.morphology);
          this.possiblePartsOfSpeech.push(parts);
          this.morphologies.push(MorphologyGenerator.generateMorphologyCodeFromWordParts(parts));
        }
      }
    }
  }
}

export class MultipleMorphologyWord {
  strongs: string;
  morphology: string;
  word: string;
}
