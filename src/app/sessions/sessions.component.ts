import {Component, OnInit} from '@angular/core';
import {LocalStorageSession} from '../models/local-storage-session';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../state.service';
import {ParseComponent} from '../parse/parse.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private state: StateService) {
  }

  sessions: LocalStorageSession[] = [];
  sessionSelectionBox: FormControl;
  selectedSession: LocalStorageSession;

  public static saveSession(component: ParseComponent): void {
    const session: LocalStorageSession = {
      words: component.words,
      wordIndex: component.wordIndex,
      currentWord: component.word,
      date: new Date().toDateString(),
      range: component.state.getBibleReference(),
      goodAnswers: component.goodAnswers,
      wrongAnswers: component.wrongAnswers,
      skippedWords: component.skippedWords,
      usedWords: component.usedWords,
      key: component.state.getBibleReference().toString() + ' ' + new Date().toDateString(),
      secondaryTensesEnabled: component.state.getSecondaryTensesEnabled()
    };

    let sessionKeys: string[] = [];
    if ('session_keys' in localStorage) {
      sessionKeys = JSON.parse(localStorage.getItem('session_keys'));
    }

    if (session.key in localStorage) { // if session exists, then remove it first
      sessionKeys = sessionKeys.filter(x => x !== session.key); // remove the key
      localStorage.removeItem(session.key);
    }

    sessionKeys.push(session.key);
    localStorage.setItem(session.key, JSON.stringify(session));
    localStorage.setItem('session_keys', JSON.stringify(sessionKeys));

    component.parsingForm.disable();
    component.sessionSaved = true;
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
      keys = keys.filter(x => x !== this.selectedSession.key);
      if (keys.length === 0) {
        localStorage.removeItem('session_keys');
      } else {
        localStorage.setItem('session_keys', JSON.stringify(keys));
      }
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
