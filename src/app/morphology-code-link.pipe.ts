import {Pipe, PipeTransform} from '@angular/core';
import {infinitiveMood} from './etc/word-type-constants';

@Pipe({
  name: 'morphologyCodeLink'
})
export class MorphologyCodeLinkPipe implements PipeTransform {

  transform(morphology: string, ...args: unknown[]): string {
    if (morphology.startsWith('V-')) {
      let result;
      if (morphology.match(/-/g).length > 1) {
        let shortenedMorph;

        let encounteredDash = 0;
        for (let i = 0; i < morphology.length; i++) {
          if (morphology[i] === '-' && encounteredDash === 1) {
            shortenedMorph = morphology.slice(0, i);
          } else if (morphology[i] === '-') {
            encounteredDash++;
          }
        }

        result = shortenedMorph;
      } else {
        if (morphology[morphology.length - 1] === infinitiveMood.abbreviation) {
          result = 'inf';
        } else {
          result = morphology;
        }
      }

      return '<a href=\'/paradigms#' + result + '\' target=\'_blank\' title="See the full paradigm">' + morphology + '</a>';
    } else if (morphology.startsWith('N-')) {
      return '<a href=\'/paradigms#' + 'nouns' + '\' target=\'_blank\' title="See the full paradigm">' + morphology + '</a>';
    } else {
      return morphology;
    }
  }

}
