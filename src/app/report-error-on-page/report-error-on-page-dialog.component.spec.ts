import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportErrorOnPageDialogComponent} from './report-error-on-page-dialog.component';

describe('ReportErrorOnPageComponent', () => {
  let component: ReportErrorOnPageDialogComponent;
  let fixture: ComponentFixture<ReportErrorOnPageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportErrorOnPageDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportErrorOnPageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
