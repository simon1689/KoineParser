import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'greekStyler'
})
export class GreekStylerPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const matches = value.match(/(?!\s)([^{IsGreek}{InGreekExtended}{.,(){}:;’*<>'!/\/}\w])*(?=\s)*/gim).filter(x => x !== '');

    for (const match of matches) {
      value = value.replace(match, '<span class=\'greek-normal-size\'>' + match + '</span>');
    }

    return value;
  }
}
