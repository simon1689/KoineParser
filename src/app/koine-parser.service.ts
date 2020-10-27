import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {TypeOfWords} from './interfaces/word';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map, shareReplay} from 'rxjs/operators';
import {WordModel} from './word.model';
import {LexiconEntry} from './lexicon.entry';

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

  getAllWords(type: TypeOfWords, book: string = null, startChapter: string = null, endChapter: string = null): Observable<WordModel[]> {
    let endpoint = this.endpoint;

    if (book !== null && startChapter !== null && endChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter + '&endChapter=' + endChapter;
    } else if (book !== null && startChapter !== null) {
      endpoint = this.endpoint + '?bookNr=' + book + '&startChapter=' + startChapter;
    }

    return this.http.get(endpoint)
      .pipe(
        map((data: any[]) => data.map((item: any) => {
          const model = new WordModel();
          Object.assign(model, item);
          model.occurrencesInRange = data.filter(x => x.word === item.word).length;
          model.lexiconEntry = this.lexiconEntries.find(x => x.strongsNr === Number(model.strongsNr));
          return model;
        })));
  }

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
    this.allLexiconEntries
      .subscribe((response) => {
          this.lexiconEntries = response;
        },
        error => console.error(error));
  }


  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
