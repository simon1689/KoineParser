import {LexiconEntry} from './lexicon.entry';
import {WordPart} from './word-part';
import {MorphologyGenerator} from '../etc/morphology-generator';
import {atticSuffix, middleVoice, participleMood, passiveVoice, perfectTense, presentTense, PartsOfSpeech} from '../etc/word-type-constants';
import {multipleWordEndings} from '../paradigms/multiple-word-endings';
import {BibleReference} from './bible-reference';
import {MorphologyTag} from './morphology-tag';

export class MultipleMorphologyWord {
  strongs: number;
  morphology: string;
  word: string;
}

export class Word {
  book: string;
  chapter: number;
  verse: number;
  // morphology: string;
  strongsNr: number;
  word: string;
  lexiconEntry: LexiconEntry;
  wordComplete: string;
  morphologyTags: MorphologyTag[];
  reference: BibleReference;

  setAllPartsOfSpeech(mainMorphology: string): void {
    // main
    this.addWordPartsToMorphologyTag(MorphologyGenerator.generateWordPartsFromMorphologyCode(mainMorphology));
    const morphologyCode = MorphologyGenerator.generateMorphologyCodeFromWordParts(this.primaryMorphologyTag.partsOfSpeech.filter(x => x !== atticSuffix));

    // alternate paradigms
    const alternate: WordPart[][] = this.alternateMorphologyGiveWordParts(morphologyCode);
    if (alternate !== null) {
      alternate.forEach(x => {
        this.addWordPartsToMorphologyTag(x);
      });
    }

    this.setMiddlePassiveMorphologies();
  }

  setMultipleMorphologies(multipleMorphologies: MultipleMorphologyWord[]): void {
    if (multipleMorphologies.length > 0) {
      for (const morph of multipleMorphologies) {
        if (this.morphologyTags.find(x => x.code === morph.morphology) === undefined) {
          this.addWordPartsToMorphologyTag(MorphologyGenerator.generateWordPartsFromMorphologyCode(morph.morphology));
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

      return result.filter(x => x.length !== 0);
    }

    return null;
  }

  get primaryMorphologyTag(): MorphologyTag {
    if (this.morphologyTags !== undefined) {
      return this.morphologyTags[0];
    }

    return null;
  }

  private setMiddlePassiveMorphologies(): void {
    const toBeAdded: WordPart[][] = [];
    let newMorph: WordPart[] = null;
    const partsOfSpeechWithParticiples = this.morphologyTags.filter(x => x.partsOfSpeech.filter(y => y === participleMood)).map(x => x.partsOfSpeech);
    if (partsOfSpeechWithParticiples !== undefined) {
      for (const morph of partsOfSpeechWithParticiples) {
        if ((morph.includes(presentTense) || morph.includes(perfectTense)) && morph.includes(middleVoice)) {
          newMorph = morph.filter(x => x.type !== PartsOfSpeech.voice);
          newMorph.push(passiveVoice);
          toBeAdded.push(newMorph);
        } else if ((morph.includes(presentTense) || morph.includes(perfectTense)) && morph.includes(passiveVoice)) {
          newMorph = morph.filter(x => x.type !== PartsOfSpeech.voice);
          newMorph.push(middleVoice);
          toBeAdded.push(newMorph);
        }
      }
    }

    if (toBeAdded.length > 0) {
      toBeAdded.forEach(x => this.addWordPartsToMorphologyTag(x));
    }
  }

  private addWordPartsToMorphologyTag(parts: WordPart[]): void {
    if (this.morphologyTags === undefined) {
      this.morphologyTags = [];
    }

    this.morphologyTags.push(new MorphologyTag(parts));
  }
}
