import {WordPart} from './wordPart';
import {
  adjective,
  allCases,
  allGenders,
  allMoods,
  allNumbers,
  allPersons,
  allSuffixes,
  allTenses,
  allVoices,
  allWordTypes,
  article,
  attic,
  correlativePronoun,
  disjunctiveParticiple,
  indeclinable, indeclinableNounOrOtherPart,
  infinitiveMood,
  negativeSuffix,
  noun,
  participleMood,
  possessivePronoun,
  personalPronoun,
  reciprocalPronoun,
  relativePronoun,
  verb, allTypesOfPronouns
} from './wordTypeConstants';

export class MorphologyGenerator {

  public static generateWordPartsFromMorphologyCode(morphology: string): WordPart[] {
    let result: WordPart[] = [];
    const splitValue = morphology.split('-');

    if (splitValue.length === 1) {
      result.push(allWordTypes.find(x => x.abbreviation === splitValue[0]));
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

    return result;
  }

  public static generateMorphologyFromWordParts(wordParts: WordPart[]): string {
    let morphology = '';

    if (wordParts.length === 1) {
      return wordParts[0].abbreviation;
    } else {
      const type = allWordTypes.find(x => wordParts.includes(x));
      if (type !== undefined) {
        switch (type.abbreviation) {
          case verb.abbreviation:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allTenses, wordParts);
            morphology += this.searchForPart(allVoices, wordParts);
            morphology += this.searchForPart(allMoods, wordParts);
            morphology += '-';

            if (this.searchForPart(allMoods, wordParts) === participleMood.abbreviation) {
              morphology += this.searchForPart(allCases, wordParts);
              morphology += this.searchForPart(allNumbers, wordParts);
              morphology += this.searchForPart(allGenders, wordParts);
            } else {
              morphology += this.searchForPart(allPersons, wordParts);
              morphology += this.searchForPart(allNumbers, wordParts);
            }

            break;

          case noun.abbreviation:
          case article.abbreviation:
          case adjective.abbreviation:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allCases, wordParts);
            morphology += this.searchForPart(allNumbers, wordParts);
            morphology += this.searchForPart(allGenders, wordParts);
            break;

          case personalPronoun.abbreviation:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allPersons, wordParts);
            morphology += this.searchForPart(allCases, wordParts);
            morphology += this.searchForPart(allNumbers, wordParts);
            break;

          case disjunctiveParticiple.abbreviation:
            morphology = type.abbreviation + '-';
            morphology += this.searchForPart(allSuffixes, wordParts);

            break;
          default:
            // morphology += wordParts.find(x => x === attic).abbreviation;
            break;
        }
      }
    }

    // console.log(morphology);
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
        if (result.includes(verb) && part.includes(infinitiveMood.abbreviation)) {
          result = this.processVerbTenseVoiceMood(part, result);
// pronouns stuff
        } else if (result.find(x => allTypesOfPronouns.includes(x))) {
          result = this.processPronounParts(part, result);
        }

        // noun related
        else if (result.includes(noun) && part === indeclinable.abbreviation) {
          result.push(indeclinable);
        } else if (result.includes(noun) && part === indeclinableNounOrOtherPart.abbreviation) {
          result.push(indeclinableNounOrOtherPart);

        } else if (result.includes(noun) || result.includes(article)
          || result.includes(relativePronoun) || result.includes(adjective)
          || result.includes(personalPronoun) || reciprocalPronoun || correlativePronoun) {
          result = this.processNounParts(part, result);

        } else if (result.includes(disjunctiveParticiple) && part === negativeSuffix.abbreviation) {
          result.push(negativeSuffix);

        } else if (part === possessivePronoun.abbreviation) {
          result.push(allPersons.find(x => x.abbreviation === part.substr(0, 1)));
          result = this.processNounParts(part.substr(1), result);
        }
      }
    }

    return result;
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
        result = this.processVerbTenseVoiceMood(part, result);
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

    return result;
  }

  private static processNounParts(value: string, result: WordPart[]): WordPart[] {
    if (value.length === 3) {
      result.push(allCases.find(x => x.abbreviation === value[0]));
      result.push(allNumbers.find(x => x.abbreviation === value[1]));
      result.push(allGenders.find(x => x.abbreviation === value[2]));
    }

    return result;
  }

  private static processVerbTenseVoiceMood(part: string, result: WordPart[]): WordPart[] {
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
    result.push(allVoices.find(x => x.abbreviation === voicePart));

    // mood
    const moodPart = part.substr(secondaryTense ? 3 : 2, 1);
    result.push(allMoods.find(x => x.abbreviation === moodPart));

    return result;
  }

  private static processPronounParts(part: string, result: WordPart[]): WordPart[] {
    if (part.length === 3) {
      if (!isNaN(Number(part[0]))) {
        result.push(allPersons.find(x => x.abbreviation === part[0]));
        result.push(allCases.find(x => x.abbreviation === part[1]));
        result.push(allNumbers.find(x => x.abbreviation === part[2]));
      } else {
        result.push(allCases.find(x => x.abbreviation === part[0]));
        result.push(allNumbers.find(x => x.abbreviation === part[1]));
        result.push(allGenders.find(x => x.abbreviation === part[2]));
      }
    }

    return result;
  }

  public static convertWordPartsToReadableForm(wordParts: WordPart[], formatting: boolean = false): string {
    if (formatting === false) {
      return wordParts.map(x => x.name).join(' ');
    }

    let result = '';
    for (const wordPart of wordParts) {
      result += `${wordPart.type}: ${wordPart.name}<br/>`;
    }

    return result;
  }

  public static convertMorphologyCodeToReadableForm(morphology: string, formatting: boolean = false): string {
    return this.convertWordPartsToReadableForm(this.generateWordPartsFromMorphologyCode(morphology), formatting);
  }
}
