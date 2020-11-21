import {Injectable} from '@angular/core';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MultipleMorphologyWord, WordModel} from './models/word.model';
import {LexiconEntry} from './models/lexicon.entry';
import {WordPart} from './models/word-part';
import {
  adverb, allTypesOfPronouns,
  conditionalType,
  conjunction,
  imperativeMood,
  indicativeMood,
  infinitiveMood,
  noun, optativeMood,
  participleMood, particleType,
  personalPronoun,
  preposition, subjunctiveMood,
  verb, WordParts
} from './etc/word-type-constants';
import {MorphologyGenerator} from './etc/morphology-generator';
import {BibleReference} from './models/bible-reference';

@Injectable({
  providedIn: 'root'
})
export class KoineParserService {
  endpoint = 'https://www.thecalvinist.net/api/bible-words/';
  lexiconEndpoint = 'https://www.thecalvinist.net/api/lexicon';
  lexiconEntries: LexiconEntry[];

  constructor(private http: HttpClient) {
    this.setAllLexiconEntries();
  }

  getWords(filters: WordPart[], reference: BibleReference): Observable<WordModel[]> {
    let endpoint = this.endpoint + reference.toApiQueryString();

    if (filters.length > 0) {
      endpoint += '?' + this.getFiltersQueryString(filters);
    }

    return this.http.get(endpoint)
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new WordModel();
          Object.assign(model, item);
          model.lexiconEntry = this.lexiconEntries.find(x => x.strongsNr === Number(model.strongsNr));
          model.partsOfSpeech = MorphologyGenerator.generateWordPartsFromMorphologyCode(model.morphology);
          model.morphologyUpdated = MorphologyGenerator.generateMorphologyCodeFromWordParts(model.partsOfSpeech);
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

  multipleMorphologiesForWord(): Promise<MultipleMorphologyWord[]> {
    return this.http.get<MultipleMorphologyWord[]>('./assets/multiple_morphologies.json')
      .pipe(catchError(error => {
        return observableThrowError(error);
      })).toPromise();
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
