import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {KoineParserService} from '../koine-parser.service';
import {TypeOfWords, Word} from '../interfaces/word';
import {WordModel} from '../word.model';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})

export class WordsComponent implements OnInit {
  words: WordModel[] = [];

  constructor(private http: HttpClient,
              private service: KoineParserService) {
  }

  ngOnInit(): void {
  }


}

