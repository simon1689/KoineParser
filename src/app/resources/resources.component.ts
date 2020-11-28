import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle('Resources for Koine Greek - KoineParser');
  }

  ngOnInit(): void {
  }
}
