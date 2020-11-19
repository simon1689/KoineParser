import {PartOfSpeech} from '../models/part-of-speech-objects';
import {FormControl, FormGroup} from '@angular/forms';
import {ParseComponent} from '../parse/parse.component';
import {Score} from '../models/score';

export class Helper {

  public static createFormGroup(parts: PartOfSpeech[], validators = null): FormGroup {
    if (parts == null) {
      return null;
    }

    const group = new FormGroup({}, validators);
    for (const part of parts) {
      group.addControl(part.controlId, new FormControl(''));
    }

    return group;
  }

  public static registerScores(component: ParseComponent): void {
    const score: Score = {
      date: new Date(),
      wrongAnswers: component.wrongAnswers.length,
      range: component.state.getBibleReference().toString(),
      numberOfWords: component.words.length,
      goodAnswers: component.goodAnswers.length,
      skippedWords: component.skippedWords.length
    };

    if ('scores' in localStorage) {
      const scoresFromLocalStorage: Score[] = JSON.parse(localStorage.getItem('scores'));
      scoresFromLocalStorage.push(score);
      localStorage.setItem('scores', JSON.stringify(scoresFromLocalStorage));
    } else {
      const scores: Score[] = [score];
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }

  public static counter(i: number): Array<number> {
    return new Array(i);
  }
}
