import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigFormComponent } from './form-config-form.component';

describe('FormConfigFormComponent', () => {
  let component: FormConfigFormComponent;
  let fixture: ComponentFixture<FormConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConfigFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
