import {WordPart} from '../models/word-part';
import {
  activeVoice,
  aoristTense, futureTense,
  indicativeMood,
  middleVoice,
  passiveVoice,
  presentTense,
  secondPerson,
  singularNumber,
  subjunctiveMood,
  thirdPerson,
  verb
} from '../etc/word-type-constants';

interface EndingsParadigms {
  endings: string[];
  paradigms: any[];
  notPrecededBy?: string[];
  irregularWords?: string[];
}

export class Paradigm {

  public partsOfSpeech: WordPart[];
  public endings: string[];
  public notPrecededBy: string[];

  constructor(partsOfSpeech: WordPart[], notPrecededBy: string[], endings: string[]) {
    this.partsOfSpeech = partsOfSpeech;
    this.endings = endings;
    this.notPrecededBy = endings;
  }

  public static giveMeParadigms(word: string): WordPart[] {
    const lastTwoCharacters = word.substr(word.length - 2).toLowerCase();
    const lastCharacter = word.substr(word.length - 1).toLowerCase();

    const irregularWords = ['μείνῃ', 'ἄρῃ', 'ἀποστείλῃ', 'γήμῃ']; // V-AAS-3S
    if (this.endingInSigmaEtaSubscript().endings.includes(lastTwoCharacters)) {
      return this.endingInSigmaEtaSubscript().paradigms;
    } else if (this.endingInEtaSubscript().endings.includes(lastCharacter)) {
      return this.endingInEtaSubscript().paradigms;
    }

    return null;
  }

  // #########################
  // λύῃ
  public static endingInEtaSubscript(): EndingsParadigms {
    return {
      notPrecededBy: ['σῃ', 'ξῃ', 'ψῃ'],
      endings: ['ῃ'],
      paradigms: [this.V_PPI_2S(), this.V_PMI_2S(), this.V_PMS_2S(), this.V_PAS_3S()]
    };
  }

  private static V_PPI_2S(): WordPart[] {
    return [verb, presentTense, passiveVoice, indicativeMood, secondPerson, singularNumber];
  }

  private static V_PMI_2S(): WordPart[] {
    return [verb, presentTense, middleVoice, indicativeMood, secondPerson, singularNumber];
  }

  private static V_PMS_2S(): WordPart[] {
    return [verb, presentTense, middleVoice, subjunctiveMood, secondPerson, singularNumber];
  }

  private static V_PAS_3S(): WordPart[] {
    return [verb, presentTense, activeVoice, subjunctiveMood, thirdPerson, singularNumber];
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // #########################
  // λύσῃ
  public static endingInSigmaEtaSubscript(): EndingsParadigms {
    return {
      endings: ['σῃ', 'ξῃ', 'ψῃ'],
      paradigms: [this.V_AAS_3S(), this.V_FPI_2S()]
    };
  }

  private static V_AAS_3S(): WordPart[] {
    return [verb, aoristTense, activeVoice, subjunctiveMood, thirdPerson, singularNumber];
  }

  private static V_FPI_2S(): WordPart[] {
    return [verb, futureTense, passiveVoice, indicativeMood, secondPerson, singularNumber];
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
