import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseAnswerDialogComponent } from './parse-answer-dialog.component';

describe('ParseAnswerDialogComponent', () => {
  let component: ParseAnswerDialogComponent;
  let fixture: ComponentFixture<ParseAnswerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParseAnswerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParseAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
