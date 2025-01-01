import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfigView } from './form-config.view';

describe('ConfigurationViewComponent', () => {
  let component: FormConfigView;
  let fixture: ComponentFixture<FormConfigView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConfigView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConfigView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
