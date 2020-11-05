import {Component, Injectable} from '@angular/core';
import {Observable, Subscription, throwError, throwError as observableThrowError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {MultipleMorphologyWord, WordModel} from './models/word.model';
import {LexiconEntry} from './models/lexicon.entry';
import {WordPart} from './models/wordPart';
import {adverb, conditionalType, conjunction, infinitiveMood, participleMood, preposition} from './word-type-constants';
import {MorphologyGenerator} from './morphologyGenerator';
import {forEachComment} from 'tslint';

@Injectable({
  providedIn: 'root'
})
export class KoineParserService {
  endpoint = 'https://www.thecalvinist.net/pages/api/greek/words-get.php';
  lexiconEndpoint = 'https://www.thecalvinist.net/pages/api/greek/lexicon-get.php';
  lexiconEntries: LexiconEntry[];

  constructor(private http: HttpClient) {
    this.setAllLexiconEntries();
  }

  getTypesQueryString(types: WordPart[]): string {
    let result = '&types=';
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

  getAllWords(types: WordPart[], book: string = null, startChapter: string = null, endChapter: string = null): Observable<WordModel[]> {
    let endpoint = this.endpoint;

    if (book !== null && startChapter !== null && endChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter + '&endChapter=' + endChapter;
    } else if (book !== null && startChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter;
    }

    if (types.length > 0) {
      //    endpoint += '&types=' + types.map(x => x === participleMood ? 'Ptc' : x === infinitiveMood ? 'Inf' : x.abbreviation).join(',');
      endpoint += this.getTypesQueryString(types);
    }

    return this.http.get(endpoint)
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new WordModel();
          Object.assign(model, item);
          // model.occurrencesInRange = data.filter(x => x.word === item.word).length;
          model.lexiconEntry = this.lexiconEntries.find(x => x.strongsNr === Number(model.strongsNr));
          model.partsOfSpeech = MorphologyGenerator.generateWordPartsFromMorphologyCode(model.morphology);
          return model;
        })));
  }

  getWordsCount(types: WordPart[], book: string = null, startChapter: string = null, endChapter: string = null): Observable<any> {
    let endpoint = this.endpoint;

    if (book !== null && startChapter !== null && endChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter + '&endChapter=' + endChapter + '&count=x';
    } else if (book !== null && startChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter + '&count=x';
    }

    if (types.length > 0) {
      endpoint += this.getTypesQueryString(types);
    }

    return this.http.get(endpoint)
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }

  multipleMorphologiesForWord(): Observable<MultipleMorphologyWord[]> {
    return this.http.get<MultipleMorphologyWord[]>('./assets/multiple_morphologies.json')
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }

  get allLexiconEntries(): Observable<LexiconEntry[]> {
    return this.http.get(this.lexiconEndpoint)
      .pipe(
        shareReplay(100),
        map((data: any[]) => data.map((item: any) => {
          const model = new LexiconEntry();
          Object.assign(model, item);
          return model;
        })));
  }

  get allDodsonLexiconEntries(): Observable<LexiconEntry[]> {
    return this.http.get(this.lexiconEndpoint + '?lexicon=dodson')
      .pipe(
        shareReplay(100),
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
      this.allDodsonLexiconEntries
        .subscribe((response) => {
            this.lexiconEntries = response;
            localStorage.setItem('lexicon', JSON.stringify(this.lexiconEntries));
          },
          error => console.error(error));
    }
  }

  sendErrorMessageMail(content: any): Observable<any> {
    const endpoint = 'https://www.thecalvinist.net/pages/api/email-post.php';

    return this.http
      .post(endpoint, {content})
      .pipe(catchError(error => {
        return observableThrowError(error);
      }));
  }
}
