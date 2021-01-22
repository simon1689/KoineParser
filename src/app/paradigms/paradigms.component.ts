import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paradigms',
  templateUrl: './paradigms.component.html',
  styleUrls: ['./paradigms.component.css']
})
export class ParadigmsComponent implements OnInit {
  tocHidden = true;
  tocIcon = faBars;

  constructor(private titleService: Title) {
    titleService.setTitle('Paradigms - KoineParser');
  }

  ngOnInit(): void {
  }
}
