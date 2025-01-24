import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormFieldTabComponent } from './edit-form-field-tab.component';

describe('EditFormFieldTabComponent', () => {
  let component: EditFormFieldTabComponent;
  let fixture: ComponentFixture<EditFormFieldTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormFieldTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFormFieldTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
