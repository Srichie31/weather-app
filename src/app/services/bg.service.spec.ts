import { TestBed } from '@angular/core/testing';

import { BgService } from './bg.service';

describe('BgService', () => {
  let service: BgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
