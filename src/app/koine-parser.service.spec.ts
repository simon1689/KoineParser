import { TestBed } from '@angular/core/testing';

import { KoineParserService } from './koine-parser.service';

describe('KoineParserService', () => {
  let service: KoineParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KoineParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
