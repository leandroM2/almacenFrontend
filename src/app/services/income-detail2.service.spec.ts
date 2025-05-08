import { TestBed } from '@angular/core/testing';

import { IncomeDetail2Service } from './income-detail2.service';

describe('IncomeDetail2Service', () => {
  let service: IncomeDetail2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeDetail2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});