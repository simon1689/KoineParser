import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Score} from '../models/score';
import {faExclamationCircle, faForward, faThumbsDown, faThumbsUp, faTrash} from '@fortawesome/free-solid-svg-icons';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-my-scores',
  templateUrl: './my-scores.component.html',
  styleUrls: ['./my-scores.component.css']
})
export class MyScoresComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['range', 'date', 'numberOfWords', 'score', 'answers', 'actions'];

  scores: Score[] = [];
  scoresDataSource = new MatTableDataSource(this.scores);
  exclamationIcon = faExclamationCircle;
  @ViewChild(MatSort) sort: MatSort;
  thumbsUp = faThumbsUp;
  thumbsDown = faThumbsDown;
  skip = faForward;
  trash = faTrash;

  constructor(private titleService: Title) {
    titleService.setTitle('My scores - KoineParser');
  }

  ngOnInit(): void {
    this.getScores();
  }

  ngAfterViewInit(): void {
    this.scoresDataSource.sort = this.sort;
  }

  getScores(): void {
    if ('scores' in localStorage) {
      this.scores = JSON.parse(localStorage.getItem('scores'));
      this.scores.forEach(x => x.dateFormatted = new Date(x.date).toDateString());
      this.scoresDataSource.data = this.scores;
    }
  }

  deleteScore(score: Score): void {
    if ('scores' in localStorage) {
      const scores: Score[] = JSON.parse(localStorage.getItem('scores'));

      const index: number = this.scores.indexOf(score);
      if (index !== -1) {
        scores.splice(index, 1);
      }

      localStorage.setItem('scores', JSON.stringify(scores));
      this.getScores();
    }
  }
}
