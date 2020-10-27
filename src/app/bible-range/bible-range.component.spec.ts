import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleRangeComponent } from './bible-range.component';

describe('BibleRangeComponent', () => {
  let component: BibleRangeComponent;
  let fixture: ComponentFixture<BibleRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibleRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibleRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
