import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoFooterComponent } from './empleado-footer.component';

describe('EmpleadoFooterComponent', () => {
  let component: EmpleadoFooterComponent;
  let fixture: ComponentFixture<EmpleadoFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadoFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
