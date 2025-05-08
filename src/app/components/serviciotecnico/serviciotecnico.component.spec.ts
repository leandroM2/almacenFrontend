import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciotecnicoComponent } from './serviciotecnico.component';

describe('ServiciotecnicoComponent', () => {
  let component: ServiciotecnicoComponent;
  let fixture: ComponentFixture<ServiciotecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciotecnicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciotecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
