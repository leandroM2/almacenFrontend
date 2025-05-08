import { TestBed } from '@angular/core/testing';

import { IncomeDetailService } from './income-detail.service';

describe('IncomeDetailService', () => {
  let service: IncomeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
