import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableFormFieldComponent } from './selectable-form-field.component';

describe('SelectableFormFieldComponent', () => {
  let component: SelectableFormFieldComponent;
  let fixture: ComponentFixture<SelectableFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableFormFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectableFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
