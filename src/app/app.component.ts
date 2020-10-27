import {Component, OnInit} from '@angular/core';
import {KoineParserService} from './koine-parser.service';
import {TypeOfWords} from './interfaces/word';
import {WordModel} from './word.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Koine Greek Parser';
}
