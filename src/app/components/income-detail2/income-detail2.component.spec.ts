import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDetail2Component } from './income-detail2.component';

describe('IncomeDetailComponent', () => {
  let component: IncomeDetail2Component;
  let fixture: ComponentFixture<IncomeDetail2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeDetail2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
