import { TestBed } from '@angular/core/testing';

import { OutcomeDetailService } from './outcome-detail.service';

describe('OutcomeDetailService', () => {
  let service: OutcomeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutcomeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
