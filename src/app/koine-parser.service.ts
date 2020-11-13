import {Injectable} from '@angular/core';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MultipleMorphologyWord, WordModel} from './models/word.model';
import {LexiconEntry} from './models/lexicon.entry';
import {WordPart} from './models/word-part';
import {adverb, conditionalType, conjunction, infinitiveMood, participleMood, preposition} from './etc/word-type-constants';
import {MorphologyGenerator} from './etc/morphology-generator';

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

  getTypesQueryString(types: WordPart[]): string {
    let result = 'types=';
    let comma = ',';
    let x = 1;
    for (const type of types) {
      if (types.length === x) {
        comma = '';
      }
      switch (type) {
        case conjunction:
        case adverb:
        case preposition:
        case conditionalType:
          result += `${type.abbreviation}${comma}`;
          break;
        case participleMood:
          result += `Ptc${comma}`;
          break;
        case infinitiveMood:
          result += `Inf${comma}`;
          break;
        default:
          result += `${type.abbreviation}-${comma}`;
          break;
      }

      x++;
    }
    return result;
  }

  getAllWords(types: WordPart[], book: string = '40', startChapter: string = '1', startVerse: string = '1',
              endChapter: string = '1', endVerse: string = '2'): Observable<WordModel[]> {
    let endpoint = this.endpoint + book + '/' + startChapter + '/' + startVerse
      + '/' + endChapter + '/' + endVerse;

    if (types.length > 0) {
      endpoint += '?' + this.getTypesQueryString(types);
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

  getWordsCount(types: WordPart[], book: string = '40', startChapter: string = '1', startVerse: string = '1',
                endChapter: string = '1', endVerse: string = '2'): Observable<any> {
    let endpoint = this.endpoint + book + '/' + startChapter + '/' + startVerse
      + '/' + endChapter + '/' + endVerse + '?count=x';

    if (types.length > 0) {
      endpoint += '&' + this.getTypesQueryString(types);
    }

    return this.http.get(endpoint)
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
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
