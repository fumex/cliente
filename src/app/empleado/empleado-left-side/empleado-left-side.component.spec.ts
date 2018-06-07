import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoLeftSideComponent } from './empleado-left-side.component';

describe('EmpleadoLeftSideComponent', () => {
  let component: EmpleadoLeftSideComponent;
  let fixture: ComponentFixture<EmpleadoLeftSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadoLeftSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoLeftSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
