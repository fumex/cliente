import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoHeaderComponent } from './empleado-header.component';

describe('EmpleadoHeaderComponent', () => {
  let component: EmpleadoHeaderComponent;
  let fixture: ComponentFixture<EmpleadoHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadoHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
