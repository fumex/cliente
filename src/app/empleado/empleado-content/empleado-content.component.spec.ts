import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoContentComponent } from './empleado-content.component';

describe('EmpleadoContentComponent', () => {
  let component: EmpleadoContentComponent;
  let fixture: ComponentFixture<EmpleadoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
