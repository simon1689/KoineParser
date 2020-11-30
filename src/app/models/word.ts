import {LexiconEntry} from './lexicon.entry';
import {WordPart} from './word-part';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {atticSuffix, middleVoice, participleMood, passiveVoice, perfectTense, presentTense, verb, WordParts} from '../etc/word-type-constants';
import {multipleWordEndings} from '../paradigms/multiple-word-endings';

export class MultipleMorphologyWord {
  strongs: number;
  morphology: string;
  word: string;
}

export class Word {
  book: string;
  chapter: number;
  verse: number;
  morphology: string;
  morphologies: string[];
  strongsNr: number;
  word: string;
  lexiconEntry: LexiconEntry;
  wordComplete: string;
  possiblePartsOfSpeech: WordPart[][] = [];

  setAllPartsOfSpeech(mainMorphology: string): WordPart[][] {
    // main
    this.morphologies = [];
    this.possiblePartsOfSpeech.push(MorphologyGenerator.generateWordPartsFromMorphologyCode(mainMorphology));
    const morphologyCode = MorphologyGenerator.generateMorphologyCodeFromWordParts(this.possiblePartsOfSpeech[0].filter(x => x !== atticSuffix));

    // alternate paradigms
    const alternate: WordPart[][] = this.alternateMorphologyGiveWordParts(morphologyCode);
    if (alternate !== null) {
      alternate.forEach(x => {
        this.possiblePartsOfSpeech.push(x);
        // this.morphologies.push(MorphologyGenerator.generateMorphologyCodeFromWordParts(x));
      });
    }

    this.setMorphologiesForParticiples();
    this.updateMorphologyCodes();

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

  alternateMorphologyGiveWordParts(morphology: string): WordPart[][] {
    const result: WordPart[][] = [];
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

  private setMorphologiesForParticiples(): void {
    const toBeAdded: WordPart[][] = [];
    const partsOfSpeechWithParticiples = this.possiblePartsOfSpeech.filter(x => x.filter(y => y === participleMood));
    if (partsOfSpeechWithParticiples !== undefined) {
      for (const morph of partsOfSpeechWithParticiples) {
        if (morph.includes(presentTense) && morph.includes(middleVoice)) {
          toBeAdded.push([verb, presentTense, passiveVoice, participleMood,
            morph.find(x => x.type === WordParts.case),
            morph.find(x => x.type === WordParts.number),
            morph.find(x => x.type === WordParts.gender)]);
        } else if (morph.includes(presentTense) && morph.includes(passiveVoice)) {
          toBeAdded.push([verb, presentTense, middleVoice, participleMood,
            morph.find(x => x.type === WordParts.case),
            morph.find(x => x.type === WordParts.number),
            morph.find(x => x.type === WordParts.gender)]);
        } else if (morph.includes(perfectTense) && morph.includes(middleVoice)) {
          toBeAdded.push([verb, perfectTense, passiveVoice, participleMood,
            morph.find(x => x.type === WordParts.case),
            morph.find(x => x.type === WordParts.number),
            morph.find(x => x.type === WordParts.gender)]);
        } else if (morph.includes(perfectTense) && morph.includes(passiveVoice)) {
          toBeAdded.push([verb, perfectTense, middleVoice, participleMood,
            morph.find(x => x.type === WordParts.case),
            morph.find(x => x.type === WordParts.number),
            morph.find(x => x.type === WordParts.gender)]);
        }
      }
    }

    if (toBeAdded.length > 0) {
      toBeAdded.forEach(x => this.possiblePartsOfSpeech.push(x));
    }
  }

  updateMorphologyCodes(): void {
    this.morphologies = [];
    this.possiblePartsOfSpeech.forEach(x => this.morphologies.push(MorphologyGenerator.generateMorphologyCodeFromWordParts(x)));
  }
}
