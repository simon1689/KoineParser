import {WordPart} from '../models/word-part';
import {
  adjective,
  adverb,
  allCases,
  allGenders,
  allMoods,
  allNumbers,
  allPersons,
  allSuffixes,
  allTenses,
  allTypesOfPronouns,
  allVoices,
  allWordTypes,
  article,
  atticSuffix,
  correlativeOrInterrogativePronoun,
  correlativePronoun,
  demonstrativePronoun,
  indeclinable,
  indeclinableNounOrOtherPartSuffix,
  indefinitePronoun,
  infinitiveMood,
  interrogativePronoun,
  noun,
  participleMood,
  particleType,
  personalPronoun,
  possessivePronoun,
  reciprocalPronoun,
  reflexivePronoun,
  relativePronoun,
  verb
} from './word-type-constants';

export class MorphologyGenerator {

  public static generateWordPartsFromMorphologyCode(morphology: string): WordPart[] {
    let result: WordPart[] = [];
    const splitValue = morphology.split('-');

    if (splitValue.length === 1) {
      result.push(allWordTypes.find(x => x.abbreviation === splitValue[0]));
    } else if (splitValue.length === 2) { // nouns
      result = this.processTwoPartMorphology(splitValue);
    } else if (splitValue.length === 3) { // verbs
      if (allWordTypes.filter(x => x !== verb).map(x => x.abbreviation).find(x => x === splitValue[0]) !== undefined) {
        result = this.processTwoPartMorphology(splitValue);
        result.push(allSuffixes.find(x => x.abbreviation === splitValue[2]));
      } else {
        result = this.processThreePartMorphology(splitValue);
      }
    } else if (splitValue.length === 4) {
      result = this.processThreePartMorphology(splitValue);
      if (splitValue[3] === atticSuffix.abbreviation) {
        result.push(atticSuffix);
      }
    }

    return result.filter(x => x !== undefined);
  }

  public static generateMorphologyCodeFromWordParts(wordParts: WordPart[]): string {
    let morphology = '';
    if (wordParts.length === 1) {
      return wordParts[0].abbreviation;
    } else {
      let suffix = null;
      const type = allWordTypes.find(x => wordParts.includes(x));
      if (type !== undefined) {
        switch (type) {
          case verb:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allTenses, wordParts);
            morphology += this.searchForPart(allVoices, wordParts);
            morphology += this.searchForPart(allMoods, wordParts);

            // if its infinitive, then cut it off
            if (this.searchForPart(allMoods, wordParts) === infinitiveMood.abbreviation) {
              break;
            }

            morphology += '-';
            if (this.searchForPart(allMoods, wordParts) === participleMood.abbreviation) {
              morphology += this.searchForPart(allCases, wordParts);
              morphology += this.searchForPart(allNumbers, wordParts);
              morphology += this.searchForPart(allGenders, wordParts);
            } else {
              morphology += this.searchForPart(allPersons, wordParts);
              morphology += this.searchForPart(allNumbers, wordParts);
            }

            suffix = this.searchForPart(allSuffixes, wordParts);
            if (suffix !== '?') {
              morphology += '-' + suffix;
            }
            break;

          case noun:
          case article:
          case adjective:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allCases, wordParts);
            morphology += this.searchForPart(allNumbers, wordParts);
            morphology += this.searchForPart(allGenders, wordParts);

            suffix = this.searchForPart(allSuffixes, wordParts);
            if (suffix !== '?') {
              morphology += '-' + suffix;
            }

            break;

          case personalPronoun:
          case relativePronoun:
          case reciprocalPronoun:
          case possessivePronoun:
          case correlativePronoun:
          case demonstrativePronoun:
          case reflexivePronoun:
          case interrogativePronoun:
          case correlativeOrInterrogativePronoun:
          case indefinitePronoun:
            morphology = type.abbreviation + '-';

            const person = this.searchForPart(allPersons, wordParts);
            if (!isNaN(Number(person))) {
              morphology += person;
            }

            const nominalCase = this.searchForPart(allCases, wordParts);
            if (nominalCase !== '?') {
              morphology += nominalCase;
            }

            morphology += this.searchForPart(allNumbers, wordParts);
            const gender = this.searchForPart(allGenders, wordParts);
            if (gender !== '?') {
              morphology += gender;
            }

            suffix = this.searchForPart(allSuffixes, wordParts);
            if (suffix !== '?') {
              morphology += '-' + suffix;
            }
            break;

          // case disjunctiveParticiple:
          case particleType:
          case adverb:
            morphology = type.abbreviation;
            suffix = this.searchForPart(allSuffixes, wordParts);
            if (suffix !== '?') {
              morphology += '-' + suffix;
            }
            break;
          default:
            break;
        }
      }
    }

    return morphology;
  }

  private static searchForPart(allTypesConstants: WordPart[], wordParts: WordPart[]): string {
    const part = allTypesConstants.find(x => wordParts.includes(x));
    return (part === undefined) ? '?' : part.abbreviation;
  }

  private static processTwoPartMorphology(splitValue: string[]): WordPart[] {
    let result: WordPart[] = [];

    for (let i = 0; i < 2; i++) {
      const part = splitValue[i];
      if (i === 0) {
        result.push(allWordTypes.find(x => x.abbreviation === part));
      }

      if (i === 1) {
        if ((result.includes(particleType) || result.includes(adverb))
          && allSuffixes.map(x => x.abbreviation).includes(part)) {
          result.push(allSuffixes.find(x => x.abbreviation === part));
        } else if (result.includes(verb) && part.includes(infinitiveMood.abbreviation)) {
          result = this.processVerbTenseVoiceMood(part, result);

          // pronouns stuff
        } else if (result.find(x => allTypesOfPronouns.includes(x))) {
          result = this.processPronounParts(part, result);
        }

        // noun related
        else if (result.includes(noun) && part === indeclinable.abbreviation) {
          result.push(indeclinable);
        } else if (result.includes(noun) && part === indeclinableNounOrOtherPartSuffix.abbreviation) {
          result.push(indeclinableNounOrOtherPartSuffix);

        } else if (result.includes(noun) || result.includes(article)
          || result.includes(relativePronoun) || result.includes(adjective)
          || result.includes(personalPronoun) || reciprocalPronoun || correlativePronoun) {
          result = this.processNounParts(part, result);
        }
      }
    }

    return result.filter(x => x !== undefined);
  }

  private static processThreePartMorphology(splitValue: string[]): WordPart[] {
    let result: WordPart[] = [];

    for (let i = 0; i < 3; i++) {
      const part = splitValue[i];
      // first part
      if (i === 0) {
        result.push(allWordTypes.find(x => x.abbreviation === part));
      }

      // second part
      if (i === 1) {
        result = this.processVerbTenseVoiceMood(part, result, true);
      }

      // third part
      if (i === 2) {
        // person and number
        if (!isNaN((Number(part[0])))) {
          result.push(allPersons.find(x => x.abbreviation === part[0]));
          result.push(allNumbers.find(x => x.abbreviation === part[1]));
          // for participles
        } else {
          result = this.processNounParts(part, result);
        }
      }
    }

    return result.filter(x => x !== undefined);
  }

  private static processNounParts(value: string, result: WordPart[]): WordPart[] {
    if (value.length === 3) {
      result.push(allCases.find(x => x.abbreviation === value[0]));
      result.push(allNumbers.find(x => x.abbreviation === value[1]));
      result.push(allGenders.find(x => x.abbreviation === value[2]));
    }

    return result;
  }

  private static processVerbTenseVoiceMood(part: string, result: WordPart[], replaceDeponency: boolean = true): WordPart[] {
    let secondaryTense: boolean;
    // tense
    if ((!isNaN((Number(part.substr(0, 1)))))) {
      secondaryTense = true;
      result.push(allTenses.find(x => x.abbreviation === part.substr(0, 2)));
    } else {
      result.push(allTenses.find(x => x.abbreviation === part.substr(0, 1)));
    }

    // voice
    const voicePart = part.substr(secondaryTense ? 2 : 1, 1);
    const voice = allVoices.find(x => x.abbreviation === voicePart);
    if (replaceDeponency && voice !== undefined && voice.headCategory !== undefined) {
      result.push(voice.headCategory);
    } else {
      result.push(voice);
    }

    // mood
    const moodPart = part.substr(secondaryTense ? 3 : 2, 1);
    result.push(allMoods.find(x => x.abbreviation === moodPart));

    return result.filter(x => x !== undefined);
  }

  private static processPronounParts(part: string, result: WordPart[]): WordPart[] {
    if (part.length === 4) {
      if (!isNaN(Number(part[0]))) { // if its a number
        result.push(allPersons.find(x => x.abbreviation === part[0]));
        result.push(allCases.find(x => x.abbreviation === part[1]));
        result.push(allNumbers.find(x => x.abbreviation === part[2]));
        result.push(allGenders.find(x => x.abbreviation === part[3]));
      }
    } else if (part.length === 3) {
      if (!isNaN(Number(part[0]))) { // if its a number
        result.push(allPersons.find(x => x.abbreviation === part[0]));
        result.push(allCases.find(x => x.abbreviation === part[1]));
        result.push(allNumbers.find(x => x.abbreviation === part[2]));
      } else {
        result.push(allCases.find(x => x.abbreviation === part[0]));
        result.push(allNumbers.find(x => x.abbreviation === part[1]));
        result.push(allGenders.find(x => x.abbreviation === part[2]));
      }
    }

    return result.filter(x => x !== undefined);
  }

  public static convertWordPartsToReadableForm(wordParts: WordPart[], formatting: boolean = false, newLine = false): string {
    if (formatting === false) {
      return wordParts.map(x => x.name).join(' ');
    }

    let result = '';
    const newLiner = formatting ? (newLine) ? '\n' : '<br />' : '';
    for (const wordPart of this.sortWordParts(wordParts)) {
      result += `${wordPart.type}: ${wordPart.name}${newLiner}`;
    }

    return result;
  }

  public static sortWordParts(wordParts: WordPart[]): WordPart[] {
    const result: WordPart[] = [];

    const type = wordParts.find(x => allWordTypes.includes(x));
    const tense = wordParts.find(x => allTenses.includes(x));
    const voice = wordParts.find(x => allVoices.includes(x));
    const mood = wordParts.find(x => allMoods.includes(x));
    const person = wordParts.find(x => allPersons.includes(x));
    const numbers = wordParts.find(x => allNumbers.includes(x));
    const cases = wordParts.find(x => allCases.includes(x));
    const gender = wordParts.find(x => allGenders.includes(x));
    const suffix = wordParts.find(x => allSuffixes.includes(x));

    if (type) {
      result.push(type);
    }

    if (tense) {
      result.push(tense);
    }

    if (voice) {
      result.push(voice);
    }

    if (mood) {
      result.push(mood);
    }

    if (person) {
      result.push(person);
    }

    if (numbers) {
      result.push(numbers);
    }

    if (cases) {
      result.push(cases);
    }

    if (gender) {
      result.push(gender);
    }

    if (suffix) {
      result.push(suffix);
    }

    return result;
  }

  public static convertMorphologyCodeToReadableForm(morphology: string, formatting: boolean = false): string {
    return this.convertWordPartsToReadableForm(this.generateWordPartsFromMorphologyCode(morphology), formatting);
  }
}
