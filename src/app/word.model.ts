import {Word, WordPerson} from './interfaces/word';
import {LexiconEntry} from './lexicon.entry';

export class WordModel implements Word {
  book: number;
  chapter: number;
  morphology: string;
  strongsNr: string;
  verse: number;
  word: string;
  occurrencesInRange: number;
  lexiconEntry: LexiconEntry;
  wordComplete: string;

  get partsOfSpeech(): WordPart[] {
    let result: WordPart[] = [];
    const splitValue = this.morphology.split('-');

    if (splitValue.length === 1) {
      switch (splitValue[0]) {
        case adverb.abbreviation:
          result.push(adverb);
          break;
        case conjunction.abbreviation:
          result.push(conjunction);
          break;
        case preposition.abbreviation:
          result.push(preposition);
          break;
        default:
          break;
      }
    } else if (splitValue.length === 2) { // nouns
      result = this.processTwoPartMorphology(splitValue);
    } else if (splitValue.length === 3) { // verbs
      result = this.processThreePartMorphology(splitValue);
    } else if (splitValue.length === 4) {
      if (splitValue[3] === attic.abbreviation) {
        result = this.processThreePartMorphology(splitValue);
        result.push(attic);
      }
    }

    console.log('result', result);
    return result;
  }

  processThreePartMorphology(splitValue: string[]): WordPart[] {
    let result: WordPart[] = [];

    for (let i = 0; i < 3; i++) {
      const part = splitValue[i];
      // first part
      if (i === 0) {
        result.push(this.processWordType(part));
      }

      // second part
      if (i === 1) {
        result = this.processVerbTenseVoiceMood(part, result);
      }

      // third part
      if (i === 2) {
        // person and number
        if (!isNaN((Number(part[0])))) {
          result.push(this.processPerson(part[0]));
          switch (part[1]) {
            case 'S':
              result.push(singular);
              break;
            case 'P':
              result.push(plural);
              break;
            default:
              break;
          }
          // for participles
        } else {
          result = this.processNounParts(part, result);
        }
      }
    }

    return result;
  }

  processNounParts(value: string, result: WordPart[]): WordPart[] {
    if (value.length === 3) {
      switch (value[0]) {
        case PartOfSpeechEnum.Nominative:
          result.push(nominative);
          break;
        case PartOfSpeechEnum.Genitive:
          result.push(genitive);
          break;
        case PartOfSpeechEnum.Dative:
          result.push(dative);
          break;
        case PartOfSpeechEnum.Accusative:
          result.push(accusative);
          break;
        case PartOfSpeechEnum.Vocative:
          result.push(vocative);
          break;
        default:
          break;
      }

      switch (value[1]) {
        case PartOfSpeechEnum.Singular:
          result.push(singular);
          break;
        case PartOfSpeechEnum.Plural:
          result.push(plural);
          break;
        default:
          break;
      }

      switch (value[2]) {
        case PartOfSpeechEnum.Masculine:
          result.push(masculine);
          break;
        case PartOfSpeechEnum.Feminine:
          result.push(feminine);
          break;
        case PartOfSpeechEnum.Neuter:
          result.push(neuter);
          break;
        default:
          break;
      }
    }

    return result;
  }

  processTwoPartMorphology(splitValue: string[]): WordPart[] {
    let result: WordPart[] = [];

    for (let i = 0; i < 2; i++) {
      const part = splitValue[i];

      if (i === 0) {
        result.push(this.processWordType(part));
      }

      if (i === 1) {
        if (result.includes(noun) || result.includes(article)
          || result.includes(relativePronoun) || result.includes(adjective)
          || result.includes(pronoun) || reciprocalPronoun) {
          result = this.processNounParts(part, result);
        } else if (part === infinitive.abbreviation) {
          result = this.processVerbTenseVoiceMood(part, result);
        } else if (result.includes(disjunctiveParticiple) && part === negativeSuffix.abbreviation) {
          result.push(negativeSuffix);
        } else if (part === possessivePronoun.abbreviation) {
          result.push(this.processPerson(part.substr(0, 1)));
          result = this.processNounParts(part.substr(1), result);
        }
      }
    }

    return result;
  }

  processWordType(part: string): WordPart {
    let result: WordPart;
    switch (part) {
      case noun.abbreviation:
        result = noun;
        break;
      case verb.abbreviation:
        result = verb;
        break;
      case adverb.abbreviation:
        result = adverb;
        break;
      case adjective.abbreviation:
        result = adjective;
        break;
      case conjunction.abbreviation:
        result = conjunction;
        break;
      case article.abbreviation:
        result = article;
        break;
      case pronoun.abbreviation:
        result = pronoun;
        break;
      case relativePronoun.abbreviation:
        result = relativePronoun;
        break;
      case disjunctiveParticiple.abbreviation:
        result = disjunctiveParticiple;
        break;
      case reciprocalPronoun.abbreviation:
        result = reciprocalPronoun;
        break;
      case possessivePronoun.abbreviation:
        result = possessivePronoun;
        break;
      default:
        break;
    }

    return result;
  }

  processVerbTenseVoiceMood(part: string, result: WordPart[]): WordPart[] {
    let secondaryTense: boolean;
    // tense
    if ((!isNaN((Number(part.substr(0, 1)))))) {
      secondaryTense = true;
      switch (part.substr(0, 2)) {
        case PartOfSpeechEnum.SecondAorist:
          result.push(secondAoristTense);
          break;
        case PartOfSpeechEnum.SecondPerfect:
          result.push(secondPerfect);
          break;
        case PartOfSpeechEnum.SecondPluperfect:
          result.push(secondPluperfect);
          break;
        default:
          break;
      }
    } else {
      switch (part.substr(0, 1)) {
        case PartOfSpeechEnum.Present:
          result.push(presentTense);
          break;
        case PartOfSpeechEnum.Future:
          result.push(futureTense);
          break;
        case PartOfSpeechEnum.Aorist:
          result.push(aoristTense);
          break;
        case PartOfSpeechEnum.Perfect:
          result.push(perfect);
          break;
        case PartOfSpeechEnum.Imperfect:
          result.push(imperfect);
          break;
        case PartOfSpeechEnum.Pluperfect:
          result.push(pluperfect);
          break;
      }
    }

    // voice
    const voicePart = part.substr(secondaryTense ? 2 : 1, 1);
    switch (voicePart) {
      case active.abbreviation:
        result.push(active);
        break;
      case middle.abbreviation:
        result.push(middle);
        break;
      case passive.abbreviation:
        result.push(passive);
        break;
      case deponent.abbreviation:
        result.push(deponent);
        break;
      case noVoice.abbreviation:
        result.push(noVoice);
        break;
      case middlePassiveDeponent.abbreviation:
        result.push(middlePassiveDeponent);
        break;
      case middlePassive.abbreviation:
        result.push(middlePassive);
        break;
      default:
        break;
    }

    // mood
    const moodPart = part.substr(secondaryTense ? 3 : 2, 1);
    switch (moodPart) {
      case PartOfSpeechEnum.Infinitive:
        result.push(infinitive);
        break;
      case PartOfSpeechEnum.Indicative:
        result.push(indicative);
        break;
      case PartOfSpeechEnum.Optative:
        result.push(optative);
        break;
      case PartOfSpeechEnum.Participle:
        result.push(participle);
        break;
      case PartOfSpeechEnum.Imperative:
        result.push(imperative);
        break;
      default:
        break;
    }

    return result;
  }


  processPerson(person: string): WordPart {
    if (!isNaN((Number(person)))) {
      switch (person) {
        case '1':
          return firstPerson;
        case '2':
          return secondPerson;
        case '3':
          return thirdPerson;
      }
    }

    return null;
  }
}

enum PartOfSpeechEnum {
  MiddlePassive = 'E',
  Attic = 'ATT',
  MiddlePassiveDeponent = 'N',
  RelativePronoun = 'R',
  Noun = 'N',
  Pronoun = 'P',
  Article = 'T',
  Adjective = 'A',
  Verb = 'V',
  Conjunction = 'CONJ',
  Preposition = 'PREP',

  // tense
  Present = 'P',
  Imperfect = 'I',
  Future = 'F',
  Aorist = 'A',
  SecondAorist = '2A',
  Perfect = 'R',
  FirstPerfect = '1R',
  SecondPerfect = '2R',
  Pluperfect = 'L',
  SecondPluperfect = '2L',

  // voice
  Active = 'A',
  Middle = 'M',
  Passive = 'P',
  Deponent = 'D',
  VoiceNone = 'X',

  // mood
  Indicative = 'I',
  Participle = 'P',
  Imperative = 'I',
  Subjunctive = 'S',
  Optative = 'O',
  Infinitive = 'N',


  First = 1,
  Second = 2,
  Third = 3,

  Singular = 'S',
  Plural = 'P',
  BothNumbers = 'X',

  Nominative = 'N',
  Genitive = 'G',
  Dative = 'D',
  Accusative = 'A',
  Vocative = 'V',

  Masculine = 'M',
  Feminine = 'F',
  Neuter = 'N'
}

export interface WordPart {
  abbreviation: string;
  name: string;
  enum?: PartOfSpeechEnum;
}

// type
const verb: WordPart = {name: 'Verb', abbreviation: 'V', enum: PartOfSpeechEnum.Verb};
const noun: WordPart = {name: 'Noun', abbreviation: 'N', enum: PartOfSpeechEnum.Verb};
const adverb: WordPart = {name: 'Adverb', abbreviation: 'ADV', enum: PartOfSpeechEnum.Verb};
const adjective: WordPart = {name: 'Adjective', abbreviation: 'A', enum: PartOfSpeechEnum.Adjective};
const article: WordPart = {name: 'Definite article', abbreviation: 'T', enum: PartOfSpeechEnum.Article};
const pronoun: WordPart = {name: 'Personal pronoun', abbreviation: 'P', enum: PartOfSpeechEnum.Pronoun};
const conjunction: WordPart = {name: 'Conjunction', abbreviation: 'CONJ', enum: PartOfSpeechEnum.Conjunction};
const relativePronoun: WordPart = {name: 'Relative pronoun', abbreviation: 'R', enum: PartOfSpeechEnum.RelativePronoun};
const reciprocalPronoun: WordPart = {name: 'Reciprocal pronoun', abbreviation: 'C', enum: PartOfSpeechEnum.RelativePronoun};
const preposition: WordPart = {name: 'Preposition', abbreviation: 'PREP', enum: PartOfSpeechEnum.Preposition};
const possessivePronoun: WordPart = {name: 'Possessive pronoun', abbreviation: 'S'};

// tense
const presentTense: WordPart = {name: 'Present', abbreviation: 'P', enum: PartOfSpeechEnum.Present};
const futureTense: WordPart = {name: 'Future', abbreviation: 'F', enum: PartOfSpeechEnum.Future};
const aoristTense: WordPart = {name: 'Aorist', abbreviation: 'A', enum: PartOfSpeechEnum.Aorist};
const secondAoristTense: WordPart = {name: 'Second Aorist', abbreviation: '2A', enum: PartOfSpeechEnum.SecondAorist};
const imperfect: WordPart = {name: 'Imperfect', abbreviation: 'I', enum: PartOfSpeechEnum.Imperfect};
const perfect: WordPart = {name: 'Perfect', abbreviation: 'R', enum: PartOfSpeechEnum.Perfect};
const firstPerfect: WordPart = {name: 'First Perfect', abbreviation: '1R', enum: PartOfSpeechEnum.FirstPerfect};
const secondPerfect: WordPart = {name: 'Second Perfect', abbreviation: '2R', enum: PartOfSpeechEnum.SecondPerfect};
const pluperfect: WordPart = {name: 'Pluperfect', abbreviation: 'L', enum: PartOfSpeechEnum.Pluperfect};
const secondPluperfect: WordPart = {name: 'Second Pluperfect', abbreviation: '2L', enum: PartOfSpeechEnum.SecondPluperfect};

// voice
const active: WordPart = {name: 'Active', abbreviation: 'A', enum: PartOfSpeechEnum.Active};
const middle: WordPart = {name: 'Middle', abbreviation: 'M', enum: PartOfSpeechEnum.Middle};
const passive: WordPart = {name: 'Passive', abbreviation: 'P', enum: PartOfSpeechEnum.Passive};
const deponent: WordPart = {name: 'Deponent', abbreviation: 'D', enum: PartOfSpeechEnum.Deponent};
const middlePassiveDeponent: WordPart = {
  name: 'Middle or passive deponent',
  abbreviation: 'N',
  enum: PartOfSpeechEnum.MiddlePassiveDeponent
};

const middlePassive: WordPart = {
  name: 'Middle or passive',
  abbreviation: 'E',
  enum: PartOfSpeechEnum.MiddlePassive
};
const noVoice: WordPart = {name: 'No voice', abbreviation: 'X', enum: PartOfSpeechEnum.VoiceNone};


// mood
const indicative: WordPart = {name: 'Indicative', abbreviation: 'I', enum: PartOfSpeechEnum.Indicative};
const participle: WordPart = {name: 'Participle', abbreviation: 'P', enum: PartOfSpeechEnum.Participle};
const imperative: WordPart = {name: 'Imperative', abbreviation: 'Im', enum: PartOfSpeechEnum.Imperative};
const subjunctive: WordPart = {name: 'Subjunctive', abbreviation: 'S', enum: PartOfSpeechEnum.Subjunctive};
const optative: WordPart = {name: 'Optative', abbreviation: 'O', enum: PartOfSpeechEnum.Optative};
const infinitive: WordPart = {name: 'Infinitive', abbreviation: 'N', enum: PartOfSpeechEnum.Infinitive};

// person
const firstPerson: WordPart = {name: '1st', abbreviation: '1', enum: PartOfSpeechEnum.First};
const secondPerson: WordPart = {name: '2nd', abbreviation: '2', enum: PartOfSpeechEnum.First};
const thirdPerson: WordPart = {name: '3rd', abbreviation: '3', enum: PartOfSpeechEnum.First};

// number
const singular: WordPart = {name: 'Singular', abbreviation: 'S', enum: PartOfSpeechEnum.Singular};
const plural: WordPart = {name: 'Plural', abbreviation: 'P', enum: PartOfSpeechEnum.Plural};

// case
const nominative: WordPart = {name: 'Nominative', abbreviation: 'N', enum: PartOfSpeechEnum.Nominative};
const genitive: WordPart = {name: 'Genitive', abbreviation: 'G', enum: PartOfSpeechEnum.Genitive};
const dative: WordPart = {name: 'Dative', abbreviation: 'D', enum: PartOfSpeechEnum.Dative};
const accusative: WordPart = {name: 'Accusative', abbreviation: 'A', enum: PartOfSpeechEnum.Accusative};
const vocative: WordPart = {name: 'Vocative', abbreviation: 'V', enum: PartOfSpeechEnum.Vocative};

// gender
const masculine: WordPart = {name: 'Masculine', abbreviation: 'M', enum: PartOfSpeechEnum.Masculine};
const feminine: WordPart = {name: 'Feminine', abbreviation: 'F', enum: PartOfSpeechEnum.Feminine};
const neuter: WordPart = {name: 'Neuter', abbreviation: 'N', enum: PartOfSpeechEnum.Neuter};

// etc
const attic: WordPart = {name: 'Attic word', abbreviation: 'A', enum: PartOfSpeechEnum.Attic};
const disjunctiveParticiple: WordPart = {name: 'disjunctiveParticiple', abbreviation: 'PRT'};
const negativeSuffix: WordPart = {name: 'Negative', abbreviation: 'N'};
