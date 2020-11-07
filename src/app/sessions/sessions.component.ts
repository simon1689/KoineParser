import {Component, Input, OnInit} from '@angular/core';
import {LocalStorageSession} from '../models/local-storage-session';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../state.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  sessions: LocalStorageSession[] = [];
  sessionSelectionBox: FormControl;
  selectedSession: LocalStorageSession;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService,
              private ngxLoader: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.sessionSelectionBox = new FormControl('');
    this.getSessions();
  }

  getSessions(): void {
    this.sessions = [];

    if ('session_keys' in localStorage) {
      const keys: string[] = JSON.parse(localStorage.getItem('session_keys'));
      for (const key of keys) {
        this.sessions.push(JSON.parse(localStorage.getItem(key)));
      }
    }

    this.sessions = this.sessions.filter(x => x !== null);
  }

  deleteSession(): void {
    if (this.selectedSession.key in localStorage) {
      localStorage.removeItem(this.selectedSession.key);
      let keys: string[] = JSON.parse(localStorage.getItem('session_keys'));
      keys = keys.filter(x => x === this.selectedSession.key);
      localStorage.removeItem('session_keys');
      localStorage.setItem('session_keys', JSON.stringify(keys));
    }

    this.getSessions();
  }

  resumeSession(): void {
    this.state.setCurrentSession(this.selectedSession);
    this.router.navigate(['parsing']);
  }

  sessionSelected(): void {
    this.selectedSession = this.sessions.find(x => x.key === this.sessionSelectionBox.value);
  }
}
