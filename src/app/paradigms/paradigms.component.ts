import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-paradigms',
  templateUrl: './paradigms.component.html',
  styleUrls: ['./paradigms.component.css']
})
export class ParadigmsComponent implements OnInit {
  constructor(private titleService: Title) {
    titleService.setTitle('Verb paradigms - KoineParser');
  }

  ngOnInit(): void {
  }
}
