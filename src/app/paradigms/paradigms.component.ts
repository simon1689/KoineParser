import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-paradigms',
  templateUrl: './paradigms.component.html',
  styleUrls: ['./paradigms.component.css']
})
export class ParadigmsComponent implements OnInit {

  toc: any = null;

  constructor() {
  }

  ngOnInit(): void {
    this.getToC();
  }

  getToC(): void {
    const contentDiv = document.getElementById('paradigms');
    const myArrayOfNodes = [].slice.call(contentDiv.querySelectorAll('h1, h2, h3'));
    const toc = document.createElement('ul');
    let pointer = toc;

    myArrayOfNodes.forEach((value, key, listObj) => {
      // if we have detected a top level headline:
      if ('H1' === value.tagName) {
        // reset the pointer to top level:
        pointer = toc;
      }

      // if we are at top level and we have detected a headline level 2
      if ('H2' === value.tagName && pointer === toc) {
        // create a nested unordered list
        pointer = pointer.appendChild(document.createElement('ul'));
      }

      if ('H3' === value.tagName) {
        const lis = toc.querySelectorAll('li');
        pointer = lis[lis.length - 1].appendChild(document.createElement('ul'));
      }

      // for each headline, create a list item with the corresponding HTML content:
      const li = pointer.appendChild(document.createElement('li'));
      li.innerHTML = value.innerHTML;
    });

    // this.toc = toc.innerHTML;
  }
}
