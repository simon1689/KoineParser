import {Injectable} from '@angular/core';
import {Observable, Subscription, throwError as observableThrowError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MultipleMorphologyWord, Word} from './models/word';
import {LexiconEntry} from './models/lexicon.entry';
import {WordPart} from './models/word-part';
import {
  adverb,
  allTypesOfPronouns,
  conditionalType,
  conjunction,
  imperativeMood,
  indicativeMood,
  infinitiveMood,
  noun,
  optativeMood,
  participleMood,
  particleType,
  personalPronoun,
  preposition,
  subjunctiveMood,
  verb,
  WordParts
} from './etc/word-type-constants';
import {BibleReference} from './models/bible-reference';

@Injectable({
  providedIn: 'root'
})
export class KoineParserService {
  endpoint = 'https://www.thecalvinist.net/api/bible-words/';
  lexiconEndpoint = 'https://www.thecalvinist.net/api/lexicon';
  multipleMorphologiesEndpoint = './assets/multiple_morphologies.json';

  lexiconEntries: LexiconEntry[];
  multipleMorphologiesOfWords: MultipleMorphologyWord[];

  constructor(private http: HttpClient) {
    this.setAllLexiconEntries();
    this.setMultipleMorphologies();
  }

  getWords(filters: WordPart[], reference: BibleReference): Observable<Word[]> {
    let endpoint = this.endpoint + reference.toApiQueryString();

    if (filters.length > 0) {
      endpoint += '?' + this.getFiltersQueryString(filters);
    }

    return this.http.get(endpoint)
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new Word();
          model.reference = new BibleReference(Number(item.book), item.chapter, item.verse, 0, 0);
          model.strongsNr = Number(item.strongsNr);
          model.lexiconEntry = this.lexiconEntries.find(x => x.strongsNr === model.strongsNr);
          model.setAllPartsOfSpeech(item.morphology);
          model.setMultipleMorphologies(this.multipleMorphologiesOfWords.filter(x => x.word === model.word && x.strongs === model.strongsNr));
          model.word = (model.primaryMorphologyTag.code.startsWith('N-') ? item.word : item.word.toLowerCase());

          return model;
        })));
  }

  getWordCount(filters: WordPart[], reference: BibleReference): Observable<any> {
    let endpoint = this.endpoint + reference.toApiQueryString() + '?count=x';
    if (filters.length > 0) {
      endpoint += this.getFiltersQueryString(filters);
    }

    return this.http.get(endpoint)
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }

  getFiltersQueryString(filters: WordPart[]): string {
    const types = filters.filter(x => x.type === WordParts.type);
    const moods = filters.filter(x => x.type === WordParts.mood);
    const tenses = filters.filter(x => x.type === WordParts.tense);
    let result = '';

    if (types.length !== 0) {
      result += '&' + this.getFilters(types, 'types');
    }

    if (moods.length !== 0) {
      result += '&' + this.getFilters(moods, 'moods');
    }

    if (tenses.length !== 0) {
      result += '&' + this.getFilters(tenses, 'tenses');
    }

    return result;
  }

  getFilters(filters: WordPart[], queryStringName: string): string {
    let result = queryStringName + '=';
    let comma = ',';
    const c = 1;
    for (const type of filters) {
      if (filters.length === c) {
        comma = '';
      }

      switch (type) {
        case conjunction:
        case adverb:
        case preposition:
        case particleType:
        case conditionalType:
          result += `${type.abbreviation}${comma}`;
          break;
        case verb:
        case noun:
          result += `${type.abbreviation}-${comma}`;
          break;
        case personalPronoun:
          result += allTypesOfPronouns.map(x => x.abbreviation + '-') + comma;
          break;
        case indicativeMood:
        case imperativeMood:
        case subjunctiveMood:
        case optativeMood:
        case infinitiveMood:
        case participleMood:
          result += `${type.abbreviation}${comma}`;
          break;
        default:
          result += `${type.abbreviation}${comma}`;
      }
    }

    return result;
  }

  get multipleMorphologies(): Observable<MultipleMorphologyWord[]> {
    return this.http.get(this.multipleMorphologiesEndpoint)
      .pipe(
        shareReplay(100),
        map((data: any[]) => data.map((item: any) => {
          const model = new MultipleMorphologyWord();
          Object.assign(model, item);
          return model;
        })));
  }

  setMultipleMorphologies(): Subscription {
    return this.multipleMorphologies.subscribe(response => {
        return this.multipleMorphologiesOfWords = response;
      }, err => {
        console.error(err);
      }
    );
  }

  // Dodson, Mounce, and if these are not available then 'greek_lexicon' which I'm not sure which lexicon is that
  get allLexiconEntries(): Observable<LexiconEntry[]> {
    return this.http.get(this.lexiconEndpoint)
      .pipe(
        shareReplay(1),
        map((data: any[]) => data.map((item: any) => {
          const model = new LexiconEntry();
          Object.assign(model, item);
          return model;
        })));
  }

  setAllLexiconEntries(): void {
    if ('lexicon' in localStorage) {
      this.lexiconEntries = JSON.parse(localStorage.getItem('lexicon'));
    } else {
      this.allLexiconEntries
        .subscribe((response) => {
            this.lexiconEntries = response;
            localStorage.setItem('lexicon', JSON.stringify(this.lexiconEntries));
          },
          error => console.error(error));
    }
  }

  sendErrorMessageMail(content: any): Observable<any> {
    const endpoint = 'https://www.thecalvinist.net/api/email';

    return this.http
      .post(endpoint, {content})
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }

  getEmailedReportInformation(): Observable<any> {
    return this.http.get<any>('./assets/emailed-information.json')
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }
}
